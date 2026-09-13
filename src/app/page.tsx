'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionStore } from '../store/sessionStore';
import { useCartStore } from '../store/cartStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const router = useRouter();
  const { customer, artesao, logoutAll } = sessionStore();
  const { items, addItem, removeItem, clearCart } = useCartStore();

  if (!mounted) return null;

  const handleBuyProduct = () => {
    addItem({ id: 'p1', name: 'Handmade Vase', price: 45.0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>

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
