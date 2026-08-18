# Modo Coming Soon — Documentação Completa

> Data: 18/08/2026
> Projeto: `Marketplace` (Next.js 15 + React 19 + TypeScript + Tailwind CSS 4)

---

## 1. Resumo

O site foi colocado **fora do ar** e substituído por uma página **Coming Soon** de tela cheia, com fundo de imagem, logomarca, formulário de newsletter e mensagem de confirmação. Todo o site antigo (loja) continua intacto no código — nada foi apagado. Este documento explica exatamente o que foi feito e como **reverter com segurança** quando o site precisar voltar ao ar.

---

## 2. Arquivos envolvidos

| Arquivo | Status | Descrição |
|---|---|---|
| `src/components/storefront/coming-soon.tsx` | **Novo** | Componente da página Coming Soon (logomarca, título, formulário) |
| `src/app/coming-soon/page.tsx` | **Novo** | Rota `/coming-soon` |
| `src/app/page.tsx` | **Modificado** | Raiz `/` agora renderiza a Coming Soon (antes: `redirect('/en')`) |
| `src/middleware.ts` | **Modificado** | Todas as rotas redirecionam para `/coming-soon` |
| `public/banner 1.2 (1) (1).png` | **Novo (asset)** | Imagem de fundo (4K, já estava em `public/`) |
| `public/logotipo.webp` | **Existente** | Logomarca usada no header — reutilizada na Coming Soon |

> **Importante:** Nenhum arquivo da loja (`src/app/[locale]/`, `src/components/storefront/*`, catálogo, etc.) foi alterado ou removido.

---

## 3. O que cada mudança faz

### 3.1 `src/components/storefront/coming-soon.tsx` (novo)

Componente `'use client'` com:

- **Fundo**: imagem `/banner 1.2 (1) (1).png` com `bg-cover bg-center bg-no-repeat` via `backgroundImage` inline + overlay `bg-black/30` para legibilidade.
- **Logomarca**: `/logotipo.webp` (150×75px), posicionada com `absolute left-1/2 top-[55px]` — fixa no topo, **fora do fluxo**, para não deslocar o conteúdo centralizado.
- **Título**: `WE'RE BUILDING OUR WEBSITE` (uppercase, `text-4xl/5xl`, bold).
- **Subtítulo**: "Sign up now and be the first to know when it's ready!".
- **Formulário**: input de email (transparente, borda branca fina, `rounded-full`, placeholder itálico) + botão circular com seta SVG. Ao enviar, exibe mensagem de confirmação (estado local apenas — **não conectado a nenhum backend**).
- **Sem** rodapé de copyright e **sem** ícones de redes sociais (removidos a pedido).

### 3.2 `src/app/coming-soon/page.tsx` (novo)

Rota standalone fora de `[locale]`, para renderizar a página em **tela cheia sem header/footer/modais do site**.

```tsx
export const metadata: Metadata = {
  title: 'Coming Soon | Sinesia Karol',
  robots: { index: false, follow: false }, // não indexar nos buscadores
};
```

### 3.3 `src/app/page.tsx` (modificado)

**Antes (site no ar):**

```tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/en');
}
```

**Depois (coming soon):**

```tsx
import type { Metadata } from 'next';
import { ComingSoon } from '@/components/storefront/coming-soon';

export const metadata: Metadata = {
  title: 'Coming Soon | Sinesia Karol',
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return <ComingSoon />;
}
```

### 3.4 `src/middleware.ts` (modificado)

**Antes (site no ar):** redirecionava `/pt/*` → `/en/*` e `/` → `/en`.

**Depois (coming soon):**

```ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Deixa arquivos estáticos da pasta /public passarem sem redirecionar.
  if (/\.[a-zA-Z0-9]{1,5}$/.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname === '/' || pathname === '/coming-soon') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/coming-soon', request.url));
}
```

> ⚠️ **Detalhe crítico:** a verificação de arquivos estáticos (extensão no final da URL) é **obrigatória**. Sem ela, o middleware redireciona também as imagens/fontes de `public/` — foi exatamente isso que "sumiu" o fundo da página (a imagem voltava como `text/html`). Não remova essa linha.

---

## 4. Como testar localmente

```bash
cd Marketplace
npm run dev
```

