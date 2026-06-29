require('dotenv').config();
const app = require('./app');
const { connect } = require('./models');

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  await connect();
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
})();
