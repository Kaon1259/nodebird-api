const path = require('path');
const {User, Domain} = require(path.join(__dirname, '..', 'models'));

const renderLogin = async(req, res, next) =>{
    console.log(`renderMain : ${req.user ? req.user.id : 'User 객체가 없음'}`);

    try{
        const user = await User.findOne({
                where : {id : req.user?.id || null},
                include: { model : Domain},
            })
        
        console.log(`renderLogin[user:id]: ${user ? user.id : 'not loggendIn'}`);
    
        return res.render('login', {
               user,
               domains: user?.Domains,
        })
    }catch(err){
      console.log(`err : ${err}`);
      next(err);
    }
}

module.exports = {renderLogin};