// components.jsx — Velhos Sabores shared UI
const { useState, useEffect, useRef } = React;

const WHATSAPP_NUMBER = '5548984971362';
const waLink = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg || 'Olá! Vim pelo site da Velhos Sabores e gostaria de fazer um pedido.')}`;

/* ---------- tiny inline icons (simple shapes only) ---------- */
function Icon({ name, size = 20, stroke = 2 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    check: <polyline points="20 6 9 17 4 12" />,
    x: <g><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></g>,
    arrow: <g><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></g>,
    leaf: <g><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 4 0 7 1 7 1s-1 11-9 15Z" /><line x1="8" y1="16" x2="16" y2="8" /></g>,
    clock: <g><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></g>,
    heart: <path d="M12 21s-7-4.6-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.4 12 21 12 21Z" />,
    wheat: <g><line x1="12" y1="22" x2="12" y2="8" /><path d="M12 8c0-2-1.5-3.5-3.5-3.5C8.5 6.5 10 8 12 8Z" /><path d="M12 8c0-2 1.5-3.5 3.5-3.5C15.5 6.5 14 8 12 8Z" /><path d="M12 13c0-2-1.5-3.5-3.5-3.5C8.5 11.5 10 13 12 13Z" /><path d="M12 13c0-2 1.5-3.5 3.5-3.5C15.5 11.5 14 13 12 13Z" /></g>,
    wa: <path d="M12 2a10 10 0 0 0-8.6 15l-1.2 4 4.1-1.1A10 10 0 1 0 12 2Z" />,
  };
  return <svg {...common} aria-hidden="true">{paths[name]}</svg>;
}

/* ---------- Placeholder image with mono label ---------- */
function Ph({ label, style, className = '' }) {
  return <div className={`ph ${className}`} data-label={label} style={style} />;
}

/* ---------- reveal-on-scroll hook (with safety nets) ---------- */
function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll('.reveal:not(.in)')];
    if (!els.length) return;
    const reveal = (el) => el.classList.add('in');
    const inView = (el) => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.94 && r.bottom > 0;
    };
    // 1) reveal anything already on screen, next frame
    const raf = requestAnimationFrame(() => els.forEach(el => { if (inView(el)) reveal(el); }));
    // 2) observe the rest for scroll-in
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.06, rootMargin: '0px 0px -5% 0px' });
      els.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });
    } else {
      els.forEach(reveal);
    }
    // 3) ultimate fallback — never leave content invisible
    const t = setTimeout(() => els.forEach(reveal), 1400);
    return () => { cancelAnimationFrame(raf); io && io.disconnect(); clearTimeout(t); };
  });
}

/* ---------- Brand mark (wordmark) ---------- */
function Brand({ onClick, compact }) {
  return (
    <button onClick={onClick} className="vs-brand" aria-label="Velhos Sabores — início">
      <span className="vs-brand-mark"><Icon name="wheat" size={compact ? 20 : 24} /></span>
      <span className="vs-brand-text">
        <span className="vs-brand-name">Velhos Sabores</span>
        <span className="vs-brand-sub">padaria artesanal</span>
      </span>
    </button>
  );
}

/* ---------- Top navigation ---------- */
function Nav({ page, go }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { id: 'home', label: 'Início' },
    { id: 'produtos', label: 'Nossos pães' },
    { id: 'sobre', label: 'A história' },
  ];
  const nav = (id) => { go(id); setOpen(false); };
  return (
    <header className={`vs-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap vs-nav-inner">
        <Brand onClick={() => nav('home')} compact={scrolled} />
        <nav className="vs-nav-links">
          {links.map(l => (
            <button key={l.id} className={`vs-nav-link ${page === l.id ? 'active' : ''}`} onClick={() => nav(l.id)}>
              {l.label}
            </button>
          ))}
        </nav>
        <a className="btn btn-primary vs-nav-cta" href={waLink()} target="_blank" rel="noopener">
          <Icon name="wa" size={17} /> Fazer pedido
        </a>
        <button className="vs-burger" aria-label="Menu" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="vs-nav-mobile">
          {links.map(l => (
            <button key={l.id} className={`vs-nav-link ${page === l.id ? 'active' : ''}`} onClick={() => nav(l.id)}>{l.label}</button>
          ))}
          <a className="btn btn-primary" href={waLink()} target="_blank" rel="noopener"><Icon name="wa" size={17} /> Fazer pedido</a>
        </div>
      )}
    </header>
  );
}

/* ---------- Footer ---------- */
function Footer({ go }) {
  return (
    <footer className="vs-footer">
      <div className="wrap vs-footer-grid">
        <div className="vs-footer-brand">
          <Brand onClick={() => go('home')} />
          <p>Pão de verdade, feito devagar. Fermentação natural, ingredientes que você reconhece e o cheiro de forno que traz a casa de volta.</p>
          <a className="btn btn-primary" href={waLink()} target="_blank" rel="noopener"><Icon name="wa" size={17} /> Pedir pelo WhatsApp</a>
        </div>
        <div className="vs-footer-col">
          <h4>Navegar</h4>
          <button onClick={() => go('home')}>Início</button>
          <button onClick={() => go('produtos')}>Nossos pães</button>
          <button onClick={() => go('sobre')}>A história</button>
        </div>
        <div className="vs-footer-col">
          <h4>A padaria</h4>
          <span>Ter — Sáb · 7h às 19h</span>
          <span>Domingo · 7h às 13h</span>
          <span>Encomendas pelo WhatsApp</span>
          <span className="mono">(48) 98497-1362</span>
        </div>
      </div>
      <div className="wrap vs-footer-base">
        <span>© {new Date().getFullYear()} Velhos Sabores</span>
        <span className="serif-accent">feito com fermento, tempo e memória</span>
      </div>
    </footer>
  );
}

/* ---------- Floating WhatsApp button ---------- */
function WhatsAppFab() {
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 700);
    const t2 = setTimeout(() => setTip(true), 2200);
    const t3 = setTimeout(() => setTip(false), 8000);
    return () => { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <a
      className={`vs-fab ${show ? 'in' : ''}`}
      href={waLink()}
      target="_blank"
      rel="noopener"
      aria-label="Fale conosco no WhatsApp"
      onMouseEnter={() => setTip(true)}
    >
      <span className={`vs-fab-tip ${tip ? 'show' : ''}`}>Faça seu pedido 🥖</span>
      <span className="vs-fab-pulse" />
      <Icon name="wa" size={30} stroke={1.7} />
    </a>
  );
}

Object.assign(window, { Icon, Ph, useReveal, Brand, Nav, Footer, WhatsAppFab, waLink, WHATSAPP_NUMBER });
