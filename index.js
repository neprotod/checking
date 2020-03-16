// Add env
require('dotenv').config();

const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(`Server is starting on port ${process.env.PORT}`);
});
