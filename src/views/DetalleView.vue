<script setup>
// Importamos ref y onMounted para gestionar el estado del detalle del Pokémon
import { ref, onMounted } from 'vue'
// Importamos useRoute para leer el parámetro dinámico :id de la ruta /detalle/:id
import { useRoute } from 'vue-router'

// Obtenemos el objeto de la ruta activa
const route = useRoute()
// Variable reactiva con los datos principales del Pokémon
const personaje = ref(null)
// Variable reactiva con la descripción en español obtenida de pokemon-species
const descripcion = ref("")
// Variable reactiva con la categoría de especie (ej: "Pokémon Semilla")
const categoria = ref("")
// Estado reactivo booleano para saber si este Pokémon está en favoritos
const isFavorito = ref(false)
// Estados reactivos de carga y error con opción de reintentar
const cargando = ref(false)
const error = ref(null)

// Función para verificar en localStorage si el Pokémon actual ya está en favoritos
const verificarFavorito = (nombre) => {
  const usuario = JSON.parse(localStorage.getItem('perfil'))
  isFavorito.value = Boolean(usuario?.favoritos?.find((p) => p.name === nombre))
}

// Función para agregar o quitar este Pokémon de favoritos desde la pantalla de detalle
const toggleFavorito = () => {
  if (!personaje.value) return
  // Leemos el perfil de localStorage o inicializamos uno por defecto si no inició sesión
  const usuario = JSON.parse(localStorage.getItem('perfil')) || {
    nombre: 'Entrenador Pokémon',
    email: '',
    photoURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    favoritos: []
  }
  if (!usuario.favoritos) {
    usuario.favoritos = []
  }

  // Armamos el objeto resumen del Pokémon para guardar en localStorage
  const itemResumen = {
    id: personaje.value.id,
    name: personaje.value.name,
    url: `https://pokeapi.co/api/v2/pokemon/${personaje.value.id}/`,
    height: personaje.value.height,
    weight: personaje.value.weight,
    base_experience: personaje.value.base_experience,
    types: personaje.value.types?.map((t) => t.type.name).join(', '),
    sprite: personaje.value.sprites?.front_default
  }

  // Si ya está en favoritos lo quitamos; si no está, lo agregamos
  if (usuario.favoritos.find((p) => p.name === personaje.value.name)) {
    usuario.favoritos = usuario.favoritos.filter((p) => p.name !== personaje.value.name)
    isFavorito.value = false
  } else {
    usuario.favoritos.push(itemResumen)
    isFavorito.value = true
  }

  // Guardamos la lista actualizada en localStorage
  localStorage.setItem('perfil', JSON.stringify(usuario))
}

// Función asíncrona que carga los datos y la descripción del Pokémon desde PokéAPI
const cargarDetalle = async () => {
  cargando.value = true
  error.value = null
  try {
    // 1. Pedimos los datos técnicos del Pokémon (altura, peso, imagen, tipos, estadísticas)
    const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + route.params.id)
    if (!res.ok) throw new Error("No se encontró el Pokémon solicitado")
    const data = await res.json()
    personaje.value = data
    verificarFavorito(data.name)

    // 2. Pedimos la especie del Pokémon para obtener su descripción oficial en español
    const speciesRes = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + data.id)
    if (speciesRes.ok) {
      const speciesData = await speciesRes.json()
      // Buscamos la entrada de texto en español ('es') o en inglés ('en') como respaldo
      const entradaTexto =
        speciesData.flavor_text_entries?.find((e) => e.language.name === 'es') ||
        speciesData.flavor_text_entries?.find((e) => e.language.name === 'en')
      // Limpiamos saltos de línea especiales del texto de PokéAPI
      descripcion.value = entradaTexto
        ? entradaTexto.flavor_text.replace(/[\n\f\r]+/g, ' ')
        : "Este Pokémon posee habilidades únicas dentro de su hábitat natural."

      // Buscamos el género/categoría en español (ej: "Pokémon Semilla", "Pokémon Ratón")
      const generoEsp = speciesData.genera?.find((g) => g.language.name === 'es')
      categoria.value = generoEsp ? generoEsp.genus : ""
    }
  } catch (err) {
    console.log(err)
    error.value = "No se pudo cargar la información del Pokémon. Verificá tu conexión o intentá nuevamente."
  } finally {
    cargando.value = false
  }
}

// Cargamos el detalle cuando se monta la vista
onMounted(() => {
  cargarDetalle()
})
</script>

