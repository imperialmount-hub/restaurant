import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Admin from './Admin';
import { useMenu } from './MenuContext';

function LandingPage() {
  const { menuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // New state for Resort Order Details
  const [orderLocation, setOrderLocation] = useState('table'); // 'table' or 'room'
  const [locationNumber, setLocationNumber] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = activeCategory === 'all' ? menuItems : menuItems.filter(item => item.category === activeCategory);
  const addToCart = (item) => { setCart([...cart, { ...item, cartId: Date.now() }]); setCartOpen(true); };
  const removeFromCart = (cartId) => { setCart(cart.filter(item => item.cartId !== cartId)); };
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!locationNumber) {
      alert(orderLocation === 'table' ? 'Ширээний дугаараа оруулна уу' : 'Өрөөний дугаараа оруулна уу');
      return;
    }

    const orderData = {
      id: `#${Math.floor(Math.random() * 9000 + 1000)}`,
      customer: 'Зочин',
      items: cart.map(i => `${i.title} (x1)`).join(', '),
      total: `${totalPrice.toLocaleString()}₮`,
      locationType: orderLocation,
      locationNumber: locationNumber,
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Save to localStorage for Admin to read
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([orderData, ...existingOrders]));

    alert('Захиалга амжилттай илгээгдлээ!');
    setCart([]);
    setCartOpen(false);
    setLocationNumber('');
  };

  return (
    <div className="App">
      <nav className={`navbar ${scrolled ? 'scrolled glass-morphism' : ''}`}>
        <div className="logo gradient-text">NOMAD RESORT</div>
        <ul className="nav-links">
          <li><Link to="/">Нүүр</Link></li>
          <li><a href="#">Цэс</a></li>
          <li><Link to="/admin">Админ</Link></li>
        </ul>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Сагс ({cart.length})
        </button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Resort-ын <br /><span className="gradient-text">Амтат Хоол Хүргэлт</span></h1>
          <p>Та өрөөнөөсөө эсвэл ресторанд сууж байхдаа шууд захиалгаа өгөх боломжтой боллоо. Бид таны захиалгыг мөч бүрт шуурхай хүргэх болно.</p>
          <button className="cta-button">Цэс үзэх</button>
        </div>
      </section>

      <div className="container">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Манай Цэс</h2>
        <div className="categories">
          {categories.map(cat => (
            <div key={cat.id} className={`category-card ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {cat.id === 'all' ? '🍽️' : (
                  cat.icon.startsWith('/')
                    ? <img src={cat.icon} alt="" style={{ width: '30px', height: '30px' }} />
                    : <span style={{ fontSize: '1.2rem', lineHeight: '30px' }}>{cat.icon}</span>
                )}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat.name}</div>
            </div>
          ))}
        </div>
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item glass-morphism">
              <img src={item.image} alt={item.title} className="menu-item-img" />
              <div className="menu-item-content">
                <div className="menu-item-tags">{item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                <h3 className="menu-item-title">{item.title}</h3>
                <p className="menu-item-desc">{item.description}</p>
                <div className="menu-item-footer">
                  <div className="price">{item.price.toLocaleString()}₮</div>
                  <button className="add-to-cart" onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`cart-drawer ${cartOpen ? 'open' : ''} glass-morphism`}>
        <div className="cart-header"><h2>Миний Сагс</h2><button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button></div>

        <div className="cart-items">
          {cart.length === 0 ? <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>Таны сагс хоосон байна.</div> :
            cart.map(item => (
              <div key={item.cartId} className="cart-item">
                <img src={item.image} alt={item.title} /><div className="cart-item-info"><div className="cart-item-title">{item.title}</div><div className="cart-item-price">{item.price.toLocaleString()}₮</div></div>
                <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>Устгах</button>
              </div>
            ))
          }
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="order-details-form" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--glass)', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '0.8rem' }}>Хүргэх байршил хүсэлт:</h4>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setOrderLocation('table')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: orderLocation === 'table' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  Ширээ
                </button>
                <button
                  onClick={() => setOrderLocation('room')}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: orderLocation === 'room' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  Өрөө
                </button>
              </div>
              <input
                type="text"
                placeholder={orderLocation === 'table' ? "Ширээний дугаар" : "Өрөөний дугаар"}
                value={locationNumber}
                onChange={(e) => setLocationNumber(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', color: 'white' }}
              />
            </div>
            <div className="total-row"><span>Нийт:</span><span>{totalPrice.toLocaleString()}₮</span></div>
            <button className="checkout-btn" onClick={handleCheckout}>Захиалга хийх</button>
          </div>
        )}
      </div>

      <footer style={{ padding: '4rem 2rem', background: '#050505', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}><div className="logo gradient-text" style={{ marginBottom: '1rem' }}>NOMAD RESORT</div><p style={{ color: 'var(--text-muted)' }}>© 2024 Бүх эрх хуулиар хамгаалагдсан. Улаанбаатар хот.</p></footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
