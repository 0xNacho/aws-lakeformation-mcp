FROM node:lts-alpine
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --ignore-scripts

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 8080

# Run the MCP server
CMD [ "node", "build/index.js" ]