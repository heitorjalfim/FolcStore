'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useCartStore } from '../store/cartStore';

export default function Home() {
  // Pull the single login function instead
  const { user, login } = useSessionStore();
  const { items, addItem, removeItem, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleBuyProduct = () => {
    addItem({ id: 'p1', name: 'Handmade Vase', price: 45.0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

    {/* ROLE SWITCHER SECTION */}
    <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
    <h2>Change Your Role</h2>
    <p>Current Role: <strong>{user.role}</strong> ({user.name})</p>

    <div style={{ display: 'flex', gap: '10px' }}>
    {/* Pass the ID for each specific mock user */}
    <button onClick={() => login('1')}>Set as Visitante</button>
    <button onClick={() => login('2')}>Set as Comprador</button>
    <button onClick={() => login('3')}>Set as Artesão</button>
    </div>
    </section>

    {/* CART SECTION */}
    <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
    <h2>Shopping Cart Demo</h2>
    <button onClick={handleBuyProduct} style={{ marginBottom: '15px' }}>
    Add Vase to Cart ($45)
    </button>

    <h3>Your Cart ({items.length} items)</h3>
    {items.length === 0 ? (
      <p>The cart is empty.</p>
    ) : (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
      {items.map((item) => (
        <li key={item.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>{item.name} - ${item.price} (Qty: {item.quantity})</span>
        <button onClick={() => removeItem(item.id)}>Remove</button>
        </li>
      ))}
      </ul>
    )}

    {items.length > 0 && (
      <button onClick={clearCart} style={{ marginTop: '10px' }}>Clear Cart</button>
    )}
    </section>

    </div>
  );
}
