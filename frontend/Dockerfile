# Stage 1: Build Vite app
FROM node:18 as build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Vite project (output to /app/dist)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built frontend to NGINX public folder
COPY --from=build /app/dist /usr/share/nginx/html

# NGINX config (MUST be in frontend/)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
