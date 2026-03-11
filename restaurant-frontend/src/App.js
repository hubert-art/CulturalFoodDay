import React, { useState, useEffect } from 'react';
import { menuItems } from './data';
import './App.css';

const BACKEND_URL = 'https://culturalfooddaybackend.onrender.com';

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
    <div className='page'>
      <div className='congo_title'>
        <h1>Congolese Restaurant Menu</h1>
        <p>Welcome! Enjoy our dishes that showcase the pride of our Congolese culture… Bon appétit!</p>
      </div>
      <div className='items_content'>
        {menuItems.map(item => (
          <div key={item.id} className='box_item'>
            <img src={item.image} alt={item.name} style={{ width: '100%' }} />
            <h3>{item.name}</h3>
            <p className='description'>{item.description}</p>
            <p className='price'>Prix : <strong>{item.price}</strong> kesh</p>
            <input type="number" defaultValue={1} min={1} id={`qty-${item.id}`} className='qtnt_input' />
            <button onClick={() => addToCart(item, parseInt(document.getElementById(`qty-${item.id}`).value))} className='add_btn'>
              Add to cart
            </button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      <ul>
        {cart.map(c => (
          <li key={c.id}>{c.name} x{c.quantity} = {c.price * c.quantity} kesh</li>
        ))}
      </ul>

      <p>Total amount: <strong>{totalPrice} Kesh</strong></p>

      <div className='pay_div'>
        <button
          onClick={() => {
            const mpesaNumber = '0743059899'; 
            navigator.clipboard.writeText(mpesaNumber);
            alert(`M-Pesa Number ${mpesaNumber} Copied! Open your M-Pesa app to make the payment.`);
            // Option mobile : window.location.href = 'mpesa://pay?number=123456';
          }}
        >
          Open M-Pesa / Copy number
        </button>

        <p>Pay via M-Pesa and enter the Transaction ID</p>
        <input
          placeholder="Transaction ID M-Pesa"
          value={transactionId}
          onChange={e => setTransactionId(e.target.value)}
        />
        <button onClick={submitCart} disabled={cart.length === 0 || !transactionId}>
          Confirm and Submit
        </button>
      </div>

      <h2>Existing Orders</h2>
      <ul>
        {orders.map(o => (
          <li key={o.id}>{o.item} | {o.amount} | {o.transaction_id || 'pending'} | {o.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;