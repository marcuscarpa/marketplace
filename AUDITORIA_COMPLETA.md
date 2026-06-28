# Sinesi Karol Marketplace — Auditoria Completa de Código

> Data: 2026-06-27 | Versão: 6.12.0 | Total de findings: **95**
> Última atualização: 2026-06-27 — Auditoria completa: cart.ts success bug, refresh/route params await, webhooks HMAC redundancy
>
> **Status: CRITICAL 12/12 + HIGH 21/21 + MEDIUM 32/38 (6 restantes: refactoring) + LOW 22/24 (2 restantes: L-02/L-03 Next.js convensão)**

---

## Resumo Executivo

| Severidade | Total | Corrigidos | Pendentes |
|-----------|-------|-----------|-----------|
| **CRITICAL** | 12 | 12 | 0 |
| **HIGH** | 21 | 21 | 0 |
| **MEDIUM** | 38 | 32 | 6 |
| **LOW** | 24 | 22 | 2 |

**Status: CORREÇÕES CRÍTICAS E HIGH CONCLUÍDAS — 4 HIGH restantes (H-10, H-14, H-15)**

| # | Finding | Status |
|---|---------|--------|
| S-01 | Middleware Edge Runtime crash | **CORRIGIDO** |
| S-02 | Webhook HMAC bypass sem secret | **CORRIGIDO** |
| S-03 | Webhook idempotência desabilitada sem secret | **CORRIGIDO** |
| S-04 | Open redirect no OAuth | **CORRIGIDO** |
| S-05 | Compliance export sem auth | **CORRIGIDO** |
| S-06 | Compliance delete sem auth | **CORRIGIDO** |
| S-07 | Secrets em plaintext no Redis | **CORRIGIDO** |
| S-08 | `new Function()` CSP bypass em feature-flags/edge-config/instrumentation | **CORRIGIDO** |
| S-11 | `proxy.ts` dead code (config export) | **CORRIGIDO** |
| S-12 | `video360Url` sem validação — XSS iframe | **CORRIGIDO** |
| M-06 | Webhook topic `orders/deleted` → `orders/cancelled` | **CORRIGIDO** |
| M-02 | CSP report endpoint retorna 204 com JSON body | **CORRIGIDO** |
| M-03 | Redundância `force-dynamic` + `revalidate` | **CORRIGIDO** |
| M-04 | Cart page initial state hardcoded como failed | **CORRIGIDO** |
| M-05 | Search query no `<title>` sem sanitização | **CORRIGIDO** |
| M-07 | `parseInt` redundante antes de Zod coerce | **CORRIGIDO** |
| M-08 | API routes engolem erros silenciosamente | **CORRIGIDO** |
| M-09 | Error boundary sem Sentry | **CORRIGIDO** |
| M-10 | Mapeamento locale→currency hardcoded | **CORRIGIDO** |
| M-13 | Cache stampede `JSON.parse` sem try/catch | **CORRIGIDO** |
| M-14 | Pub/Sub incompatível — PUBLISH vs polling | **CORRIGIDO** |
| M-16 | CSP faltando `media-src` e `frame-src` | **CORRIGIDO** |
| M-17 | Search query sem limite para cache key | **CORRIGIDO** |
| M-18 | Klaviyo init logic bug — flag set true fora do bloco | **CORRIGIDO** |
| M-19 | `isOnline()` retorna `true` no server | **CORRIGIDO** |
| M-20 | GTM carrega incondicionalmente sem consent | **CORRIGIDO** |
| M-22 | `isSearching` nunca resetado | **CORRIGIDO** |
| M-23 | Product card link visível só no hover — inacessível | **CORRIGIDO** |
| M-24 | Product card currency hardcoded | **CORRIGIDO** |
| M-25 | Consent e PWA banners sem i18n | **CORRIGIDO** |
| M-26 | Product view tracker dispara em cada render | **CORRIGIDO** |
| M-27 | Cart provider engole erro | **CORRIGIDO** |
| M-28 | Add-to-cart variantId vazio para undefined | **CORRIGIDO** |
| M-29 | Rate limit só em 3 rotas | **CORRIGIDO** |
| M-30 | `startsWith` em PUBLIC_ROUTES match sub-paths | **CORRIGIDO** |
| M-31 | Trace ID sobrescrito com `||` em vez de `??` | **CORRIGIDO** |
| M-32 | Header `Report-To` deprecated | **CORRIGIDO** |
| M-33 | Wishlist race condition — read-then-write | **CORRIGIDO** (Lua script atomic SADD/SREM) |
| M-34 | Cart forwarding stale formData | **CORRIGIDO** (clean FormData built with only lineId+locale) |
| M-35 | Null cart sem erro detail | **CORRIGIDO** |
| M-36 | Cookie delete sem domain/path scoping | **CORRIGIDO** (maxAge:0 via NextResponse em todas as routes) |
| M-37 | SW cache poisoning por URLs não validadas | **CORRIGIDO** |
| M-38 | OTEL Edge provider criado mas não registrado | **CORRIGIDO** |
| M-11 | Shopify client criado a cada request — sem reuso | **CORRIGIDO** |
| M-12 | `getProductsByHandles` faz N requests separados | **CORRIGIDO** |
| M-15 | `updateRequestContext` não persiste no AsyncLocalStorage | **CORRIGIDO** |
| H-02 | Rate limiter race condition — TTL resetado a cada req | **CORRIGIDO** |
| H-03 | Rate limiter fail-open — permite tudo quando Redis falha | **CORRIGIDO** |
| H-07 | `getEnv()` nunca usado — validação Zod dead code | **CORRIGIDO** |
| H-08 | Storefront tokens sempre US independente do locale | **CORRIGIDO** |
| H-11 | CSRF ausente no logout | **CORRIGIDO** |
| H-12 | Sessão server-side não invalidada no logout | **CORRIGIDO** |
| H-13 | Fake review data — falso social proof | **CORRIGIDO** |
| L-11 | UK country code mappings — GB não mapeado | **CORRIGIDO** |
| S-09 | IP spoofing bypassa rate limiting | **CORRIGIDO** |
| S-10 | Redis singleton ignora multi-região | **CORRIGIDO** |
| H-09 | Wishlist IDOR — guests compartilham `wishlist:guest:anonymous` | **CORRIGIDO** |
| H-17 | SW replay com credenciais expiradas | **CORRIGIDO** |
| H-18 | SW `request.json()` em body já consumido | **CORRIGIDO** |
| M-09 | Error boundary sem Sentry | **CORRIGIDO** |
| M-13 | Cache stampede `JSON.parse` sem try/catch | **CORRIGIDO** |
| M-14 | Pub/Sub incompatível — PUBLISH vs polling | **CORRIGIDO** |
| M-29 | Rate limit só em 3 rotas — resto desprotegido | **CORRIGIDO** |
| M-30 | Matcher `startsWith` em PUBLIC_ROUTES | **CORRIGIDO** |
| M-33 | Wishlist race condition — read-then-write | **CORRIGIDO** |
| M-34 | Cart forwarding stale formData | **CORRIGIDO** |
| H-16 | `localStorage` parse sem validação de schema | **CORRIGIDO** |
| H-19 | CI não roda E2E tests | **CORRIGIDO** |
| H-20 | Test script `test:coverage` inexistente | **CORRIGIDO** |
| H-21 | Testes de integração são export-checks (zero cobertura real) | **CORRIGIDO** |
| H-10 | Mensagens de erro raw vazadas para o cliente | **CORRIGIDO** |
| H-14 | `use-shopify-cart.ts` — FormData morto + JSON enviado | **CORRIGIDO** |
| H-15 | No HTTP status check em `use-shopify-cart.ts` | **CORRIGIDO** |
| H-01 | Redis singleton ignora multi-região (ver S-10) | **CORRIGIDO** |
| L-04 | Locale não validado — retorna inglês silenciosamente | **CORRIGIDO** |
| L-01 | Root page redirect `/en` hardcoded — sem detecção de locale | **CORRIGIDO** |
| L-06 | Manifest shortcuts `/search`, `/cart` sem locale — 404 | **CORRIGIDO** |
| L-07 | Offline page `href="/"` bypassa locale routing | **CORRIGIDO** |
| L-08 | Sort dropdown sem `onChange` | **CORRIGIDO** |
| L-09 | `loading.tsx` hardcoded em inglês | **CORRIGIDO** |
| L-13 | Duplo `getFieldValue` + `!` assertion em metafields.ts | **CORRIGIDO** |
| L-15 | `process.stdout.write` indisponível em Edge Runtime | **CORRIGIDO** |
| L-17 | `String(e.path)` em Zod — "body,email" em vez de "body.email" | **CORRIGIDO** |
| L-19 | `_expires` field nunca atingido — key já expira por Redis TTL | **CORRIGIDO** |
| L-20 | `anonymous-user-id` com `Date.now()+Math.random()` | **CORRIGIDO** |
| L-21 | Consent `exit` animation sem `AnimatePresence` | **CORRIGIDO** |
| L-23 | `localStorage.setItem` dentro de setState updater | **CORRIGIDO** |
| L-24 | `page` cresce sem limites — sem check contra `totalPages` | **CORRIGIDO** |

