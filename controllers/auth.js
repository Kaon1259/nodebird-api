const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require(path.join(__dirname, '..', 'models', 'user'));

require('dotenv').config(); 

const join = async(req, res, next)=>{
    const {email, nick, password} = req.body;

    console.log(`auth/join : ${email} : ${nick} :${password}`)

    try{
        //1. 계정이 이미 존재하는지 확인
        const exUser = await User.findOne({
            where : {email : email}
        });

        //2.이미 존재하면 가입 페이지로 에러 전달
        if(exUser){
            return res.redirect('/join?error=exist');
        }

        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email: email,
            nick: nick,
            password: hash,
        });

        return res.redirect('/');

    }catch(err){
        console.log(err);
        return next(err);
    }
};


const login = (req, res, next)=>{
    
    console.log(`auth/login : ${req.body.email} : ${req.body.password}`)

    //'local' Stratergy를 실행하고 (authError, ...) 콜백 함수를 호출해서 전달해 준다...
    passport.authenticate('local', async(authError, user, info)=>{
        if(authError){
            console.log(authError);
            return next(authError);
        }

        if(!user){
            return res.redirect(`/?error=${info.message}`);
        }

        try {
        // 1) 로그인(세션에 유저 적재)
        await new Promise((resolve, reject) => {
            req.login(user, (loginError) => {
            if (loginError) return reject(loginError);
            return resolve();
            });
        });

        // 2) (중요) 세션 저장이 끝난 뒤에 리다이렉트 — 레이스컨디션 방지
        if (req.session) {
            req.session.save((saveErr) => {
            if (saveErr) return next(saveErr);
            return res.redirect('/'); // 성공
            });
        } else {
            // 세션 미들웨어가 없을 때 대비 (개발 중 오류 방지)
            return res.redirect('/');
        }
        } catch (e) {
        return next(e);
        }
    })(req, res, next);
};


const logout = async(req, res, next) => {
    
    console.log('before', {
        sid: req.sessionID,
        hasSession: !!req.session,
        hasUser: !!req.user,
        cookie: req.headers.cookie
    });

    try {
        await req.logout((err) => {
            if (err) return next(err);

            // 세션을 쓰는 경우, 세션도 정리
            if (req.session) {
                req.session.destroy(() => {
                    res.clearCookie('sid'); // 세션 쿠키 이름에 맞춰 조정
                    res.clearCookie('connect.sid');
                    return res.redirect('/'); // 혹은 '/'
                });
            } else {
                return res.redirect('/');
            }
        });
        
        console.log('after', {
        sid: req.sessionID,
        hasSession: !!req.session,
        hasUser: !!req.user,
        cookie: req.headers.cookie
    });
        
    } catch (err) {
        console.log('로그아웃 처리 중 에러 발생:', err);
        // next()로 에러 핸들러로 전달
        return next(err);
    }
};

module.exports = {join, login, logout};