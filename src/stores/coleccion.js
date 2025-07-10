import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../main.js'

export const useColeccionStore = defineStore('coleccion', () => {
  const pokemons = ref([])
  const loading = ref(false)
  const error = ref(null)
  const userActiveId = ref(null)

  const cargarColeccion = async (userId) => {
    if (!userId) {
      pokemons.splice(0, pokemons.length)
      return
    }
    loading.value = true
    try {
      const [{ data: pokemonsData1 }, { data: pokemonsData2 }] = await Promise.all([
        supabase.from('pokedex_pokemon').select('*').order('numero', { ascending: true }).range(0, 999),
        supabase.from('pokedex_pokemon').select('*').order('numero', { ascending: true }).range(1000, 1024)
      ])
      const pokemonsData = [...(pokemonsData1 || []), ...(pokemonsData2 || [])]

      const { data: coleccion } = await supabase
        .from('pokedex_coleccion')
        .select('*')
        .eq('user_id', userId)

      const adquiridosSet = new Set(coleccion?.map(c => c.pokemon_numero))
      const nuevosPokemons = pokemonsData.map(p => ({
        ...p,
        adquirida: adquiridosSet.has(p.numero)
      }))
      pokemons.value =nuevosPokemons
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const marcarAdquirida = async (pokemon, userId) => {
    console.log(pokemon, userId)
    if (pokemon.adquirida || !userId) return
    await supabase.from('pokedex_coleccion').upsert({
      pokemon_numero: pokemon.numero,
      adquirida: true,
      user_id: userId
    })
    pokemon.adquirida = true
  }

  const eliminarDeColeccion = async (pokemon, userId) => {
    await supabase
      .from('pokedex_coleccion')
      .delete()
      .eq('pokemon_numero', pokemon.numero)
      .eq('user_id', userId)
    pokemon.adquirida = false
  }


  return { pokemons, loading, error, cargarColeccion, marcarAdquirida, eliminarDeColeccion }

})
