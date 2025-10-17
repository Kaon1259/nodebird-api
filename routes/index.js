const router = require('express').Router();
const path = require('path');
const {renderLogin} = require(path.join(__dirname, '..', 'controllers'));
const {createDomain} = require(path.join(__dirname, '..', 'controllers', 'domain'));
const { isLoggedIn, isNotLoggedIn} = require(path.join(__dirname, '..', 'middlewares'));


router.route('/')
    .get(renderLogin);

router.route('/domain')
    .post(isLoggedIn, createDomain);

router.use('/v1', require('./v1'));
router.use('/v2', require('./v2'));
router.use('/auth', require('./auth'));

module.exports = router;