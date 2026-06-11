// produtos.jsx — listagem com comparativo artesanal × industrializado
function ComparePanel({ p }) {
  return (
    <div className="vs-compare">
      <div className="vs-compare-head">
        <div className="vs-compare-col label" />
        <div className="vs-compare-col vs-col-art">
          <span className="vs-col-tag"><Icon name="wheat" size={16} /> Velhos Sabores</span>
        </div>
        <div className="vs-compare-col vs-col-ind">
          <span className="vs-col-tag muted">Pão industrializado</span>
        </div>
      </div>
      {VS_COMPARE_ROWS.map((row) => (
        <div className="vs-compare-row" key={row.key}>
          <div className="vs-compare-col label"><span>{row.rotulo}</span></div>
          <div className="vs-compare-col vs-col-art">
            <span className="vs-mark ok"><Icon name="check" size={14} stroke={2.6} /></span>
            <span className="vs-val">{p.artesanal[row.key]}</span>
          </div>
          <div className="vs-compare-col vs-col-ind">
            <span className="vs-mark no"><Icon name="x" size={14} stroke={2.6} /></span>
            <span className="vs-val muted">{p.industrial[row.key]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductBlock({ p, index, reverse, addToCart }) {
  return (
    <article className={`vs-product reveal ${reverse ? 'rev' : ''}`} id={`prod-${p.id}`}>
      <div className="vs-product-identity">
        <div className="vs-product-art">
          <Ph label={p.label} src={p.img} className="vs-product-img" />
          <span className="vs-product-no mono">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="vs-product-info">
          <span className="badge ok"><Icon name="leaf" size={13} /> {p.selo}</span>
          <h2>{p.nome}</h2>
          <p className="vs-product-tag serif-accent">{p.tagline}</p>
          <p className="vs-product-desc">{p.descricao}</p>
          <div className="vs-ingredients">
            <span className="vs-ing-label">O que tem dentro</span>
            <div className="vs-ing-chips">
              {p.ingredientes.map(ing => <span className="vs-chip" key={ing}>{ing}</span>)}
            </div>
          </div>
          <div className="vs-product-ctas">
            <button className="btn btn-primary" onClick={() => addToCart(p.id)}>
              <Icon name="heart" size={18} /> Adicionar ao Carrinho
            </button>
            <a className="btn btn-ghost" href={waLink(`Olá! Gostaria de encomendar o ${p.nome} da Velhos Sabores.`)} target="_blank" rel="noopener">
              <Icon name="wa" size={18} /> Encomendar
            </a>
          </div>
        </div>
      </div>
      <ComparePanel p={p} />
    </article>
  );
}

function ProdutosPage({ go, focusId, addToCart }) {
  useReveal();
  useEffect(() => {
    if (focusId) {
      const el = document.getElementById(`prod-${focusId}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [focusId]);

  return (
    <main className="vs-produtos">
      <section className="vs-prod-hero">
        <div className="wrap-narrow vs-prod-hero-inner">
          <span className="eyebrow reveal">Nossos pães · comparativo honesto</span>
          <h1 className="reveal">Compare antes de morder.</h1>
          <p className="reveal">
            Para cada pão da casa, colocamos lado a lado o que servimos e o que costuma vir embalado
            na prateleira. Mesmo nome, histórias bem diferentes — começando pela lista de ingredientes.
          </p>
          <div className="vs-prod-legend reveal">
            <span><span className="vs-mark ok"><Icon name="check" size={12} stroke={3} /></span> Velhos Sabores</span>
            <span><span className="vs-mark no"><Icon name="x" size={12} stroke={3} /></span> Industrializado</span>
          </div>
        </div>
      </section>

      <section className="vs-prod-list">
        <div className="wrap">
          {VS_PRODUCTS.map((p, i) => (
            <ProductBlock key={p.id} p={p} index={i} reverse={i % 2 === 1} addToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="vs-band">
        <div className="wrap vs-band-inner reveal">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Ficou com fome?</span>
          <h2>Seu pão sai quentinho amanhã cedo.</h2>
          <p>Encomendas pelo WhatsApp até as 18h são entregues ou retiradas no dia seguinte, fresquinhas.</p>
          <a className="btn btn-primary" href={waLink()} target="_blank" rel="noopener">
            <Icon name="wa" size={18} /> Fazer pedido agora
          </a>
        </div>
      </section>
    </main>
  );
}
window.ProdutosPage = ProdutosPage;
