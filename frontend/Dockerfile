FROM node:12.16.1 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=PRODUCTION

RUN yarn build:lcov && yarn --production --frozen-lockfile

FROM node:12.16.1

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["yarn", "start"]