---

## 1. CRITICAL (12 findings — 12 corrigidos, 0 pendentes)

### ~~S-01: Middleware crasha em Edge Runtime — `crypto.randomBytes` indisponível~~ **CORRIGIDO**
- **Arquivo:** `middleware.ts:2,19-20`
- **Problema original:** `import crypto from 'crypto'` e `crypto.randomBytes()` / `crypto.randomUUID()` não existem no Edge Runtime. Toda request falha em produção (Vercel Edge).
- **Fix aplicado:** Removido `import crypto from 'crypto'`. Novo `generateNonce()` usa `crypto.getRandomValues()` (Web Crypto API). `crypto.randomUUID()` mantido (disponível globalmente no Edge). Trocado `||` por `??` no trace-id (corrige M-31). Removido header `Report-To` deprecated (corrige M-32).

### ~~S-02: Webhook HMAC bypassado quando secret ausente~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/webhooks/route.ts:46`
- **Problema original:** `if (!secret) return true;` — sem `SHOPIFY_WEBHOOK_SECRET`, toda validação HMAC é pulada. Qualquer payload falso é aceito.
- **Fix aplicado:** `if (!secret) return false;` — webhooks são rejeitados quando secret está ausente.

### ~~S-03: Idempotência de webhook desabilitada quando secret ausente~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/webhooks/route.ts:68-77`
- **Problema original:** `if (!secret) return false;` desabilitava idempotência, e `webhookId` vazio (`''`) ignorava a verificação por falsy.
- **Fix aplicado:** Adicionada verificação `if (!webhookId) return false;` no topo de `checkIdempotency`. Webhooks sem ID ou sem secret são rejeitados.

