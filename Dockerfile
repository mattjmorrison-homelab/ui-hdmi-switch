FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM base AS build
RUN npm run build

FROM nginx:1.27-alpine@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10 AS release
ARG COMMIT_SHA
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN echo "{\"commit_sha\": \"${COMMIT_SHA}\"}" > /usr/share/nginx/html/version.json
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

FROM base AS test
RUN true
ENTRYPOINT ["npm", "run", "test"]
