import { pool } from './db.js';

try {
  const [resultado] = await pool.execute('SELECT 1 AS ok');
  console.log('Conectou!', resultado);
} catch (erro) {
  console.error('Falhou:', erro.message);
} finally {
  await pool.end();
}