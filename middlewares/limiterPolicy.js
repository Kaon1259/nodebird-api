const rateLimit = require('express-rate-limit');
require('dotenv').config();

const LimiterPolicy = {
  free: rateLimit({
    windowMs: Number(process.env.API_LIMITER_FREE_TIME) || 60 * 1000, // 기본 1분
    max: Number(process.env.API_LIMITER_FREE_COUNT) || 5,             // 기본 5회
    handler(req, res, next, options) {
      res.status(options.statusCode).json({
        code: options.statusCode,
        message: 'Free 도메인 요청을 초과하였습니다.',
      });
    },
  }),

  normal: rateLimit({
    windowMs: Number(process.env.API_LIMITER_NORMAL_TIME) || 60 * 1000, // 기본 1분
    max: Number(process.env.API_LIMITER_NORMAL_COUNT) || 5,             // 기본 5회
    handler(req, res, next, options) {
      res.status(options.statusCode).json({
        code: options.statusCode,
        message: 'Free 도메인 요청을 초과하였습니다.',
      });
    },
  }),

  premium: rateLimit({
    windowMs: Number(process.env.API_LIMITER_PREMIUM_TIME) || 60 * 1000,
    max: Number(process.env.API_LIMITER_PREMIUM_COUNT) || 50,
    handler(req, res, next, options) {
      res.status(options.statusCode).json({
        code: options.statusCode,
        message: 'Premium 도메인 요청을 초과하였습니다.',
      });
    },
  }),
};

module.exports = LimiterPolicy;
