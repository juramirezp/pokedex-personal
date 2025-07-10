<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useColeccionStore } from "./stores/coleccion.js";
import PokemonCard from "./components/PokemonCard.vue";
import Login from "./components/Login.vue";
import { supabase } from "./main.js";

const user = ref(null);

// Detectar cambios de sesión
detectarSesion();

function detectarSesion() {
  user.value = supabase.auth.user ? supabase.auth.user() : null;
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null;
  });
}

const buscador = ref("");
const resultadoBusqueda = ref(null);
const buscando = ref(false);
const totalPokemons = 1025;

const coleccion = useColeccionStore();

watch(user, (nuevoUser) => {
  coleccion.userActiveId = nuevoUser?.id;
  if (coleccion.pokemons.length < 1) coleccion.cargarColeccion(nuevoUser?.id);
});

// Filtros
const filtro = ref("todos");
const mostrarFiltros = ref(false);
const filtroRef = ref(null);

function clickFuera(e) {
  if (
    mostrarFiltros.value &&
    filtroRef.value &&
    !filtroRef.value.contains(e.target)
  ) {
    mostrarFiltros.value = false;
  }
}
onMounted(() => {
  document.addEventListener("click", clickFuera);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", clickFuera);
});

const adquiridos = computed(() =>
  coleccion.pokemons.filter((p) => p.adquirida)
);
const porcentaje = computed(() =>
  ((adquiridos.value.length / totalPokemons) * 100).toFixed(1)
);
const faltantes = computed(() => totalPokemons - adquiridos.value.length);

const faltantesPokemons = computed(() =>
  coleccion.pokemons.filter((p) => !p.adquirida)
);

const copiarFaltantes = async () => {
  const texto = faltantesPokemons.value
    .map((p) => `- ${p.numero} ${p.nombre}`)
    .join("\n");
  try {
    await navigator.clipboard.writeText(texto);
    alert("¡Listado copiado al portapapeles!");
  } catch (e) {
    // Fallback para móviles y navegadores antiguos
    const textarea = document.createElement("textarea");
    textarea.value = texto;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      alert("¡Listado copiado al portapapeles!");
    } catch (err) {
      alert(
        "No se pudo copiar automáticamente. Selecciona y copia manualmente:\n\n" +
          texto
      );
    }
    document.body.removeChild(textarea);
  }
};

const pokemonsFiltrados = computed(() => {
  let base = coleccion.pokemons;
  if (filtro.value === "adquiridos") base = base.filter((p) => p.adquirida);
  if (filtro.value === "faltantes") base = base.filter((p) => !p.adquirida);
  if (buscador.value)
    return base.filter((p) => p.numero.toString() === buscador.value);
  return base;
});

const buscar = () => {
  buscando.value = true;
  const valor = buscador.value?.toString().replace(/^0+/, ""); // elimina ceros a la izquierda
  if (!valor) {
    console.log("1");
    resultadoBusqueda.value = null;
    buscando.value = false;
    return;
  }
  if (!coleccion.pokemons.length) {
    console.log("2");
    resultadoBusqueda.value = null;
    buscando.value = false;
    return;
  }
  const poke = coleccion.pokemons.find((p) => p.numero.toString() === valor);
  resultadoBusqueda.value = poke || false;
  buscando.value = false;
};

watch(buscador, (nuevo) => {
  buscar();
});

watch(buscador, (nuevo) => {
  if (!nuevo) resultadoBusqueda.value = null;
});

