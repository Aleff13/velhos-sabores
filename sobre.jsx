// sobre.jsx — A história da Velhos Sabores
function SobrePage({ go }) {
  useReveal();
  const steps = [
    { n: '01', t: 'A seleção', d: 'Começamos com ingredientes selecionados. Farinha de qualidade, sal marinho, água filtrada — nada mais do que o necessário.' },
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
            <h1>Nasceu do sonho<br /><em className="serif-accent">de fazer pão certo.</em></h1>
            <p>
              A Velhos Sabores nasceu do sonho de Gabriel Velho, apaixonado pela arte da panificação artesanal. O nome da marca foi inspirado na memória afetiva que a comida é capaz de despertar — aqueles aromas, sabores e momentos especiais que nos conectam à família, à infância e às nossas melhores lembranças.
            </p>
            <p>
              O que começou como uma forma de complementar a renda e investir em cursos profissionalizantes se tornou um projeto construído com dedicação, aprendizado e muita persistência. Entre erros, acertos e inúmeros testes, Gabriel descobriu o verdadeiro significado de empreender no universo da alimentação artesanal.
            </p>
          </div>
          <div className="vs-sobre-hero-art reveal">
            <Ph label="foto · retrato da família / fundadores" src="https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=700&q=80&auto=format&fit=crop" className="vs-sobre-portrait" />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className=”vs-quote”>
        <div className=”wrap-narrow reveal”>
          <p className=”vs-quote-text”>
            “Pão bom não tem segredo. Tem <em className=”serif-accent”>ingredientes de verdade e tempo</em>.
            O resto é só pressa que estraga o sabor.”
          </p>
          <span className=”vs-quote-by mono”>— a receita da casa</span>
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

      {/* Production */}
      <section className="vs-production">
        <div className="wrap vs-production-grid">
          <div className="vs-production-copy reveal">
            <span className="eyebrow">Nossa produção</span>
            <h2>Pequeno, planejado e fresco.</h2>
            <p>
              Percebemos que muitos clientes buscavam algo diferente da produção em larga escala: produtos artesanais, frescos e feitos com atenção aos detalhes.
            </p>
            <p>
              Por isso, trabalhamos com uma produção mais enxuta e planejada, garantindo qualidade em cada fornada.
            </p>
            <div className="vs-production-schedule">
              <div className="vs-schedule-item">
                <span className="vs-schedule-label">Fornadas</span>
                <span className="vs-schedule-value">segundas e quintas-feiras</span>
              </div>
              <div className="vs-schedule-item">
                <span className="vs-schedule-label">Retirada</span>
                <span className="vs-schedule-value">no dia seguinte à produção</span>
              </div>
              <div className="vs-schedule-item">
                <span className="vs-schedule-label">Modelo</span>
                <span className="vs-schedule-value">produção sob demanda</span>
              </div>
            </div>
            <p style={{ fontSize: '.95em', color: 'var(--muted)', marginTop: '12px' }}>
              Esse modelo permite que cada cliente receba seus produtos sempre frescos, ao mesmo tempo em que se adapta à rotina corrida do dia a dia.
            </p>
          </div>
          <div className="vs-production-art reveal">
            <Ph label="foto · processo de produção" src="https://images.unsplash.com/photo-1577003833154-a92bbd4c4fe0?w=700&q=80&auto=format&fit=crop" className="vs-production-img" />
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
              <li><span className="vs-mark ok"><Icon name="check" size={13} stroke={3} /></span> Cada pão moldado à mão, um a um</li>
              <li><span className="vs-mark ok"><Icon name="check" size={13} stroke={3} /></span> Assado fresco, nunca congelado ou pré-pronto</li>
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
