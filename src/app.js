const express = require('express');
const cors = require('cors');
const exampleRoutes = require('./routes/example.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

app.use('/api/examples', exampleRoutes);

app.use(errorHandler);

module.exports = app;
