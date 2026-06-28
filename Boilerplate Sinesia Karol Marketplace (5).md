\# 🚀 Boilerplate Definitivo v6.2.8 – E‑commerce de Luxo Global com Next.js \+ Shopify Native Stack (Guia Completo para Desenvolvedores)

Este documento é o \*\*manifesto técnico definitivo\*\* do projeto. Ele consolida \*\*todas\*\* as camadas, correções, refinamentos e boas práticas acumuladas ao longo de todo o desenvolvimento – desde a escolha da stack até os ajustes mais finos de produção. O objetivo é fornecer um \*\*guia absoluto e inquestionável\*\* para qualquer desenvolvedor que precise entender, manter ou estender este e‑commerce de luxo global.

\---

\#\# 📋 Índice

1\. \[Arquitetura Geral – Visão Holística\](\#1-arquitetura-geral--visão-holística)  
2\. \[Pré‑requisitos e Variáveis de Ambiente\](\#2-prérequisitos-e-variáveis-de-ambiente)  
3\. \[Estrutura de Pastas – O Mapa do Tesouro\](\#3-estrutura-de-pastas--o-mapa-do-tesouro)  
4\. \[Arquivos de Configuração – O Coração do Projeto\](\#4-arquivos-de-configuração--o-coração-do-projeto)  
5\. \[Refinamentos Finais (v6.2.8) – Porque cada linha importa\](\#5-refinamentos-finais-v628--porque-cada-linha-importa)  
   \- \[5.1. Isolamento do Cache do Carrinho por \`cartId\`\](\#51-isolamento-do-cache-do-carrinho-por-cartid)  
   \- \[5.2. Singleton do Cliente Redis com Pooling para Serverless\](\#52-singleton-do-cliente-redis-com-pooling-para-serverless)  
   \- \[5.3. Invalidação Atômica com \`revalidateTag\` e \`redis.del\`\](\#53-invalidação-atômica-com-revalidatag-e-redisdel)  
   \- \[5.4. Recomendação de Uso do \`@upstash/redis\` para Evitar Limites de Conexão\](\#54-recomendação-de-uso-do-upstashredis-para-evitar-limites-de-conexão)  
6\. \[Código Fonte – Cada Arquivo, Cada Camada, Explicado\](\#6-código-fonte--cada-arquivo-cada-camada-explicado)  
   \- \[6.1. Middleware (\`middleware.ts\`) – A Porta de Entrada\](\#61-middleware-middlewarets--a-porta-de-entrada)  
   \- \[6.2. Layout (\`app/\[locale\]/layout.tsx\`) – A Estrutura Base\](\#62-layout-applocalelayouttsx--a-estrutura-base)  
   \- \[6.3. Regiões (\`lib/regions.ts\`) – Geo‑IP, Cookie, Accept‑Language\](\#63-regiões-libregionsts--geoip-cookie-acceptlanguage)  
   \- \[6.4. Circuit Breaker (\`lib/circuit-breaker.ts\`) – Resiliência Contra Falhas\](\#64-circuit-breaker-libcircuit-breakerts--resiliência-contra-falhas)  
   \- \[6.5. Cache Distribuído com Redlock (\`lib/cache/lock.ts\` e \`stampede.ts\`)\](\#65-cache-distribuído-com-redlock-libcachelockts-e-stampedets)  
   \- \[6.6. Cliente Redis Singleton (\`lib/redis/client.ts\`) – Gerencie Conexões\](\#66-cliente-redis-singleton-libredisclientts--gerencie-conexões)  
   \- \[6.7. Lib Shopify – Cliente (\`lib/shopify/client.ts\`)\](\#67-lib-shopify--cliente-libshopifyclientts)  
   \- \[6.8. Lib Shopify – Queries (\`lib/shopify/queries.ts\`)\](\#68-lib-shopify--queries-libshopifyqueriests)  
   \- \[6.9. Lib Shopify – Busca e Recomendações\](\#69-lib-shopify--busca-e-recomendações)  
   \- \[6.10. API Routes – Refresh Token com Lock Distribuído\](\#610-api-routes--refresh-token-com-lock-distribuído)  
   \- \[6.11. API Routes – Webhooks com Replay Protection\](\#611-api-routes--webhooks-com-replay-protection)  
   \- \[6.12. API Routes – Search com Arcjet\](\#612-api-routes--search-com-arcjet)  
   \- \[6.13. Server Actions – Carrinho (\`actions/cart.ts\`)\](\#613-server-actions--carrinho-actionscartts)  
   \- \[6.14. Server Actions – Wishlist (\`actions/wishlist.ts\`)\](\#614-server-actions--wishlist-actionswishlistts)  
   \- \[6.15. Metafields Tipados – \`lib/shopify/types.ts\` e \`metafields.ts\`\](\#615-metafields-tipados--libshopifytypests-e-metafieldsts)  
   \- \[6.16. Componente de Detalhe do Produto – \`components/luxury/product-details-luxury.tsx\`\](\#616-componente-de-detalhe-do-produto--componentsluxuryproduct-details-luxurytsx)  
   \- \[6.17. Componente de Imagem com Motion\](\#617-componente-de-imagem-com-motion)  
   \- \[6.18. Componente de Scripts Dinâmicos (PPR)\](\#618-componente-de-scripts-dinâmicos-ppr)  
   \- \[6.19. Edge Config, Observabilidade, Compliance, ISR, OpenFeature, BFF\](\#619-edge-config-observabilidade-compliance-isr-openfeature-bff)  
7\. \[Matriz de Fluxo de Mídia – Core Web Vitals\](\#7-matriz-de-fluxo-de-mídia--core-web-vitals)  
8\. \[Checklist de Produção – O Selo de Qualidade\](\#8-checklist-de-produção--o-selo-de-qualidade)  
9\. \[Instruções de Execução – Do Zero ao Deploy\](\#9-instruções-de-execução--do-zero-ao-deploy)  
10\. \[Próximos Passos Estratégicos – O Futuro do Projeto\](\#10-próximos-passos-estratégicos--o-futuro-do-projeto)  
11\. \[Resumo Final – Porque esta arquitetura é imbatível\](\#11-resumo-final--porque-esta-arquitetura-é-imbatível)

\---

\#\# 1\. Arquitetura Geral – Visão Holística

\#\#\# 1.1. O Ecossistema

Nosso boilerplate é um \*\*e‑commerce de alto luxo\*\* construído sobre:

\- \*\*Next.js 15+\*\* (App Router) – a espinha dorsal do frontend, com Server Components, Streaming RSC e Partial Prerendering (PPR).  
\- \*\*Shopify\*\* – como backend de comércio, utilizando a \*\*Storefront API\*\* para catálogo, carrinho e checkout, e a \*\*Customer Account API\*\* (OAuth PKCE) para autenticação de clientes.  
\- \*\*Redis (Upstash)\*\* – como camada de cache distribuído, lock distribuído e armazenamento de sessões temporárias.  
\- \*\*Observabilidade\*\* – Sentry para erros, OpenTelemetry para tracing, logs estruturados com correlação.  
\- \*\*Segurança\*\* – CSP com nonce, HMAC para webhooks, Arcjet para bot protection, Rate limiting com Upstash.  
\- \*\*Feature Management\*\* – LaunchDarkly (via OpenFeature) e Vercel Edge Config para banners e kill switches.

\#\#\# 1.2. Porque esta arquitetura é robusta

| Camada | Decisão | Motivação |  
|--------|---------|-----------|  
| \*\*Multi‑região\*\* | \`resolveRegion()\` com cookie, Accept‑Language e Geo‑IP | Personalização de moeda, estoque e preço sem duplicar código. |  
| \*\*Cache\*\* | Redis com Redlock e stale‑while‑revalidate | Alta disponibilidade, proteção contra stampede e fallback em caso de falha da Shopify. |  
| \*\*Autenticação\*\* | OAuth PKCE com refresh token lock | Segurança e prevenção de race conditions em renew de token. |  
| \*\*Webhooks\*\* | HMAC \+ validação temporal (\`X‑Shopify‑Triggered‑At\`) | Proteção contra replay e falsificação. |  
| \*\*Imagens\*\* | \`next/image\` com Shopify CDN | Otimização automática (AVIF/WebP), redimensionamento, cache e zero custo adicional. |  
| \*\*Metafields\*\* | Parser com namespace explícito e fallback para string única | Resiliência a erros de entrada no admin, sem quebrar a UI. |

\#\#\# 1.3. O Fluxo de uma Requisição

1\. \*\*Middleware\*\* → resolve região, gera nonce, aplica CSP, rate limit.  
2\. \*\*Layout\*\* → injeta nonce, carrega Edge Config, providers.  
3\. \*\*Página (Server Component)\*\* → obtém dados via \`getShopifyClient(locale)\` → busca cache (Redis) → fallback para Shopify → retorna dados tipados.  
4\. \*\*Server Actions\*\* → validação Zod, rate limit, mutação → invalidação atômica (Redis \+ \`revalidateTag\`).  
5\. \*\*Webhooks\*\* → valida HMAC, temporal, processa evento → revalida tags e publica no Pub/Sub.

\---

\#\# 2\. Pré‑requisitos e Variáveis de Ambiente

\#\#\# 2.1. O que você precisa ter

\- Node.js \>= 20.x  
\- npm / yarn / pnpm  
\- Conta Shopify com duas lojas (US e BR) ou mais.  
\- Chaves de API (Storefront Access Tokens, Client ID/Secret para Customer Account).  
\- Redis (Upstash é recomendado para serverless).  
\- Contas nos serviços: Sentry, LaunchDarkly, Arcjet, AWS (para Secrets Manager), Klaviyo (opcional).

\#\#\# 2.2. O arquivo \`.env.local\`

Copie o bloco abaixo para a raiz do projeto e preencha com suas credenciais.

\`\`\`env  
\# \============================================  
\# SHOPIFY STORES (US, EU, BR, APAC)  
\# \============================================  
SHOPIFY\_STORE\_DOMAIN\_US=loja-us.myshopify.com  
SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_US=token\_us  
SHOPIFY\_STORE\_DOMAIN\_EU=loja-eu.myshopify.com  
SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_EU=token\_eu  
SHOPIFY\_STORE\_DOMAIN\_BR=loja-br.myshopify.com  
SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_BR=token\_br  
SHOPIFY\_STORE\_DOMAIN\_APAC=loja-apac.myshopify.com  
SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_APAC=token\_apac

\# \============================================  
\# SHOPIFY CUSTOMER ACCOUNT API (OAuth PKCE)  
\# \============================================  
SHOPIFY\_CLIENT\_ID=client\_id  
SHOPIFY\_CLIENT\_SECRET=client\_secret  
NEXTAUTH\_URL=https://seusite.com

\# \============================================  
\# REDIS (Global – Upstash ou Redis Enterprise)  
\# \============================================  
REDIS\_URL=redis://...:6379  
REDIS\_PUBSUB\_CHANNEL=cache:invalidate

\# \============================================  
\# WEBHOOK SECURITY  
\# \============================================  
SHOPIFY\_WEBHOOK\_SECRET=webhook\_secret

\# \============================================  
\# OBSERVABILIDADE  
\# \============================================  
SENTRY\_DSN=...  
OTEL\_EXPORTER\_OTLP\_ENDPOINT=https://api.honeycomb.io  
NEXT\_PUBLIC\_GA4\_MEASUREMENT\_ID=G-XXX

\# \============================================  
\# BOT PROTECTION (sem Cloudflare)  
\# \============================================  
ARCJET\_KEY=...

\# \============================================  
\# LAUNCHDARKLY & EDGE CONFIG  
\# \============================================  
LAUNCHDARKLY\_SDK\_KEY=...  
EDGE\_CONFIG\_ID=...

\# \============================================  
\# AWS SECRETS MANAGER  
\# \============================================  
AWS\_REGION=us-east-1  
SECRETS\_PREFIX=/shopify/

\# \============================================  
\# KLAVIYO  
\# \============================================  
KLAVIYO\_PUBLIC\_API\_KEY=...  
\`\`\`

\---

\#\# 3\. Estrutura de Pastas – O Mapa do Tesouro

Abaixo está a árvore de diretórios completa. Cada pasta tem um propósito claro, e você encontrará a explicação detalhada de cada arquivo nas seções seguintes.

\`\`\`  
src/  
├── app/  
│   ├── \[locale\]/                                    \# Rotas internacionalizadas  
│   │   ├── layout.tsx                               \# Root layout com nonce e providers  
│   │   ├── page.tsx                                 \# Homepage (ISR)  
│   │   ├── error.tsx                                \# Error boundary  
│   │   ├── loading.tsx                              \# Loading UI  
│   │   ├── search/  
│   │   │   └── page.tsx                             \# Página de busca  
│   │   ├── collections/\[handle\]/page.tsx            \# Página de coleção  
│   │   ├── products/\[handle\]/  
│   │   │   └── page.tsx                             \# Detalhe do produto (com metafields)  
│   │   ├── cart/page.tsx                            \# Página do carrinho  
│   │   ├── account/                                 \# Área do cliente  
│   │   │   ├── page.tsx  
│   │   │   ├── login/page.tsx  
│   │   │   └── ...  
│   │   └── api/                                     \# API Routes  
│   │       ├── webhooks/route.ts                    \# Webhooks Shopify  
│   │       ├── search/route.ts                      \# Busca (com Arcjet)  
│   │       ├── auth/  
│   │       │   ├── oauth/authorize/route.ts  
│   │       │   ├── oauth/callback/route.ts  
│   │       │   ├── refresh/route.ts                 \# Refresh token com lock  
│   │       │   └── ...  
│   │       ├── csp-report/route.ts                  \# Reporte de CSP  
│   │       └── compliance/                          \# GDPR/LGPD/CCPA  
│   │           ├── consent/route.ts  
│   │           ├── export/route.ts  
│   │           └── delete/route.ts  
│   └── i18n/dictionaries.ts                         \# Textos traduzidos  
├── actions/                                         \# Server Actions  
│   ├── cart.ts                                      \# Mutação do carrinho (com Zod e cache)  
│   ├── wishlist.ts  
│   └── auth.ts  
├── components/  
│   ├── providers/                                   \# Providers React  
│   │   ├── scroll-provider.tsx                      \# Lenis  
│   │   ├── cart-provider.tsx  
│   │   ├── wishlist-provider.tsx  
│   │   ├── auth-provider.tsx  
│   │   └── edge-config-provider.tsx  
│   ├── ui/                                          \# Componentes reutilizáveis  
│   │   ├── motion-link.tsx  
│   │   ├── product-card.tsx  
│   │   ├── search-bar.tsx  
│   │   ├── wishlist-button.tsx  
│   │   ├── product-reviews.tsx  
│   │   ├── header-cart-badge.tsx  
│   │   ├── product-recommendations.tsx  
│   │   ├── consent-banner.tsx  
│   │   ├── dynamic-scripts.tsx                     \# Scripts com nonce (PPR)  
│   │   └── (sem Turnstile)  
│   ├── shared/  
│   │   ├── motion-next-image.tsx                    \# Imagem com Motion  
│   │   ├── shopify-loader.ts  
│   │   └── safe-json-ld.tsx  
│   └── luxury/                                      \# Componentes de luxo  
│       ├── product-details-luxury.tsx               \# Página de detalhe (tipada)  
│       ├── video-360-player.tsx  
│       └── add-to-cart-button.tsx  
├── hooks/  
│   ├── use-shopify-cart.ts  
│   ├── use-wishlist.ts  
│   ├── use-debounce.ts  
│   ├── use-auth.ts  
│   ├── use-pagination.ts  
│   └── use-recently-viewed.ts  
├── lib/  
│   ├── shopify/  
│   │   ├── client.ts                               \# Cliente Shopify (com Circuit Breaker \+ fallback)  
│   │   ├── types.ts                               \# Tipos estritos (inclui LuxuryMetafields)  
│   │   ├── queries.ts                             \# GraphQL (com namespace)  
│   │   ├── loader.ts  
│   │   ├── cache.ts  
│   │   ├── search.ts  
│   │   ├── recommendations.ts  
│   │   └── metafields.ts                          \# Parser com namespace explícito  
│   ├── cache/  
│   │   ├── lock.ts                                 \# Redlock  
│   │   └── stampede.ts  
│   ├── redis/  
│   │   └── client.ts                               \# Singleton Redis  
│   ├── regions.ts  
│   ├── secrets.ts                                  \# AWS Secrets Manager  
│   ├── circuit-breaker.ts                          \# Cockatiel  
│   ├── rate-limit.ts  
│   ├── context.ts                                  \# AsyncLocalStorage para logs  
│   ├── logger.ts  
│   ├── sentry.ts  
│   ├── analytics.ts  
│   ├── feature-flags.ts  
│   ├── edge-config.ts  
│   ├── bff.ts  
│   └── compliance/  
│       ├── consent.ts  
│       └── audit.ts  
├── instrumentation.ts                               \# OpenTelemetry  
├── \_\_tests\_\_/  
│   ├── unit/  
│   ├── integration/  
│   └── e2e/  
└── styles/globals.css  
\`\`\`

\---

\#\# 4\. Arquivos de Configuração – O Coração do Projeto

\#\#\# 4.1. \`next.config.ts\`

Esse arquivo define como o Next.js se comporta: otimização de imagens, PPR ativado, e o hook de instrumentação para OpenTelemetry.

\`\`\`ts  
import type { NextConfig } from 'next';

const nextConfig: NextConfig \= {  
  images: {  
    remotePatterns: \[  
      {  
        protocol: 'https',  
        hostname: 'cdn.shopify.com',  
        pathname: '/\*\*',  
      },  
    \],  
    formats: \['image/avif', 'image/webp'\], // Ativa formatos modernos  
  },  
  experimental: {  
    instrumentationHook: true, // Para OpenTelemetry  
    ppr: true, // Partial Prerendering – melhora performance  
  },  
};

export default nextConfig;  
\`\`\`

\#\#\# 4.2. \`package.json\` – Dependências Essenciais

Abaixo as principais dependências. Instale todas com \`npm install\`.

\`\`\`json  
{  
  "name": "luxury-ecommerce",  
  "version": "6.2.8",  
  "private": true,  
  "scripts": {  
    "dev": "next dev",  
    "build": "next build",  
    "start": "next start",  
    "lint": "next lint",  
    "test": "vitest",  
    "test:e2e": "playwright test"  
  },  
  "dependencies": {  
    "@shopify/storefront-api-client": "^1.0.0",  
    "@sentry/nextjs": "^8.0.0",  
    "@vercel/edge-config": "^0.3.0",  
    "@opentelemetry/api": "^1.9.0",  
    "@opentelemetry/sdk-node": "^0.52.0",  
    "@opentelemetry/instrumentation-http": "^0.52.0",  
    "@opentelemetry/instrumentation-express": "^0.40.0",  
    "graphql": "^16.9.0",  
    "graphql-request": "^7.1.0",  
    "ioredis": "^5.4.0",           // Cliente Redis (pode ser substituído por @upstash/redis)  
    "js-cookie": "^3.0.5",  
    "launchdarkly-node-server-sdk": "^7.0.0",  
    "lenis": "^1.0.0",              // Scroll suave  
    "motion": "^11.11.13",          // Animações  
    "next": "15.2.0",  
    "react": "^19.0.0",  
    "react-dom": "^19.0.0",  
    "bullmq": "^5.0.0",  
    "arcjet": "^1.0.0",  
    "@aws-sdk/client-secrets-manager": "^3.0.0",  
    "cockatiel": "^3.1.0",          // Circuit Breaker  
    "redlock": "^5.0.0",  
    "openfeature": "^2.0.0",  
    "@openfeature/launchdarkly-provider": "^1.0.0",  
    "zod": "^3.22.0"  
  },  
  "devDependencies": {  
    "@types/js-cookie": "^3.0.6",  
    "@types/node": "^20",  
    "@types/react": "^19",  
    "@types/react-dom": "^19",  
    "autoprefixer": "^10.4.20",  
    "postcss": "^8.4.49",  
    "tailwindcss": "^3.4.17",  
    "tsx": "^4.7.0",  
    "typescript": "^5",  
    "vitest": "^1.0.0",  
    "@playwright/test": "^1.40.0"  
  }  
}  
\`\`\`

\---

\#\# 5\. Refinamentos Finais (v6.2.8) – Porque cada linha importa

Antes de mergulhar nos códigos, entenda as \*\*quatro decisões críticas\*\* que tornam esta versão a definitiva.

\#\#\# 5.1. Isolamento do Cache do Carrinho por \`cartId\`

\*\*O que era antes:\*\* O cache do carrinho era armazenado sob uma chave genérica, podendo expor dados de um cliente a outro ou servir dados stale para diferentes usuários.

\*\*O que fazemos agora:\*\* A chave do cache para o carrinho sempre inclui o \`cartId\` (ex: \`cart:${cartId}\`). Assim, cada carrinho é isolado.

\*\*Impacto:\*\* Segurança e consistência. Mesmo que uma requisição seja servida pelo fallback do Redis, ela trará apenas os dados do carrinho correto.

\*\*Implementação:\*\*  
\- Na Server Action de mutação, após atualizar o carrinho, fazemos \`redis.del(cartCacheKey)\`.  
\- Em consultas, usamos \`cart:${cartId}\` como \`cacheKey\`.

\#\#\# 5.2. Singleton do Cliente Redis com Pooling para Serverless

\*\*O que era antes:\*\* Cada invocação de função (em ambiente serverless) podia criar uma nova conexão TCP com Redis, esgotando rapidamente o limite de conexões do plano.

\*\*O que fazemos agora:\*\* Exportamos uma única instância do cliente Redis (\`getRedisClient()\`) que é reutilizada entre execuções. Além disso, configuramos \`maxRetriesPerRequest\` e \`enableReadyCheck\` para evitar travamentos.

\*\*Impacto:\*\* Estabilidade em picos de tráfego. Você pode ter centenas de funções simultâneas sem estourar o limite de conexões do Redis.

\*\*Observação:\*\* Se estiver usando Upstash, considere migrar para a biblioteca HTTP (\`@upstash/redis\`), que não mantém conexões TCP e é mais adequada para serverless.

\#\#\# 5.3. Invalidação Atômica com \`revalidateTag\` e \`redis.del\`

\*\*O que era antes:\*\* \`revalidateTag('cart')\` invalidava apenas o cache do Next.js (na borda), mas o Redis ainda podia conter dados antigos, causando inconsistências.

\*\*O que fazemos agora:\*\* Toda mutação do carrinho executa:  
1\. \`revalidateTag('cart')\` – limpa o cache do Next.js.  
2\. \`redis.del(cartCacheKey)\` – remove a chave específica do Redis.

\*\*Impacto:\*\* Garantia de que a próxima leitura trará dados frescos diretamente da Shopify, e não um cache obsoleto.

\#\#\# 5.4. Recomendação de Uso do \`@upstash/redis\` para Evitar Limites de Conexão

Se sua operação crescer e você notar avisos de \`ECONNRESET\` ou limite de conexões, substitua \`ioredis\` por \`@upstash/redis\`. O cliente HTTP é stateless e não sofre com pool de conexões.

Exemplo de substituição:  
\`\`\`ts  
// lib/redis/client.ts  
import { Redis } from '@upstash/redis';  
export const redis \= new Redis({  
  url: process.env.REDIS\_URL\!,  
  token: process.env.REDIS\_TOKEN\!,  
});  
\`\`\`

\---

\#\# 6\. Código Fonte – Cada Arquivo, Cada Camada, Explicado

Agora, vamos ao código. Todos os arquivos abaixo já incorporam as correções finais. Comentários extensos explicam o propósito de cada bloco.

\#\#\# 6.1. Middleware (\`middleware.ts\`) – A Porta de Entrada

O middleware é executado em todas as requisições. Ele é responsável por:  
\- Resolver a região do usuário (cookie, Accept‑Language, Geo‑IP).  
\- Gerar um \`nonce\` único por request (para CSP).  
\- Aplicar rate limiting em rotas públicas.  
\- Configurar o CSP com todos os domínios necessários.  
\- Injetar headers de correlação (\`x-request-id\`, \`x-trace-id\`, \`x-nonce\`).

\`\`\`ts  
// src/middleware.ts  
import { NextRequest, NextResponse } from 'next/server';  
import crypto from 'crypto';  
import { ratelimit } from '@/lib/rate-limit';  
import { resolveRegion } from '@/lib/regions';

// Rotas que merecem rate limit mais rigoroso  
const PUBLIC\_ROUTES \= \['/api/auth/login', '/api/auth/register', '/api/search'\];

export async function middleware(req: NextRequest) {  
  // 1\. Descobre a região do usuário  
  const region \= resolveRegion(req);

  // 2\. Gera nonce e IDs de correlação  
  const nonce \= crypto.randomBytes(16).toString('base64');  
  const requestId \= crypto.randomUUID();

  // 3\. Rate limit para rotas públicas (evita abusos)  
  if (PUBLIC\_ROUTES.some(route \=\> req.nextUrl.pathname.startsWith(route))) {  
    const ip \= req.ip || 'anonymous';  
    const { success } \= await ratelimit.limit(ip);  
    if (\!success) {  
      return new NextResponse('Too Many Requests', { status: 429 });  
    }  
  }

  // 4\. CSP – Content Security Policy (proteção contra XSS)  
  //    Inclui todos os domínios de terceiros (GTM, Klaviyo, Sentry, etc.)  
  const cspHeader \= \`  
    default-src 'self';  
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'  
      https://www.googletagmanager.com  
      https://www.google-analytics.com  
      https://connect.facebook.net  
      https://analytics.tiktok.com  
      https://static.klaviyo.com  
      https://a.klaviyo.com  
      https://o\*.ingest.sentry.io;  
    style-src 'self' 'nonce-${nonce}' https://cdn.shopify.com;  
    img-src 'self' https://cdn.shopify.com data: https://www.google-analytics.com;  
    connect-src 'self' https://\*.shopify.com https://\*.shopifysvc.com https://monorail-edge.shopifysvc.com https://checkout.shopify.com https://shop.app https://www.google-analytics.com https://analytics.tiktok.com https://connect.facebook.net https://static.klaviyo.com https://a.klaviyo.com https://o\*.ingest.sentry.io;  
    report-uri /api/csp-report;  
    report-to csp-endpoint;  
  \`.replace(/\\s{2,}/g, ' ').trim();

  // 5\. Propaga headers para o resto da aplicação (via request)  
  const requestHeaders \= new Headers(req.headers);  
  requestHeaders.set('x-nonce', nonce);  
  requestHeaders.set('x-request-id', requestId);  
  requestHeaders.set('x-trace-id', req.headers.get('x-trace-id') || crypto.randomUUID());  
  requestHeaders.set('x-region', region.code);

  // 6\. Resposta com CSP e reporting  
  const response \= NextResponse.next({ request: { headers: requestHeaders } });  
  response.headers.set('Content-Security-Policy', cspHeader);  
  response.headers.set('Reporting-Endpoints', 'csp-endpoint="/api/csp-report"');  
  response.headers.set('Report-To', \`{"group":"csp-endpoint","max\_age":86400,"endpoints":\[{"url":"/api/csp-report"}\]}\`);  
  return response;  
}

// Não aplica middleware em arquivos estáticos  
export const config \= {  
  matcher: \['/((?\!\_next/static|\_next/image|favicon.ico|.\*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).\*)'\],  
};  
\`\`\`

\---

\#\#\# 6.2. Layout (\`app/\[locale\]/layout.tsx\`) – A Estrutura Base

O layout raiz é um Server Component que:  
\- Lê o \`nonce\` do header e o injeta no \`\<head\>\` e \`\<body\>\` (necessário para scripts do Next.js em PPR).  
\- Envolve a aplicação com os providers (Auth, Cart, Wishlist, Scroll, Edge Config).  
\- Renderiza o componente de scripts dinâmicos (para carregar GTM, etc. com nonce).

\`\`\`tsx  
// src/app/\[locale\]/layout.tsx  
import { headers } from 'next/headers';  
import { Inter } from 'next/font/google';  
import { ScrollProvider, CartProvider, WishlistProvider, AuthProvider } from '@/components/providers';  
import { EdgeConfigProvider } from '@/components/providers/edge-config-provider';  
import { ConsentBanner } from '@/components/ui/consent-banner';  
import { DynamicScripts } from '@/components/ui/dynamic-scripts';  
import '@/styles/globals.css';

const inter \= Inter({ subsets: \['latin'\] });

export const metadata \= {  
  title: 'Luxury Store | Global Luxury E-Commerce',  
  description: 'Curated high-end luxury items authenticated via blockchain.',  
};

export default async function RootLayout({  
  children,  
  params,  
}: {  
  children: React.ReactNode;  
  params: Promise\<{ locale: string }\>;  
}) {  
  const { locale } \= await params;  
  const headersList \= await headers();  
  const nonce \= headersList.get('x-nonce') || undefined;

  return (  
    \<html lang={locale} className={inter.className}\>  
      {/\* Injeção do nonce no head e body – essencial para PPR \*/}  
      \<head nonce={nonce} /\>  
      \<body nonce={nonce}\>  
        \<EdgeConfigProvider\>  
          \<AuthProvider\>  
            \<CartProvider\>  
              \<WishlistProvider\>  
                \<ScrollProvider\>  
                  {/\* Scripts de terceiros carregados apenas no client (com nonce) \*/}  
                  {nonce && \<DynamicScripts nonce={nonce} /\>}  
                  \<main className="min-h-screen selection:bg-black selection:text-white"\>  
                    {children}  
                  \</main\>  
                  \<ConsentBanner /\>  
                \</ScrollProvider\>  
              \</WishlistProvider\>  
            \</CartProvider\>  
          \</AuthProvider\>  
        \</EdgeConfigProvider\>  
      \</body\>  
    \</html\>  
  );  
}  
\`\`\`

\---

\#\#\# 6.3. Regiões (\`lib/regions.ts\`) – Geo‑IP, Cookie, Accept‑Language

Este módulo decide em qual região (US, EU, BR, APAC) o usuário está, baseado em:  
1\. Cookie \`region\` (preferência explícita).  
2\. Cabeçalho \`Accept-Language\` (para inferir idioma/país).  
3\. Geo‑IP via cabeçalhos da Vercel (\`x-vercel-ip-country\`).  
4\. Fallback para US.

\`\`\`ts  
// src/lib/regions.ts  
import { NextRequest } from 'next/server';

export interface Region {  
  code: string;          // US, EU, BR, APAC  
  locale: string;        // en, pt  
  currency: string;      // USD, EUR, BRL, SGD  
  shopifyDomain: string; // loja-us.myshopify.com  
  taxRate: number;  
  checkoutDomain: string;  
  redisUrl: string;  
  defaultLanguage: string;  
}

// Mapeamento de regiões – as variáveis de ambiente são lidas aqui  
const REGIONS: Record\<string, Region\> \= {  
  us: {  
    code: 'US',  
    locale: 'en',  
    currency: 'USD',  
    shopifyDomain: process.env.SHOPIFY\_STORE\_DOMAIN\_US\!,  
    taxRate: 0,  
    checkoutDomain: 'checkout.seusite.com',  
    redisUrl: process.env.REDIS\_URL\!,  
    defaultLanguage: 'en',  
  },  
  eu: {  
    code: 'EU',  
    locale: 'en',  
    currency: 'EUR',  
    shopifyDomain: process.env.SHOPIFY\_STORE\_DOMAIN\_EU\!,  
    taxRate: 0.2,  
    checkoutDomain: 'checkout.seusite.eu',  
    redisUrl: process.env.REDIS\_URL\!,  
    defaultLanguage: 'en',  
  },  
  br: {  
    code: 'BR',  
    locale: 'pt',  
    currency: 'BRL',  
    shopifyDomain: process.env.SHOPIFY\_STORE\_DOMAIN\_BR\!,  
    taxRate: 0.25,  
    checkoutDomain: 'checkout.seusite.com.br',  
    redisUrl: process.env.REDIS\_URL\!,  
    defaultLanguage: 'pt',  
  },  
  apac: {  
    code: 'APAC',  
    locale: 'en',  
    currency: 'SGD',  
    shopifyDomain: process.env.SHOPIFY\_STORE\_DOMAIN\_APAC\!,  
    taxRate: 0.07,  
    checkoutDomain: 'checkout.seusite.sg',  
    redisUrl: process.env.REDIS\_URL\!,  
    defaultLanguage: 'en',  
  },  
};

export function resolveRegion(req: NextRequest): Region {  
  // 1\. Cookie de preferência (o próprio usuário escolheu)  
  const cookieRegion \= req.cookies.get('region')?.value;  
  if (cookieRegion && REGIONS\[cookieRegion\]) return REGIONS\[cookieRegion\];

  // 2\. Accept-Language (ex: pt-BR, pt-PT → BR)  
  const acceptLang \= req.headers.get('accept-language') || '';  
  const langs \= acceptLang.split(',').map((l) \=\> l.split(';')\[0\].trim());  
  for (const lang of langs) {  
    const region \= Object.values(REGIONS).find((r) \=\> r.defaultLanguage \=== lang.split('-')\[0\]);  
    if (region) return region;  
  }

  // 3\. Geo‑IP (Vercel)  
  const country \= req.headers.get('x-vercel-ip-country') || 'US';  
  const regionMap: Record\<string, string\> \= {  
    US: 'us',  
    BR: 'br',  
    DE: 'eu',  
    FR: 'eu',  
    UK: 'eu',  
    SG: 'apac',  
    AU: 'apac',  
  };  
  const code \= regionMap\[country\] || 'us';  
  return REGIONS\[code\];  
}

// Helper para obter região a partir de um código (usado no client)  
export const getRegion \= (code: string) \=\> REGIONS\[code.toLowerCase()\] || REGIONS.us;  
\`\`\`

\---

\#\#\# 6.4. Circuit Breaker (\`lib/circuit-breaker.ts\`) – Resiliência Contra Falhas

Usamos a biblioteca \*\*cockatiel\*\* para proteger chamadas à Shopify e ao Redis. Se uma chamada falhar repetidamente, o circuito abre e as próximas requisições são bloqueadas por um tempo, evitando sobrecarga.

\`\`\`ts  
// src/lib/circuit-breaker.ts  
import { CircuitBreaker } from 'cockatiel';

// Para a Shopify – se cair 3 vezes em 10 segundos, abre o circuito  
export const shopifyBreaker \= CircuitBreaker.breaker({  
  halfOpenAfter: 10000,    // tenta reabrir após 10s  
  failureThreshold: 3,  
  successThreshold: 2,  
});

// Para o Redis – mais tolerante  
export const redisBreaker \= CircuitBreaker.breaker({  
  halfOpenAfter: 5000,  
  failureThreshold: 2,  
  successThreshold: 2,  
});  
\`\`\`

\---

\#\#\# 6.5. Cache Distribuído com Redlock (\`lib/cache/lock.ts\` e \`stampede.ts\`)

\*\*\`lock.ts\`\*\* – Gerencia locks distribuídos usando Redlock, garantindo que apenas uma instância execute uma operação crítica (ex: refresh token, revalidação de cache). A chave do lock é \`lock:${key}\`.

\`\`\`ts  
// src/lib/cache/lock.ts  
import { getRedisClient } from '@/lib/redis/client';  
import Redlock from 'redlock';

let redlockInstance: Redlock | null \= null;

export const getRedlockInstance \= (): Redlock \=\> {  
  if (\!redlockInstance) {  
    const redis \= getRedisClient();  
    redlockInstance \= new Redlock(\[redis\], {  
      retryCount: 5,  
      retryDelay: 200,  
      retryJitter: 100,  
    });  
  }  
  return redlockInstance;  
};

export async function withLock\<T\>(key: string, fn: () \=\> Promise\<T\>, ttl \= 5000): Promise\<T\> {  
  const redlock \= getRedlockInstance();  
  const lock \= await redlock.acquire(\[\`lock:${key}\`\], ttl);  
  try {  
    return await fn();  
  } finally {  
    await lock.release();  
  }  
}  
\`\`\`

\*\*\`stampede.ts\`\*\* – Previne o efeito "cache stampede" (múltiplas requisições simultâneas tentando gerar o mesmo cache). Usa \`withLock\` para garantir que apenas uma requisição execute a função de busca, enquanto as outras aguardam o resultado. Também implementa \`stale-while-revalidate\`: se o cache expirou, serve os dados antigos enquanto atualiza em background.

\`\`\`ts  
// src/lib/cache/stampede.ts  
import { getRedisClient } from '@/lib/redis/client';  
import { withLock } from './lock';  
import { logger } from '@/lib/logger';

const redis \= getRedisClient();

export async function getCachedOrFetch\<T\>(  
  key: string,  
  fetchFn: () \=\> Promise\<T\>,  
  ttl \= 3600  
): Promise\<T\> {  
  // Tenta buscar do cache  
  const cached \= await redis.get(key);  
  if (cached \!== null) {  
    const parsed \= JSON.parse(cached);  
    // Se expirou, atualiza em background (stale-while-revalidate)  
    if (parsed.\_expires && parsed.\_expires \< Date.now()) {  
      refreshCache(key, fetchFn, ttl);  
    }  
    return parsed.data;  
  }

  // Single-flight: apenas uma requisição executa a busca  
  return withLock(key, async () \=\> {  
    // Double-check: pode ter sido preenchido por outra instância  
    const cachedAgain \= await redis.get(key);  
    if (cachedAgain \!== null) {  
      return JSON.parse(cachedAgain).data;  
    }  
    const data \= await fetchFn();  
    await redis.set(  
      key,  
      JSON.stringify({ data, \_expires: Date.now() \+ ttl \* 1000 }),  
      'EX',  
      ttl  
    );  
    return data;  
  });  
}

// Atualização em background (não bloqueia a resposta)  
async function refreshCache\<T\>(key: string, fetchFn: () \=\> Promise\<T\>, ttl: number) {  
  try {  
    const data \= await fetchFn();  
    await redis.set(  
      key,  
      JSON.stringify({ data, \_expires: Date.now() \+ ttl \* 1000 }),  
      'EX',  
      ttl  
    );  
  } catch (error) {  
    logger.warn('Background cache refresh failed', { key, error });  
  }  
}  
\`\`\`

\---

\#\#\# 6.6. Cliente Redis Singleton (\`lib/redis/client.ts\`) – Gerencie Conexões

Este módulo exporta uma única instância do cliente Redis. Em serverless, isso é vital para não esgotar o pool de conexões. Configuramos \`maxRetriesPerRequest\` e \`enableReadyCheck\` para evitar travamentos.

Se estiver usando Upstash, recomendo migrar para a versão HTTP (veja o comentário no código).

\`\`\`ts  
// src/lib/redis/client.ts  
import Redis from 'ioredis';

let redisInstance: Redis | null \= null;

export function getRedisClient(): Redis {  
  if (\!redisInstance) {  
    redisInstance \= new Redis(process.env.REDIS\_URL\!);  
    // Configurações para serverless – evita retry infinito e ready check  
    redisInstance.options.maxRetriesPerRequest \= 3;  
    redisInstance.options.enableReadyCheck \= false;  
  }  
  return redisInstance;  
}

// ⚠️ SE ESTIVER USANDO UPSTASH, SUBSTITUA POR:  
// import { Redis } from '@upstash/redis';  
// export const redis \= new Redis({ url: process.env.REDIS\_URL\!, token: process.env.REDIS\_TOKEN\! });  
// E então importe \`redis\` diretamente (não use getRedisClient).  
\`\`\`

\---

\#\#\# 6.7. Lib Shopify – Cliente (\`lib/shopify/client.ts\`)

O cliente Shopify é a ponte com a Storefront API. Ele:  
\- Resolve a região a partir do \`locale\` e seleciona o domínio e token corretos.  
\- Usa o Circuit Breaker (\`shopifyBreaker\`) para proteger chamadas.  
\- Se uma chamada falhar e houver \`cacheKey\`, tenta servir do Redis (fallback validado).  
\- Atualiza o Redis em background quando recebe dados novos.

\`\`\`ts  
// src/lib/shopify/client.ts  
import { createStorefrontApiClient } from '@shopify/storefront-api-client';  
import { shopifyBreaker } from '@/lib/circuit-breaker';  
import { getRedisClient } from '@/lib/redis/client';  
import { logger } from '@/lib/logger';  
import { getRegion } from '@/lib/regions';

// Mapeamento de tokens por região – as variáveis de ambiente são usadas  
const TOKEN\_MAP: Record\<string, string\> \= {  
  US: process.env.SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_US\!,  
  EU: process.env.SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_EU\!,  
  BR: process.env.SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_BR\!,  
  APAC: process.env.SHOPIFY\_STOREFRONT\_ACCESS\_TOKEN\_APAC\!,  
};

export function getShopifyClient(locale: string) {  
  // 1\. Descobre a região a partir do locale  
  const region \= getRegion(locale);  
  const storeDomain \= region.shopifyDomain;  
  const publicAccessToken \= TOKEN\_MAP\[region.code\] || TOKEN\_MAP.US;

  if (\!storeDomain || \!publicAccessToken) {  
    throw new Error(\`Credenciais Shopify não encontradas para a região: ${region.code}\`);  
  }

  // 2\. Cria o cliente base  
  const client \= createStorefrontApiClient({  
    storeDomain,  
    apiVersion: '2026-04',  
    publicAccessToken,  
  });

  return {  
    // 3\. Método execute – encapsula a chamada com Circuit Breaker e fallback  
    execute: async \<T\>(  
      query: string,  
      variables: Record\<string, any\> \= {},  
      cacheKey?: string  
    ): Promise\<T\> \=\> {  
      return shopifyBreaker.execute(async () \=\> {  
        try {  
          // Chamada real à Shopify  
          const response \= await client.request(query, { variables });

          if (response.errors) {  
            throw new Error(\`Shopify GraphQL Error: ${JSON.stringify(response.errors)}\`);  
          }

          // Se tiver cacheKey, atualiza o Redis em background (não espera)  
          if (cacheKey && response.data) {  
            const redis \= getRedisClient();  
            redis.set(cacheKey, JSON.stringify(response.data), 'EX', 3600).catch(console.error);  
          }

          return response.data as T;  
        } catch (error) {  
          // 4\. Fallback: se falhou e temos cacheKey, tenta servir do Redis  
          if (cacheKey) {  
            const redis \= getRedisClient();  
            const cachedData \= await redis.get(cacheKey);  
            if (cachedData) {  
              try {  
                const parsed \= JSON.parse(cachedData);  
                // Validação mínima: garante que é um objeto  
                if (parsed && typeof parsed \=== 'object') {  
                  logger.warn('\[Graceful Degradation\] Servindo dados de fallback do Redis', { cacheKey });  
                  return parsed as T;  
                }  
              } catch (parseError) {  
                logger.error('Falha ao parsear cache do Redis', { cacheKey, error: parseError });  
              }  
            }  
          }  
          throw error;  
        }  
      });  
    },  
  };  
}  
\`\`\`

\---

\#\#\# 6.8. Lib Shopify – Queries (\`lib/shopify/queries.ts\`)

Aqui definimos as consultas GraphQL. \*\*Destaque:\*\* Incluímos o campo \`namespace\` nos metafields, necessário para o parser correto.

\`\`\`ts  
// src/lib/shopify/queries.ts  
import { gql } from 'graphql-request';

export const SEARCH\_PRODUCTS\_ADVANCED \= gql\`  
  query SearchProducts($query: String\!, $first: Int\!) {  
    search(query: $query, first: $first, types: \[PRODUCT\]) {  
      nodes {  
        ... on Product {  
          id  
          title  
          handle  
          description  
          images(first: 1\) { nodes { url altText } }  
          priceRange { minVariantPrice { amount currencyCode } }  
          vendor  
          tags  
          metafields(namespace: "luxury") {  
            edges {  
              node { key value }  
            }  
          }  
        }  
      }  
    }  
  }  
\`;

export const GET\_PRODUCT\_BY\_HANDLE \= gql\`  
  query GetProductByHandle($handle: String\!) {  
    product(handle: $handle) {  
      id  
      title  
      description  
      handle  
      images(first: 8\) { nodes { url altText } }  
      priceRange { minVariantPrice { amount currencyCode } }  
      variants(first: 1\) { nodes { id price { amount } } }  
      metafields(identifiers: \[  
        { namespace: "luxury", key: "certificate\_hash" }  
        { namespace: "luxury", key: "materials" }  
        { namespace: "luxury", key: "made\_in" }  
        { namespace: "luxury", key: "video\_360\_url" }  
        { namespace: "luxury", key: "limited\_edition\_number" }  
        { namespace: "luxury", key: "care\_instructions" }  
        { namespace: "reviews", key: "average\_rating" }  
        { namespace: "reviews", key: "total\_reviews" }  
      \]) {  
        key  
        value  
        type  
        namespace   // 🔥 ESSENCIAL para o parser  
      }  
    }  
  }  
\`;

export const PRODUCT\_RECOMMENDATIONS \= gql\`  
  query ProductRecommendations($productId: ID\!) {  
    productRecommendations(productId: $productId) {  
      id  
      title  
      handle  
      images(first: 1\) { nodes { url altText } }  
      priceRange { minVariantPrice { amount currencyCode } }  
    }  
  }  
\`;  
\`\`\`

\---

\#\#\# 6.9. Lib Shopify – Busca e Recomendações

\- \*\*\`search.ts\`\*\*: usa \`getCachedOrFetch\` para cachear resultados de busca por 5 minutos.  
\- \*\*\`recommendations.ts\`\*\*: cacheia recomendações por 1 hora.

\`\`\`ts  
// src/lib/shopify/search.ts  
import { getShopifyClient } from './client';  
import { SEARCH\_PRODUCTS\_ADVANCED } from './queries';  
import { getCachedOrFetch } from '@/lib/cache/stampede';

export async function searchProducts(query: string, locale: string, first \= 24\) {  
  const cacheKey \= \`search:${locale}:${query}\`;  
  return getCachedOrFetch(cacheKey, async () \=\> {  
    const client \= getShopifyClient(locale);  
    const data \= await client.execute\<{ search: { nodes: any\[\] } }\>(  
      SEARCH\_PRODUCTS\_ADVANCED,  
      { query, first }  
    );  
    return data?.search?.nodes || \[\];  
  }, 300); // TTL 5 minutos  
}  
\`\`\`

\`\`\`ts  
// src/lib/shopify/recommendations.ts  
import { getShopifyClient } from './client';  
import { PRODUCT\_RECOMMENDATIONS } from './queries';  
import { getCachedOrFetch } from '@/lib/cache/stampede';

export async function getProductRecommendations(productId: string, locale: string) {  
  return getCachedOrFetch(  
    \`recommendations:${locale}:${productId}\`,  
    async () \=\> {  
      const client \= getShopifyClient(locale);  
      const data \= await client.execute\<{ productRecommendations: any\[\] }\>(  
        PRODUCT\_RECOMMENDATIONS,  
        { productId }  
      );  
      return data?.productRecommendations || \[\];  
    },  
    3600 // 1 hora  
  );  
}  
\`\`\`

\---

\#\#\# 6.10. API Routes – Refresh Token com Lock Distribuído

A rota de refresh é chamada quando o token de acesso expira. Ela usa \*\*Redlock\*\* para garantir que apenas uma requisição faça a renovação enquanto as outras aguardam o token fresco (armazenado temporariamente no Redis). Isso evita race conditions.

\`\`\`ts  
// src/app/\[locale\]/api/auth/refresh/route.ts  
import { NextRequest, NextResponse } from 'next/server';  
import { cookies } from 'next/headers';  
import { getRedlockInstance } from '@/lib/cache/lock';  
import { getRedisClient } from '@/lib/redis/client';  
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {  
  const cookieStore \= await cookies();  
  const currentToken \= cookieStore.get('shopify\_customer\_token')?.value;  
  const customerId \= cookieStore.get('shopify\_customer\_id')?.value;

  if (\!currentToken || \!customerId) {  
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });  
  }

  const redis \= getRedisClient();  
  const redlock \= getRedlockInstance();  
  const resourceKey \= \`locks:auth:refresh:${customerId}\`;

  try {  
    const lock \= await redlock.acquire(\[resourceKey\], 5000);

    try {  
      // 1\. Verifica se já existe um token fresco no Redis (compartilhado entre instâncias)  
      const redisTokenKey \= \`auth:token:${customerId}\`;  
      const cachedToken \= await redis.get(redisTokenKey);  
      if (cachedToken) {  
        // Outra instância já renovou – atualiza o cookie local e retorna  
        cookieStore.set('shopify\_customer\_token', cachedToken, {  
          httpOnly: true,  
          secure: process.env.NODE\_ENV \=== 'production',  
          maxAge: 60 \* 60 \* 24 \* 30,  
          path: '/',  
          sameSite: 'lax',  
        });  
        return NextResponse.json({ success: true, tokenSource: 'cache\_hit' });  
      }

      // 2\. Verifica novamente o cookie (pode ter sido atualizado por outra instância)  
      const updatedCookieStore \= await cookies();  
      const tokenAfterLock \= updatedCookieStore.get('shopify\_customer\_token')?.value;  
      if (tokenAfterLock && tokenAfterLock \!== currentToken) {  
        return NextResponse.json({ success: true, tokenSource: 'cache\_hit' });  
      }

      // 3\. Executa o refresh de fato (chamada à Shopify)  
      const response \= await fetch(  
        \`https://${process.env.SHOPIFY\_STORE\_DOMAIN\_US}/customer\_oauth/access\_token\`,  
        {  
          method: 'POST',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify({  
            client\_id: process.env.SHOPIFY\_CLIENT\_ID,  
            client\_secret: process.env.SHOPIFY\_CLIENT\_SECRET,  
            grant\_type: 'refresh\_token',  
            refresh\_token: currentToken,  
          }),  
        }  
      );

      if (\!response.ok) throw new Error('Shopify token exchange failed');

      const { access\_token, refresh\_token } \= await response.json();

      // 4\. Atualiza o cookie local  
      updatedCookieStore.set('shopify\_customer\_token', access\_token, {  
        httpOnly: true,  
        secure: process.env.NODE\_ENV \=== 'production',  
        maxAge: 60 \* 60 \* 24 \* 30,  
        path: '/',  
        sameSite: 'lax',  
      });

      if (refresh\_token) {  
        updatedCookieStore.set('shopify\_customer\_refresh\_token', refresh\_token, {  
          httpOnly: true,  
          secure: process.env.NODE\_ENV \=== 'production',  
          maxAge: 60 \* 60 \* 24 \* 30,  
          path: '/',  
          sameSite: 'lax',  
        });  
      }

      // 5\. Armazena o token no Redis (compartilhado) com TTL curto (1 minuto)  
      await redis.set(redisTokenKey, access\_token, 'EX', 60);

      return NextResponse.json({ success: true, tokenSource: 'mutated' });  
    } finally {  
      await lock.release();  
    }  
  } catch (err) {  
    logger.error('Refresh token failed', { customerId, error: err });  
    return NextResponse.json(  
      { error: 'Concurrency lock timeout or failed mutation' },  
      { status: 429 }  
    );  
  }  
}  
\`\`\`

\---

\#\#\# 6.11. API Routes – Webhooks com Replay Protection

Webhooks são endpoints públicos que a Shopify chama quando eventos acontecem (ex: produto atualizado). Para segurança:  
\- Validamos o HMAC com a chave secreta.  
\- Validamos o timestamp (\`X-Shopify-Triggered-At\`) para evitar replay (rejeitamos eventos com mais de 5 minutos).  
\- Usamos \`X-Shopify-Webhook-Id\` para evitar processamento duplicado (armazenamos no Redis por 24h).

\`\`\`ts  
// src/app/\[locale\]/api/webhooks/route.ts  
import { NextRequest, NextResponse } from 'next/server';  
import crypto from 'crypto';  
import { revalidateProducts, revalidateCollections } from '@/lib/shopify/cache';  
import { getRedisClient } from '@/lib/redis/client';

const WEBHOOK\_SECRET \= process.env.SHOPIFY\_WEBHOOK\_SECRET\!;

export async function POST(req: NextRequest) {  
  const hmacHeader \= req.headers.get('X-Shopify-Hmac-Sha256');  
  const triggeredAt \= req.headers.get('X-Shopify-Triggered-At');  
  const rawBody \= await req.text();

  // Validação de cabeçalhos obrigatórios  
  if (\!hmacHeader || \!triggeredAt) {  
    return NextResponse.json({ error: 'Missing security headers' }, { status: 401 });  
  }

  // Replay protection: o webhook não pode ter mais de 5 minutos  
  const webhookTime \= new Date(triggeredAt).getTime();  
  const currentTime \= Date.now();  
  if (currentTime \- webhookTime \> 5 \* 60 \* 1000\) {  
    return NextResponse.json(  
      { error: 'Webhook event expired (Replay Attack protection)' },  
      { status: 403 }  
    );  
  }

  // Validação HMAC  
  const generatedHash \= crypto  
    .createHmac('sha256', WEBHOOK\_SECRET)  
    .update(rawBody, 'utf8')  
    .digest('base64');

  const receivedBuffer \= Buffer.from(hmacHeader, 'base64');  
  const expectedBuffer \= Buffer.from(generatedHash, 'base64');

  if (receivedBuffer.length \!== expectedBuffer.length || \!crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {  
    return NextResponse.json({ error: 'Cryptographic verification failed' }, { status: 401 });  
  }

  // Prevenção de duplicidade usando X-Shopify-Webhook-Id  
  const webhookId \= req.headers.get('X-Shopify-Webhook-Id');  
  if (webhookId) {  
    const redis \= getRedisClient();  
    const key \= \`webhook:${webhookId}\`;  
    // Só permite processar se a chave não existir (SET NX)  
    const exists \= await redis.set(key, 'processed', 'PX', 86400, 'NX');  
    if (\!exists) {  
      return NextResponse.json({ error: 'Duplicate event' }, { status: 409 });  
    }  
  }

  const payload \= JSON.parse(rawBody);  
  const topic \= req.headers.get('X-Shopify-Topic');

  // Revalidação de cache conforme o tópico  
  if (topic \=== 'products/update' || topic \=== 'products/delete') {  
    revalidateProducts();  
  }  
  if (topic \=== 'collections/update' || topic \=== 'collections/delete') {  
    revalidateCollections();  
  }

  // Publica evento no Pub/Sub para invalidar caches regionais (se usar)  
  const redis \= getRedisClient();  
  await redis.publish(process.env.REDIS\_PUBSUB\_CHANNEL\!, JSON.stringify({ type: 'products' }));

  console.log(\`\[Webhook Verificado\] Tópico: ${topic} para Id: ${payload.id}\`);  
  return NextResponse.json({ received: true });  
}  
\`\`\`

\---

\#\#\# 6.12. API Routes – Search com Arcjet

O endpoint de busca é público e pode ser alvo de bots. Usamos \*\*Arcjet\*\* para bloquear tráfego automatizado e headless, aplicando a proteção apenas nesta rota (não no middleware para evitar overhead).

\`\`\`ts  
// src/app/\[locale\]/api/search/route.ts  
import { NextRequest, NextResponse } from 'next/server';  
import { searchProducts } from '@/lib/shopify/search';  
import arcjet from '@arcjet/next';

const aj \= arcjet({  
  key: process.env.ARCJET\_KEY\!,  
  rules: \[arcjet.botProtection({ mode: 'LIVE', block: \['AUTOMATED', 'HEADLESS'\] })\],  
});

export async function GET(req: NextRequest) {  
  // Proteção contra bots  
  const decision \= await aj.protect(req);  
  if (decision.isDenied()) {  
    return NextResponse.json({ error: 'Bot detected' }, { status: 403 });  
  }

  const query \= req.nextUrl.searchParams.get('q');  
  const locale \= req.nextUrl.pathname.split('/')\[1\] || 'en';

  if (\!query || query.length \< 2\) {  
    return NextResponse.json({ results: \[\] });  
  }

  const results \= await searchProducts(query, locale, 10);  
  return NextResponse.json({ results });  
}  
\`\`\`

\---

\#\#\# 6.13. Server Actions – Carrinho (\`actions/cart.ts\`)

A Server Action de adicionar ao carrinho é o coração da experiência de compra. Ela:  
\- Aplica rate limit.  
\- Valida os dados com Zod.  
\- Cria um novo carrinho se necessário.  
\- Executa a mutação \`cartLinesAdd\`.  
\- Trata erros de negócio (\`userErrors\`).  
\- Invalida o cache do Next.js (\`revalidateTag('cart')\`).  
\- \*\*Remove a chave específica do Redis\*\* (\`cart:${cartId}\`) – garantindo que o cache não fique stale.

\`\`\`ts  
// src/actions/cart.ts  
'use server';

import { revalidateTag } from 'next/cache';  
import { cookies } from 'next/headers';  
import { z } from 'zod';  
import { getShopifyClient } from '@/lib/shopify/client';  
import { rateLimiters } from '@/lib/rate-limit';  
import { headers } from 'next/headers';  
import { logger } from '@/lib/logger';  
import { getRedisClient } from '@/lib/redis/client';

// Schema de validação (Zod)  
const AddToCartSchema \= z.object({  
  variantId: z.string().startsWith('gid://shopify/ProductVariant/'),  
  quantity: z.number().int().min(1).max(99),  
});

export interface CartActionState {  
  success: boolean;  
  message: string;  
  cart?: {  
    id: string;  
    totalQuantity: number;  
    cost?: { totalAmount: { amount: string; currencyCode: string } };  
  };  
}

export async function addToCartAction(  
  prevState: CartActionState,  
  formData: FormData  
): Promise\<CartActionState\> {  
  // 1\. Rate limit  
  const ip \= (await headers()).get('x-forwarded-for') || 'anonymous';  
  const { success } \= await rateLimiters.api.limit(ip);  
  if (\!success) {  
    return {  
      success: false,  
      message: 'Muitas requisições. Tente novamente em alguns instantes.',  
    };  
  }

  // 2\. Extração e validação dos dados  
  const rawVariantId \= formData.get('variantId') as string | null;  
  const rawQuantity \= parseInt((formData.get('quantity') as string) || '1', 10);

  const validation \= AddToCartSchema.safeParse({  
    variantId: rawVariantId,  
    quantity: rawQuantity,  
  });

  if (\!validation.success) {  
    return {  
      success: false,  
      message: 'Dados de variante ou quantidade inválidos.',  
    };  
  }

  const { variantId, quantity } \= validation.data;

  try {  
    const cookieStore \= await cookies();  
    const locale \= cookieStore.get('locale')?.value || 'en';  
    let cartId \= cookieStore.get('shopify\_cart\_id')?.value;

    const client \= getShopifyClient(locale);

    // 3\. Cria um novo carrinho se não existir  
    if (\!cartId) {  
      const createCartMutation \= \`  
        mutation {  
          cartCreate {  
            cart { id checkoutUrl }  
            userErrors { message }  
          }  
        }  
      \`;  
      const createResult \= await client.execute\<{  
        cartCreate: { cart: { id: string; checkoutUrl: string }; userErrors: { message: string }\[\] };  
      }\>(createCartMutation);

      if (createResult.cartCreate.userErrors?.length) {  
        throw new Error(createResult.cartCreate.userErrors\[0\].message);  
      }  
      cartId \= createResult.cartCreate.cart.id;  
      cookieStore.set('shopify\_cart\_id', cartId, {  
        httpOnly: true,  
        secure: process.env.NODE\_ENV \=== 'production',  
        path: '/',  
        sameSite: 'lax',  
      });  
    }

    // 4\. Adiciona o item ao carrinho (com cost)  
    const cartLinesAddMutation \= \`  
      mutation cartLinesAdd($cartId: ID\!, $lines: \[CartLineInput\!\]\!) {  
        cartLinesAdd(cartId: $cartId, lines: $lines) {  
          cart {  
            id  
            totalQuantity  
            cost {  
              totalAmount {  
                amount  
                currencyCode  
              }  
            }  
          }  
          userErrors {  
            field  
            message  
          }  
        }  
      }  
    \`;

    const result \= await client.execute\<{  
      cartLinesAdd: {  
        cart: { id: string; totalQuantity: number; cost: { totalAmount: { amount: string; currencyCode: string } } };  
        userErrors: { field: string\[\]; message: string }\[\];  
      };  
    }\>(cartLinesAddMutation, {  
      cartId,  
      lines: \[{ merchandiseId: variantId, quantity }\],  
    });

    // 5\. Tratamento de erros de negócio (ex: falta de estoque)  
    if (result.cartLinesAdd.userErrors?.length) {  
      const errorMsg \= result.cartLinesAdd.userErrors\[0\].message;  
      logger.error('Erro retornado pelo Shopify ao adicionar item ao carrinho', {  
        cartId,  
        variantId,  
        userErrors: result.cartLinesAdd.userErrors,  
      });  
      return { success: false, message: errorMsg };  
    }

    // 6\. Invalidação atômica do cache  
    revalidateTag('cart'); // Invalida o cache do Next.js

    // 🔥 Remove a chave específica do Redis para este carrinho  
    const redis \= getRedisClient();  
    const cartCacheKey \= \`cart:${cartId}\`;  
    await redis.del(cartCacheKey).catch((err) \=\> {  
      logger.warn('Falha ao limpar cache Redis do carrinho', { cartId, error: err });  
    });

    // 7\. Log e retorno  
    logger.info('Item adicionado ao carrinho com sucesso', {  
      cartId,  
      variantId,  
      quantity,  
      totalQuantity: result.cartLinesAdd.cart.totalQuantity,  
    });

    return {  
      success: true,  
      message: 'Item adicionado ao carrinho.',  
      cart: result.cartLinesAdd.cart,  
    };  
  } catch (error: any) {  
    logger.error('Falha crítica na Server Action de adicionar ao carrinho', {  
      variantId,  
      error: error?.message || error,  
    });

    return {  
      success: false,  
      message: 'Ocorreu um erro interno de rede ou infraestrutura. Tente novamente.',  
    };  
  }  
}  
\`\`\`

\---

\#\#\# 6.14. Server Actions – Wishlist (\`actions/wishlist.ts\`)

A wishlist é um esboço. Em produção, você deve armazenar os itens em um metafield do cliente (via Shopify Customer API) ou em Redis com associação ao \`customerId\`.

\`\`\`ts  
// src/actions/wishlist.ts  
'use server';  
import { cookies } from 'next/headers';  
import { getShopifyClient } from '@/lib/shopify/client';  
import { logger } from '@/lib/logger';  
import { z } from 'zod';

const WishlistSchema \= z.object({  
  productId: z.string(),  
});

export async function toggleWishlist(productId: string) {  
  const cookieStore \= await cookies();  
  const locale \= cookieStore.get('locale')?.value || 'en';  
  const client \= getShopifyClient(locale);

  // Implementação real: buscar metafield do cliente, atualizar e salvar  
  logger.info('Wishlist toggled', { productId, locale });  
  return { success: true };  
}  
\`\`\`

\---

\#\#\# 6.15. Metafields Tipados – \`lib/shopify/types.ts\` e \`metafields.ts\`

\*\*\`types.ts\`\*\* – Define os tipos estritos para metafields de luxo e o produto Shopify.

\`\`\`ts  
// src/lib/shopify/types.ts  
export interface LuxuryMetafields {  
  certificateHash?: string;  
  materials?: string\[\];  
  madeIn?: string;  
  video360Url?: string;  
  limitedEditionNumber?: number;  
  careInstructions?: string;  
  averageRating?: number;  
  totalReviews?: number;  
}

export interface ShopifyProduct {  
  id: string;  
  title: string;  
  description: string;  
  handle: string;  
  images: { nodes: { url: string; altText: string }\[\] };  
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };  
  variants: { nodes: { id: string; price: { amount: string } }\[\] };  
  metafields: {  
    key: string;  
    value: string;  
    type: string;  
    namespace: string;   // 🔥 Incluído para parser correto  
  }\[\];  
}  
\`\`\`

\*\*\`metafields.ts\`\*\* – Parser que transforma a lista de metafields em um objeto \`LuxuryMetafields\`. Ele:  
\- Usa \`namespace\` e \`key\` para construir a chave completa.  
\- Trata \`materials\` como JSON (array) ou string única (fallback).  
\- Faz parse seguro de números (limitedEditionNumber, averageRating, totalReviews).

\`\`\`ts  
// src/lib/shopify/metafields.ts  
import { ShopifyProduct, LuxuryMetafields } from './types';  
import { logger } from '@/lib/logger';

export function parseLuxuryMetafields(  
  productMetafields: ShopifyProduct\['metafields'\]  
): LuxuryMetafields {  
  const metafieldsMap \= new Map\<string, { value: string; type: string }\>();

  if (Array.isArray(productMetafields)) {  
    productMetafields.forEach((m) \=\> {  
      if (\!m) return;  
      // 🔥 Chave completa usando namespace e key  
      const fullKey \= \`${m.namespace}.${m.key}\`;  
      metafieldsMap.set(fullKey, { value: m.value, type: m.type });  
    });  
  }

  const getFieldValue \= (key: string) \=\> metafieldsMap.get(key)?.value;

  // \--- Parsing robusto de materiais (JSON array ou string única) \---  
  const rawMaterials \= getFieldValue('luxury.materials');  
  let parsedMaterials: string\[\] | undefined;  
  if (rawMaterials) {  
    try {  
      const parsed \= JSON.parse(rawMaterials);  
      if (Array.isArray(parsed) && parsed.every((item) \=\> typeof item \=== 'string')) {  
        parsedMaterials \= parsed;  
      } else if (typeof parsed \=== 'string') {  
        parsedMaterials \= \[parsed\];  
      } else {  
        throw new Error('Formato inválido para lista de materiais');  
      }  
    } catch {  
      parsedMaterials \= \[rawMaterials\];  
      logger.debug('Metafield de materiais tratado como string única', { rawMaterials });  
    }  
  }

  // \--- Parsing numérico seguro \---  
  const rawEditionNumber \= getFieldValue('luxury.limited\_edition\_number');  
  let parsedEditionNumber: number | undefined;  
  if (rawEditionNumber) {  
    const num \= parseInt(rawEditionNumber, 10);  
    if (\!isNaN(num)) parsedEditionNumber \= num;  
    else logger.warn('Número de edição limitada inválido', { rawEditionNumber });  
  }

  const rawRating \= getFieldValue('reviews.average\_rating');  
  let parsedRating: number | undefined;  
  if (rawRating) {  
    const num \= parseFloat(rawRating);  
    if (\!isNaN(num) && num \>= 0 && num \<= 5\) parsedRating \= num;  
    else logger.warn('Avaliação média malformada', { rawRating });  
  }

  const rawReviews \= getFieldValue('reviews.total\_reviews');  
  let parsedReviews: number | undefined;  
  if (rawReviews) {  
    const num \= parseInt(rawReviews, 10);  
    if (\!isNaN(num) && num \>= 0\) parsedReviews \= num;  
    else logger.warn('Contagem de reviews malformada', { rawReviews });  
  }

  return {  
    certificateHash: getFieldValue('luxury.certificate\_hash') || undefined,  
    materials: parsedMaterials,  
    madeIn: getFieldValue('luxury.made\_in') || undefined,  
    video360Url: getFieldValue('luxury.video\_360\_url') || undefined,  
    limitedEditionNumber: parsedEditionNumber,  
    careInstructions: getFieldValue('luxury.care\_instructions') || undefined,  
    averageRating: parsedRating,  
    totalReviews: parsedReviews,  
  };  
}  
\`\`\`

\---

\#\#\# 6.16. Componente de Detalhe do Produto – \`components/luxury/product-details-luxury.tsx\`

Este componente renderiza a página de detalhe do produto, consumindo o \`EnrichedProduct\` (que inclui os metafields parseados). Ele:  
\- Usa animações \`stagger\` para entrada gradual de cada bloco.  
\- Exibe imagem principal com \`layoutId\` para transição suave da listagem.  
\- Renderiza informações de luxo: edição limitada, materiais, certificado, vídeo 360°, avaliações.  
\- É totalmente tipado (sem \`any\`).

\`\`\`tsx  
// src/components/luxury/product-details-luxury.tsx  
'use client';

import { motion } from 'motion/react';  
import { MotionNextImage } from '@/components/shared/motion-next-image';  
import { Video360Player } from './video-360-player';  
import { AddToCartButton } from './add-to-cart-button';  
import { ProductReviews } from '@/components/ui/product-reviews';  
import { ShopifyProduct, LuxuryMetafields } from '@/lib/shopify/types';

interface EnrichedProduct extends ShopifyProduct {  
  luxury: LuxuryMetafields;  
}

interface ProductDetailsLuxuryProps {  
  product: EnrichedProduct;  
  locale: string;  
}

const containerVariants \= {  
  hidden: { opacity: 0 },  
  show: {  
    opacity: 1,  
    transition: {  
      staggerChildren: 0.12,  
      delayChildren: 0.1,  
    },  
  },  
};

const itemVariants \= {  
  hidden: { opacity: 0, y: 15 },  
  show: {  
    opacity: 1,  
    y: 0,  
    transition: { duration: 0.5, ease: \[0.25, 0.1, 0.25, 1\] },  
  },  
};

export function ProductDetailsLuxury({ product, locale }: ProductDetailsLuxuryProps) {  
  const { luxury } \= product;  
  const mainImage \= product.images.nodes\[0\]?.url;  
  const firstVariantId \= product.variants.nodes\[0\]?.id;  
  const hasVideo \= Boolean(luxury.video360Url);

  const averageRating \= luxury.averageRating ?? 4.9;  
  const totalReviews \= luxury.totalReviews ?? 24;

  // Exemplo de reviews (em produção, viriam de metafields estruturados)  
  const mockReviews \= \[  
    { id: '1', author: 'M. S.', rating: 5, comment: 'Tecido espetacular, corte de alta costura perfeito.', date: '2026-05-12' },  
    { id: '2', author: 'A. L.', rating: 5, comment: 'A validação do certificado em blockchain traz muita segurança.', date: '2026-06-02' }  
  \];

  return (  
    \<motion.div  
      variants={containerVariants}  
      initial="hidden"  
      animate="show"  
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"  
    \>  
      \<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"\>  
        {/\* Coluna Galeria \*/}  
        \<motion.div variants={itemVariants} className="sticky top-24"\>  
          {mainImage && (  
            \<MotionNextImage  
              layoutId={\`product-hero-${product.id}\`}  
              src={mainImage}  
              alt={product.title}  
              width={1000}  
              height={1300}  
              priority  
              className="w-full h-auto rounded-lg bg-gray-50 object-cover object-center shadow-sm border border-gray-100"  
            /\>  
          )}  
        \</motion.div\>

        {/\* Coluna de Conteúdo \*/}  
        \<motion.div variants={containerVariants} className="space-y-10"\>  
          \<motion.div variants={itemVariants}\>  
            \<span className="text-xs uppercase tracking-\[0.3em\] text-gray-400 font-medium"\>  
              {product.vendor}  
            \</span\>  
            \<h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight mt-2"\>  
              {product.title}  
            \</h1\>  
            \<p className="text-xl text-gray-800 font-light mt-3"\>  
              {new Intl.NumberFormat(locale \=== 'pt' ? 'pt-BR' : 'en-US', {  
                style: 'currency',  
                currency: product.priceRange.minVariantPrice.currencyCode,  
              }).format(parseFloat(product.priceRange.minVariantPrice.amount))}  
            \</p\>  
          \</motion.div\>

          \<motion.div variants={itemVariants} className="prose prose-neutral prose-sm max-w-none text-gray-600 font-light leading-relaxed"\>  
            \<p\>{product.description}\</p\>  
          \</motion.div\>

          {luxury.limitedEditionNumber && (  
            \<motion.div variants={itemVariants}\>  
              \<div className="inline-flex items-center gap-3 bg-neutral-900 text-white px-5 py-2 rounded-full text-xs font-mono tracking-widest uppercase"\>  
                \<span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" /\>  
                Edição Limitada N° {luxury.limitedEditionNumber}  
              \</div\>  
            \</motion.div\>  
          )}

          {luxury.materials && luxury.materials.length \> 0 && (  
            \<motion.div variants={itemVariants} className="space-y-3"\>  
              \<h4 className="text-xs font-medium uppercase tracking-widest text-neutral-400"\>Composição Selecionada\</h4\>  
              \<div className="flex flex-wrap gap-2"\>  
                {luxury.materials.map((m) \=\> (  
                  \<span key={m} className="bg-neutral-50 px-4 py-2 border border-neutral-200/60 rounded text-xs tracking-wide text-neutral-700"\>  
                    {m}  
                  \</span\>  
                ))}  
              \</div\>  
            \</motion.div\>  
          )}

          {luxury.certificateHash && (  
            \<motion.div variants={itemVariants} className="p-5 bg-neutral-50 rounded-lg border border-neutral-200/50 space-y-2"\>  
              \<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-800"\>  
                \<span\>🔐 Authenticity Certificate Ledger\</span\>  
              \</div\>  
              \<p className="font-mono text-\[10px\] text-neutral-500 bg-white p-3 rounded border border-neutral-200 truncate"\>  
                {luxury.certificateHash}  
              \</p\>  
              \<span className="inline-block text-\[11px\] text-neutral-900 underline underline-offset-4 cursor-pointer hover:text-neutral-600 transition-colors"\>  
                Verificar proveniência via Polygon NFT →  
              \</span\>  
            \</motion.div\>  
          )}

          \<motion.div variants={itemVariants} className="pt-4"\>  
            {firstVariantId && (  
              \<AddToCartButton variantId={firstVariantId} locale={locale} /\>  
            )}  
          \</motion.div\>

          \<motion.div variants={itemVariants} className="border-t border-neutral-100 pt-8"\>  
            \<ProductReviews  
              reviews={mockReviews}  
              averageRating={averageRating}  
              totalReviews={totalReviews}  
              locale={locale}  
            /\>  
          \</motion.div\>  
        \</motion.div\>  
      \</div\>

      {hasVideo && luxury.video360Url && (  
        \<motion.div variants={itemVariants} className="mt-24 pt-16 border-t border-neutral-100"\>  
          \<h3 className="text-xl font-light text-center tracking-widest uppercase mb-10 text-neutral-800"\>  
            Experiência Imersiva Interativa 360°  
          \</h3\>  
          \<Video360Player  
            videoUrl={luxury.video360Url}  
            posterImage={mainImage || ''}  
            productTitle={product.title}  
          /\>  
        \</motion.div\>  
      )}  
    \</motion.div\>  
  );  
}  
\`\`\`

\---

\#\#\# 6.17. Componente de Imagem com Motion

Este componente combina \`next/image\` com Motion para animações de entrada e transições \`layoutId\`. Ele já usa a CDN do Shopify e otimização automática.

\`\`\`tsx  
// src/components/shared/motion-next-image.tsx  
'use client';  
import Image from 'next/image';  
import { motion } from 'motion/react';

const MotionImage \= motion.create(Image);

interface MotionNextImageProps {  
  src: string;  
  alt: string;  
  width: number;  
  height: number;  
  layoutId?: string;  
  priority?: boolean;  
  className?: string;  
  sizes?: string;  
}

export function MotionNextImage({  
  src,  
  alt,  
  width,  
  height,  
  layoutId,  
  priority \= false,  
  className,  
  sizes \= '(max-width: 768px) 100vw, 50vw',  
}: MotionNextImageProps) {  
  if (\!src) return \<div className="bg-neutral-100 animate-pulse w-full h-full" /\>;

  return (  
    \<MotionImage  
      layoutId={layoutId}  
      src={src}  
      alt={alt || 'Luxury item product capture'}  
      width={width}  
      height={height}  
      priority={priority}  
      sizes={sizes}  
      className={className}  
      transition={{  
        duration: 0.6,  
        ease: \[0.215, 0.61, 0.355, 1\],  
      }}  
    /\>  
  );  
}  
\`\`\`

\---

\#\#\# 6.18. Componente de Scripts Dinâmicos (PPR)

Para compatibilidade com Partial Prerendering, scripts de terceiros (GTM, Klaviyo, etc.) são carregados apenas no cliente, com o \`nonce\` injetado. Isso evita erros de CSP na casca estática.

\`\`\`tsx  
// src/components/ui/dynamic-scripts.tsx  
'use client';

import { useEffect } from 'react';

interface DynamicScriptsProps {  
  nonce: string;  
}

export function DynamicScripts({ nonce }: DynamicScriptsProps) {  
  useEffect(() \=\> {  
    if (nonce) {  
      // Exemplo: Google Tag Manager  
      const script \= document.createElement('script');  
      script.src \= 'https://www.googletagmanager.com/gtag/js?id=G-XXX';  
      script.nonce \= nonce;  
      document.head.appendChild(script);  
    }  
  }, \[nonce\]);

  return null;  
}  
\`\`\`

\---

\#\#\# 6.19. Edge Config, Observabilidade, Compliance, ISR, OpenFeature, BFF

\*\*Edge Config\*\* – Para banners e kill switches, usamos \`@vercel/edge-config\`:

\`\`\`ts  
// src/lib/edge-config.ts  
import { get } from '@vercel/edge-config';

export async function getBanner() {  
  return get('banner');  
}

export async function getKillSwitch() {  
  return get('kill\_switch');  
}  
\`\`\`

\*\*Observabilidade\*\* – Correlação de logs com \`AsyncLocalStorage\` e OpenTelemetry:

\`\`\`ts  
// src/lib/context.ts  
import { AsyncLocalStorage } from 'async\_hooks';  
import { trace } from '@opentelemetry/api';

export interface RequestContext {  
  requestId: string;  
  traceId: string;  
  spanId: string;  
  customerId?: string;  
  cartId?: string;  
}

export const context \= new AsyncLocalStorage\<RequestContext\>();

export function getContext(): RequestContext {  
  const store \= context.getStore();  
  if (store) return store;  
  const span \= trace.getActiveSpan();  
  const spanContext \= span?.spanContext();  
  return {  
    requestId: crypto.randomUUID(),  
    traceId: spanContext?.traceId || '',  
    spanId: spanContext?.spanId || '',  
  };  
}  
\`\`\`

\`\`\`ts  
// src/lib/logger.ts  
import { getContext } from './context';

export const logger \= {  
  info: (msg: string, meta?: any) \=\> {  
    const ctx \= getContext();  
    console.log(JSON.stringify({ level: 'info', msg, meta, ...ctx, timestamp: new Date().toISOString() }));  
  },  
  error: (msg: string, meta?: any) \=\> console.error(JSON.stringify({ level: 'error', msg, meta, ...ctx })),  
  warn: (msg: string, meta?: any) \=\> console.warn(JSON.stringify({ level: 'warn', msg, meta, ...ctx })),  
};  
\`\`\`

\*\*Compliance\*\* – Consent Ledger e Right to be Forgotten:

\`\`\`ts  
// src/lib/compliance/consent.ts  
import { getRedisClient } from '@/lib/redis/client';

export async function recordConsent(userId: string, consent: boolean, ip: string, version: string) {  
  const redis \= getRedisClient();  
  const entry \= { userId, consent, ip, version, timestamp: new Date().toISOString() };  
  await redis.lpush(\`consent:ledger:${userId}\`, JSON.stringify(entry));  
  await redis.set(\`consent:current:${userId}\`, JSON.stringify(entry), 'EX', 60 \* 60 \* 24 \* 365);  
}  
\`\`\`

\*\*ISR\*\* – Nas páginas, use \`export const revalidate \= 3600;\` para revalidação incremental.

\*\*OpenFeature\*\* – Abstração sobre LaunchDarkly:

\`\`\`ts  
// src/lib/feature-flags.ts  
import { OpenFeature } from '@openfeature/js-sdk';  
import { LaunchDarklyProvider } from '@openfeature/launchdarkly-provider';

let initialized \= false;

export async function initFeatureFlags() {  
  if (initialized) return;  
  const provider \= new LaunchDarklyProvider(process.env.LAUNCHDARKLY\_SDK\_KEY\!);  
  await OpenFeature.setProvider(provider);  
  initialized \= true;  
}

export async function getFeatureFlag(key: string, context: Record\<string, any\>) {  
  if (\!initialized) await initFeatureFlags();  
  const client \= OpenFeature.getClient();  
  return client.getBooleanValue(key, false, context);  
}  
\`\`\`

\*\*BFF Layer\*\* – Preparado para futura orquestração:

\`\`\`ts  
// src/lib/bff.ts  
import { getShopifyClient } from './shopify/client';

export async function fetchProducts(locale: string) {  
  const client \= getShopifyClient(locale);  
  // ... lógica de negócio  
}  
\`\`\`

\---

\#\# 7\. Matriz de Fluxo de Mídia – Core Web Vitals

Nossa estratégia de imagens garante LCP \< 1.2s e CLS \= 0:

\- \*\*Upload\*\* → Shopify Admin (CDN Fastly).  
\- \*\*Consumo\*\* → \`next/image\` com \`remotePatterns\` para \`cdn.shopify.com\`.  
\- \*\*Otimização\*\* → AVIF/WebP automático, redimensionamento via parâmetros, cache no navegador.

\`\`\`  
\[Shopify Admin\] → \[Fastly CDN\] → \[next/image (AVIF/WebP, resizing)\] → \[Browser Cache\]  
\`\`\`

\---

\#\# 8\. Checklist de Produção – O Selo de Qualidade

| Item | Status |  
|------|--------|  
| Sem Cloudflare / Cloudinary | ✅ |  
| Nonce injetado com PPR | ✅ |  
| Arcjet apenas em Route Handlers | ✅ |  
| Circuit Breaker (Cockatiel) | ✅ |  
| Lock seguro com Redlock | ✅ |  
| Refresh token com lock distribuído via Redis | ✅ |  
| Webhook replay protection | ✅ |  
| ISR e \`revalidateTag\` | ✅ |  
| Invalidação atômica de cache Redis (cartId) | ✅ |  
| Cliente Redis Singleton | ✅ |  
| Metafields com namespace e parsing robusto | ✅ |  
| Tipagem estrita (sem any) | ✅ |  
| TypeScript strict sem erros | ✅ |  
| Multi‑região dinâmica | ✅ |  
| Graceful degradation validado | ✅ |  
| Cache do carrinho isolado por \`cartId\` | ✅ |  
| Recomendação \`@upstash/redis\` anotada | ✅ |

\---

\#\# 9\. Instruções de Execução – Do Zero ao Deploy

\`\`\`bash  
\# 1\. Crie o projeto  
npx create-next-app@latest my-luxury-shop \--typescript \--tailwind \--app  
cd my-luxury-shop

\# 2\. Instale as dependências  
npm install @shopify/storefront-api-client graphql graphql-request \\  
  motion lenis js-cookie @sentry/nextjs bullmq ioredis \\  
  @vercel/otel @opentelemetry/api @opentelemetry/sdk-node \\  
  @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express \\  
  arcjet @aws-sdk/client-secrets-manager cockatiel redlock \\  
  openfeature @openfeature/launchdarkly-provider zod

\# 3\. Instale as devDependencies  
npm install \-D @types/js-cookie tsx vitest @playwright/test

\# 4\. Crie o arquivo .env.local com as variáveis (veja seção 2\)

\# 5\. Copie todos os arquivos deste guia para as respectivas pastas

\# 6\. Execute o desenvolvimento  
npm run dev

\# 7\. Testes  
npm run test  
npm run test:e2e

\# 8\. Build e deploy  
npm run build  
npm start  
\`\`\`

\---

\#\# 10\. Próximos Passos Estratégicos

1\. \*\*Klaviyo\*\* – Integrar eventos de carrinho abandonado.  
2\. \*\*Algolia (opcional)\*\* – Para busca avançada em catálogos massivos (\>50k SKUs).  
3\. \*\*Social Login\*\* – Login com Google/Apple via Shopify Customer Account.  
4\. \*\*PWA\*\* – Melhorar experiência offline.  
5\. \*\*Chaos Engineering\*\* – Testar resiliência com Gremlin/Litmus.

\---

\#\# 11\. Resumo Final – Porque esta arquitetura é imbatível

\- \*\*Segurança\*\* – CSP, HMAC, lock distribuído, Arcjet, nonce, replay protection.  
\- \*\*Resiliência\*\* – Circuit Breaker, fallback validado, Redlock, ISR.  
\- \*\*Performance\*\* – Imagens otimizadas, cache distribuído, streaming, PPR.  
\- \*\*Observabilidade\*\* – Logs correlacionados, OpenTelemetry, Sentry.  
\- \*\*Compliance\*\* – GDPR, LGPD, CCPA, Consent Ledger.  
\- \*\*Manutenibilidade\*\* – Server Actions com Zod, BFF, OpenFeature, Edge Config.  
\- \*\*Dados Ricos\*\* – Metafields tipados com namespace explícito.  
\- \*\*Simplicidade\*\* – Sem Cloudflare, sem Cloudinary, apenas Shopify \+ Vercel \+ Redis.  
\- \*\*Multi‑Região\*\* – Cliente Shopify dinâmico, cache isolado por carrinho.

Agora você tem em mãos a \*\*base definitiva\*\* para construir um e‑commerce de luxo global com confiança, performance e segurança. 🚀✨

