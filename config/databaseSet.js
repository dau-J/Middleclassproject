// 중요!
const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,               
  host: process.env.DB_HOST || '127.0.0.1',  
  user: process.env.DB_USER || 'root',       
  password: process.env.DB_PASSWORD || '0000', 
  database: process.env.DB_NAME || 'middle',
  waitForConnections: true,          
  queueLimit: 0,                     
  connectTimeout: 10000,              
  debug: false                       
});

pool
.getConnection()
.then((conn) => {
  console.log("Connected to the database");
  conn.release();
})
.catch((err) => {
  console.error("Error connecting to the database:", err);
});

module.exports = pool;