- `http://localhost:3000/` → mostra a Coming Soon.
- `http://localhost:3000/coming-soon` → mostra a Coming Soon.
- `http://localhost:3000/en/about` (ou qualquer rota antiga) → redireciona para `/coming-soon`.
- `http://localhost:3000/banner 1.2 (1) (1).png` → deve responder `image/png` (se responder `text/html`, o middleware está bloqueando estáticos).

---

## 5. COMO REVERTER — voltar o site ao ar (guia seguro)

### Opção A — Reverter com `git` (recomendado, rápido e 100% seguro)

Os dois arquivos modificados (`src/app/page.tsx` e `src/middleware.ts`) têm versão original no git (commit `HEAD`). Para restaurar:

```bash
cd Marketplace

# Restaura os dois arquivos modificados para o estado original
git checkout HEAD -- src/app/page.tsx src/middleware.ts

# Verifica o que sobrou (devem restar apenas os arquivos novos e os assets)
git status
```

Os arquivos **novos** (listados abaixo) podem ser **removidos** depois, quando não forem mais necessários:

```bash
git clean -f src/app/coming-soon/ src/components/storefront/coming-soon.tsx
```

> Opcional — se quiser manter a página `/coming-soon` acessível no futuro (ex.: reutilizar depois), **não rode** o `git clean` acima. Os arquivos novos são inofensivos para o site no ar, pois o middleware original ignora caminhos sem essa rota.

**Observação sobre o asset:** `public/banner 1.2 (1) (1).png` já existia na pasta `public/` antes das alterações (apenas não estava versionado no git). Ele **não atrapalha** a loja e pode ficar onde está. Se quiser removê-lo, delete o arquivo manualmente — nenhum código do site original o referencia.

### Opção B — Reverter manualmente (sem git)

**1. Restaurar `src/app/page.tsx`:**

```tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/en');
}
```

**2. Restaurar `src/middleware.ts`** (versão original completa):

```ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * Only `en` is live right now. The `/pt` locale is disabled until the
 * Brazilian Shopify store is ready — any `/pt/*` request redirects to `/en/*`.
 */
const DEFAULT_LOCALE = 'en' as const;

function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => isNaN(p))) return false;
  const [a, b] = parts;
  if (a === undefined || b === undefined) return false;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function getClientIp(request: NextRequest): string | null {
  const vercelFw = request.headers.get('x-vercel-forwarded-for');
  if (vercelFw) {
    const segments = vercelFw.split(',');
    const first = segments[0]?.trim();
    if (first && !isPrivateIp(first)) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp && !isPrivateIp(realIp)) return realIp;
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Disabled locale: /pt and /pt/... redirect to the English equivalent.
  if (pathname === '/pt' || pathname.startsWith('/pt/')) {
    const target = pathname === '/pt' ? '/en' : `/en${pathname.slice('/pt'.length)}`;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Root always resolves to the live default locale.
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**3. (Opcional) Remover os arquivos novos:**

- `src/app/coming-soon/page.tsx`
- `src/app/coming-soon/` (diretório, se vazio)
- `src/components/storefront/coming-soon.tsx`

---

## 6. Checklist de validação após reverter

Depois de reverter (opção A ou B), rode localmente e confirme:

- [ ] `npm run dev` compila sem erros
- [ ] `http://localhost:3000/` redireciona para `/en` e mostra a **home da loja** (header, hero, produtos)
- [ ] `http://localhost:3000/en/` mostra a loja normalmente
- [ ] `http://localhost:3000/en/collections/...` mostra as coleções
- [ ] `http://localhost:3000/coming-soon` retorna **404** (rota removida) — comportamento esperado
- [ ] `npm run build` completa sem erros
- [ ] Fazer o deploy normalmente (Vercel) e validar em produção

> Se usou a Opção A com `git checkout`, os arquivos originais são exatamente os do commit `e5c0870`, que era o estado da loja funcionando.

---

## 7. Observações finais

- O formulário de newsletter da Coming Soon **não envia dados para lugar nenhum** — é apenas um estado local de demonstração. Se for usar de verdade, conecte-o a um serviço de email (ex.: a API de newsletter já existente no projeto, se houver).
- A página Coming Soon tem `robots: noindex` (não será indexada pelos buscadores).
- Para manter a loja em produção durante o período de construção do site, basta não reverter — o middleware já garante que nenhuma rota da loja seja acessível.
