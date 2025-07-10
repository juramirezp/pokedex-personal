-- Crear tabla de Pokémon
CREATE TABLE IF NOT EXISTS pokedex_pokemon (
  numero INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  imagen_url TEXT NOT NULL,
  types TEXT[] DEFAULT '{}'::TEXT[]
);

-- Crear tabla de usuarios (aunque Supabase ya maneja esto con auth.users)
-- Esta tabla es solo para referencia, ya que Supabase maneja la autenticación
-- CREATE TABLE IF NOT EXISTS usuarios (
--   id UUID PRIMARY KEY REFERENCES auth.users(id),
--   email TEXT UNIQUE NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Crear tabla de colección (relación entre usuarios y pokémon)
CREATE TABLE IF NOT EXISTS pokedex_coleccion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pokemon_numero INTEGER NOT NULL REFERENCES pokedex_pokemon(numero) ON DELETE CASCADE,
  adquirida BOOLEAN DEFAULT TRUE,
  fecha_adquisicion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pokemon_numero)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_coleccion_user_id ON pokedex_coleccion(user_id);
CREATE INDEX IF NOT EXISTS idx_coleccion_pokemon_numero ON pokedex_coleccion(pokemon_numero);

-- Crear políticas de seguridad RLS (Row Level Security)

-- Habilitar RLS en las tablas
ALTER TABLE pokedex_pokemon ENABLE ROW LEVEL SECURITY;
ALTER TABLE pokedex_coleccion ENABLE ROW LEVEL SECURITY;

-- Política para la tabla pokemon: todos pueden leer
CREATE POLICY pokemon_select_policy ON pokedex_pokemon
  FOR SELECT USING (true);

-- Políticas para la tabla coleccion
-- Los usuarios solo pueden ver sus propias colecciones
CREATE POLICY coleccion_select_policy ON pokedex_coleccion
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios solo pueden insertar en sus propias colecciones
CREATE POLICY coleccion_insert_policy ON pokedex_coleccion
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias colecciones
CREATE POLICY coleccion_update_policy ON pokedex_coleccion
  FOR UPDATE USING (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar de sus propias colecciones
CREATE POLICY coleccion_delete_policy ON pokedex_coleccion
  FOR DELETE USING (auth.uid() = user_id);