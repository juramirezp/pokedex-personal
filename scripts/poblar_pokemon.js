// Script para poblar la tabla 'pokemon' en Supabase desde la PokeAPI
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

const supabaseUrl = 'https://whddlhwjqihddhwaxsgb.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const TOTAL_POKEMON = 1025

async function poblarPokemon() {
  for (let numero = 1; numero <= TOTAL_POKEMON; numero++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${numero}`
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`No se pudo obtener el Pokémon #${numero}`)
      const data = await res.json()
      const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1)
      const imagen_url = data.sprites.other['official-artwork'].front_default
      if (!imagen_url) continue
      // Inserta en Supabase
      await supabase.from('pokemon').upsert({ numero, nombre, imagen_url })
      console.log(`Pokémon #${numero} - ${nombre} agregado.`)
    } catch (e) {
      console.error(`Error con el Pokémon #${numero}:`, e.message)
    }
    await new Promise(r => setTimeout(r, 200)) // Para no saturar la API
  }
  console.log('¡Poblado completo!')
}

poblarPokemon()
