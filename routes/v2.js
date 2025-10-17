const router = require('express').Router();
const cors = require('cors');

const path = require('path');
const { createToken, testToken, getAllPosts, getMyPosts, getPostsByHashtag } = require(path.join(__dirname, '..', 'controllers', 'v1'));
const { verifyToken, chooseLimiter, deprecated, corsWhenDomainMatches } = require(path.join(__dirname, '..', 'middlewares'));

router.use(corsWhenDomainMatches);

router.route('/token')
    .post(chooseLimiter, createToken)

router.route('/test')
    .get(chooseLimiter, verifyToken, testToken);

router.route('/posts')
    .get(chooseLimiter, verifyToken, getAllPosts);

router.route('/posts/my')
    .get(chooseLimiter, verifyToken, getMyPosts);

router.route('/posts/hashtag/:title')
    .get(chooseLimiter, verifyToken, getPostsByHashtag);

module.exports = router;