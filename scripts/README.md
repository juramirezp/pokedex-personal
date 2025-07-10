# Scripts para Supabase

## Solución al problema de inserción de datos

Se han corregido los siguientes problemas que impedían que los datos se grabaran correctamente en las tablas:

1. **Gestión de tipos de Pokémon**: Se ha añadido el campo `types` como un array de strings para almacenar los tipos de cada Pokémon (por ejemplo: ["fire", "flying"]).

2. **Discrepancia en los nombres de las tablas**: Se ha corregido la discrepancia entre los nombres de las tablas en el SQL y en el código JavaScript:
   - En el SQL se crean tablas con prefijo `pokedex_` (pokedex_pokemon y pokedex_coleccion)
   - En el código JavaScript se hacía referencia a ellas sin ese prefijo ('pokemon' y 'coleccion')
   - Se han actualizado todos los archivos para usar los nombres correctos con el prefijo `pokedex_`

## Instrucciones para ejecutar los scripts

### 1. Configuración de variables de entorno

Antes de ejecutar cualquier script, asegúrate de tener un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### 2. Crear las tablas en Supabase

1. Accede al panel de administración de Supabase
2. Ve a la sección "SQL Editor"
3. Copia y pega el contenido del archivo `crear_tablas_supabase.sql`
4. Ejecuta la consulta

### 3. Poblar la tabla de Pokémon

Ejecuta el siguiente comando desde la raíz del proyecto:

```bash
node scripts/poblar_pokemon.js
```

## Verificación

Para verificar que los datos se han insertado correctamente:

1. Accede al panel de administración de Supabase
2. Ve a la sección "Table Editor"
3. Selecciona la tabla "pokedex_pokemon"
4. Deberías ver los registros con todos los campos correctamente poblados (numero, nombre, imagen_url, types)
   - El campo `types` debe contener un array con los tipos de cada Pokémon (ej. ["fire", "flying"])

## Solución de problemas comunes

- **Error de autenticación**: Verifica que las variables de entorno sean correctas
- **Error de conexión**: Asegúrate de que la URL de Supabase sea accesible
- **Error en la estructura de la tabla**: Verifica que hayas ejecutado correctamente el script SQL para crear las tablas
- **Nombres de tablas incorrectos**: Asegúrate de que estás usando los nombres correctos con el prefijo `pokedex_`
- **Problemas con el campo `types`**: Si el campo `types` no aparece o no se guarda correctamente:
  - Asegúrate de que la tabla `pokedex_pokemon` tiene una columna `types` de tipo `TEXT[]`
  - Verifica que el script de población está extrayendo correctamente los tipos de la PokeAPI
  - Comprueba que los datos se están insertando como un array de strings