// Script para poblar la tabla 'pokemon' en Supabase desde la PokeAPI
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabaseUrl = 'http://supabasekong-sws4s8k4kogoso4gkwg0gscw.31.97.147.171.sslip.io'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const TOTAL_POKEMON = 1025

const poblarPokemon = async () => {
  for (let numero = 1; numero <= TOTAL_POKEMON; numero++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${numero}`
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`No se pudo obtener el Pokémon #${numero}`)
      const data = await res.json()
      const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1)
      const imagen_url = data.sprites.other['official-artwork'].front_default
      if (!imagen_url) continue
      
      // Extraer los tipos del Pokémon
      const types = data.types.map(typeInfo => typeInfo.type.name)
      
      // Inserta en Supabase incluyendo el array de tipos
      const respuesta = await supabase.from('pokedex_pokemon').upsert({ numero, nombre, imagen_url, types })
      console.log(respuesta)
      console.log(`Pokémon #${numero} - ${nombre} agregado.`)
    } catch (e) {
      console.error(`Error con el Pokémon #${numero}:`, e.message)
    }
    await new Promise(r => setTimeout(r, 200)) // Para no saturar la API
  }
  console.log('¡Poblado completo!')
}

poblarPokemon()
