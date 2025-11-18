<<<<<<< HEAD
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
<<<<<<< Updated upstream
    ssl: {
        rejectUnauthorized: false
    }
=======
    ssl: { rejectUnauthorized: false }
>>>>>>> Stashed changes
});

module.exports = pool;
=======
// const { Pool } = require('pg');

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

// module.exports = pool;
>>>>>>> b94989129010a65a1a0c6418f31771fc79ed991a
