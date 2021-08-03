[![backend-test](https://github.com/ojhaujjwal/sws-test/actions/workflows/test.yaml/badge.svg?branch=main)](https://github.com/ojhaujjwal/sws-test/actions/workflows/test.yaml)


## Description
SWS API Test.

## Installation

### Using Docker
1. Copy .env.dist to .env and modify appropriate values

```bash
docker-compose build

# Starts the app onn nwatch mode
docker-compose up -d
```

### Without using Docker
It's recommended to use nvm to setup the same node version. If not, any node on v14.* should work.

```bash
$ nvm use

$ npm install

$ npm run start:dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## TODO:
- [ ] Build Docker Image and Push to Container Registry
- [ ] Deploy docker image to [cloud run](https://cloud.google.com/run)