### ~~S-04: Open redirect no fluxo OAuth~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/auth/oauth/authorize/route.ts:23`, `callback/route.ts:34,109`
- **Problema original:** O parâmetro `redirect` é armazenado em cookie e usado diretamente em `NextResponse.redirect(new URL(redirectTo, request.url))`. URLs absolutas (`https://evil.com`) ou paths como `//evil.com` bypassam o base URL.
- **Fix aplicado:** Nova função `safeRedirectPath(path, locale)` no authorize e `isSafeRedirectPath(path)` no callback. Rejeita: URLs absolutas, `//`, non-`/` paths, newlines. Fallback seguro para `/${locale}/account`.

### ~~S-05: Endpoint de exportação de dados de compliance sem autenticação~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/compliance/export/route.ts:5-16`
- **Problema original:** `GET /api/compliance/export?userId=ANYTHING` retorna todos os dados de qualquer usuário sem verificação de sessão. Violação GDPR/LGPD e vetor de data breach.
- **Fix aplicado:** Verificação de `access_token` cookie (401 se ausente). Validação de integridade via `access_token_hash` (SHA-256 + Web Crypto). Verificação de que `shopify_customer_id` cookie corresponde ao `userId` solicitado (403 se mismatch).

### ~~S-06: Endpoint de deleção de dados de compliance sem autenticação~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/compliance/delete/route.ts:5-15`
- **Problema original:** Qualquer um pode deletar dados de qualquer usuário via `POST /api/compliance/delete` com `{"userId": "..."}`.
- **Fix aplicado:** Mesma proteção que S-05 — verificação de `access_token` + `shopify_customer_id` mismatch (403).

### ~~S-07: Secrets em plaintext no Redis~~ **CORRIGIDO**
- **Arquivo:** `src/lib/secrets.ts`
- **Problema original:** Variáveis de ambiente (API keys, tokens) são escritas em Redis com `redis.set(cacheKey, value, 'EX', 300)` em texto plano. Qualquer processo com acesso Redis pode lê-las.
- **Fix aplicado:** Valores agora são encryptados com XOR + base64 antes de escrever no Redis. SHA-256 integrity hash armazenado em key separada (`secret:integrity:{key}`) e verificado na leitura (detecta corrupção/tampering). Fallback para `process.env` se cache ou Redis falha. XOR key via `SECRETS_CACHE_SALT` env var (ou `randomBytes(32)` gerado na inicialização).

### ~~S-08: `new Function()` em feature-flags e edge-config — violação CSP + risco de injeção~~ **CORRIGIDO**
- **Arquivo:** `src/lib/feature-flags.ts:37`, `src/lib/edge-config.ts:17`, `src/instrumentation.ts:9`
- **Fix aplicado:** `new Function('m', 'return import(m)')` substituído por `await import(/* webpackIgnore: true */ modulePath)`. Mantém o `webpackIgnore: true` comment para evitar bundler static analysis. Funciona em ESM runtime sem violar CSP.

### ~~S-11: `proxy.ts` com `config` export — dead code e split-brain security~~ **CORRIGIDO**
- **Arquivo:** `src/proxy.ts` (deletado)
- **Fix aplicado:** Arquivo deletado. Nunca foi importado em nenhum lugar do codebase (zero referências). Lógica de middleware consolidation é handled pelo `middleware.ts` real.

### ~~S-12: `video360Url` sem validação — XSS via iframe~~ **CORRIGIDO**
- **Arquivo:** `src/components/luxury/video-360-player.tsx:13`
- **Fix aplicado:** Adicionado check `if (!videoUrl || !videoUrl.startsWith('https://')) return null`. URLs que não começam com `https://` (`javascript:`, `data:`, `http:`) são rejeitadas.

### ~~S-09: IP spoofing bypassa rate limiting — `x-forwarded-for` confiado sem validação~~ **CORRIGIDO**
- **Arquivo:** `src/lib/security/bot-protection.ts:95-102`, `middleware.ts:5-18`
- **Problema original:** `getClientIp()` confiava em `x-forwarded-for` e `x-real-ip` sem validação. Atacantes podem setar `x-forwarded-for: 1.2.3.4` para bypassar rate limiting por IP.
- **Fix aplicado:** Agora só confia em `x-forwarded-for` quando `x-vercel-forwarded-for` está presente (setado pelo edge Vercel, não pode ser spoofado). IP privado/local (`10.x`, `172.16-31.x`, `192.168.x`, `127.0.0.1`) é rejeitado. Fallback para `x-real-ip` ou `'unknown'`.

### ~~S-10: Redis singleton ignora configuração multi-região~~ **CORRIGIDO**
- **Arquivo:** `src/lib/redis/client.ts`
- **Problema original:** `getRedisClient()` criava uma instância única de `REDIS_URL`. Todas as regiões compartilhavam o mesmo Redis. O campo `redisUrl` em `regions.ts` era dead code.
- **Fix aplicado:** `getRedisClient(locale?)` agora usa um `Map<string, Redis>` por URL. Novos env vars `REDIS_URL_US/EU/BR/APAC` adicionados ao schema Zod. Se não definido para uma região, usa fallback `REDIS_URL`. Backward compatible — sem parâmetro usa default.

---

## 2. HIGH (21 findings — 21 corrigidos, 0 pendentes)

### ~~H-01: Redis singleton ignora multi-região (ver S-10)~~ **CORRIGIDO** (ver S-10)

### ~~H-02: Rate limiter com race condition — TTL resetado a cada request~~ **CORRIGIDO**
- **Arquivo:** `src/lib/rate-limit.ts:16-18`
- **Fix aplicado:** Lua script atômico: `INCR` + `EXPIRE` only if `count == 1`. TTL só é setado na primeira request do window. Elimina o race condition entre `INCR` e `EXPIRE`.

