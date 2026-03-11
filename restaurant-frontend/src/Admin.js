import React, { useEffect, useState } from 'react';

const BACKEND_URL = "https://culturalfooddaybackend.onrender.com";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [transactionIds, setTransactionIds] = useState({});

  const fetchPendingOrders = async () => {
    const res = await fetch(`${BACKEND_URL}/pending-orders`);
    const data = await res.json();
    setOrders(data);
  };

  const validateTransaction = async (orderId) => {
    const transaction_id = transactionIds[orderId];
    if (!transaction_id) return alert('Entrez le Transaction ID');
    await fetch(`${BACKEND_URL}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, transaction_id })
    });
    alert(`Commande ${orderId} validée !`);
    setTransactionIds(prev => ({ ...prev, [orderId]: '' }));
    fetchPendingOrders();
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard - Commandes pending</h2>
      {orders.length === 0 && <p>Aucune commande en attente.</p>}
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
          <p>{order.item} | Status: {order.status}</p>
          <input
            placeholder="Transaction ID"
            value={transactionIds[order.id] || ''}
            onChange={e => setTransactionIds(prev => ({ ...prev, [order.id]: e.target.value }))}
          />
          <button onClick={() => validateTransaction(order.id)}>Valider</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;