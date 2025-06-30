# Gestor de Colección Pokedex Pokémon 

Esta aplicación web te permite gestionar tu colección de cartas Pokémon TCG, marcando cuáles tienes y visualizando el progreso de tu colección de los 1025 Pokémon oficiales. El proyecto está construido con Vue 3, Vite, Pinia y Supabase.

## Características principales
- Visualiza todos los Pokémon en una cuadrícula tipo calendario.
- Marca cartas como "adquiridas" y elimina de la colección con un clic.
- Buscador por número de Pokémon (con soporte para ceros a la izquierda).
- Barra de progreso nativa `<progress>` mostrando avance de la colección.
- Filtros: ver todos, solo adquiridos o solo faltantes.
- Interfaz minimalista y temática Pokémon.
- Estado global con Pinia.
- Imágenes oficiales de la PokeAPI.
- Sin autenticación, pensado para uso personal.
- Compatible con dispositivos móviles y escritorio.

---

## Requisitos
- Node.js >= 16
- Una cuenta en [Supabase](https://supabase.com/)

## Instalación y uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/pokedex.git
cd pokedex
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear tu instancia de Supabase
1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2. Crea dos tablas:
   - `pokemon` (con los datos de los 1025 Pokémon; puedes poblarla usando la PokeAPI y un script si lo deseas)
   - `coleccion` (campos: `pokemon_numero` [int, PK], `adquirida` [bool])
3. Obtén tu `anon key` y la `url` de tu proyecto desde la sección de configuración de API de Supabase.

### 4. Configuración de variables de entorno
1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Rellena los valores de tu `.env` con la URL y la anon key de tu proyecto Supabase:
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

### 5. Ejecutar la app en desarrollo
```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## Personalización
- Puedes modificar estilos en los archivos `.vue` y en `src/index.css`.
- Si quieres reiniciar tu colección, basta con vaciar la tabla `coleccion` en Supabase.

## Notas técnicas
- El proyecto NO incluye autenticación y está pensado para uso personal.
- Si vas a desplegarlo, asegúrate de proteger tu anon key y restringir reglas de Supabase si lo necesitas.
- La carga de los 1025 Pokémon usa paginación para evitar el límite de 1000 registros por consulta en Supabase.

---

## Créditos
- [PokeAPI](https://pokeapi.co/) para imágenes y datos oficiales.
- [Supabase](https://supabase.com/) para backend y base de datos.
- [Vue.js](https://vuejs.org/) y [Vite](https://vitejs.dev/) para el frontend.

---

¿Dudas o sugerencias? ¡Abre un issue o contacta al autor!
