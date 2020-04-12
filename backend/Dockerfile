FROM node:12.16.1 AS build

WORKDIR /server

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=PRODUCTION

RUN yarn build:lcov && yarn --production

FROM node:12.16.1

WORKDIR /server

COPY --from=build /server .

EXPOSE 6001

CMD ["yarn", "start"]