const marcarAdquirida = async (pokemon) => {
  await coleccion.marcarAdquirida(pokemon, coleccion.userActiveId);
};
function logout() {
  supabase.auth.signOut();
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 main">
    <Login v-if="!user" />
    <div v-else>
      <button class="logout-btn desktop-only" @click="logout">Cerrar sesión</button>
      <div class="app-bg app-flex app-padding">
        <!-- Header -->
        <header class="header-container">
          <div class="header-flex">
            <h1 class="titulo">Mi Colección</h1>
            <div class="progreso-flex">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  width: 100%;
                "
              >
                <progress
                  :value="adquiridos.length"
                  :max="totalPokemons"
                  style="flex: 1; height: 20px"
                ></progress>
              </div>
              <div class="progreso-fraccion">
                <span class="progreso-capturados">{{ adquiridos.length }}</span>
                /
                <span>{{ totalPokemons }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Botón copiar faltantes -->
        <div
          style="width: 100%; text-align: right; margin-bottom: 10px"
          v-if="faltantesPokemons.length"
          class="desktop-only"
        >
          <button class="btn-copiar" @click="copiarFaltantes">
            Copiar faltantes
          </button>
        </div>

        <!-- Buscador y Filtros -->
        <div class="buscador-filtros">
          <input
            v-model="buscador"
            type="number"
            min="1"
            max="1025"
            placeholder="Buscar por número..."
            class="input-buscador"
          />
          <div class="filtros-dropdown" ref="filtroRef">
            <button
              @click="mostrarFiltros = !mostrarFiltros"
              class="btn-filtros"
            >
              Filtros
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <div v-if="mostrarFiltros" class="filtros-menu">
              <ul>
                <li
                  :class="{ 'filtro-activo': filtro === 'todos' }"
                  class="filtro-opcion"
                  @click="
                    filtro = 'todos';
                    mostrarFiltros = false;
                  "
                >
                  Todos
                </li>
                <li
                  :class="{ 'filtro-activo': filtro === 'adquiridos' }"
                  class="filtro-opcion"
                  @click="
                    filtro = 'adquiridos';
                    mostrarFiltros = false;
                  "
                >
                  Solo adquiridos
                </li>
                <li
                  :class="{ 'filtro-activo': filtro === 'faltantes' }"
                  class="filtro-opcion"
                  @click="
                    filtro = 'faltantes';
                    mostrarFiltros = false;
                  "
                >
                  Solo faltantes
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Resultado de búsqueda -->
        <div
          v-if="resultadoBusqueda !== null"
          class="busqueda-resultado-container"
        >
          <div v-if="resultadoBusqueda" class="busqueda-resultado">
            <PokemonCard :pokemon="resultadoBusqueda" />
          </div>
          <div v-else class="busqueda-resultado">
            <div
              class="busqueda-noadquirida"
              style="width: 100%; text-align: center"
            >
              No se encontró ningún Pokémon con ese número.
            </div>
          </div>
        </div>

        <!-- Cuadrícula de Pokémon -->
        <div v-if="resultadoBusqueda === null" class="pokemon-grid">
          <PokemonCard
            v-for="pokemon in pokemonsFiltrados"
            :key="pokemon.numero"
            :pokemon="pokemon"
          />
        </div>

        <!-- Loader -->
        <div v-if="coleccion.loading" class="loader-overlay">
          <div class="loader-box">Cargando colección...</div>
        </div>
      </div>
      <div class="navbar-mobile">
        <button
          v-if="user"
          @click="copiarFaltantes"
          class="navbar-btn navbar-btn-blue"
        >
          Copiar Faltantes
        </button>
        <button
          v-if="user"
          @click="supabase.auth.signOut()"
          class="navbar-btn navbar-btn-red"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
    <span class="version">v1.1</span>
  </div>
</template>

<style scoped>
.main{
  position: relative;
}
.version{
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
}
.app-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}
.header-container {
  width: 100%;
  max-width: 640px;
  margin: 0 auto 24px auto;
}
.header-flex {
  display: grid;
  grid-template-columns: 60% 35%;
  gap: 8px;
}
.titulo {
  font-size: 1.6rem;
  font-weight: bold;
  text-align: left;
  color: #000;
  margin-bottom: 4px;
  font-family: "Fira Code", monospace;
  text-shadow: 0 2px 8px #fffbe7;
  margin-top: 4px;
}
.progreso-flex {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.barra-progreso {
  flex: 1;
  height: 12px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}
.barra-progreso-interna {
  height: 100%;
  background: #4ade80;
  border-radius: 999px 0 0 999px;
  transition: width 0.3s;
}
.progreso-texto {
  position: absolute;
  right: 12px;
  top: 0;
  font-size: 0.8rem;
  font-weight: bold;
  color: #374151;
}
.progreso-fraccion {
  margin-left: 8px;
  text-align: right;
  font-size: 0.85rem;
  font-family: monospace;
  color: #374151;
}
.progreso-capturados {
  font-weight: bold;
  color: #15803d;
}
.buscador-filtros {
  width: 100%;
  max-width: 640px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.input-buscador {
  flex: 1;
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}
.input-buscador:focus {
  border-color: #fde047;
  box-shadow: 0 0 0 2px #fde04744;
}
.filtros-dropdown {
  position: relative;
}
.btn-filtros {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 8px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
  border: none;
  box-shadow: 0 1px 4px #0001;
  cursor: pointer;
  transition: background 0.15s;
  height: 100%;
  font-family: "Work Sans", sans-serif;
}
.btn-filtros:hover {
  background: #d1d5db;
}
.filtros-menu {
  position: absolute;
  right: 0;
  margin-top: 8px;
  width: 160px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0002;
  z-index: 10;
}
.filtros-menu ul {
  list-style: none;
  margin-left: 0;
  padding-left: 0;
}
.filtro-opcion {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.15s;
  font-family: "Work Sans", sans-serif;
}
.filtro-opcion:hover {
  background: #73c7ff;
}
.filtro-activo {
  background: #73c7ff;
  font-weight: bold;
}
.busqueda-resultado-container {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
}
.busqueda-resultado {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  padding: 16px;
}
.busqueda-img {
  width: 96px;
  height: 96px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}
.busqueda-info {
  flex: 1;
}
.busqueda-num-nombre {
  font-size: 1.1rem;
  font-weight: 600;
}
.busqueda-adquirida {
  color: #16a34a;
  font-weight: bold;
}
.busqueda-noadquirida {
  color: #dc2626;
  font-weight: bold;
}
.btn-adquirida-resultado {
  margin-left: 16px;
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-adquirida-resultado:hover {
  background: #15803d;
}
.pokemon-grid {
  width: 100%;
  max-width: 640px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (min-width: 640px) {
  .pokemon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 900px) {
  .pokemon-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.loader-box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0002;
  font-size: 1.25rem;
  font-weight: bold;
  color: #eab308;
}
.grayscale {
  filter: grayscale(1);
}
.opacity-70 {
  opacity: 0.7;
}
.btn-copiar {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 0.98rem;
  font-family: "Work Sans", sans-serif;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background 0.15s;
}
.btn-copiar:hover {
  background: #1d4ed8;
}

.logout-btn {
  position: fixed;
  top: 18px;
  right: 24px;
  background: #e11d48;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 0.98rem;
  font-family: "Work Sans", sans-serif;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background 0.15s;
}
.logout-btn:hover {
  background: #b91c1c;
}

/* Clases para mostrar/ocultar elementos según el dispositivo */
.desktop-only {
  display: block;
}

.navbar-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  border: none;
  cursor: pointer;
}

.navbar-btn-blue {
  background-color: #3b82f6;
}

.navbar-btn-blue:hover {
  background-color: #2563eb;
}

.navbar-btn-red {
  background-color: #ef4444;
}

.navbar-btn-red:hover {
  background-color: #dc2626;
}

@media (max-width: 767px) {
  .desktop-only {
    display: none;
  }
}

@media (min-width: 768px) {
  .navbar-mobile {
    display: none;
  }
}
</style>
