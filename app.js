const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const bouquetsRouter = require('./routes/bouquets');
const errorHandler = require('./middlewares/errorHandler');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.json', (_req, res) => res.json(swaggerDocument));

app.use('/api/bouquets', bouquetsRouter);

app.get('/', (_req, res) => {
  res.json({ name: 'Flora API', docs: '/api-docs' });
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
