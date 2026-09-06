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

# Deliberately duplicates base's setup instead of `FROM base AS test`: when
# kaniko's --target stage's own FROM references another Dockerfile stage
# rather than an external image, it pushes a Docker-v2-schema manifest
# instead of OCI, and zot rejects that with 415/MANIFEST_INVALID. Confirmed
# by reproducing locally against a throwaway registry with both variants of
# a minimal Dockerfile -- release (FROM nginx, external) is unaffected.
FROM node:22-alpine@sha256:c610fcdfb1d5b4740dd70c284ed3cb16bb857e0f7166196e36a5501df7a3aa32 AS test
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENTRYPOINT ["npm", "run", "test"]
