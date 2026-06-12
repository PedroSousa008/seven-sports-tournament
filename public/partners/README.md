# Logos de Patrocinadores & Parceiros

Coloca aqui os logos dos parceiros e regista cada um em `src/lib/partners-content.ts`.

## Pastas por categoria

| Pasta | Tipo | `partnershipType` |
|-------|------|-------------------|
| `main-sponsor/` | Patrocinador Principal | `MAIN_SPONSOR` |
| `official-partners/` | Parceiros Oficiais | `OFFICIAL_PARTNER` |
| `equipment/` | Parceiro de Equipamento | `EQUIPMENT` |
| `health/` | Parceiro de Saúde | `HEALTH_PHYSIO` |
| `food-beverage/` | Restauração | `FOOD_BEVERAGE` |

## Como adicionar um parceiro

1. Guarda o logo em PNG ou SVG (fundo transparente recomendado), por exemplo:
   `public/partners/official-partners/sport-zone.png`

2. Abre `src/lib/partners-content.ts` e adiciona:

```typescript
{
  slug: "sport-zone",
  brandName: "Sport Zone",
  logo: "/partners/official-partners/sport-zone.png",
  partnershipType: "OFFICIAL_PARTNER",
  websiteUrl: "https://...", // opcional
  logoFit: "fill", // "fill" preenche o cartão; "fit" centrado (predefinido)
},
```

3. O logo aparece automaticamente na homepage na secção **Patrocinadores & Parceiros**.

## Alternativa: painel de organizador

Também podes criar parceiros em `/owner/partnerships` e usar o campo **URL do logo** com o caminho local, por exemplo:

`/partners/official-partners/sport-zone.png`

## Dicas

- Largura recomendada: **400–800px**
- Formato: **PNG** ou **SVG** com fundo transparente
- Usa nomes de ficheiro simples (sem espaços): `marca-nome.png`
