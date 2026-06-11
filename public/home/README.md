# Imagens da Homepage

Substitui os ficheiros `.jpg` em cada pasta pelas tuas fotos, **mantendo o mesmo nome de ficheiro**. O site atualiza automaticamente.

## Estrutura

### `hero/` — Carrossel principal (4 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `01-futebol-celebracao.jpg` | Slide 1 — Futebol |
| `02-padel.jpg` | Slide 2 — Padel |
| `03-karts.jpg` | Slide 3 — Karts |
| `04-voleibol.jpg` | Slide 4 — Voleibol |

### `sports/` — Secção dos 4 desportos (4 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `futebol7.jpg` | Futebol 7 |
| `padel.jpg` | Padel |
| `karts.jpg` | Karts |
| `voleibol.jpg` | Voleibol |

### `journey/` — Linha temporal do torneio (4 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `dia1-futebol7.jpg` | Dia 1 — Futebol 7 (10 Julho) |
| `dia2-padel.jpg` | Dia 2 — Padel (11 Julho) |
| `dia3-voleibol.jpg` | Dia 3 — Voleibol (17 Julho) |
| `dia4-karts-final.jpg` | Dia 4 — Karts Grand Final (18 Julho) |

### `trophies/` — Troféus (5 imagens)
| Ficheiro | Descrição |
|----------|-----------|
| `futebol7.jpg` | Futebol 7 — Troféu de Campeão |
| `padel.jpg` | Padel — Troféu de Campeão |
| `voleibol.jpg` | Voleibol — Troféu de Campeão |
| `karts.jpg` | Karts — Troféu de Campeão |
| `campeoes-torneio.jpg` | Campeões do Torneio — 1.ª Edição |

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
