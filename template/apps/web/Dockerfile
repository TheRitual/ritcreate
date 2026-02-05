FROM node:22.12-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN npm install

FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=web

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /repo
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages/ui ./packages/ui
COPY --from=builder /repo/apps/web/dist ./apps/web/dist
COPY --from=builder /repo/apps/web/app.js ./apps/web/app.js
COPY --from=builder /repo/apps/web/package.json ./apps/web/package.json
COPY --from=builder /repo/package.json ./package.json
WORKDIR /repo/apps/web
EXPOSE 3000
CMD ["node", "app.js"]
