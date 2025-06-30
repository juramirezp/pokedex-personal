import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../main.js'

export const useColeccionStore = defineStore('coleccion', () => {
  const pokemons = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function cargarColeccion() {
    loading.value = true
    try {
      // Carga en dos partes para evitar el límite de 1000
      let { data: pokemonsData1 } = await supabase.from('pokemon').select('*').order('numero', { ascending: true }).range(0, 999)
      let { data: pokemonsData2 } = await supabase.from('pokemon').select('*').order('numero', { ascending: true }).range(1000, 1024)
      let pokemonsData = [...(pokemonsData1 || []), ...(pokemonsData2 || [])]
      let { data: coleccion } = await supabase.from('coleccion').select('*')
      pokemons.value = pokemonsData.map(p => {
        const adquirida = coleccion?.find(c => c.pokemon_numero === p.numero)?.adquirida || false
        return { ...p, adquirida }
      })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function marcarAdquirida(pokemon) {
    if (pokemon.adquirida) return
    await supabase.from('coleccion').upsert({ pokemon_numero: pokemon.numero, adquirida: true })
    pokemon.adquirida = true
  }

  async function eliminarDeColeccion(pokemon) {
    await supabase.from('coleccion').delete().eq('pokemon_numero', pokemon.numero)
    pokemon.adquirida = false
  }

  return { pokemons, loading, error, cargarColeccion, marcarAdquirida, eliminarDeColeccion }
})
