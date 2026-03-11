import React, { useState, useEffect } from 'react';
import { menuItems } from './data';

const BACKEND_URL = '';

function App() {
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const res = await fetch(`${BACKEND_URL}/orders`);
    const data = await res.json();
    setOrders(data);
  };

  const addToCart = (item, qty) => {
    const existing = cart.find(c => c.id === item.id);
    if(existing){
      setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + qty} : c));
    } else {
      setCart([...cart, {...item, quantity: qty}]);
    }
  };

  const submitCart = async () => {
    for(const plat of cart){
      await fetch(`${BACKEND_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: `${plat.name} x${plat.quantity}`,
          amount: plat.price * plat.quantity,
          transaction_id: transactionId
        })
      });
    }
    setCart([]);
    setTransactionId('');
    fetchOrders();
  };

  // Calcul du total du panier
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Menu du restaurant</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
            <img src={item.image} alt={item.name} style={{ width: '100%' }} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Prix : {item.price}</p>
            <input type="number" defaultValue={1} min={1} id={`qty-${item.id}`} style={{ width: '50px' }} />
            <button onClick={() => addToCart(item, parseInt(document.getElementById(`qty-${item.id}`).value))}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      <h2>Panier</h2>
      <ul>
        {cart.map(c => (
          <li key={c.id}>{c.name} x{c.quantity} = {c.price * c.quantity}</li>
        ))}
      </ul>

      <p>Total à payer : {totalPrice}</p>

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => {
            const mpesaNumber = '0746786865'; 
            navigator.clipboard.writeText(mpesaNumber);
            alert(`Numéro M-Pesa ${mpesaNumber} copié ! Ouvre ton application M-Pesa pour payer.`);
            // Option mobile : window.location.href = 'mpesa://pay?number=123456';
          }}
        >
          Ouvrir M-Pesa / Copier numéro
        </button>

        <p>Payer via M-Pesa et entrer le Transaction ID :</p>
        <input
          placeholder="Transaction ID M-Pesa"
          value={transactionId}
          onChange={e => setTransactionId(e.target.value)}
        />
        <button onClick={submitCart} disabled={cart.length === 0 || !transactionId}>
          Confirmer et Envoyer
        </button>
      </div>

      <h2>Commandes existantes</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>{o.item} | {o.amount} | {o.transaction_id || 'pending'} | {o.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;