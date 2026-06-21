// home.jsx — Velhos Sabores landing/home
function HomePage({ go }) {
  useReveal();
  const values = [
    { icon: 'wheat', t: 'Feito à mão', d: 'Cada pão é moldado manualmente na nossa padaria.' },
    { icon: 'leaf', t: 'Sem conservantes', d: 'Só ingredientes que você reconhece e pronuncia.' },
    { icon: 'clock', t: 'Tempo de verdade', d: 'Até 6h de descanso. Pressa é inimiga do sabor.' },
    { icon: 'heart', t: 'Receita de família', d: 'O mesmo caderno de receitas, geração após geração.' },
  ];
  return (
    <main className="vs-home">
      {/* ---------------- HERO ---------------- */}
      <section className="vs-hero">
        <div className="wrap vs-hero-grid">
          <div className="vs-hero-copy">
            <span className="eyebrow reveal">Padaria artesanal · desde sempre</span>
            <h1 className="vs-hero-title reveal">
              O pão que tem<br /><em className="serif-accent">cheiro de casa.</em>
            </h1>
            <p className="vs-hero-lead reveal">
              Na Velhos Sabores a gente não acelera o tempo. Farinha de verdade, trabalho feito à mão
              e o forno quente de cedo — para que cada fatia traga de volta a memória da cozinha da família.
            </p>
            <div className="vs-hero-cta reveal">
              <button className="btn btn-primary" onClick={() => go('produtos')}>
                Conhecer os pães <Icon name="arrow" size={18} />
              </button>
              <a className="btn btn-ghost" href={waLink()} target="_blank" rel="noopener">
                <Icon name="wa" size={18} /> Fazer um pedido
              </a>
            </div>
            <div className="vs-hero-meta reveal">
              <span className="badge ok"><Icon name="check" size={14} /> Sem conservantes</span>
              <span className="badge ok"><Icon name="check" size={14} /> Feito à mão</span>
              <span className="badge ok"><Icon name="check" size={14} /> Assado no dia</span>
            </div>
          </div>
          <div className="vs-hero-art reveal">

            <Ph label="foto · pães prontos da padaria" src="assets/products/paes%20prontos.jpeg" className="vs-hero-img" />
            <div className="vs-hero-stamp">
              <Icon name="wheat" size={22} />
              <span>feito<br />à mão</span>
            </div>
            <div className="vs-hero-note">
              <strong>Feito com amor</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- VALUES STRIP ---------------- */}
      <section className="vs-values">
        <div className="wrap vs-values-grid">
          {values.map((v, i) => (
            <div className="vs-value reveal" style={{ transitionDelay: `${i * 70}ms` }} key={v.t}>
              <span className="vs-value-ico"><Icon name={v.icon} size={22} /></span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- PROPOSTA / STORY TEASER ---------------- */}
      <section className="vs-proposta">
        <div className="wrap vs-proposta-grid">
          <div className="vs-proposta-art reveal">
            <Ph label="foto · fazendo a massa" src="assets/products/faznedo%20massa.jpeg" className="vs-proposta-img a" />
          </div>
          <div className="vs-proposta-copy reveal">
            <span className="eyebrow">Nosso compromisso</span>
            <h2>Pão bom não tem segredo. Tem tempo.</h2>
            <p>
              Na Velhos Sabores, acreditamos que um bom pão vai muito além dos ingredientes. Ele carrega história, dedicação e a tradição de fazer tudo com tempo, cuidado e propósito.
            </p>
            <p>
              Cada fornada é preparada para proporcionar uma experiência autêntica, valorizando a qualidade artesanal e os sabores que permanecem na memória. Porque pão feito devagar é pão que se lembra.
            </p>
            <button className="btn btn-ghost" onClick={() => go('sobre')}>
              Conhecer a história <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- PRODUTOS PREVIEW ---------------- */}
      <section className="vs-preview">
        <div className="wrap">
          <div className="vs-section-head reveal">
            <div>
              <span className="eyebrow">Da nossa bancada</span>
              <h2>Quatro pães, nenhuma pressa</h2>
            </div>
            <button className="btn btn-ghost" onClick={() => go('produtos')}>Ver todos <Icon name="arrow" size={18} /></button>
          </div>
          <div className="vs-preview-grid">
            {VS_PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                className="vs-pcard reveal"
                style={{ transitionDelay: `${i * 60}ms` }}
                onClick={() => go('produtos', p.id)}
              >
                <Ph label={p.label} src={p.img} className="vs-pcard-img" />
                <div className="vs-pcard-body">
                  <span className="badge ok"><Icon name="leaf" size={13} /> {p.selo}</span>
                  <h3>{p.nome}</h3>
                  <p>{p.tagline}</p>
                  <span className="vs-pcard-link">Ver comparativo <Icon name="arrow" size={15} /></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- COMPARE CTA BAND ---------------- */}
      <section className="vs-band">
        <div className="wrap vs-band-inner reveal">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Artesanal × Industrializado</span>
          <h2>Leia o rótulo. Depois prove o nosso.</h2>
          <p>
            Montamos um comparativo honesto, pão por pão: o que tem dentro, quanto dura e por que o sabor
            é tão diferente. Sem marketing — só a lista de ingredientes lado a lado.
          </p>
          <button className="btn btn-primary" onClick={() => go('produtos')}>
            Ver o comparativo <Icon name="arrow" size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
window.HomePage = HomePage;
