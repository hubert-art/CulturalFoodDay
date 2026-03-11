import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const dbPromise = open({
  filename: './db.sqlite',
  driver: sqlite3.Database
});

// Créer la table commandes si elle n'existe pas
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

// Lister toutes les commandes
app.get('/orders', async (req, res) => {
  const db = await dbPromise;
  const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));