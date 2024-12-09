const { Pool } = require('pg');
const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
require('dotenv').config()
const dbURL = `postgres://${process.env.USER}:${process.env.PSSWD}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DBNAME}`;
const pool = new Pool({
  connectionString: dbURL,
  secretOrPrivateKey: process.env.secretOrPrivateKey,
});

//console.log('DATABASE_URL:', process.env.DATABASE_URL); // Debugging line

module.exports = pool;
