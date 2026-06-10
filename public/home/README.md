# Imagens da Homepage

Substitui os ficheiros `.jpg` em cada pasta pelas tuas fotos, **mantendo o mesmo nome de ficheiro**. O site atualiza automaticamente.

## Estrutura

### `hero/` — Carrossel principal (5 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `01-futebol-celebracao.jpg` | Slide 1 — Futebol |
| `02-padel.jpg` | Slide 2 — Padel |
| `03-karts.jpg` | Slide 3 — Karts |
| `04-tenis.jpg` | Slide 4 — Ténis |
| `05-voleibol.jpg` | Slide 5 — Voleibol |

### `sports/` — Secção dos 5 desportos (5 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `futebol7.jpg` | Futebol 7 |
| `padel.jpg` | Padel |
| `karts.jpg` | Karts |
| `tenis.jpg` | Ténis |
| `voleibol.jpg` | Voleibol |

### `journey/` — Linha temporal do torneio (5 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `dia1-padel.jpg` | Dia 1 — Padel |
| `dia2-voleibol.jpg` | Dia 2 — Voleibol |
| `dia3-futebol7.jpg` | Dia 3 — Futebol 7 |
| `dia4-tenis.jpg` | Dia 4 — Ténis |
| `dia5-karts-final.jpg` | Dia 5 — Karts Grand Final |

### `trophies/` — Troféus (4 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `campeao.jpg` | 1.º Lugar |
| `vice-campeao.jpg` | 2.º Lugar |
| `terceiro-lugar.jpg` | 3.º Lugar |
| `fair-play.jpg` | Fair Play |

### `gallery/` — Galeria de momentos (8 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `01-celebracao-equipa.jpg` | Celebração de equipa |
| `02-karting.jpg` | Karting |
| `03-voleibol.jpg` | Voleibol |
| `04-padel.jpg` | Padel |
| `05-multidao.jpg` | Multidão |
| `06-trofeu.jpg` | Troféu |
| `07-podio.jpg` | Pódio |
| `08-futebol.jpg` | Futebol |

### `cta/` — Fundo do call-to-action (1 imagem)
| Ficheiro | Descrição |
|----------|-----------|
| `fundo.jpg` | Fundo da secção final |

## Dicas

- Formato recomendado: **JPG** ou **WebP**
- Hero e CTA: largura mínima ~2400px
- Sports, journey, trophies, gallery: ~800–1200px
- Se usares outro formato (ex: `.png`), atualiza o caminho em `src/lib/home-content.ts` ou `src/components/home/cta-section.tsx`
