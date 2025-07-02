<script setup>
import { ref } from 'vue'
const toastMsg = ref('')
const toastVisible = ref(false)
let toastTimeout = null

// Props: pokemon (objeto), onAdquirida (función)
const props = defineProps({
  pokemon: Object
})
import { useColeccionStore } from '../stores/coleccion.js'
const store = useColeccionStore()

const eliminando = ref(false)
const eliminarTimeout = ref(null)

function iniciarEliminar() {
  eliminando.value = true
  eliminarTimeout.value = setTimeout(() => {
    if (typeof props.onEliminar === 'function') {
      props.onEliminar(props.pokemon)
    }
    eliminando.value = false
  }, 3000)
}
function cancelarEliminar() {
  eliminando.value = false
  if (eliminarTimeout.value) clearTimeout(eliminarTimeout.value)
}
function showToast(msg) {
  toastMsg.value = msg
  toastVisible.value = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastVisible.value = false
  }, 2000)
}

async function handleRegistrar() {
  await store.marcarAdquirida(props.pokemon, store.userActiveId)
  showToast('¡Registrado!')
}

async function handleEliminar() {
  await store.eliminarDeColeccion(props.pokemon, store.userActiveId)
  showToast('Eliminado de tu colección')
}
</script>

<template>
  <div class="pokemon-card">
    <div v-if="toastVisible" class="toast">{{ toastMsg }}</div>
    <img :src="pokemon.imagen_url" :alt="pokemon.nombre" class="pokemon-img" :class="{'grayscale': !pokemon.adquirida, 'opacity-70': !pokemon.adquirida}" />
    <div class="pokemon-num">#{{ pokemon.numero }}</div>
    <div class="pokemon-nombre">{{ pokemon.nombre }}</div>
    <div class="pokemon-btns">
      <button
        v-if="!pokemon.adquirida"
        class="btn-adquirida"
        @click="handleRegistrar"
      >
        Registrar
      </button>
      <button
        v-if="pokemon.adquirida"
        class="btn-eliminar"
        @click="handleEliminar"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.15s;
}
.pokemon-card:hover {
  transform: scale(1.05);
}
.pokemon-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 8px;
}
.grayscale {
  filter: grayscale(1);
}
.opacity-70 {
  opacity: 0.7;
}
.pokemon-num {
  font-size: 0.95rem;
  font-weight: bold;
  margin-top: 4px;
  font-family: "Fira Code", monospace;
}
.pokemon-nombre {
  font-size: 0.8rem;
  color: #444;
  font-family: "Work Sans", sans-serif;
}
.pokemon-btns {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 4px;
}
.btn-adquirida {
  margin-top: 4px;
  font-size: 0.75rem;
  background: #43c464;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-adquirida:hover {
  background: #319e4a;
}
.btn-eliminar {
  margin-top: 4px;
  font-size: 0.75rem;
  background: #e11d48;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-eliminar.eliminando {
  background: #b91c1c;
  color: #fffbe7;
}
.btn-eliminar:hover {
  background: #b91c1c;
}
.toast {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.85);
  color: #fffbe7;
  padding: 5px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Work Sans', sans-serif;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s;
}
.toast[style*="display: none"] {
  opacity: 0;
}
.pokemon-card {
  position: relative;
}
</style>
