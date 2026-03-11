import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Base SQLite
const dbPromise = open({
  filename: './db.sqlite',
  driver: sqlite3.Database
});

// Création table orders
(async () => {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT NOT NULL,
      amount REAL NOT NULL,
      transaction_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

// Ajouter une commande
app.post('/order', async (req, res) => {
  const db = await dbPromise;
  const { item, amount, transaction_id } = req.body;
  await db.run(
    'INSERT INTO orders (item, amount, transaction_id) VALUES (?, ?, ?)',
    [item, amount, transaction_id]
  );
  res.json({ message: 'Order added!' });
});

// Récupérer toutes les commandes
app.get('/orders', async (req, res) => {
  const db = await dbPromise;
  const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(orders);
});

// Récupérer seulement les commandes pending
app.get('/pending-orders', async (req, res) => {
  const db = await dbPromise;
  const orders = await db.all('SELECT * FROM orders WHERE status = "pending" ORDER BY created_at DESC');
  res.json(orders);
});

// Valider une transaction
app.post('/validate', async (req, res) => {
  const db = await dbPromise;
  const { id, transaction_id } = req.body;
  await db.run(
    'UPDATE orders SET transaction_id = ?, status = ? WHERE id = ?',
    [transaction_id, 'paid', id]
  );
  res.json({ message: 'Transaction validée !' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));