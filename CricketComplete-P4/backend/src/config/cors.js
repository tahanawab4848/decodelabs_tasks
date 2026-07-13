const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', '*'], // Allow frontend origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

module.exports = corsOptions;
