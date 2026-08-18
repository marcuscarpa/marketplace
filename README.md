# Luxury Marketplace

A global luxury e-commerce platform built on Next.js 16, Shopify Storefront API, Upstash Redis, with OAuth PKCE authentication, webhook security, observability, feature flags, and GDPR/LGPD/CCPA compliance.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (Browser)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Product  │  │   Cart   │  │  Search  │  │  Account │    │
│  │  Pages   │  │ Checkout │  │   Page   │  │  OAuth   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
└───────┼─────────────┼─────────────┼──────────────┼─────────┘
        │             │             │              │
┌───────▼─────────────▼─────────────▼──────────────▼─────────┐
│                    Next.js 16 (Proxy/Middleware)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  CSP +  │ │   Bot    │ │  Rate    │ │    Locale     │  │
│  │  Nonce  │ │ Protect  │ │  Limit   │ │   Routing     │  │
│  └─────────┘ └──────────┘ └──────────┘ └───────────────┘  │
└───────┬─────────────┬─────────────┬──────────────┬─────────┘
        │             │             │              │
┌───────▼─────┐ ┌─────▼─────┐ ┌────▼─────┐ ┌──────▼──────┐
│   Shopify   │ │  Upstash  │ │ Feature  │ │  Compliance │
│ Storefront  │ │   Redis   │ │  Flags   │ │   Ledger    │
│   API (×2)  │ │  (Cache)  │ │ (LD/EC)  │ │  (GDPR)     │
│  US + BR    │ │  + Locks  │ │          │ │             │
└─────────────┘ └───────────┘ └──────────┘ └─────────────┘
```

### Key Components

- **Multi-Region Shopify**: Separate Storefront API clients for US and BR markets
- **Redis Caching**: Read-through cache with stampede protection via distributed locks
- **OAuth PKCE**: Shopify Customer Account API with distributed lock token refresh
- **Webhook Security**: HMAC-SHA256 validation, timestamp window, Redis idempotency
- **CSP + Bot Protection**: Per-request nonce, user-agent screening, rate limiting
- **Observability**: OpenTelemetry traces, Sentry error capture, structured JSON logging
- **Feature Flags**: OpenFeature/LaunchDarkly + Vercel Edge Config for kill switches
- **Compliance**: Tamper-evident consent ledger, data export, deletion requests

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Shopify store (US + BR) with Storefront API access
- Upstash Redis database
- (Optional) Sentry, LaunchDarkly, Vercel Edge Config, Klaviyo accounts

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` with:

```env
# Required - Base
SHOPIFY_STORE_DOMAIN_US=your-us-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_US=your-us-token
SHOPIFY_STORE_DOMAIN_BR=your-br-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR=your-br-token
REDIS_URL=https://your-redis.upstash.io
REDIS_TOKEN=your-redis-token

# Required - Advanced
SHOPIFY_CLIENT_ID=your-oauth-client-id
SHOPIFY_CLIENT_SECRET=your-oauth-client-secret
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret

# Optional - Observability
SENTRY_DSN=your-sentry-dsn
OTEL_EXPORTER_OTLP_ENDPOINT=your-otel-endpoint

# Optional - Feature Flags
LAUNCHDARKLY_SDK_KEY=your-ld-sdk-key
EDGE_CONFIG=your-edge-config-connection-string

# Optional - Marketing
NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY=your-klaviyo-key
```

### Development

```bash
npm run dev          # Start dev server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript check
npm run test         # Run unit + integration tests
npm run test:coverage  # Run tests with coverage
npm run test:e2e     # Run Playwright E2E tests
npm run build        # Production build
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The CI pipeline (GitHub Actions) runs:
1. ESLint
2. TypeScript type check
3. Vitest with coverage
4. Playwright E2E smoke tests
5. Production build

### Environment Variable Security

All secrets are stored as Vercel environment variables. No secrets are committed to the repository. The `env.ts` Zod schema validates all required variables at startup.

## Testing

- **Unit Tests**: `__tests__/unit/` - Pure functions (regions, metafields, security, logger, feature flags)
- **Integration Tests**: `__tests__/integration/` - Mocked external deps (Shopify, Redis, webhooks, compliance)
- **E2E Tests**: `__tests__/e2e/` - Playwright browser tests (home, product, search, cart)
- **Coverage**: 55% lines, 55% functions, 50% branches (Redis/Shopify files excluded)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Motion |
| API | Shopify Storefront GraphQL API |
| Cache | Upstash Redis (HTTP) |
| Auth | Shopify Customer Account API (OAuth PKCE) |
| Observability | OpenTelemetry, Sentry |
| Feature Flags | OpenFeature + LaunchDarkly, Vercel Edge Config |
| Testing | Vitest, Playwright |
| CI | GitHub Actions |

## Docs

- [OTIMIZACAO_PERFORMANCE.md](./OTIMIZACAO_PERFORMANCE.md) — redução de mídia (imagens/vídeos) e melhorias de lazy load / prefetch / LCP
- [AUDITORIA_COMPLETA.md](./AUDITORIA_COMPLETA.md) — auditoria de segurança e código
- [SETUP.md](./SETUP.md) — setup e configuração do ambiente
