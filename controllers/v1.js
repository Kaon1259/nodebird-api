const jwt = require('jsonwebtoken');

const path = require('path');
const {Domain, User, Post, Hashtag} = require(path.join(__dirname, '..', 'models'));

const createToken = async(req, res)=>{
    const {clientSecret} = req.body

    console.log(`createToken : ${clientSecret}`);
    try{
        //1. clientSecret exist ?
        if(clientSecret){

            //1. get domain
            const domain = await Domain.findOne({
                where: {clientSecret},
                include : {
                    model: User,
                    attributes : ['nick', 'id'],
                }
            });

            if(!domain){
                return res.status(401).json({
                    code: 401,
                    message: '등록되지 않은 도메인 입니다. 먼저 도메인을 등록하세요',
                });
            }
            
            //3. create token : id, nick in 1m
            const token = jwt.sign({
                id: domain.User.id,
                nick: domain.User.nick,
                }, process.env.JWT_SECRET, {
                    expiresIn : '5m',
                    issuer: process.env.TOKEN_ISSUER,
                }
            );

            if(token){
                return res.status(200).json({
                    code: 200,
                    message: '토큰이 발급 되었습니다',
                    token,    
                });
            }else{
                return res.status(500).json({
                    code: 500,
                    message: '토큰 발급 실패(서버 오류)',

                });
            }
        }
    }catch(err){
        console.log(`v1/createToken ${err}`);
        return res.status(500).json({
                    code: 500,
                    message: '서버 오류',

                });
    }
}

const testToken = (req, res) =>{
    res.json(res.locals.decoded);
};

const getAllPosts = async(req, res) =>{
    try{
      const posts = await Post.findAll({
        include :{
          model: User,
          attributes :['id', 'nick'],
        },
        order:[['createdAt', 'DESC']],
      });

        console.log(`posts : ${posts}`);
        return res.json({
                code:200,
                payload: posts,
             });        
    }catch(err){
      console.log(err);
      return res.status(500).json({
                    code : 500,
                    message: '서버 에러'
                });
    }
}
const getMyPosts = async(req, res) =>{
    try{
        //verifyToken시 decoded에 저장된 정보....
        const userId = res.locals.decoded.id;

        console.log(`getMyPosts userId: ${userId}`);

        if(userId){
            await Post.findAll({
                where: {userId : userId}
            })
            .then((posts)=>{
                console.log(`posts : ${posts}`);
                return res.json({
                    code:200,
                    payload: posts,
                })
            })
            .catch((err)=>{
                console.log(`getMyPosts err : ${err}`);
                return res.status(500).json({
                    code : 500,
                    message: '서버 에러'
                });
            });
        }
    }catch(err){
        return res.status(500).json({
                    code : 500,
                    message: '서버 에러'
                });
    }
};

const getPostsByHashtag = async(req, res) =>{
    try{
        const title = req.params.title;
        console.log(`getPostsByHashtag title: ${title}`);

        const hashtag = await Hashtag.findOne({
            where:{
                title: title,
            }
        });

        if(!hashtag){
           return res.status(404).json({
                    code : 404,
                    message: '검색 결과가 없습니다.'
                }); 
        }

        let posts =[];
        if(hashtag){
            posts = await hashtag.getPosts({
            include: [{model:User}]
            });
        }

        //const posts = await hashtag.getPosts();
        console.log(`posts : ${posts}`);
        return res.json({
                code:200,
                payload: posts,
             });        
    }catch(err){
        return res.status(500).json({
                    code : 500,
                    message: '서버 에러'
                });
    }
};

module.exports = { createToken, testToken, getAllPosts, getMyPosts, getPostsByHashtag };