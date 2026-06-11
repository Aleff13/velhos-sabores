// app.jsx — Velhos Sabores: routing + palette tweaks
const { useState: useS, useEffect: useE } = React;

const STUDIO_ROUTES = {
  studio: 'instagram-generator.html',
  'recipe-studio': 'recipe-ebook-generator.html',
};

const PALETTES = {
  forno:  { label: 'Forno & Trigo',     sw: ['#B5613A', '#6E7A4F', '#F3E7D2'] },
  geleia: { label: 'Geleia & Canela',   sw: ['#A8324A', '#D99A4E', '#F6ECDD'] },
  horta:  { label: 'Horta & Mel',       sw: ['#4A6140', '#CAA35A', '#EEE6D4'] },
  manha:  { label: 'Manhã de Domingo',  sw: ['#C07A38', '#E0B674', '#F5EBDA'] },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "forno",
  "grain": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useS(() => {
    const hash = window.location.hash.slice(1);
    return STUDIO_ROUTES[hash] ? hash : 'home';
  });
  const [focusId, setFocusId] = useS(null);
  const [quantities, setQuantities] = useS({
    canela: 0,
    caseiro: 0,
    integral: 0,
    graos: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useS(false);

  const updateQuantity = (id, value) => {
    setQuantities({ ...quantities, [id]: Math.max(0, parseInt(value) || 0) });
  };

  const addToCart = (id) => {
    setQuantities({ ...quantities, [id]: quantities[id] + 1 });
    setSidebarOpen(true);
  };

  const clearCart = () => {
    setQuantities({ canela: 0, caseiro: 0, integral: 0, graos: 0 });
  };

  // apply palette + grain to <html>
  useE(() => {
    if (STUDIO_ROUTES[page]) return;
    document.documentElement.setAttribute('data-palette', t.palette || 'forno');
    document.documentElement.style.setProperty('--grain-opacity', t.grain ? '0.5' : '0');
  }, [t.palette, t.grain, page]);

  const go = (p, fid = null) => {
    setPage(p);
    setFocusId(fid);
    if (p !== 'produtos' || !fid) window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (STUDIO_ROUTES[page]) {
    return (
      <iframe
        src={STUDIO_ROUTES[page]}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', border: 'none' }}
        title="Studio"
      />
    );
  }

  return (
    <React.Fragment>
      <Nav page={page} go={go} />
      <CartSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} quantities={quantities} updateQuantity={updateQuantity} onCheckout={() => { go('carrinho'); setSidebarOpen(false); }} clearCart={clearCart} />
      <div key={page} className="vs-page-fade">
        {page === 'home' && <HomePage go={go} />}
        {page === 'produtos' && <ProdutosPage go={go} focusId={focusId} addToCart={addToCart} />}
        {page === 'sobre' && <SobrePage go={go} />}
        {page === 'carrinho' && <CartPage go={go} quantities={quantities} updateQuantity={updateQuantity} clearCart={clearCart} />}
      </div>
      <Footer go={go} />
      <WhatsAppFab />

      <TweaksPanel>
        <TweakSection label="Paleta de cores" />
        <div className="vs-tw-palettes">
          {Object.entries(PALETTES).map(([key, p]) => (
            <button
              key={key}
              className={`vs-tw-pal ${t.palette === key ? 'active' : ''}`}
              onClick={() => setTweak('palette', key)}
            >
              <span className="vs-tw-sw">
                {p.sw.map((c, i) => <i key={i} style={{ background: c }} />)}
              </span>
              <span className="vs-tw-name">{p.label}</span>
            </button>
          ))}
        </div>
        <TweakSection label="Textura" />
        <TweakToggle label="Grão de papel" value={t.grain} onChange={(v) => setTweak('grain', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
