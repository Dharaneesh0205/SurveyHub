const rateLimit = (windowMs, max, message = 'Too many requests') => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    }

    const userRequests = requests.get(ip) || [];
    
    if (userRequests.length >= max) {
      return res.status(429).json({ 
        message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.push(now);
    requests.set(ip, userRequests);
    next();
  };
};

// Rate limiting configurations
export const authLimiter = rateLimit(15 * 60 * 1000, 100, 'Too many authentication attempts');
export const apiLimiter = rateLimit(15 * 60 * 1000, 100, 'Too many API requests');
export const responseLimiter = rateLimit(60 * 1000, 10, 'Too many survey submissions');