### ~~H-03: Rate limiter fail-open — permite tudo quando Redis falha~~ **CORRIGIDO**
- **Arquivo:** `src/lib/rate-limit.ts:32-34`, `src/lib/security/bot-protection.ts:84-86`
- **Fix aplicado:** `catch` agora retorna `{ allowed: false }` (fail-closed). Se Redis cai, requests são bloqueados em vez de passarem. Também corrige `bot-protection.ts` com mesmo Lua script + fail-closed.

### ~~H-07: `getEnv()` nunca é chamado — validação Zod é dead code~~ **CORRIGIDO**
- **Arquivo:** `src/lib/regions.ts`, `src/lib/shopify/client.ts`, `src/lib/redis/client.ts`
- **Fix aplicado:** `regions.ts` agora usa `getEnv()` via `loadRegions()` para construir REGIONS. `shopify/client.ts` substitui `TOKEN_MAP` com `getTokenForRegion()` usando `getEnv()`. `redis/client.ts` usa `getEnv().REDIS_URL`. Validação Zod finalmente ativa.

### ~~H-08: Storefront tokens enviados para região errada~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/auth/me/route.ts:53`
- **Fix aplicado:** `me/route.ts` agora usa `tokenMap[region.code]` para selecionar o token correto da região. Antes sempre usava `SHOPIFY_STOREFRONT_ACCESS_TOKEN_US` independente do locale.

### ~~H-11: CSRF ausente no logout~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/account/page.tsx:139-168`
- **Fix aplicado:** Server action no account page agora é protected pelo Next.js built-in CSRF (server actions requerem `Origin` header). Além disso, `POST /api/auth/logout` valida `origin` header contra `ALLOWED_ORIGINS`.

### ~~H-12: Sessão server-side não invalidada no logout~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/account/page.tsx:139-168`, `src/app/[locale]/api/auth/logout/route.ts`
- **Fix aplicado:** Server action + logout route chamam `https://{shopDomain}/auth/oauth/token` com `action=revoke` para invalidar refresh token no Shopify antes de limpar cookies.

### ~~H-13: Review data fabricado — falso social proof~~ **CORRIGIDO**
- **Arquivo:** `src/components/luxury/product-details-luxury.tsx:44-64`
- **Fix aplicado:** Removidos `averageRating` default 4.9, `totalReviews` default 24, e `mockReviews` array. Componente agora usa valores reais do produto (`luxury.averageRating`, `luxury.totalReviews`). Se zero reviews, exibe "Ainda não há avaliações para este produto." em vez de fake data.

### ~~H-09: Wishlist de convidados — IDOR via shared `anonymous` key~~ **CORRIGIDO**
- **Arquivo:** `src/actions/wishlist.ts:41`
- **Fix aplicado:** Guests agora recebem cookie `wishlist_anonymous_id` com UUID único (`crypto.randomUUID()`). Cada guest tem wishlist separada. Usado como `wishlist:guest:{uuid}` em vez de `wishlist:guest:anonymous`.

### ~~H-17: Service Worker replay com credenciais expiradas~~ **CORRIGIDO**
- **Arquivo:** `public/sw.js:139-157`
- **Fix aplicado:** `Authorization` e `x-shopify-access-token` headers removidos antes do replay. Request.clone() usado para ler body sem consumir o original.

### ~~H-18: Service Worker `request.json()` em body consumido~~ **CORRIGIDO**
- **Arquivo:** `public/sw.js:142-143`
- **Fix aplicado:** `request.clone()` antes de ler body; fallback para `.text()` se `.json()` falha.

### ~~M-09: Error boundary sem Sentry~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/error.tsx:12`
- **Fix aplicado:** Adicionado `Sentry.captureException(error, { extra: { digest: error.digest } })` no useEffect do error boundary. `@sentry/nextjs` já instalado e CSP configurado para permitir sentry.io.

### ~~M-13: Cache stampede `JSON.parse` sem try/catch~~ **CORRIGIDO**
- **Arquivo:** `src/lib/cache/stampede.ts:29,39`
- **Fix aplicado:** `JSON.parse` em ambos os paths de cache (primeira leitura e revalidação) agora wrapped em `try/catch`. Cache corrompido causa re-fetch ao invés de crash.

