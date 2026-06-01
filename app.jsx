// app.jsx — Velhos Sabores: routing + palette tweaks
const { useState: useS, useEffect: useE } = React;

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
  const [page, setPage] = useS('home');
  const [focusId, setFocusId] = useS(null);

  // apply palette + grain to <html>
  useE(() => {
    document.documentElement.setAttribute('data-palette', t.palette || 'forno');
    document.documentElement.style.setProperty('--grain-opacity', t.grain ? '0.5' : '0');
  }, [t.palette, t.grain]);

  const go = (p, fid = null) => {
    setPage(p);
    setFocusId(fid);
    if (p !== 'produtos' || !fid) window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <React.Fragment>
      <Nav page={page} go={go} />
      <div key={page} className="vs-page-fade">
        {page === 'home' && <HomePage go={go} />}
        {page === 'produtos' && <ProdutosPage go={go} focusId={focusId} />}
        {page === 'sobre' && <SobrePage go={go} />}
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
