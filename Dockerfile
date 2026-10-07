# =============================================================================
# Gogada Prameela — portfolio (Next.js 16, App Router)
#
# Published as ghcr.io/<owner>/prameela-portfolio-web and deployed by
# aiagentechx-infra as the `prameela-portfolio-web` compose service
# (prameelagogada.com + www).
# =============================================================================

FROM node:22-alpine AS base


# ── deps ─────────────────────────────────────────────────────────────────────
FROM base AS deps
# Next's SWC binaries are glibc-linked; libc6-compat provides the shim musl
# needs to load them.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Manifests only, so this layer survives every source-only edit.
COPY package.json package-lock.json ./
RUN npm ci


# ── builder ──────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# .dockerignore drops node_modules from the context, so this cannot clobber the
# install above with host binaries.
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_* is inlined at build time, so the canonical URL (sitemap, OG
# tags, the resume QR code) is fixed here, not at container start.
ARG NEXT_PUBLIC_SITE_URL=https://prameelagogada.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# A green build without output:"standalone" produces an image whose CMD cannot
# resolve. Fail here instead of crash-looping on the host.
RUN test -f .next/standalone/server.js \
    || (echo "ERROR: .next/standalone/server.js missing — is output:'standalone' set in next.config.ts?" && exit 1)


# ── runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Next binds to $HOSTNAME, and Docker sets that to the container id — which
# resolves to the container's network IP alone, so the server never answers on
# loopback and its own healthcheck fails while Traefik routes to it fine.
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# public/ stays root-owned and read-only to the app user. The Next output is
# chowned because the server writes its cache under .next/.
COPY --from=builder /app/public                                ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

# 127.0.0.1, never localhost: /etc/hosts maps localhost to ::1 as well, wget
# tries IPv6 first, and nothing listens there.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
