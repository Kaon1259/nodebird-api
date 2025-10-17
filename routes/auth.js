const router = require('express').Router()
const path = require('path');

//get module
const {join, login, logout} = require(path.join(__dirname, '..', 'controllers', 'auth.js'));
const { isLoggedIn, isNotLoggedIn} = require(path.join(__dirname, '..', 'middlewares'));

router.route('/join')
    .post(join);    

//local login/logout
router.route('/login')
    .post(isNotLoggedIn, login);    

router.route('/logout')
    .get(isLoggedIn, logout);

module.exports = router;