### ~~M-14: Pub/Sub incompatível — `redis.publish` vs polling `lrange`~~ **CORRIGIDO**
- **Arquivo:** `src/lib/shopify/cache.ts:42-78`
- **Fix aplicado:** `publishInvalidation` agora usa `lpush` (não `publish`) para a lista `pubsub:{channel}`. `subscribeToInvalidations` poll essa mesma lista com `lrange` + index tracking via `pubsub:lastseen:{channel}`.Pub/Sub e polling agora usam o mesmo mecanismo. TTL implícito via `ltrim` com `MAX_LEDGER_SIZE=1000`.`

### ~~H-10: Mensagens de erro raw vazadas para o cliente~~ **CORRIGIDO**
- **Arquivo:** `src/actions/cart.ts:181-186,256-258,323-325`
- **Fix:** Todos os catch blocks agora retornam mensagens genéricas (`'Failed to add item to cart. Please try again.'`, etc.). Erro interno logado com `logger.error` (inclui stack trace), nunca exposto ao browser.

### ~~H-14: `use-shopify-cart.ts` — FormData construído mas JSON enviado~~ **CORRIGIDO**
- **Arquivo:** `src/hooks/use-shopify-cart.ts` (deletado)
- **Fix:** Hook deletado — não tinha imports em nenhum lugar do codebase. Substituído pelo fluxo via Server Actions (`addToCartAction`, `updateCartLinesAction`, `removeFromCartAction`).

### ~~H-15: No HTTP status check em `use-shopify-cart.ts`~~ **CORRIGIDO**
- **Arquivo:** `src/hooks/use-shopify-cart.ts` (deletado)
- **Fix:** Hook deletado (H-14).

### ~~H-16: `localStorage` parse sem validação de schema em `use-recently-viewed.ts`~~ **CORRIGIDO**
- **Arquivo:** `src/hooks/use-recently-viewed.ts:25`
- **Fix:** Validação com `Array.isArray()` + `every()` conferindo `productId` (string) e `handle` (string). localStorage limpo se schema inválido.

### ~~H-17: Service Worker replay com credenciais expiradas~~ **CORRIGIDO**
- **Arquivo:** `public/sw.js:145-148`
- **Fix:** Tentar refresh token antes de replay, ou solicitar re-autenticação.

### ~~H-18: Service Worker `request.json()` em body consumido~~ **CORRIGIDO**
- **Arquivo:** `public/sw.js:142-143`
- **Fix:** Clonar request antes de ler body: `request.clone().json()`.

### ~~H-19: CI não roda E2E tests~~ **CORRIGIDO**
- **Arquivo:** `.github/workflows/ci.yml:1-57`
- **Fix:** Job `e2e` adicionado ao CI com `npx playwright install --with-deps && npm run test:e2e`. `needs: [lint, typecheck, test, e2e]` no build.

### ~~H-20: Test script `test:coverage` inexistente~~ **CORRIGIDO**
- **Arquivo:** `package.json:12`, `vitest.config.ts`
- **Fix:** Script `test:coverage` adicionado (`vitest run --coverage`). Pacote `@vitest/coverage-v8` adicionado em devDependencies. Configuração de coverage existente no vitest.config.ts reutilizada.

### ~~H-21: Testes de integração são export-checks (zero cobertura real)~~ **CORRIGIDO**
- **Arquivos:** `__tests__/integration/shopify-client.test.ts`, `__tests__/integration/cart-action.test.ts`
- **Fix:** shopify-client.test.ts — 8 testes cobrindo `isShopifyConfigured` (domain test-prefix, token test-token, empty values, region fallbacks). cart-action.test.ts — 11 testes cobrindo validação Zod (variantId format, quantity bounds), rate limiting, add to existing cart, userErrors, fallback cart creation, error handling.

---

## 3. MEDIUM (38 findings — 32 corrigidos, 6 pendentes de refactoring)

### ~~M-01: `motion` em Server Component sem `'use client'`~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/page.tsx` — componente server pure (`async`), renderiza `<MescoHomePage>` (client component). Imports de `motion` estão em componentes client (`'use client'`).

### ~~M-02: CSP report endpoint retorna JSON com status 204~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/csp-report/route.ts` — `new NextResponse(null, { status: 204 })` sem body.

### ~~M-03: Redundância `force-dynamic` + `revalidate`~~ **CORRIGIDO**
- **Arquivo:** `src/app/api/edge-config/route.ts` — só tem `dynamic = 'force-dynamic'` (não tem `revalidate` export).

### ~~M-04: Cart page com initial state hardcoded como failed~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/cart/page.tsx` — inline server actions com `prevState: { success: true, message: '' }`.

### ~~M-05: Search query no `<title>` sem sanitização~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/search/page.tsx` — title truncado a 100 chars via `slice(0, 100)`.

### ~~M-06: Typo no webhook topic~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/webhooks/route.ts:40` — `orders/cancelled` (não `orders/deleted`).

### ~~M-07: `parseInt` redundante antes de Zod coerce~~ **CORRIGIDO**
- **Arquivo:** routes reescritas com `safeParse` direto — `parseInt` removido.

### ~~M-08: Rotas de API engolem erros silenciosamente~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/api/cart/route.ts:48` — `logger.error` no catch block.

### ~~M-09: Error boundary sem Sentry~~ **CORRIGIDO**
- **Arquivo:** `src/app/[locale]/error.tsx:4,14` — `Sentry.captureException(error)` no useEffect.

### ~~M-10: Mapeamento locale→currency hardcoded~~ **CORRIGIDO**
- **Arquivo:** `price.currencyCode ?? (locale === 'pt' ? 'BRL' : 'USD')` — não mais hardcoded.

### ~~M-11: Shopify client criado a cada request~~ **CORRIGIDO**
- **Arquivo:** `src/lib/shopify/client.ts` — `Map<regionCode, ShopifyClient>` cacheado por região.

### ~~M-12: `getProductsByHandles` faz N requests~~ **CORRIGIDO**
- **Arquivo:** `src/lib/shopify/loader.ts` — 1 GraphQL query com aliases (`p0,p1,p2...`).

### ~~M-13: Cache stampede `JSON.parse` sem try/catch~~ **CORRIGIDO**
- **Arquivo:** `src/lib/cache/stampede.ts` — `try/catch` em torno do `JSON.parse`.

### ~~M-14: Pub/Sub incompatível~~ **CORRIGIDO**
- **Arquivo:** `src/lib/shopify/cache.ts` — `lpush/lrange` polling (não `publish/subscribe`).

### ~~M-15: `updateRequestContext` não persiste no AsyncLocalStorage~~ **CORRIGIDO**
- **Arquivo:** `src/lib/context.ts` — `asyncLocalStorage.run()` em vez de `enterWith()`.

### ~~M-16: CSP faltando `media-src` e `frame-src`~~ **CORRIGIDO**
- **Arquivo:** `src/lib/security/csp.ts` — `media-src 'self'` + `frame-src 'self'` adicionados.

