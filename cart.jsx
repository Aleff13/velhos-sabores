// cart.jsx — Velhos Sabores: shopping cart para pedidos via WhatsApp
function CartPage({ go }) {
  useReveal();
  const [quantities, setQuantities] = React.useState({
    canela: 0,
    caseiro: 0,
    integral: 0,
    graos: 0,
  });
  const [notes, setNotes] = React.useState('');

  const updateQuantity = (id, value) => {
    setQuantities({ ...quantities, [id]: Math.max(0, parseInt(value) || 0) });
  };

  const generateMessage = () => {
    const items = [];
    VS_PRODUCTS.forEach(p => {
      const qty = quantities[p.id];
      if (qty > 0) {
        items.push(`${qty}x ${p.nome}`);
      }
    });

    if (items.length === 0) {
      return 'Olá! Gostaria de fazer um pedido.';
    }

    let msg = `Olá! Gostaria de fazer um pedido:\n\n`;
    msg += items.join('\n');
    if (notes.trim()) {
      msg += `\n\nObservações: ${notes}`;
    }
    return msg;
  };

  const hasItems = Object.values(quantities).some(q => q > 0);
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const message = generateMessage();
  const whatsappLink = waLink(message);

  return (
    <main className="vs-cart">
      {/* Hero */}
      <section className="vs-cart-hero">
        <div className="wrap">
          <div className="vs-section-head center reveal">
            <span className="eyebrow">Faça seu pedido</span>
            <h1>Escolha seus pães</h1>
            <p>Selecione os produtos desejados e envie seu pedido direto pelo WhatsApp</p>
          </div>
        </div>
      </section>

      {/* Cart Grid */}
      <section className="vs-cart-section">
        <div className="wrap">
          <div className="vs-cart-layout">
            {/* Left: Product Selection */}
            <div className="vs-cart-products">
              <h2>Nossos pães</h2>
              <div className="vs-cart-grid">
                {VS_PRODUCTS.map((p) => (
                  <div className="vs-cart-item reveal" key={p.id}>
                    <div className="vs-cart-item-img">
                      <Ph label={p.label} src={p.img} />
                    </div>
                    <div className="vs-cart-item-body">
                      <h3>{p.nome}</h3>
                      <p className="vs-cart-tagline">{p.tagline}</p>
                      <p className="vs-cart-desc">{p.descricao}</p>
                      <div className="vs-cart-qty">
                        <label>Quantidade</label>
                        <div className="vs-qty-control">
                          <button
                            className="vs-qty-btn"
                            onClick={() => updateQuantity(p.id, quantities[p.id] - 1)}
                            disabled={quantities[p.id] === 0}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={quantities[p.id]}
                            onChange={(e) => updateQuantity(p.id, e.target.value)}
                            className="vs-qty-input"
                          />
                          <button
                            className="vs-qty-btn"
                            onClick={() => updateQuantity(p.id, quantities[p.id] + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="vs-cart-summary reveal">
              <div className="vs-cart-summary-box">
                <h2>Resumo do Pedido</h2>

                {hasItems ? (
                  <div className="vs-summary-items">
                    {VS_PRODUCTS.map((p) => {
                      const qty = quantities[p.id];
                      if (qty === 0) return null;
                      return (
                        <div key={p.id} className="vs-summary-item">
                          <span className="vs-summary-name">{p.nome}</span>
                          <span className="vs-summary-qty">{qty}x</span>
                        </div>
                      );
                    })}
                    <div className="vs-summary-total">
                      <strong>Total de itens: {totalItems}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="vs-summary-empty">Selecione os pães desejados</p>
                )}

                <div className="vs-summary-notes">
                  <label htmlFor="notesInput">Observações (opcional)</label>
                  <textarea
                    id="notesInput"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Sem sal, entrega em tal lugar, etc."
                    maxLength="200"
                  />
                  <span className="vs-notes-count">{notes.length}/200</span>
                </div>

                <div className="vs-summary-message">
                  <label>Sua mensagem</label>
                  <div className="vs-message-preview">
                    {message.split('\n').map((line, i) => (
                      <div key={i}>{line || <br />}</div>
                    ))}
                  </div>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-primary vs-cart-send"
                  style={{ pointerEvents: hasItems ? 'auto' : 'none', opacity: hasItems ? 1 : 0.5 }}
                >
                  <Icon name="wa" size={18} /> Enviar Pedido
                </a>

                <button
                  className="btn btn-ghost vs-cart-clear"
                  onClick={() => setQuantities({ canela: 0, caseiro: 0, integral: 0, graos: 0 })}
                >
                  Limpar carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="vs-band">
        <div className="wrap vs-band-inner reveal">
          <span className="eyebrow" style={{ color: 'var(--gold)' }}>Dúvidas?</span>
          <h2>Fale diretamente com a gente</h2>
          <p>Qualquer pergunta sobre os pães ou formas de pagamento, nosso WhatsApp está sempre aberto.</p>
          <a className="btn btn-primary" href={waLink()} target="_blank" rel="noopener">
            <Icon name="wa" size={18} /> Conversar no WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
window.CartPage = CartPage;
