'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../store/sessionStore'; // Adjust path if needed
import { useCartStore } from '../store/cartStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const router = useRouter();
  const { customer, artesao, logoutAll } = useSessionStore();
  const { items, addItem, removeItem, clearCart } = useCartStore();

  if (!mounted) return null;

  // Dynamically determine the current role and name
  let currentRole = 'Visitante';
  let currentName = 'Anônimo';

  if (customer) {
    currentRole = 'Comprador';
    currentName = customer.nome;
  } else if (artesao) {
    currentRole = 'Artesão';
    currentName = artesao.nomeArtesao;
  }

  const handleBuyProduct = () => {
    addItem({ id: 'p1', name: 'Handmade Vase', price: 45.0 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>

    <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
    <h2>Sessão Atual</h2>
    <p>Current Role: <strong>{currentRole}</strong> ({currentName})</p>

    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
    {/* Show Login buttons if no one is logged in */}
    {!customer && !artesao && (
      <>
      <button onClick={() => router.push('/customer/login')}>Login como Comprador</button>
      <button onClick={() => router.push('/artesao/login')}>Login como Artesão</button>
      </>
    )}

    {/* Show Logout if either user type is logged in */}
    {(customer || artesao) && (
      <button onClick={logoutAll}>Sair (Logout)</button>
    )}
    </div>
    </section>

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
