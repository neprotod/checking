// Add env
require('dotenv').config();

const app = require('./app');
const t = 10 + 100;

app.listen(process.env.PORT, () => {
  console.log(`Server is starting on port ${process.env.PORT}`);
});