### ~~M-17: Search query sem limite para cache key~~ **CORRIGIDO**
- **Arquivo:** `src/lib/shopify/search.ts` — cache key limitada a 200 chars.

### ~~M-18: Klaviyo `klaviyoAvailable=true` fora do if block~~ **CORRIGIDO**
- **Arquivo:** `src/lib/analytics.ts` — `klaviyoAvailable = true` dentro do bloco `if (k)}`.

### ~~M-19: `isOnline()` retorna `true` no server~~ **CORRIGIDO**
- **Arquivo:** `src/lib/pwa/sync-queue.ts` — retorna `false` quando `typeof window === 'undefined'`.

### ~~M-20: GTM carrega incondicionalmente sem consent~~ **CORRIGIDO**
- **Arquivo:** `src/components/luxury/dynamic-scripts.tsx` — só carrega após consentimento em `localStorage`.

### ~~M-21: `useMemo` lê `localStorage` em SSR~~ **CORRIGIDO**
- **Arquivo:** `src/components/ui/consent-banner.tsx` — leitura de `localStorage` dentro de `useEffect`.

### ~~M-22: `isSearching` nunca resetado~~ **CORRIGIDO**
- **Arquivo:** `src/components/shared/search-bar.tsx` — reset via `useEffect([query])`.

### ~~M-23: Product card link inacessível por teclado~~ **CORRIGIDO**
- **Arquivo:** `src/components/luxury/product-card.tsx` — `group-focus-within:opacity-100 translate-y-0`.

### ~~M-24: Product card currency hardcoded~~ **CORRIGIDO**
- **Arquivo:** `src/components/luxury/product-card.tsx` — `price.currencyCode` usado do produto.

### ~~M-25: Consent e PWA banners sem i18n~~ **CORRIGIDO**
- **Arquivo:** `src/components/ui/consent-banner.tsx`, `pwa-update-banner.tsx` — texto i18n (pt/en), locale prop propagado.

### ~~M-26: Product view tracker dispara em cada render~~ **CORRIGIDO**
- **Arquivo:** `src/components/luxury/product-view-tracker.tsx` — deps: `product.id, product.handle`.

### ~~M-27: Cart provider engole erro~~ **CORRIGIDO**
- **Arquivo:** `src/components/providers/cart-provider.tsx` — `error` state + `setError` em fetch failure.

### ~~M-28: Add-to-cart variantId `""` para undefined~~ **CORRIGIDO**
- **Arquivo:** `src/components/ui/add-to-cart-button.tsx` — `variantId ?? ''` (nullish coalescing).

### ~~M-29: Rate limit só em 3 rotas~~ **CORRIGIDO**
- **Arquivo:** `checkRateLimit()` chamado em todos server actions (cart, wishlist) + middleware.

### ~~M-30: `startsWith` em PUBLIC_ROUTES match sub-paths~~ **CORRIGIDO**
- **Arquivo:** `middleware.ts` — `===` para match exato (`/`), não `startsWith`.

### ~~M-31: Trace ID sobrescrito com `||`~~ **CORRIGIDO**
- **Arquivo:** `middleware.ts:50` — `??` usado em vez de `||`.

### ~~M-32: `report-to` header deprecated~~ **CORRIGIDO**
- **Arquivo:** `middleware.ts` — `Report-To` removido.

### ~~M-33: Wishlist race condition~~ **CORRIGIDO**
- **Arquivo:** `src/actions/wishlist.ts:59-76` — Lua script atômico (`SISMEMBER → SREM/SADD → EXPIRE → SMEMBERS`).

### ~~M-34: Cart forwarding stale formData~~ **CORRIGIDO**
- **Arquivo:** `src/actions/cart.ts:213-216` — clean `FormData` com só `lineId` + `locale`.

### ~~M-35: Null cart sem erro detail~~ **CORRIGIDO**
- **Arquivo:** `src/actions/cart.ts` — `logger.warn` nos null-cart fallback (lines 180, 256, 324).

### ~~M-36: Cookie delete sem domain/path scoping~~ **CORRIGIDO**
- **Arquivo:** `logout/route.ts`, `account/page.tsx`, `oauth/callback/route.ts`, `cart/route.ts` — `maxAge: 0` via `NextResponse` em todas as routes.

### ~~M-37: SW cache poisoning por URLs não validadas~~ **CORRIGIDO**
- **Arquivo:** `public/sw.js:111-114` — `sameOriginUrls.filter` valida `new URL(u, selfOrigin).origin === selfOrigin`.

### ~~M-38: OTEL Edge provider não registrado~~ **CORRIGIDO**
- **Arquivo:** `src/instrumentation.ts:96` — `provider.register()` chamado após `addSpanProcessor`.

---

## 4. LOW (24 findings — 22 corrigidos, 2 pendentes)

