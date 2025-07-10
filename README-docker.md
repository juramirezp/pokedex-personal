# Despliegue de Pokedex en Coolify

Este documento describe cómo desplegar la aplicación Pokedex en Coolify utilizando Docker.

## Archivos de configuración

Se han creado los siguientes archivos para facilitar el despliegue:

- `Dockerfile`: Configuración para construir la imagen Docker de la aplicación
- `docker-compose.yml`: Configuración para orquestar el servicio
- `.dockerignore`: Lista de archivos y directorios excluidos del contexto de construcción
- `nginx.conf`: Configuración personalizada de Nginx para servir la aplicación

## Requisitos previos

1. Tener acceso a Coolify
2. Configurar las variables de entorno para Supabase

## Variables de entorno

La aplicación requiere las siguientes variables de entorno:

- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de tu proyecto Supabase

## Pasos para el despliegue en Coolify

1. **Crear un nuevo servicio en Coolify**
   - Selecciona "Create new resource"
   - Elige "Docker Compose"

2. **Configurar el repositorio**
   - Conecta tu repositorio Git
   - Selecciona la rama principal

3. **Configurar el despliegue**
   - Coolify detectará automáticamente el archivo `docker-compose.yml`
   - Configura el dominio como `pokedex.server-fikalab.cl`

4. **Configurar variables de entorno**
   - Agrega las variables de entorno necesarias:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Iniciar el despliegue**
   - Haz clic en "Deploy"

## Verificación del despliegue

Una vez completado el despliegue, puedes acceder a la aplicación en:

```
https://pokedex.server-fikalab.cl
```

## Solución de problemas

Si encuentras problemas durante el despliegue:

1. Verifica los logs de Coolify para identificar errores
2. Asegúrate de que las variables de entorno estén correctamente configuradas
3. Verifica que el dominio `pokedex.server-fikalab.cl` esté correctamente configurado en tu DNS

## Mantenimiento

Para actualizar la aplicación, simplemente realiza un push a la rama principal del repositorio. Coolify detectará los cambios y realizará un nuevo despliegue automáticamente.