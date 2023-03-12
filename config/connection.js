const { connect, connection } = require('mongoose');
require('dotenv').config();

const connString = `${process.env.DB_PROTOCOL}${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(connString);
connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
