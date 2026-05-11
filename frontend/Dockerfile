# Estágio 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copia apenas os arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos e gera a pasta dist
COPY . .
RUN npm run build

# Estágio 2: Serve (Produção)
FROM nginx:stable-alpine

# Copia os arquivos buildados do estágio anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia uma configuração customizada do Nginx (opcional, mas recomendada para SPAs)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]