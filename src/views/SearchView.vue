<script setup>
// Importamos ref, computed, onMounted y watch de Vue
import { ref, computed, onMounted, watch } from "vue"
// Importamos useRoute y useRouter para leer y sincronizar los query params de la URL
import { useRoute, useRouter } from "vue-router"
// Importamos los componentes de Grilla de Tarjetas (Table) y Paginación
import Table from "../components/Table.vue"
import Paginacion from "../components/Paginacion.vue"

// Obtenemos la ruta actual y el router
const route = useRoute()
const router = useRouter()

// Lista reactiva de pokemones obtenidos de la API para la página actual
const personajes = ref([])
// Cantidad total de páginas del resultado de búsqueda
const count = ref(0)
// URL de la siguiente página
const next = ref("")
// URL de la página anterior
const previous = ref("")
// Página actual
const currentPage = ref(1)
// Estados reactivos de carga y error con opción de reintentar
const cargando = ref(false)
const error = ref(null)

// Lista de tipos/categorías de Pokémon disponibles para el selector de filtro
const tiposDisponibles = [
  { valor: "", etiqueta: "Todos los tipos" },
  { valor: "fire", etiqueta: "Fuego (Fire)" },
  { valor: "water", etiqueta: "Agua (Water)" },
  { valor: "grass", etiqueta: "Planta (Grass)" },
  { valor: "electric", etiqueta: "Eléctrico (Electric)" },
  { valor: "poison", etiqueta: "Veneno (Poison)" },
  { valor: "flying", etiqueta: "Volador (Flying)" },
  { valor: "bug", etiqueta: "Bicho (Bug)" },
  { valor: "normal", etiqueta: "Normal" },
  { valor: "ground", etiqueta: "Tierra (Ground)" },
  { valor: "fairy", etiqueta: "Hada (Fairy)" },
  { valor: "fighting", etiqueta: "Lucha (Fighting)" },
  { valor: "psychic", etiqueta: "Psíquico (Psychic)" },
  { valor: "rock", etiqueta: "Roca (Rock)" },
  { valor: "ghost", etiqueta: "Fantasma (Ghost)" },
  { valor: "ice", etiqueta: "Hielo (Ice)" },
  { valor: "dragon", etiqueta: "Dragón (Dragon)" }
]

// Objeto reactivo con los criterios de búsqueda y filtrado: nombre, tipo y rango de altura (min y max)
const filtro = ref({
  nombre: "",
  tipo: "",
  min: 0,
  max: 300
})

// Propiedad computed para filtrar los resultados cargados por nombre, tipo y altura
const personajesFiltrados = computed(() => {
  const texto = (filtro.value.nombre || "").trim().toLowerCase()
  const tipoSeleccionado = (filtro.value.tipo || "").trim().toLowerCase()
  const alturaMin = Number(filtro.value.min) || 0
  const alturaMax = Number(filtro.value.max) || 300

  return personajes.value.filter((p) => {
    const coincideNombre = !texto || p.name.toLowerCase().includes(texto)
    const coincideTipo = !tipoSeleccionado || p.types.toLowerCase().includes(tipoSeleccionado)
    const coincideAltura = p.height >= alturaMin && p.height <= alturaMax
    return coincideNombre && coincideTipo && coincideAltura
  })
})

// Función para actualizar los query params en la URL y mantener la búsqueda y el filtro al recargar o compartir
const sincronizarQueryUrl = (pagina = 1) => {
  const query = {}
  if (filtro.value.nombre) query.search = filtro.value.nombre
  if (filtro.value.tipo) query.tipo = filtro.value.tipo
  if (Number(filtro.value.min) > 0) query.min = filtro.value.min
  if (Number(filtro.value.max) < 300) query.max = filtro.value.max
  if (pagina > 1) query.page = pagina
  router.replace({ path: "/search", query })
}

