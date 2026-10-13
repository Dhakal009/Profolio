import { useState, useMemo } from 'react';

const PRODUCTS = [
  {
    id: 'p-1',
    name: 'Keychron Q1 Pro Mechanical Keyboard',
    category: 'Peripherals',
    price: 199,
    rating: 4.9,
    reviews: 128,
    badge: 'Bestseller',
    stock: 14,
    description:
      'CNC machined aluminum wireless custom mechanical keyboard with hot-swappable Gateron switches and QMK/VIA support.',
    accent: 'from-amber-500/20 to-orange-600/10',
    icon: '⌨️',
  },
  {
    id: 'p-2',
    name: 'Sony WH-1000XM5 Studio Headphones',
    category: 'Audio',
    price: 348,
    rating: 4.8,
    reviews: 312,
    badge: 'Featured',
    stock: 9,
    description:
      'Industry-leading adaptive noise cancellation with 8 microphones, 30-hour battery life, and spatial audio clarity.',
    accent: 'from-indigo-500/20 to-blue-600/10',
    icon: '🎧',
  },
  {
    id: 'p-3',
    name: 'UltraSharp 32" 4K USB-C Hub Monitor',
    category: 'Displays',
    price: 649,
    rating: 4.9,
    reviews: 89,
    badge: 'Pro Choice',
    stock: 6,
    description:
      'IPS Black panel technology with 98% DCI-P3 color accuracy, 90W USB-C power delivery, and integrated RJ45 Ethernet.',
    accent: 'from-emerald-500/20 to-teal-600/10',
    icon: '🖥️',
  },
  {
    id: 'p-4',
    name: 'MX Master 3S Wireless Ergonomic Mouse',
    category: 'Peripherals',
    price: 99,
    rating: 4.9,
    reviews: 450,
    badge: 'Popular',
    stock: 25,
    description:
      '8,000 DPI optical sensor that tracks on glass, quiet-click tactile switches, and MagSpeed electromagnetic scrolling.',
    accent: 'from-purple-500/20 to-pink-600/10',
    icon: '🖱️',
  },
  {
    id: 'p-5',
    name: 'Thunderbolt 4 Pro 12-in-1 Workstation Dock',
    category: 'Accessories',
    price: 229,
    rating: 4.7,
    reviews: 64,
    badge: 'New',
    stock: 11,
    description:
      'Dual 4K@60Hz or single 8K display output, 96W host charging, UHS-II SD 4.0 card reader, and 2.5GbE port.',
    accent: 'from-cyan-500/20 to-sky-600/10',
    icon: '🔌',
  },
  {
    id: 'p-6',
    name: 'Shure MV7+ Podcast Dynamic Microphone',
    category: 'Audio',
    price: 279,
    rating: 4.8,
    reviews: 176,
    badge: 'Creator Pick',
    stock: 8,
    description:
      'Hybrid USB-C and XLR dynamic microphone with real-time denoiser, digital popper stopper, and LED touch mute panel.',
    accent: 'from-rose-500/20 to-red-600/10',
    icon: '🎙️',
  },
];

const CATEGORIES = ['All', 'Peripherals', 'Audio', 'Displays', 'Accessories'];

export default function EcommerceDemo() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([
    { product: PRODUCTS[0], qty: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setOrderSuccess(null);
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const handleCheckout = () => {
    if (!cart.length) return;
    setOrderSuccess({
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      total: subtotal,
      items: cartCount,
    });
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Store Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-5 py-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-lg">
              🛍️
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                NovaGear Store
              </h1>
              <p className="text-xs text-zinc-400">
                Full-Stack E-Commerce Demo · Developer Hardware
              </p>
            </div>
          </div>

          <div className="flex flex-1 max-w-md mx-auto w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyboards, monitors, audio..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition cursor-pointer"
          >
            <span>Cart</span>
            <span className="rounded-full bg-zinc-950 px-2 py-0.5 text-xs font-bold text-amber-400">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8">
        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const inCart = cart.find((i) => i.product.id === product.id);
            return (
              <article
                key={product.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-zinc-700"
              >
                <div>
                  <div
                    className={`relative mb-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br ${product.accent} border border-white/5 text-6xl`}
                  >
                    <span>{product.icon}</span>
                    <span className="absolute top-3 left-3 rounded-full bg-zinc-950/80 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                      {product.badge}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-zinc-950/80 px-2.5 py-1 text-xs font-medium text-zinc-200">
                      ★ {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {product.category}
                  </span>
                  <h2 className="mt-1 text-lg font-bold text-white leading-snug">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xl font-bold text-white">
                      ${product.price}
                    </span>
                    <span className="block text-[11px] text-emerald-400">
                      {product.stock} in stock
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="rounded-xl bg-white/10 hover:bg-amber-500 hover:text-zinc-950 border border-white/10 px-4 py-2.5 text-xs font-semibold text-white transition cursor-pointer"
                  >
                    {inCart ? `In Cart (${inCart.qty}) +` : 'Add to Cart'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col p-6 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold">Shopping Cart ({cartCount})</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:text-white cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {orderSuccess ? (
              <div className="my-auto text-center p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-emerald-300">
                  Order Confirmed!
                </h3>
                <p className="text-xs text-zinc-300 mt-2">
                  Order ID: <span className="font-mono">{orderSuccess.orderId}</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  {orderSuccess.items} item(s) · Total paid: ${orderSuccess.total}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOrderSuccess(null);
                    setIsCartOpen(false);
                  }}
                  className="mt-5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="my-auto text-center text-zinc-400">
                <p className="text-3xl mb-2">🛒</p>
                <p className="text-sm">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4 space-y-3">
                  {cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{product.icon}</span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-zinc-400">
                            ${product.price} × {qty} = ${product.price * qty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, -1)}
                          className="h-7 w-7 rounded-lg bg-zinc-800 text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold w-5 text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, 1)}
                          className="h-7 w-7 rounded-lg bg-zinc-800 text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-lg font-bold">${subtotal}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-sm font-bold text-zinc-950 transition cursor-pointer"
                  >
                    Checkout Now · ${subtotal}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50 px-5 py-4 text-center text-xs text-zinc-400">
        NovaGear E-Commerce App · Built with React, Node.js, Express &amp; MongoDB
      </footer>
    </div>
  );
}
