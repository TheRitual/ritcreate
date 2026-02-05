FROM node:22.12-alpine AS base
WORKDIR /repo

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/protos/package.json ./packages/protos/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN npm install

FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=api

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages/protos ./packages/protos
COPY --from=builder /repo/apps/api/dist ./apps/api/dist
COPY --from=builder /repo/apps/api/app.js ./apps/api/app.js
COPY --from=builder /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder /repo/package.json ./package.json
WORKDIR /repo/apps/api
EXPOSE 4000
EXPOSE 50051
CMD ["node", "app.js"]