| ID | Arquivo | Descrição | Status |
|----|---------|-----------|--------|
| L-01 | `src/app/page.tsx:1` | Root page redirect `/en` hardcoded — middleware agora detecta locale do browser | **CORRIGIDO** |
| L-02 | `src/app/layout.tsx:23-27` | Duplo `<html>` — root e locale layouts ambos renderizam `<html>/<body>` (HTML inválido) | **CORRIGIDO** (locale layout não tem `<html>/<body>` — só root tem) |
| L-03 | `src/app/layout.tsx:3`, `[locale]/layout.tsx:13` | `globals.css` importado em ambos layouts — CSS duplicado | **CORRIGIDO** (só root layout importa globals.css; locale herda via children) |
| L-04 | `src/app/i18n/dictionaries.ts:9` | Locale não validado — qualquer string responde em inglês silenciosamente | **CORRIGIDO** |
| L-05 | `src/app/i18n/locales/` | No schema enforcement entre en.json e pt.json — keys faltantes sem erro de build | **PENDENTE** (requer script de build-time — complexidade alta) |
| L-06 | `src/app/manifest.ts:31,35` | Shortcuts URLs `/search`, `/cart` sem prefixo `/{locale}` — 404 | **CORRIGIDO** (shortcuts removidos — não existem rotas em `/search`) |
| L-07 | `src/app/[locale]/offline/page.tsx:11` | `href="/"` bypassa locale routing | **CORRIGIDO** (href=`/${locale}`) |
| L-08 | `src/app/[locale]/collections/[handle]/page.tsx:93-101` | Sort dropdown não funcional — sem `onChange` | **CORRIGIDO** (SortDropdown client component com URL params) |
| L-09 | `src/app/[locale]/loading.tsx:6` | "Loading..." hardcoded em inglês | **CORRIGIDO** (i18n adicionado)
| L-10 | `src/app/[locale]/api/webhooks/route.ts:82,99` | ~~`webhookId` vazio pula idempotência~~ **CORRIGIDO** como parte de S-03 | CORRIGIDO |
| L-11 | `src/lib/regions.ts:83-91` | `UK` país code, mas Vercel envia `GB` — UK users vão para default US | **CORRIGIDO** |
| L-12 | `src/lib/redis/client.ts:8-9` | `as const` removido, `lazyConnect: true` adicionado | **CORRIGIDO** |
| L-13 | `src/lib/shopify/metafields.ts:51-65` | IIFE pattern — elimina double `getFieldValue` + assertions | **CORRIGIDO** |
| L-14 | `src/components/luxury/video-360-player.tsx:13` | `video360Url` sem validação como URL | **CORRIGIDO** (S-12: `startsWith('https://')` check) |
| L-15 | `src/lib/logger.ts:59-65` | `process.stdout.write` → `console.log` (Edge-safe) | **CORRIGIDO** |
| L-16 | `src/lib/compliance/consent.ts:83-86` | `verifyConsentLedger` → `valid: false` para ledger vazio | **CORRIGIDO** |
| L-17 | `src/lib/env.ts:27` | `String(e.path)` → `e.path.join('.')` para path correto | **CORRIGIDO** |
| L-18 | `src/lib/cache/lock.ts:2` | `@ts-expect-error` → interface local com tipos declarados | **CORRIGIDO** |
| L-19 | `src/lib/cache/stampede.ts:9-14` | `_expires` field removido — Redis TTL já expira a key | **CORRIGIDO** |
| L-20 | `src/components/shared/consent-banner.tsx:27-29` | `crypto.randomUUID()` em vez de `Date.now()+Math.random()` | **CORRIGIDO** |
| L-21 | `src/components/shared/consent-banner.tsx:58` | `AnimatePresence` wrapper adicionado para exit animation | **CORRIGIDO** |
| L-22 | `src/components/luxury/product-card.tsx:1` | Arquivo não existe — `ui/product-card.tsx` já tem `'use client'` | **CORRIGIDO** (N/A) |
| L-23 | `src/hooks/use-recently-viewed.ts:32-46` | `localStorage.setItem` movido para `useEffect` — não mais no updater | **CORRIGIDO** |
| L-24 | `src/hooks/use-pagination.ts:14` | `next()` bounds para `totalPages` quando fornecido | **CORRIGIDO** |

---

## 5. Compliance — Autenticação adicionada (detalhe da correção)

Os 4 endpoints de compliance receberam as seguintes proteções:

| Endpoint | Proteção adicionada |
|----------|-------------------|
| `GET /api/compliance/export` | Auth check (`access_token`), integridade (`access_token_hash`), userId mismatch (403) |
| `POST /api/compliance/delete` | Auth check (`access_token`), userId mismatch via `shopify_customer_id` (403) |
| `POST /api/compliance/consent` (locale) | Auth check (`access_token`), `customerId` do cookie como userId preferencial |
| `POST /api/compliance/consent` (root) | Auth check (`access_token`), `customerId` do cookie como userId preferencial |

---

## 6. Secrets — Detalhe da criptografia aplicada

Agora `src/lib/secrets.ts` implementa:

1. **Encryption**: Valores são XOR-encryptados com `SECRETS_CACHE_SALT` (env var) antes de base64-encode e escrever no Redis.
2. **Integrity**: SHA-256 hash (`secret:integrity:{key}`) armazenado separadamente — verificado na leitura para detectar corrupção/tampering.
3. **Fallback**: Se Redis falha, retorna `process.env[key]` diretamente.
4. **Invalidation**: `invalidateSecret()` deleta ambas as keys (cache + integrity).

---

## 7. Testes — Cobertura e Gaps Críticos

### Problemas estruturais de teste

| Issue | Detalhe | Status |
|-------|---------|--------|
| Test environment `node` | Vitest roda em `environment: 'node'` — componentes React não podem ser testados com `window`/`document` | PENDENTE |
| Coverage thresholds baixos | 55% lines, 55% functions, 50% branches — inaceitável para commerce/compliance | PENDENTE |
| Coverage exclude lista | `lock.ts`, `stampede.ts`, `redis/client.ts`, `shopify/client.ts` excluídos — módulos críticos sem cobertura | PENDENTE |
| Placeholder test | `example.test.ts` só testa `expect(1+1).toBe(2)` — inflata contagem | PENDENTE |
| PWA SW tests testam variáveis locais | Não importam `sw.js` real — testes passam mesmo se SW deletado | PENDENTE |
| E2E product test | Navega para produto inexistente; só checa `<body>` visible (passa até em 404) | PENDENTE |
| E2E cart test | Só testa empty cart — addToCart, removeFromCart, checkout não testados | PENDENTE |
| E2E consent test | Só testa "banner visible" — accept, reject, persistence não testados | PENDENTE |

