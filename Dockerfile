FROM node:15 as base
WORKDIR /server
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .

FROM base as production
ENV NODE_PATH=./build
ENV PORT 3000
RUN yarn build
EXPOSE $PORT 
CMD ["node", "build/index.js"]