<template>
  <main class="container py-4">
    <!-- Botón superior para regresar al listado de pokemones -->
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
      <RouterLink to="/personajes" class="btn btn-outline-dark btn-sm rounded-pill px-3">
        ← Volver a la Pokédex
      </RouterLink>
      <RouterLink to="/favoritos" class="btn btn-outline-danger btn-sm rounded-pill px-3">
        Ver mis favoritos ❤️
      </RouterLink>
    </div>

    <!-- Estado de carga -->
    <div v-if="cargando" class="text-center py-5 bg-white rounded-5 shadow-sm my-3">
      <div class="spinner-border text-danger mb-2" role="status"></div>
      <p class="text-secondary mb-0">Cargando ficha del Pokémon...</p>
    </div>

    <!-- Estado de error con botón Reintentar -->
    <div v-else-if="error" class="alert alert-danger rounded-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 my-3">
      <span>{{ error }}</span>
      <button class="btn btn-danger btn-sm rounded-pill px-4 fw-semibold" @click="cargarDetalle">
        Reintentar
      </button>
    </div>

    <!-- Tarjeta principal de dos columnas con diseño de ficha técnica Pokédex -->
    <article v-else-if="personaje" class="card border-0 shadow rounded-5 overflow-hidden">
      <div class="row g-0">
        <!-- Columna izquierda: vitrina con ilustración grande, número, tipos y botón Agregar a Favoritos -->
        <div class="col-md-5 detail-showcase text-white p-4 p-md-5 d-flex flex-column align-items-center justify-content-center text-center">
          <span class="badge bg-light text-dark rounded-pill px-3 py-1 fw-bold mb-2">
            #{{ String(personaje?.id || route?.params?.id).padStart(3, '0') }}
          </span>
          <!-- Categoría de especie si existe -->
          <span v-if="categoria" class="small text-warning fw-semibold mb-1">{{ categoria }}</span>

          <!-- Imagen oficial en alta resolución del Pokémon -->
          <img
            v-if="personaje?.sprites?.front_default"
            :src="personaje.sprites.other?.['official-artwork']?.front_default || personaje.sprites.front_default"
            :alt="personaje?.name"
            class="img-fluid my-3 detail-artwork"
            width="220"
            height="220"
          />
          <!-- Nombre del Pokémon -->
          <h1 class="h2 fw-bold text-capitalize mb-2">{{ personaje?.name }}</h1>

          <!-- Etiquetas de tipos -->
          <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
            <span
              v-for="t in personaje?.types"
              :key="t.type.name"
              class="badge bg-warning text-dark rounded-pill px-3 py-2 text-capitalize"
            >
              {{ t.type.name }}
            </span>
          </div>

          <!-- Botón para agregar o quitar de favoritos desde la vista de detalle -->
          <button
            type="button"
            class="btn rounded-pill px-4 py-2 fw-bold shadow-sm"
            :class="isFavorito ? 'btn-danger' : 'btn-light text-danger'"
            @click="toggleFavorito"
          >
            <span v-if="isFavorito">♥ Quitar de favoritos</span>
            <span v-else>♡ Agregar a favoritos</span>
          </button>
        </div>

        <!-- Columna derecha: descripción, medidas, habilidades y barras de estadísticas base -->
        <div class="col-md-7 p-4 p-md-5 bg-white">
          <!-- Descripción del Pokémon -->
          <h2 class="h5 fw-bold text-uppercase text-secondary mb-2">Descripción</h2>
          <p class="text-dark bg-light p-3 rounded-4 mb-4">
            {{ descripcion || 'Cargando descripción de la Pokédex...' }}
          </p>

          <h2 class="h5 fw-bold text-uppercase text-secondary mb-3">Datos Físicos</h2>
          <!-- Bloques de Altura, Peso y Experiencia Base -->
          <div class="row g-3 mb-4 text-center">
            <div class="col-4">
              <div class="p-3 bg-light rounded-4">
                <div class="fs-5 fw-bold text-dark">{{ personaje?.height }} dm</div>
                <div class="small text-secondary">Altura</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-3 bg-light rounded-4">
                <div class="fs-5 fw-bold text-dark">{{ personaje?.weight }} hg</div>
                <div class="small text-secondary">Peso</div>
              </div>
            </div>
            <div class="col-4">
              <div class="p-3 bg-light rounded-4">
                <div class="fs-5 fw-bold text-danger">{{ personaje?.base_experience }}</div>
                <div class="small text-secondary">Exp. Base</div>
              </div>
            </div>
          </div>

          <!-- Habilidades del Pokémon -->
          <h2 class="h5 fw-bold text-uppercase text-secondary mb-2">Habilidades</h2>
          <div class="d-flex flex-wrap gap-2 mb-4">
            <span
              v-for="a in personaje?.abilities"
              :key="a.ability.name"
              class="badge bg-dark bg-opacity-10 text-dark rounded-pill px-3 py-2 text-capitalize"
            >
              {{ a.ability.name }}
            </span>
          </div>

          <!-- Barras de progreso con las estadísticas base (HP, Attack, Defense, etc.) -->
          <h2 class="h5 fw-bold text-uppercase text-secondary mb-3">Estadísticas Base</h2>
          <div v-for="s in personaje?.stats" :key="s.stat.name" class="mb-2">
            <div class="d-flex justify-content-between small fw-semibold text-capitalize mb-1">
              <span>{{ s.stat.name }}</span>
              <span>{{ s.base_stat }}</span>
            </div>
            <div class="progress rounded-pill" style="height: 8px;">
              <div
                class="progress-bar bg-danger rounded-pill"
                role="progressbar"
                :style="{ width: Math.min(100, (s.base_stat / 150) * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.detail-showcase {
  background: linear-gradient(160deg, #1e293b 0%, #b91c1c 100%);
}

.detail-artwork {
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.35));
}
</style>
