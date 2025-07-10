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
     - `VITE_SUPABASE_URL` = `http://supabasekong-sws4s8k4kogoso4gkwg0gscw.31.97.147.171.sslip.io` (o la URL correcta de tu instancia de Supabase)
     - `VITE_SUPABASE_ANON_KEY` = `tu_clave_anónima_de_supabase`
   - **IMPORTANTE**: Asegúrate de que estas variables estén disponibles durante la fase de construcción (build)
   - En Coolify, ve a la sección "Environment Variables" y marca la opción "Build-time variables" para ambas variables

5. **Iniciar el despliegue**
   - Haz clic en "Deploy"
   - Asegúrate de que la opción "Build from source" esté seleccionada para que se utilicen las variables de entorno durante la construcción

## Verificación del despliegue

Una vez completado el despliegue, puedes acceder a la aplicación en:

```
https://pokedex.server-fikalab.cl
```

## Solución de problemas

### Error: "supabaseUrl is required"

Si al visitar el sitio ves una página en blanco y en la consola del navegador aparece el error:

```
Uncaught Error: supabaseUrl is required.
at new Rd (index-XXX.js:XX:XXXXX)
```

Este error indica que las variables de entorno de Supabase no se están incluyendo correctamente durante la fase de construcción. Para solucionarlo:

1. **Asegúrate de que las variables de entorno estén configuradas como variables de construcción (build-time variables) en Coolify**:
   - Ve a tu proyecto en Coolify
   - Navega a la sección "Environment Variables"
   - Marca la opción "Build-time variables" para `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
   - Guarda los cambios

2. **Reconstruye la aplicación**:
   - Haz clic en "Rebuild" en Coolify
   - Asegúrate de que la opción "Build from source" esté seleccionada

3. **Verifica los logs de construcción**:
   - Durante la construcción, deberías ver que las variables de entorno se están utilizando
   - Busca mensajes relacionados con Vite y las variables de entorno

### Otros problemas comunes

Si encuentras otros problemas durante el despliegue:

1. Verifica los logs de Coolify para identificar errores
2. Asegúrate de que las variables de entorno estén correctamente configuradas
3. Verifica que el dominio `pokedex.server-fikalab.cl` esté correctamente configurado en tu DNS
4. Comprueba que la configuración de Traefik en Coolify sea compatible con las etiquetas definidas en el docker-compose.yml

## Mantenimiento

Para actualizar la aplicación, simplemente realiza un push a la rama principal del repositorio. Coolify detectará los cambios y realizará un nuevo despliegue automáticamente.