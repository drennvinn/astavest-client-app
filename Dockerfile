ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-slim AS build

# Install pnpm directly
RUN npm install -g pnpm

WORKDIR /app

# Copie des fichiers de dépendances uniquement pour optimiser le cache de Docker.
# Si ces fichiers ne changent pas, Docker réutilisera le cache pour cette étape
COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

RUN pnpm install --shamefully-hoist

COPY . ./

RUN pnpm run build

FROM node:${NODE_VERSION}-slim

WORKDIR /app

COPY --from=build /app/.output ./

ENV HOST=0.0.0.0
ENV PORT=4000
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node","/app/server/index.mjs"]