// Función asíncrona que busca los pokemones en PokéAPI según el nombre o el tipo elegido
const fetchApi = async ({ uri = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0", current = 1 } = {}) => {
  cargando.value = true
  error.value = null
  try {
    const query = (filtro.value.nombre || "").trim().toLowerCase()
    const tipo = (filtro.value.tipo || "").trim().toLowerCase()
    let pageResults = []
    let totalCount = 0
    let nextUrl = ""
    let prevUrl = ""

    // Caso 1: Si el usuario seleccionó un Tipo de Pokémon en el filtro (ej: "fire"), consultamos el endpoint /type/:tipo
    if (tipo) {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`)
      if (!res.ok) throw new Error("Error al filtrar por tipo en PokéAPI")
      const data = await res.json()
      // Extraemos los pokemones de ese tipo y si también escribió un nombre, los filtramos por nombre
      let listaPorTipo = data.pokemon.map((item) => item.pokemon)
      if (query) {
        listaPorTipo = listaPorTipo.filter((p) => p.name.toLowerCase().includes(query))
      }
      totalCount = listaPorTipo.length
      const start = (current - 1) * 10
      pageResults = listaPorTipo.slice(start, start + 10)
      nextUrl = start + 10 < totalCount ? `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${start + 10}` : null
      prevUrl = current > 1 ? `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${start - 10}` : null
    } else if (query) {
      // Caso 2: Si el usuario escribió un nombre sin filtro de tipo, buscamos sobre el índice de nombres
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0")
      if (!res.ok) throw new Error("Error al buscar en PokéAPI")
      const data = await res.json()
      const matched = data.results.filter((p) => p.name.toLowerCase().includes(query))
      totalCount = matched.length
      const start = (current - 1) * 10
      pageResults = matched.slice(start, start + 10)
      nextUrl = start + 10 < totalCount ? `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${start + 10}` : null
      prevUrl = current > 1 ? `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${start - 10}` : null
    } else {
      // Caso 3: Sin texto ni tipo seleccionado, traemos la página normal de 10 en 10
      const res = await fetch(uri || `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(current - 1) * 10}`)
      if (!res.ok) throw new Error("Error al cargar los Pokémon")
      const data = await res.json()
      pageResults = data.results
      totalCount = data.count
      nextUrl = data.next
      prevUrl = data.previous
    }

    // Obtenemos el detalle (altura, peso, tipos, imagen) de los 10 pokemones de la página actual
    const detailed = await Promise.all(
      pageResults.map(async (p) => {
        const detailRes = await fetch(p.url)
        const detail = await detailRes.json()
        return {
          id: detail.id,
          name: detail.name,
          url: p.url,
          height: detail.height,
          weight: detail.weight,
          base_experience: detail.base_experience,
          types: detail.types.map((t) => t.type.name).join(", "),
          sprite: detail.sprites?.front_default
        }
      })
    )

    personajes.value = detailed
    count.value = Math.max(1, Math.ceil(totalCount / 10))
    next.value = nextUrl
    previous.value = prevUrl
    currentPage.value = current
    sincronizarQueryUrl(current)
  } catch (err) {
    console.log(err)
    error.value = "Ocurrió un error al buscar los Pokémon. Revisá tu conexión e intentá nuevamente."
  } finally {
    cargando.value = false
  }
}

// Al montarse la vista (onMounted), leemos los query params de la URL (?search=&tipo=&min=&max=&page=) y ejecutamos la búsqueda
onMounted(() => {
  filtro.value.nombre = route.query.search || ""
  filtro.value.tipo = route.query.tipo || ""
  filtro.value.min = route.query.min ? Number(route.query.min) : 0
  filtro.value.max = route.query.max ? Number(route.query.max) : 300
  const paginaInicial = route.query.page ? Number(route.query.page) : 1
  currentPage.value = paginaInicial
  fetchApi({ current: paginaInicial })
})

// Observamos (watch) si cambia el parámetro ?search= en la URL (cuando buscan desde la barra superior Nav)
watch(() => route.query.search, (nuevo) => {
  if ((nuevo || "") !== filtro.value.nombre) {
    filtro.value.nombre = nuevo || ""
    currentPage.value = 1
    fetchApi({ current: 1 })
  }
})

// Función con debounce (retardo de 500ms) para no disparar una petición en cada tecla presionada
let timeoutId = null
const buscar = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    currentPage.value = 1
    fetchApi({ current: 1 })
  }, 500)
}
</script>

<template>
  <div class="container py-4">
    <!-- Panel superior de búsqueda y filtros con diseño mobile-first -->
    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
      <h1 class="h4 fw-bold mb-3">🔍 Buscador y Filtros de Pokémon</h1>
      <!-- Inputs para buscar por nombre, filtrar por tipo/categoría y rango de altura -->
      <div class="row g-3">
        <!-- Búsqueda por nombre -->
        <div class="col-12 col-sm-6 col-lg-3">
          <label class="form-label small fw-semibold text-secondary">Nombre del Pokémon</label>
          <input
            class="form-control rounded-pill px-3"
            type="text"
            placeholder="Ej: pikachu, char..."
            @input="buscar"
            v-model="filtro.nombre"
          />
        </div>

        <!-- Filtro por Tipo / Categoría -->
        <div class="col-12 col-sm-6 col-lg-3">
          <label class="form-label small fw-semibold text-secondary">Tipo / Categoría</label>
          <select class="form-select rounded-pill px-3" v-model="filtro.tipo" @change="buscar">
            <option v-for="t in tiposDisponibles" :key="t.valor" :value="t.valor">
              {{ t.etiqueta }}
            </option>
          </select>
        </div>

        <!-- Filtro de altura mínima -->
        <div class="col-6 col-lg-3">
          <label class="form-label small fw-semibold text-secondary">Altura mínima (dm)</label>
          <input
            class="form-control rounded-pill px-3"
            type="number"
            placeholder="0"
            @input="buscar"
            v-model="filtro.min"
          />
        </div>

        <!-- Filtro de altura máxima -->
        <div class="col-6 col-lg-3">
          <label class="form-label small fw-semibold text-secondary">Altura máxima (dm)</label>
          <input
            class="form-control rounded-pill px-3"
            type="number"
            placeholder="300"
            @input="buscar"
            v-model="filtro.max"
          />
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-5 bg-white rounded-4 shadow-sm my-3">
      <div class="spinner-border text-danger mb-2" role="status"></div>
      <p class="text-secondary mb-0">Buscando Pokémon...</p>
    </div>

    <!-- Estado de error con botón Reintentar -->
    <div v-else-if="error" class="alert alert-danger rounded-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 my-3">
      <span>{{ error }}</span>
      <button class="btn btn-danger btn-sm rounded-pill px-4 fw-semibold" @click="fetchApi({ current: currentPage })">
        Reintentar
      </button>
    </div>

    <!-- Mensaje cuando no hay coincidencias con el filtro -->
    <div v-else-if="personajesFiltrados.length === 0" class="text-center py-5 bg-white rounded-4 shadow-sm my-3">
      <p class="h5 fw-bold mb-1">No se encontraron Pokémon con esos filtros</p>
      <p class="text-secondary small mb-0">Probá cambiando el nombre, el tipo o el rango de altura.</p>
    </div>

    <!-- Grilla con las tarjetas de los resultados calculados por la propiedad computed personajesFiltrados -->
    <Table v-else :personajes="personajesFiltrados" />

    <!-- Paginación de los resultados -->
    <Paginacion :count="count" :next="next" :previous="previous" :currentPage="currentPage" @fetch="fetchApi" />
  </div>
</template>

<style scoped></style>
