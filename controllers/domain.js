const path = require('path');
const {User, Domain} = require(path.join(__dirname, '..', 'models'));
const {v4: uuidv4} = require('uuid');

const createDomain = async(req, res, next) =>{
    console.log(`createDomain : ${req.user ? req.user.id : 'User 객체가 없음'}`);
    console.log(`createDomain : ${req.body ? req.body.host : 'Body 객체가 없음'}`);
    try{
        const userId = req.user.id;
        const {host, type} = req.body;

        const newDomain = await Domain.create({
                UserId : userId,
                host: host,
                type: type,
                clientSecret: uuidv4(),
            })
        
        console.log(`newDomain : ${newDomain ? newDomain : null}`);    

        return res.redirect('/');

    }catch(err){
      console.log(`err : ${err}`);
      next(err);
    }
}

module.exports = {createDomain};