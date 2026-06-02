// sobre.jsx — A história da Velhos Sabores
function SobrePage({ go }) {
  useReveal();
  const steps = [
    { n: '01', t: 'A massa madre', d: 'Tudo começa num pote de fermento natural alimentado há anos. É ele que dá vida, sabor e durabilidade ao pão — sem nenhum atalho químico.' },
    { n: '02', t: 'O descanso', d: 'A massa repousa por até 24 horas. Esse tempo é o que transforma farinha e água em algo digerível, aromático e profundo.' },
    { n: '03', t: 'As mãos', d: 'Cada pão é moldado à mão. Não existem duas peças idênticas — e é exatamente isso que faz cada uma ser especial.' },
    { n: '04', t: 'O forno', d: 'Assado de manhã cedo, até a casca cantar. O cheiro que toma a rua é o nosso melhor convite.' },
  ];
  return (
    <main className="vs-sobre">
      {/* Hero */}
      <section className="vs-sobre-hero">
        <div className="wrap vs-sobre-hero-grid">
          <div className="vs-sobre-hero-copy reveal">
            <span className="eyebrow">A história</span>
            <h1>Nasceu na cozinha de casa.<br /><em className="serif-accent">Continua feita à mão.</em></h1>
            <p>
              A Velhos Sabores não começou num plano de negócios. Começou no cheiro do pão de domingo,
              na bancada enfarinhada e no caderno de receitas passado de mão em mão. Quando o mundo
              ficou rápido demais, a gente decidiu manter uma coisa lenta: o jeito certo de fazer pão.
            </p>
          </div>
          <div className="vs-sobre-hero-art reveal">
            <Ph label="foto · retrato da família / fundadores" src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=700&q=80&auto=format&fit=crop" className="vs-sobre-portrait" />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="vs-quote">
        <div className="wrap-narrow reveal">
          <p className="vs-quote-text">
            “Pão bom não tem segredo. Tem <em className="serif-accent">farinha boa, fermento vivo e tempo</em>.
            O resto é só pressa que estraga o sabor.”
          </p>
          <span className="vs-quote-by mono">— a receita da casa</span>
        </div>
      </section>

      {/* Process */}
      <section className="vs-process">
        <div className="wrap">
          <div className="vs-section-head center reveal">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Como fazemos</span>
            <h2>Quatro passos, zero atalhos</h2>
          </div>
          <div className="vs-process-grid">
            {steps.map((s, i) => (
              <div className="vs-step reveal" style={{ transitionDelay: `${i * 80}ms` }} key={s.n}>
                <span className="vs-step-no mono">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto / contrast */}
      <section className="vs-manifesto">
        <div className="wrap vs-manifesto-grid">
          <div className="vs-manifesto-art reveal">
            <Ph label="foto · prateleira de pães na padaria" src="https://images.unsplash.com/photo-1536782896453-61d09f3aaf3e?w=800&q=80&auto=format&fit=crop" className="vs-manifesto-img" />
          </div>
          <div className="vs-manifesto-copy reveal">
            <span className="eyebrow">No que acreditamos</span>
            <h2>Menos ingredientes. Mais memória.</h2>
            <ul className="vs-manifesto-list">
              <li><span className="vs-mark ok"><Icon name="check" size={13} stroke={3} /></span> Lista de ingredientes que cabe numa mão</li>
              <li><span className="vs-mark ok"><Icon name="check" size={13} stroke={3} /></span> Nada de conservantes, corantes ou aromas artificiais</li>
              <li><span className="vs-mark ok"><Icon name="check" size={13} stroke={3} /></span> Fermentação natural que respeita o tempo do pão</li>
              <li><span className="vs-mark ok"><Icon name="check" size={13} stroke={3} /></span> Produção pequena, feita e assada no mesmo dia</li>
            </ul>
            <button className="btn btn-primary" onClick={() => go('produtos')}>
              Ver a diferença pão a pão <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="vs-band">
        <div className="wrap vs-band-inner reveal">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Venha provar</span>
          <h2>Uma fatia vale mais que mil palavras.</h2>
          <p>Faça seu pedido pelo WhatsApp e leve para casa o pão que tem cheiro de domingo.</p>
          <a className="btn btn-primary" href={waLink()} target="_blank" rel="noopener">
            <Icon name="wa" size={18} /> Falar com a padaria
          </a>
        </div>
      </section>
    </main>
  );
}
window.SobrePage = SobrePage;
