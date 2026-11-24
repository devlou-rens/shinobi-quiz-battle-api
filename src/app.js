// Builds the Express app. Does NOT start listening - server.js does that.
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');
const path = require('path');

const app = express();

// Trust the first proxy (required for production deployment).
app.set('trust proxy', 1);

// Set security-related HTTP headers.
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// Allow only configured browser origins.
// Requests without an Origin header (such as Postman) are allowed.
app.use(
  cors({
    origin: (origin, done) =>
      done(null, !origin || env.corsOrigins.includes(origin)),
  })
);

// Middleware runs in this order for every request.
if (env.nodeEnv !== 'test') app.use(morgan('dev'));
app.use(express.json());

// Allow uploaded images to be accessed through /uploads.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Hub Contract: every endpoint lives under /api/v1
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
