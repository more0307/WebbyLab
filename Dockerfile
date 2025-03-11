FROM node:20

WORKDIR /app

COPY ./ /app

ENV APP_PORT=8050

RUN npm install

EXPOSE ${APP_PORT}

CMD ["npm", "run", "dev"]
