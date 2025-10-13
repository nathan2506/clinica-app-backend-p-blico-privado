// Usage: node scripts/update_admin_password.js "nova-senha"
const bcrypt = require('bcryptjs');
require('dotenv').config();
const pool = require('../utils/db');

async function run() {
  const novo = process.argv[2];
  if (!novo) {
    console.error('Forneça a nova senha como argumento');
    process.exit(1);
  }
  const hash = bcrypt.hashSync(novo, 10);
  try {
    const res = await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'admin@example.com' RETURNING id", [hash]);
    if (res.rowCount === 0) {
      console.log('Nenhum usuário atualizado. Verifique se o usuário existe.');
    } else {
      console.log('Senha atualizada com sucesso para admin@example.com');
    }
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    await pool.end();
    process.exit(1);
  }
}

run();
