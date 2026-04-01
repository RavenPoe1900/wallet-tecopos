import rateLimit, {
  RateLimitRequestHandler,
  ipKeyGenerator,
} from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const max = Number(process.env.RATE_LIMIT_MAX ?? 100);

export const rateLimitMiddleware: RateLimitRequestHandler = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) =>
    ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? ''),

  skip: (req) => req.path === '/health' || req.path === '/metrics',

  handler: (req, res) => {
    res.status(429).json({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Too many requests, please try again later.',
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  },

  skipSuccessfulRequests: false,
});
