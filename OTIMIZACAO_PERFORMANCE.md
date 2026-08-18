# Otimização de Performance & Mídia

> Documentação das otimizações aplicadas para reduzir o peso de imagens/vídeos e melhorar a arquitetura de carregamento (lazy load / prefetch / LCP) da homepage.

## Contexto

Dois problemas foram tratados em duas frentes:

1. **Tamanho dos arquivos** — imagens em resolução 5K/6K (até 20 MB) e vídeos pesados estavam deixando o repositório e o site lentos.
2. **Arquitetura de carregamento** — mesmo com arquivos pequenos, as imagens demoravam a aparecer porque o prefetch baixava tudo de uma vez, saturando a conexão e competindo com o caminho crítico (LCP).

---

## 1. Redução de mídia

### O que foi feito

Todas as mídias foram otimizadas com **ffmpeg** (local, sem scripts versionados) e as versões originais foram substituídas em `public/`.

### Imagens gigantes (65 MB → ~1 MB no total)

| Arquivo | Dimensões originais | Antes | Depois |
|---|---|---|---|
| `Men-1.png` → `Men-1.webp` | 5120×2880 | 19,8 MB | 195 KB |
| `New-Collections -1.webp` | 5120×2880 | 12,7 MB | 155 KB |
| `Ready-to-Wear-2.webp` | 4946×6182 | 11,5 MB | 430 KB |
| `mega-menu-swimwear-1.webp` | 3008×4512 | 10,1 MB | 135 KB |
| `mega-menu-swimwear-2.webp` | 5191×6489 | 11,1 MB | 142 KB |

Comando usado (padrão para as imagens):

```bash
ffmpeg -y -i "origem.webp" -vf "scale=1600:-2" \
  -c:v libwebp -quality 82 -compression_level 6 "destino.webp"
```

- Redimensionamento para ~1600–1920 px (largura máxima exibida no site)
- Re-encode WebP (qualidade 82) — as imagens locais não passam pelo `next/image`, então a compressão é feita na origem
- Conversões de formato: `Men-1.png` → `.webp`, `footer-image.jpeg` → `.webp`, `imagem video new collections.jpg` → `.webp` (referências atualizadas no código)

### Vídeos (1080p → 720p)

| Arquivo | Antes | Depois |
|---|---|---|
| `video-banner-hero.mp4` | 1,89 MB | 728 KB |
| `banner alta costura .mp4` | 1,81 MB | 626 KB |
| `bloco 5-video 1-esquerda.mp4` | 1,05 MB | 478 KB |
| `bloco 5-video 2-direita.mp4` | 2,14 MB | 897 KB |
| `Video New Collections.mp4` | 2,0 MB | 1,35 MB |

Comando usado:

```bash
ffmpeg -y -i "origem.mp4" -vf "scale=1280:720" \
  -c:v libx264 -crf 30 -preset slow -movflags +faststart -an "destino.mp4"
```

- Escala para 720p (ou 900 px de largura nos vídeos verticais do bloco 5)
- CRF 30 + preset slow (bom equilíbrio tamanho/qualidade)
- `+faststart` (moov no início — permite playback progressivo)
- `-an` (sem áudio — todos os vídeos do site são silenciosos)

### Limpeza

- **Removidos do tracking do git**: 34 screenshots de debug em `scripts/**/*.png` (21,8 MB) — adicionados ao `.gitignore`
- **Removidos arquivos órfãos** não referenciados no código: `Banner Salle.webp`, `banner-salle.webp`, `bloco 3.webp`, `Boco2-mobile.webp`, `icone sinesia.webp`, `icone-sinesia.webp`, `nav-banner-sale.png`, `New-Collections-1.webp`, `Ready-to-Wear-2.webp`

### Resultado

- `public/` caiu de **~90 MB para ~8,3 MB**
- Maior arquivo no site agora: 1,4 MB (`Video New Collections.mp4`)

---

## 2. Arquitetura de carregamento

> Referência: padrões usados por Amazon, Airbnb, Netflix — prefetch por proximidade de scroll, nunca em massa; acima do fold eager/priority, abaixo do fold lazy.

### Antes (o problema)

O `MediaPrefetcher` disparava, logo após o `load` da página, **4 vídeos (~3,7 MB) + ~20 imagens em paralelo** via `fetch`. Isso saturava a conexão do usuário e fazia as imagens abaixo do fold (mesmo pequenas) demorarem — o vídeo hero e os vídeos de seções competiam com o caminho crítico.

### Depois (as mudanças)

#### P1 — `media-prefetcher.tsx` reescrito

