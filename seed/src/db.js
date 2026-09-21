const mysql = require('mysql2/promise');

require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

// Sempre parametrizado (?) para evitar SQL injection - nunca interpolar valores direto na query.
async function run(sql, params = []) {
  await pool.execute(sql, params);
}

// Idem, mas devolve as linhas retornadas (usado pelos jobs de tarjetas/notas, que leem o banco já seedado).
async function consulta(sql, params = []) {
  const [linhas] = await pool.execute(sql, params);
  return linhas;
}

async function close() {
  await pool.end();
}

module.exports = { run, consulta, close };
