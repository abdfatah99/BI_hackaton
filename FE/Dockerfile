# FROM node:21.7.3-alpine3.20 as BUILD_IMAGE

# WORKDIR /app/fe

# COPY package.json .

# RUN npm install

# COPY . .

# EXPOSE 5173

# # build project
# RUN npm run build

# FROM node:21.7.3-alpine3.20 as PRODUCTION_IMAGE

# WORKDIR /app/fe 
# COPY --from=BUILD_IMAGE /app/fe/dist /app/fe/dist
# EXPOSE 5173
# COPY package.json .
# COPY vite.config.ts .
# RUN npm install typescript
# CMD [ "npm", "run", "preview" ]

FROM node:21.7.3-alpine3.20

WORKDIR /app/fe

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]