- **Imagens**: aquecidas em **lotes de 3** (`IMAGE_BATCH_SIZE`) durante `requestIdleCallback`, cada lote esperando o próximo idle. Prioridade baixa (`fetchpriority="low"`).
- **Vídeos**: agrupados por seção (`videoGroups`) e só baixados quando a seção está a **~2 viewports** de distância (`IntersectionObserver` com `rootMargin: '2400px 0px'`). Após disparar, o grupo é desobservado (uma vez por sessão).
- O vídeo hero foi **removido** do prefetch (ele já é carregado pelo próprio componente).

API do componente:

```tsx
<MediaPrefetcher
  images={HOME_IMAGES}
  videoGroups={[
    { anchorId: 'collection-cta', videos: ['/bloco%205-video%201-esquerda.mp4', '/bloco%205-video%202-direita.mp4'] },
    { anchorId: 'our-values', videos: ['/banner%20alta%20costura%20.mp4'] },
  ]}
/>
```

As seções com vídeo agora têm um `id` de âncora (`collection-cta`, `our-values`).

#### P2 — `collection-grid-video.tsx` com lazy loading

- O vídeo da grade (`Video New Collections.mp4`, 1,4 MB) tocava no mount, **mesmo fora da tela**.
- Agora: `IntersectionObserver` (rootMargin 800px) monta o `<video>` apenas quando a seção se aproxima; o **poster (`next/image`) fica visível** até o `playing` disparar, com fade suave.
- `preload="none"` mantido — o vídeo só baixa de verdade ao entrar na área de observação.

#### P3 — `preconnect` no `<head>`

Adicionado em `src/app/layout.tsx`:

```tsx
<link rel="preconnect" href="https://cdn.shopify.com" />
<link rel="preconnect" href={ASSET_ORIGIN} />
```

As imagens de produto vêm de `cdn.shopify.com` e os assets de marketing de `framerusercontent.com` (via `cdnAsset()`). O preconnect elimina o DNS + TLS handshake (~200–400 ms) nas primeiras imagens de cada origem.

#### P4 — `content-visibility` nas seções abaixo do fold

Em `globals.css`:

```css
.mkt-entrance,
.mkt-entrance-stagger {
  content-visibility: auto;
  contain-intrinsic-size: auto 800px;
}
```

As seções abaixo do hero pulam style/layout/paint até se aproximarem do viewport. `contain-intrinsic-size: auto` faz o navegador lembrar a altura real renderizada de cada seção — sem pular a barra de rolagem.

#### P5 — Hero video deferido pós-LCP

Em `lazy-autoplay-video.tsx`, o modo `eager` do hero antes iniciava no próximo `requestAnimationFrame`, competindo com o poster (imagem LCP) por banda. Agora espera **idle do navegador**:

```ts
requestIdleCallback(() => setShouldLoad(true), { timeout: 2500 })
```

O poster (com `priority`) pinta primeiro; o vídeo começa a baixar quando a rede está livre.

---

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/components/storefront/media-prefetcher.tsx` | Prefetch em lotes + por proximidade |
| `src/lib/catalog/media-assets.ts` | `HOME_VIDEOS` → `HOME_VIDEO_GROUPS` (agrupados por seção) |
| `src/components/storefront/home-page.tsx` | Nova API do prefetcher |
| `src/components/storefront/collection-cta.tsx` | `id="collection-cta"` (âncora do prefetch) |
| `src/components/storefront/our-values.tsx` | `id="our-values"` (âncora do prefetch) |
| `src/components/storefront/collection-grid-video.tsx` | Lazy load via IntersectionObserver + poster |
| `src/app/layout.tsx` | `preconnect` para CDNs |
| `src/app/globals.css` | `content-visibility` nas seções |
| `src/components/storefront/lazy-autoplay-video.tsx` | Hero deferido até idle |

## Commits

| Commit | Conteúdo |
|---|---|
| `82148cb` | Compressão de imagens (webp) e vídeos (720p), untrack de screenshots, remoção de órfãos |
| `55eda77` | Reescrita do prefetcher, lazy load do vídeo de grade, preconnect, content-visibility, hero pós-LCP |

## Verificação

- Build (`npm run build`): **passou**
- Lint: **sem erros**
- Testes: 260/261 passando — o único falho (`catalog-search.test.ts`) é **pré-existente** e não relacionado às mudanças (confirmado via stash)

## Nota sobre o tamanho do repositório no GitHub

O GitHub ainda reporta ~276 MB no repositório até o garbage collection rodar. O conteúdo da branch `main` já está otimizado (~8,3 MB em `public/`); o número alto reflete objetos órfãos do histórico antigo (imagens 5K e vídeos grandes de commits anteriores), que o GitHub remove automaticamente nas semanas seguintes.
