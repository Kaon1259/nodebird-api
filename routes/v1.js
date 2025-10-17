const router = require('express').Router();

const path = require('path');
const { createToken, testToken, getAllPosts, getMyPosts, getPostsByHashtag } = require(path.join(__dirname, '..', 'controllers', 'v1'));
const { verifyToken, deprecated } = require(path.join(__dirname, '..', 'middlewares'));

router.use(deprecated);

router.route('/token')
    .post(createToken)

router.route('/test')
    .get(verifyToken, testToken);

router.route('/posts')
    .get(verifyToken, getAllPosts);

router.route('/posts/my')
    .get(verifyToken, getMyPosts);

router.route('/posts/hashtag/:title')
    .get(verifyToken, getPostsByHashtag);

module.exports = router;