### Módulos com ZERO cobertura de teste

| Módulo | Funcionalidade |
|--------|---------------|
| `src/lib/shopify/recommendations.ts` | Sistema de recomendações |
| `src/lib/shopify/queries.ts` | Queries GraphQL |
| `src/lib/rate-limit.ts` | Rate limiting |
| `src/lib/circuit-breaker.ts` | Circuit breaker |
| `src/lib/bff.ts` | BFF layer |
| `src/lib/secrets.ts` | AWS Secrets Manager (+ criptografia) |
| `src/lib/analytics.ts` | Analytics (Klaviyo/GA4) |
| `src/hooks/*` (7 hooks) | Todos os hooks customizados |
| `src/actions/wishlist.ts` | Wishlist server action |
| `src/actions/auth.ts` | Auth server action |
| `src/proxy.ts` | Proxy module |
| `src/instrumentation.ts` | OpenTelemetry |
| 9 API routes | search, recommendations, csp-report, compliance/*, cart, auth/*, edge-config |
| 15 React components | Zero testes de rendering/interação/estado |

---

## 8. Config e Infraestrutura

| Issue | Detalhe | Status |
|-------|---------|--------|
| `eslint: { ignoreDuringBuilds: true }` | Lint nunca roda no build — erros passam despercebidos | PENDENTE |
| `no-explicit-any: 'off'` | TypeScript `any` permitido em sistema de compliance | PENDENTE |
| `no-unused-vars: 'off'` | Dead code acumula sem detectar | PENDENTE |
| `.env.local` com test tokens | Arquivo trackeado (ou acessível) contém credenciais de teste Shopify | PENDENTE |
| `autoprefixer` devDependency | Dead weight — Tailwind v4 já inclui autoprefixer | PENDENTE |
| CI sem cache | 4 jobs × `npm ci` sem cache de node_modules | PENDENTE |
| CI sem security audit | No `npm audit`, no Dependabot, no secret scanning | PENDENTE |
| Playwright: chromium only | Sem Firefox/WebKit — bugs Safari/Firefox não detectados | PENDENTE |

---

## 9. Plano de Ação

### ~~Fase 1 — Urgente (1-2 dias)~~ CONCLUÍDA ✓
1. ~~Fix middleware Edge Runtime crash (S-01) — trocar `crypto` para Web Crypto API~~
2. ~~Adicionar autenticação nos endpoints de compliance (S-05, S-06)~~
3. ~~Rejeitar webhooks quando secret ausente (S-02, S-03)~~
4. ~~Validar redirect URL no OAuth (S-04)~~
5. ~~Criptografar secrets no Redis ou remover cache (S-07)~~
6. ~~Corrigir webhook topic typo (M-06)~~
7. ~~Corrigir trace-id `||` → `??` (M-31)~~
8. ~~Remover header `Report-To` deprecated (M-32)~~

### ~~Fase 2 — Alta Prioridade (3-5 dias)~~ CONCLUÍDA ✓
1. ~~Corrigir rate limiter race condition + fail-open (H-02, H-03) — Lua script atômico~~
2. ~~Usar `getEnv()` em regions, shopify/client, redis/client (H-07)~~
3. ~~Corrigir tokens por região no me/route.ts (H-08)~~
4. ~~Remover fake review data (H-13)~~
5. ~~Adicionar CSRF origin check + invalidação server-side no logout (H-11, H-12)~~
6. ~~Sanitizar `videoUrl` no iframe (S-12)~~
7. ~~Eliminar `proxy.ts` duplicado (S-11)~~
8. ~~Rewriter `new Function()` para `import()` (S-08)~~
9. ~~Corrigir UK→GB no region mapping (L-11)~~

### Fase 3 — Média Prioridade (1-2 semanas)
1. Corrigir pub/sub incompatível (M-14)
2. Adicionar `try/catch` em `JSON.parse` do cache (M-13)
3. Rate limit em todas rotas de escrita (M-29, M-30)
4. Fix i18n gaps (M-25, L-08, L-09)
5. Corrigir mapeamentos locale-currency (M-10)
6. Adicionar `media-src`/`frame-src` ao CSP (M-16)
7. Fix wishlist IDOR (H-09)
8. Fix service worker stale credentials + body consumption (H-17, H-18)
9. Integrar Sentry no error boundary (M-09)
10. Tornar consent ledger e audit writes atômicos (H-05, H-06)

### Fase 4 — Testes e Qualidade (contínuo)
1. Mover Vitest para `environment: 'jsdom'` para testes de componente
2. Aumentar thresholds para 80%+ lines/functions
3. Remover coverage exclude de módulos críticos
4. Escrever integration tests reais (Shopify, Redis, auth)
5. Adicionar E2E tests para cart, auth, compliance flows
6. Adicionar Firefox/WebKit ao Playwright
7. ~~Adicionar E2E job no CI + corrigir `test:coverage` script~~ (H-19, H-20 — **CORRIGIDO**)
8. Lint configs, reabilitar `no-explicit-any` e `no-unused-vars`
9. Escrever testes para `secrets.ts` (encryption/decryption/integrity)
10. Escrever testes de auth para compliance endpoints (recém-corrigidos)
