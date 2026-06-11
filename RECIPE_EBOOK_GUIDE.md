# Guia: Gerador de eBook de Receita

## Acesso

O gerador de eBooks de receita está disponível em:
- **URL local**: `http://localhost:8000#recipe-studio`
- **URL produção**: `https://seu-dominio.com#recipe-studio`
- **Footer**: Clique em "Ferramentas" → "Gerador de eBooks" (no rodapé)

## Funcionalidades

### 1. **Campos de Formulário** (Sidebar Esquerdo)

#### Paleta de Cores
Escolha uma das 4 paletas de cores que herdam a identidade visual do site:
- **Forno & Trigo**: Marrom quente (#B5613A) com verde (#6E7A4F)
- **Geleia & Canela**: Vermelho rosado (#A8324A) com laranja (#D99A4E)
- **Horta & Mel**: Verde floresta (#4A6140) com mostarda (#CAA35A)
- **Manhã de Domingo**: Dourado (#C07A38) com bege (#E0B674)

#### Informações da Receita
- **Título** (obrigatório): Nome da receita (ex: "Pão de Canela Especial")
- **Tagline**: Subtítulo/slogan (ex: "Doce de tarde de domingo")
- **Descrição**: Breve introdução sobre a receita

#### Ingredientes
Digite cada ingrediente em uma linha separada. O PDF exibe com bullet points.

#### Modo de Preparo
Digite cada passo em uma linha separada. O PDF numera automaticamente.

#### Dicas (Opcional)
Dicas práticas em um box destacado no final da receita.

### 2. **Visualização em Tempo Real** (Side Direito)

A preview atualiza instantaneamente conforme você digita:
- Mostra o PDF formatado exatamente como será gerado
- Respecta a paleta de cores selecionada
- Usa tipografia profissional (Merriweather serif para corpo, Bricolage para títulos)

### 3. **Download do PDF**

Botão "📥 Baixar eBook PDF" gera:
- Arquivo A4 em retrato
- Nome do arquivo baseado no título (ex: "pao-de-canela-especial.pdf")
- Qualidade JPEG de alta resolução
- Rodapé com copyright e mensagem "feito com fermento, tempo e memória"

## Exemplo de Uso

1. **Acesse** `#recipe-studio`
2. **Escolha a paleta** que melhor se adequa à receita
3. **Preencha os campos**:
   - Título: "Pão Integral de Beterraba"
   - Tagline: "Escuro, denso e cheio de sabor"
   - Descrição: "Uma receita que traz a terra para a mesa..."
   - Ingredientes: farinha integral, beterraba ralada, etc.
   - Passos: misturar, fermentar, assar...
   - Dicas: armazenar em pano úmido, congelar se desejar...
4. **Revise a preview** no lado direito
5. **Clique "Baixar eBook PDF"** para gerar o arquivo

## Design do PDF

### Layout
- **Cabeçalho**: Logo + Título + Tagline + Descrição
- **Seções**: Ingredientes, Modo de Preparo, Dicas
- **Rodapé**: Copyright e tagline da marca
- **Formatação**: Ingredientes com bullets, passos numerados, dicas em box destacado

### Tipografia
- **Títulos**: Bricolage Grotesque Bold (sem serifa, moderno)
- **Corpo**: Merriweather Regular (serifa, elegante)
- **Cores**: Baseadas na paleta selecionada

### Dimensões
- Formato: A4 (210 × 297 mm)
- Margens: 40px superior/inferior, 50px lateral
- Tamanho de fonte: 16px corpo, 36px título, proporções reduzidas para seções

## Dicas para Melhor Resultado

1. **Descrição Concisa**: Mantenha a descrição entre 1-2 parágrafos para não sobrecarregar
2. **Ingredientes Claros**: Use medidas (100g farinha, 500ml leite, etc.)
3. **Passos Numerados**: Cada linha é um passo — organize de forma lógica
4. **Dicas Práticas**: Adicione informações que agregam valor (conservação, variações, etc.)
5. **Paleta Consistente**: Use a mesma paleta para todas as receitas de uma série

## Customização Futura

Se desejar customizar:

### Adicionar seções extras
Edite `recipe-ebook-generator.html`, função `generatePdfContent()`:
```javascript
${novaCampo ? `
  <div class="pdf-section">
    <div class="pdf-section-title">Seção Nova</div>
    <div class="pdf-section-content">${escapeHtml(novaCampo)}</div>
  </div>
` : ''}
```

### Mudar fontes
Edite `@import` no `<head>` e atualize `--font-*` no CSS `:root`.

### Adicionar imagem de receita
Adicione um campo `<input type="file">` e base64-encode a imagem no PDF.

### Criar pacote temático
Combine múltiplas receitas em um único PDF maior (requer modificação do gerador).

## Troubleshooting

| Problema | Solução |
|----------|---------|
| PDF não baixa | Verifique se o navegador permite downloads; desabilite bloqueadores de pop-ups |
| Texto cortado | Reduza o tamanho da descrição ou dicas; o PDF tem altura limitada |
| Cores estranhas | Limpe o cache do navegador ou reabra a página |
| Fonte não renderiza | Verifique conexão com Google Fonts (requer internet) |

## Próximos Passos

- [ ] Adicionar campo para foto da receita
- [ ] Suporte a múltiplas receitas em um único PDF
- [ ] Template para receita em português e inglês
- [ ] Integração com catálogo de produtos (vincular ingredientes aos pães)
- [ ] Analytics para rastrear receitas mais baixadas
