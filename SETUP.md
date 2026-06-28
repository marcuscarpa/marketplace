# Sinesi Karol Marketplace — Setup Completo

> Documento de referência para deploy em produção. Criado após auditoria completa de código (v6.11.0).

---

## Índice

1. [Variáveis de Ambiente](#1-variáveis-de-ambiente)
2. [Shopify — Configuração](#2-shopify--configuração)
3. [Redis — Multi-Região](#3-redis--multi-região)
4. [Cloudflare — DNS e Workers](#4-cloudflare--dns-e-workers)
5. [Vercel — Deploy](#5-vercel--deploy)
6. [Variáveis por Ambiente](#6-variáveis-por-ambiente)
7. [Verificação Pós-Deploy](#7-verificação-pós-deploy)

---

## 1. Variáveis de Ambiente

### 1.1 Onde configurar

| Plataforma | Onde | Tipo |
|------------|------|------|
| **Vercel** | Project Settings → Environment Variables | Build + Runtime |
| **Cloudflare** | Dashboard → Workers & Pages → Settings → Variables | Runtime only |
| **Local** | `.env.local` (não commitear) | — |

### 1.2 Variáveis públicas (NEXT_PUBLIC — expostas ao browser)

These must have **"Exposure: Public"** on Vercel.

| Variável | Exemplo | Obrigatório | Notas |
|----------|---------|-------------|-------|
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `en` | ✅ | Idioma padrão da loja |
| `NEXT_PUBLIC_APP_URL` | `https://seudominio.com` | ✅ | Sem trailing slash. Usado no OAuth callback |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | ❌ | Google Analytics 4 |
| `NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY` | `pk_xxxxx` | ❌ | Klaviyo newsletter embed |

### 1.3 Variáveis server-only (NUNCA expostas ao browser)

These must have **"Exposure: Private"** on Vercel.

#### Shopify — Obrigatórias (8 tokens, 4 regiões)

```
SHOPIFY_STORE_DOMAIN_US=loja-us.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_US=xxxx
SHOPIFY_STORE_DOMAIN_EU=loja-eu.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU=xxxx
SHOPIFY_STORE_DOMAIN_BR=loja-br.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR=xxxx
SHOPIFY_STORE_DOMAIN_APAC=loja-apac.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC=xxxx
```

#### Shopify — Auth + Webhooks (Obrigatório)

```
SHOPIFY_CLIENT_ID=          # Customer Account API
SHOPIFY_CLIENT_SECRET=      # Customer Account API
SHOPIFY_WEBHOOK_SECRET=     # Gerado ao criar webhook
SHOPIFY_API_VERSION=2026-04  # Atualizar se Shopify marcar deprecated
```

#### Redis — Obrigatório

```
REDIS_URL=                  redis://host:6379 (fallback global)
REDIS_URL_US=              redis://us-host:6379 (opcional por região)
REDIS_URL_EU=              redis://eu-host:6379
REDIS_URL_BR=              redis://br-host:6379
REDIS_URL_APAC=            redis://apac-host:6379
REDIS_PUBSUB_CHANNEL=cache:invalidate
```

#### Rate Limiting — Obrigatório

```
RATE_LIMIT_FAIL_OPEN=false  # SEMPRE false — fail-closed (H-03)
```

#### Observability — Opcional

```
SENTRY_DSN=https://key@sentry.io/project
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io/v1/traces
```

#### Integrações Adicionais — Opcional

```
KLAVIYO_PRIVATE_API_KEY=    # Não é NEXT_PUBLIC — servidor
NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY=pk_xxx
ARCJET_KEY=
LAUNCHDARKLY_SDK_KEY=
EDGE_CONFIG=
EDGE_CONFIG_ID=
AWS_REGION=us-east-1
SECRETS_PREFIX=/shopify/
```

---

## 2. Shopify — Configuração

### 2.1 Criar Custom App

1. **Shopify Admin → Settings → Apps → Develop apps → Create an app**

```
App name: Sinesi Karol Marketplace
App type: Custom app
```

2. **API credentials → Install app** — copie os tokens

### 2.2 Storefront API (GraphQL)

**API credentials → Storefront API → Configure**

Scopes **unauthenticated** (sem login):
```
unauthenticated_read_product_listings
unauthenticated_read_selling_plans
unauthenticated_write_checkouts
unauthenticated_read_checkouts
```

Scopes **authenticated** (com OAuth login):
```
read_customer
write_customer
```

Copiar `Storefront API access token` para cada região (`SHOPIFY_STOREFRONT_ACCESS_TOKEN_*`).

### 2.3 Customer Account API (OAuth PKCE)

**API credentials → Customer Account API → Configure**

Scopes:
```
read_customer
write_customer
```

Copiar `Client ID` para `SHOPIFY_CLIENT_ID`.

Gerar `Client secret` para `SHOPIFY_CLIENT_SECRET`.

### 2.4 Webhooks — Registrar em cada loja

**Admin → Settings → Notifications → Webhooks → Add webhook**

Para **cada loja** (US, EU, BR, APAC), criar webhooks para:

| Topic | Endpoint | Formato |
|-------|----------|---------|
| `orders/cancelled` | `https://seudominio.com/pt/api/webhooks` | JSON |
| `customers/data_request` | `https://seudominio.com/pt/api/webhooks` | JSON |
| `customers/redact` | `https://seudominio.com/pt/api/webhooks` | JSON |
| `shop/redact` | `https://seudominio.com/pt/api/webhooks` | JSON |

> A mesma endpoint funciona para todas as lojas porque o route extrai a região do `locale` na URL.

Ao criar, a Shopify gera o **webhook secret** — copiar para `SHOPIFY_WEBHOOK_SECRET`.

### 2.5 OAuth Redirect URLs

**Customer Account API → Allowed redirect URLs:**

```
https://seudominio.com/pt/api/auth/oauth/callback
https://seudominio.com/en/api/auth/oauth/callback
```

**App URL:**
```
https://seudominio.com
```

### 2.6 Shopify API Version

```
SHOPIFY_API_VERSION=2026-04
```

Verificar em [shopify.dev/docs/api/changelog](https://shopify.dev/docs/api/changelog) se a versão está ativa. A Shopify marca versões como deprecated ~6 meses antes de desativar.

---

## 3. Redis — Multi-Região

### 3.1 Opções recomendadas

| Provider | Ideal para | Global tiering |
|----------|-----------|----------------|
| **Upstash** | Serverless (Vercel) — pay-per-request | ✅ native |
| **Redis Enterprise** | Alta escala | ✅ native |
| **Redis Cloud** | Flexível | ✅ via VPC peering |
| **Livebook** | Solo/mínimo | ❌ |

### 3.2 Schema das chaves Redis

| Chave | Tipo | TTL | Conteúdo |
|-------|------|-----|----------|
| `cart:user:{id}` | String (JSON) | 30 dias | Carrinho do utilizador logado |
| `cart:guest:{uuid}` | String (JSON) | 30 dias | Carrinho guest (UUID cookie) |
| `refresh:{userId}` | Hash | 30 dias | `{ token, exp }` |
| `consent_ledger:{userId}` | List (LPUSH) | 5 anos | GDPR consent records |
| `audit_log:{userId}` | List (LPUSH) | 5 anos | Audit events |
| `rl:{ip}:{endpoint}` | String (INCR) | 60s | Rate limit counter (Lua atomic) |
| `wishlist:guest:{uuid}` | Set | 90 dias | IDs dos produtos |
| `wishlist:user:{id}` | Set | 90 dias | IDs dos produtos |
| `lock:product:{handle}` | String | 30s | Redlock stampede |
| `lock:cart:{cartId}` | String | 30s | Redlock stampede |
| `cache:product:{handle}` | String (JSON) | 5 min | Cache produto |
| `cache:products:batch:{hash}` | String (JSON) | 5 min | Cache busca batch |
| `stampede:{cacheKey}` | String | 5 min | Stampede TTL marker |
| `secret:integrity:{key}` | String | — | SHA-256 integrity hash |

### 3.3 Upstash — Setup

1. Criar database em [upstash.com](https://upstash.com)
2. Regional databases: criar uma por região (US, EU, BR, APAC)
3. Copiar REST URL + token para as variáveis

```
# Global (fallback)
REDIS_URL=redis://default:password@global-xxxx.upstash.io:6379

# Por região
REDIS_URL_US=redis://us-xxxx.upstash.io:6379
REDIS_URL_EU=redis://eu-xxxx.upstash.io:6379
REDIS_URL_BR=redis://br-xxxx.upstash.io:6379
REDIS_URL_APAC=redis://apac-xxxx.upstash.io:6379
```

**Obs:** Se não definir variáveis por região, o código usa `REDIS_URL` para todas.

### 3.4 Rate Limit — Lua Script

O rate limiter usa um script Lua atómico (H-02 fix):

```lua
-- key = rl:{ip}:{endpoint}
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return current
```

Executar com `EVALSHA` para performance. O código trata Redis como **fail-closed** — se cair, requests são bloqueados.

---

## 4. Cloudflare — DNS e Workers

### 4.1 DNS — Configurar para Vercel

**Cloudflare Dashboard → DNS → Add record**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | 76.76.21.21 | ✅ DNS only (ou proxied) |
| CNAME | `www` | `cname.vercel-dns.com` | ⚠️ Proxied se Vercel Connected |
| CNAME | `seudominio.com` | `cname.vercel-dns.com` | ✅ Proxied |

> Para Vercel Connected Domains: `cname.vercel-dns.com`. Sem connected domain: apontar para IP do Vercel (76.76.21.21) ou usar CNAME com `alias` field.

### 4.2 SSL/TLS

**Cloudflare Dashboard → SSL/TLS → Overview**

```
Mode: Full (strict)
```

Garantir que o certificado Vercel cubra o domínio antes de ativar.

### 4.3 Page Rules (se necessário)

Se usar Cloudflare como proxy reverso para Vercel:

**Rules → Page Rules:**
```
URL: https://seudominio.com/*
Setting: Cache Level → Standard
Setting: Edge Cache TTL → 1 hour
```

### 4.4 Cloudflare Workers — Proxy opcional

Se quiseres usar Cloudflare Workers para:
- Rewriting de headers
- A/B testing na edge
- Custom cache headers

Criar Worker em **Cloudflare Dashboard → Workers & Pages → Create Worker**:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Adicionar headers customizados
    const modifiedRequest = new Request(request, {
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Country-Code': request.cf?.country ?? 'US',
        'X-City': request.cf?.city ?? 'unknown',
      },
    });

    return fetch(modifiedRequest);
  },
};
```

**Importante:** O código Next.js já detecta região por IP via `x-vercel-forwarded-for`. Cloudflare adiciona `CF-IPCountry` que pode ser usado como override.

### 4.5 Cloudflare — Vercel Integration (alternativa)

Se usares **Vercel Connected Domain** com Cloudflare:

1. **Vercel → Domains → Add** → inserir domínio
2. **Cloudflare → DNS** → adicionar os records que o Vercel indica
3. Usar **Cloudflare proxy (orange cloud)** para proteção DDoS
4. O SSL da Cloudflare deve estar em `Full` — Vercel já tem certificado Let's Encrypt

### 4.6 WAF — Regras recomendadas

**Cloudflare Dashboard → Security → WAF → Custom Rules:**

```
Rule 1: URI contains /api/auth/logout
  Action: Skip — evitar conflito com CSRF

Rule 2: IP reputation score < 30
  Action: Challenge

Rule 3: Country = XX (bloquear países específicos)
  Action: Block
```

### 4.7 DDoS Protection

**Cloudflare Dashboard → Security → Settings:**

```
Under Attack Mode: medium (se necessário)
Rate Limiting: ativar em Enterprise (ou usar o do código)
Botted traffic: JS challenge
```

### 4.8 Caching headers (via Cloudflare Workers)

Se quiseres controlar cache na Cloudflare em vez do Next.js:

```javascript
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const url = new URL(request.url);

  // Cachear estáticos na edge por 1 dia
  if (url.pathname.match(/\.(css|js|woff2?|ttf|png|jpg|webp)$/)) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', 'public, max-age=86400, immutable');
    return newResponse;
  }

  // Cachear páginas públicas 5 min
  if (request.method === 'GET' && !url.pathname.startsWith('/api')) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60');
    return newResponse;
  }

  return response;
}
```

---

## 5. Vercel — Deploy

### 5.1 Ligar repo

**Vercel Dashboard → Add New → Project → Import Git Repository**

Selecionar o repo GitHub.

### 5.2 Configurar Framework

```
Framework Preset: Next.js
Root Directory: ./ (ou marketplace/)
Build Command: npm run build
Output Directory: .next
```

### 5.3 Environment Variables — Configurar TODAS

**Crucial:** Variáveis sem valor causam crash em runtime.

Criar 3 ambientes:
- **Production** — valores reais
- **Preview** — valores de staging
- **Development** — `.env.local` (não subir para Vercel)

Listagem completa em [Secção 1](#1-variáveis-de-ambiente).

### 5.4 Dominions

**Vercel → Settings → Domains:**

```
seudominio.com    → Production
www.seudominio.com → Production (redirect)
```

O Vercel pede para adicionar DNS records na Cloudflare. Seguir as instruções.

### 5.5 Region Deployment (opcional)

Por defeito o Vercel deploya para a região mais próxima do utilizador (multi-region).

Para fixar uma região ou configurar edge middleware por região:

**Settings → Edge Functions → Region:**
```
Global (default) — usa edge network da Vercel
```

Se precisar de control precisely por região, usar **Vercel Edge Config** com geolocation.

### 5.6 Build Customization

**Settings → Build & Development Settings:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci --legacy-peer-deps",
  "framework": "nextjs"
}
```

### 5.7 Vercel CLI — Deploy manual

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add SHOPIFY_STORE_DOMAIN_US production
# ... adicionar todas as variáveis
vercel deploy --prod
```

### 5.8 CI/CD — GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci --legacy-peer-deps
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  e2e:
    runs-on: ubuntu-latest
    needs: [lint]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci --legacy-peer-deps
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

---

## 6. Variáveis por Ambiente

### 6.1 Desenvolvimento Local

```bash
# .env.local (NÃO COMMITAR)
SHOPIFY_STORE_DOMAIN_US=test-us.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_US=test-token
SHOPIFY_STORE_DOMAIN_EU=test-eu.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU=test-token
SHOPIFY_STORE_DOMAIN_BR=test-br.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR=test-token
SHOPIFY_STORE_DOMAIN_APAC=test-apac.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_APAC=test-token
SHOPIFY_CLIENT_ID=test-client-id
SHOPIFY_CLIENT_SECRET=test-client-secret
SHOPIFY_WEBHOOK_SECRET=test-webhook-secret
SHOPIFY_API_VERSION=2026-04
REDIS_URL=redis://127.0.0.1:6379
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_APP_URL=http://localhost:3000
RATE_LIMIT_FAIL_OPEN=false
```

### 6.2 Staging / Preview

Mesmas variáveis que produção, mas com:
- Tokens de loja de **staging/test**
- `NEXT_PUBLIC_APP_URL=https://staging.seudominio.com`

### 6.3 Produção

Valores reais de Shopify + Redis + dominância.

---

## 7. Verificação Pós-Deploy

### 7.1 Testes rápidos

```bash
# Home page
curl -s -o /dev/null -w "%{http_code}" https://seudominio.com/en
# Esperado: 200

# Redirect / → /en
curl -s -o /dev/null -w "%{http_code}" https://seudominio.com/
# Esperado: 302

# API health
curl -s https://seudominio.com/api/cart | head -c 100
# Esperado: JSON com id:null (sem carrinho)

# OAuth callback
curl -s -o /dev/null -w "%{http_code}" "https://seudominio.com/pt/api/auth/oauth/callback"
# Esperado: 302 (sem state)

# CSP report
curl -s -X POST https://seudominio.com/api/csp-report \
  -H "Content-Type: application/csp-report" \
  -d '{"csp-report":{}}'
# Esperado: 204
```

### 7.2 Playwright E2E

```bash
npm run build
npx playwright test --project=chromium
```

### 7.3 Verificar Rate Limiting

```bash
# Fazer 100 requests rápidos ao mesmo endpoint
for i in $(seq 1 100); do
  curl -s -o /dev/null -w "%{http_code}\n" https://seudominio.com/api/cart
done | sort | uniq -c
# Esperado: 200 para primeiros ~60, depois 429
```

### 7.4 Verificar Redis

```bash
redis-cli -u $REDIS_URL PING
# Esperado: PONG
```

### 7.5 Verificar Webhook

```bash
# No Shopify Admin → webhook → send test notification
# Verificar que chega em /api/webhooks e retorna 200
```

---

## Checklist Final

- [ ] Shopify Custom App criada com Storefront API + Customer Account API
- [ ] 4 tokens Storefront (US/EU/BR/APAC) copiados para Vercel
- [ ] `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET` configurados
- [ ] `SHOPIFY_WEBHOOK_SECRET` configurado (4 webhooks registados)
- [ ] Redis Upstash criado com URL + token
- [ ] `REDIS_URL_US/EU/BR/APAC` configurados (ou só `REDIS_URL` como fallback)
- [ ] `NEXT_PUBLIC_APP_URL` configurado em Vercel (sem trailing slash)
- [ ] `SHOPIFY_API_VERSION=2026-04` configurado
- [ ] `RATE_LIMIT_FAIL_OPEN=false` configurado
- [ ] DNS da Cloudflare aponta para Vercel com SSL Full
- [ ] OAuth redirect URLs whitelistadas no Shopify
- [ ] `npm run typecheck` passa localmente
- [ ] Deploy para Vercel production
- [ ] Home page carrega (`/en` e `/pt`)
- [ ] Webhook test notification retorna 200
- [ ] E2E tests passam

---

## Notas Importantes

### SHOPIFY_API_VERSION
```
A versão padrão é 2026-04. A Shopify desativa versões deprecated.
Marcar no calendário: verificar 30 dias antes de abril 2026.
```

### Rate Limiting
```
O código é fail-closed (H-03). Se Redis cair, requests são bloqueados.
Para desabilitar em emergência: RATE_LIMIT_FAIL_OPEN=true
MAS isso reverte para fail-open — usar só como último recurso.
```

### Redis Fallback
```
Se REDIS_URL_US/EU/BR/APAC não existirem, o código usa REDIS_URL.
Portanto não é obrigatório ter Redis por região — funciona com 1 só.
```

### next/headers cookies
```
cookieStore.delete() no Next.js 15 não aceita path/domain options.
Cookies são deletados corretamente via redirect (throw) que preserva
os Set-Cookie headers pendentes, ou via NextResponse com maxAge:0.
```

### next/headers no Edge Runtime
```
process.stdout.write não existe no Edge Runtime.
Usar console.log em vez de logger em middleware/instrumentation.
```

---

*Documento criado após auditoria de segurança completa — v6.11.0 — 2026-06-27*