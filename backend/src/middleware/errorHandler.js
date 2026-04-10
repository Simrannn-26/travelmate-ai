// Centralised error handler — never leak stack traces in production
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[${new Date().toISOString()}] ${status} ${req.method} ${req.path}`, err.message);

  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(isDev && { stack: err.stack }), // Only in dev
  });
}

// Utility to create structured errors anywhere in the app
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}