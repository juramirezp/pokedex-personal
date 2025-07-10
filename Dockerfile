FROM node:20.19.0-alpine AS build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el archivo .env.docker como .env para la construcción
COPY .env.docker .env

# Copiar el resto de archivos
COPY . .

# Configurar ARGs para las variables de entorno
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Reemplazar los valores en el archivo .env
RUN if [ -n "$VITE_SUPABASE_URL" ]; then \
    sed -i "s|VITE_SUPABASE_URL=placeholder_will_be_replaced_during_build|VITE_SUPABASE_URL=$VITE_SUPABASE_URL|g" .env; \
    fi && \
    if [ -n "$VITE_SUPABASE_ANON_KEY" ]; then \
    sed -i "s|VITE_SUPABASE_ANON_KEY=placeholder_will_be_replaced_during_build|VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY|g" .env; \
    fi

# Establecer variables de entorno para la compilación
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine AS production

# Copiar la configuración de nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]