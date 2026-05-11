# Estágio de Build
FROM node:20-alpine as build
WORKDIR /app

# Recebe o argumento do docker-compose
ARG VITE_API_URL
# Define como variável de ambiente para o processo de build
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de Produção (Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]