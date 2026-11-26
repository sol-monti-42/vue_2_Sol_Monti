<script setup>
// Importamos ref y onMounted para cargar la selección de Pokémon al iniciar la página de inicio
import { ref, onMounted } from "vue"
// Importamos el componente Table que renderiza las tarjetas de los Pokémon
import Table from "../components/Table.vue"

// Lista reactiva de Pokémon destacados que se muestran en la portada
const destacados = ref([])
// Estado reactivo de carga para mostrar un spinner mientras responde la API
const cargando = ref(false)
// Estado reactivo de error para mostrar mensaje y botón de reintentar si falla la red
const error = ref(null)

// Función asíncrona que obtiene con fetch una selección de 10 Pokémon populares para la página de inicio
const cargarDestacados = async () => {
  cargando.value = true
  error.value = null
  try {
    // Pedimos los primeros 10 Pokémon a PokéAPI
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
    if (!res.ok) throw new Error("No se pudo conectar con PokéAPI")
    const data = await res.json()

    // Obtenemos el detalle de cada uno en paralelo para mostrar su imagen, tipos, altura y peso
    const listaDetallada = await Promise.all(
      data.results.map(async (p) => {
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
    destacados.value = listaDetallada
  } catch (err) {
    console.log(err)
    error.value = "Ocurrió un problema al cargar los Pokémon destacados. Verificá tu conexión."
  } finally {
    cargando.value = false
  }
}

// Ejecutamos la carga al montar la página de inicio
onMounted(() => {
  cargarDestacados()
})
</script>

<template>
  <main class="container py-4 py-md-5">
    <!-- Banner principal (Hero) con fondo oscuro y detalles en rojo/amarillo -->
    <section class="hero-poke rounded-5 p-4 p-md-5 text-white shadow mb-5">
      <div class="row align-items-center g-4">
        <div class="col-md-8">
          <span class="badge bg-warning text-dark rounded-pill px-3 py-2 fw-bold mb-3">
            PokéAPI v2 • Vue 3
          </span>
          <h1 class="display-5 fw-bold mb-3">Explorá el Mundo Pokémon</h1>
          <p class="lead text-light opacity-75 mb-4">
            Consultá las estadísticas, descripciones, tipos y habilidades de cada Pokémon, filtrá por nombre o tipo, armá tu equipo de favoritos y pedile recomendaciones a la IA.
          </p>
          <div class="d-flex flex-wrap gap-3">
            <!-- Botón principal para ir al listado completo de la Pokédex -->
            <RouterLink to="/personajes" class="btn btn-warning btn-lg rounded-pill fw-bold px-4 shadow-sm">
              Abrir Pokédex Completa →
            </RouterLink>
            <!-- Botón secundario para ir directo al buscador con filtros -->
            <RouterLink to="/search" class="btn btn-outline-light btn-lg rounded-pill px-4">
              Buscar y Filtrar
            </RouterLink>
          </div>
        </div>
        <!-- Imagen destacada decorativa (Pikachu official artwork) -->
        <div class="col-md-4 text-center">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            class="img-fluid hero-img"
            width="210"
          />
        </div>
      </div>
    </section>

    <!-- Sección de Pokémon Destacados en la página de inicio obtenida con fetch -->
    <section class="mb-5">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h2 class="h3 fw-bold mb-0">🔥 Selección de Pokémon Destacados</h2>
          <p class="text-secondary small mb-0">Los Pokémon iniciales y más populares obtenidos en vivo desde PokéAPI</p>
        </div>
        <RouterLink to="/personajes" class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold">
          Ver catálogo paginado →
        </RouterLink>
      </div>

      <!-- Estado de carga -->
      <div v-if="cargando" class="text-center py-5 bg-white rounded-4 shadow-sm my-3">
        <div class="spinner-border text-danger mb-2" role="status"></div>
        <p class="text-secondary mb-0">Cargando Pokémon destacados...</p>
      </div>

      <!-- Estado de error con opción de reintentar -->
      <div v-else-if="error" class="alert alert-danger rounded-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 my-3">
        <span>{{ error }}</span>
        <button class="btn btn-danger btn-sm rounded-pill px-4 fw-semibold" @click="cargarDestacados">
          Reintentar
        </button>
      </div>

      <!-- Grilla de tarjetas de Pokémon destacados -->
      <Table v-else :personajes="destacados" />
    </section>

    <!-- Tarjetas de acceso rápido a las secciones de la app -->
    <section class="row g-4">
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 p-4">
          <div class="fs-2 mb-2">📕</div>
          <h3 class="h5 fw-bold">Catálogo Paginado + IA</h3>
          <p class="text-secondary small mb-3">
            Recorré todos los Pokémon con caché inteligente y consultale al asistente Gemini AI.
          </p>
          <RouterLink to="/personajes" class="mt-auto text-danger fw-semibold text-decoration-none">
            Ir a la Pokédex →
          </RouterLink>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 p-4">
          <div class="fs-2 mb-2">🔍</div>
          <h3 class="h5 fw-bold">Filtro por Tipo y Nombre</h3>
          <p class="text-secondary small mb-3">
            Encontrá cualquier Pokémon filtrando por su categoría/tipo (Fuego, Agua, Planta, etc.) y altura.
          </p>
          <RouterLink to="/search" class="mt-auto text-danger fw-semibold text-decoration-none">
            Probar filtros →
          </RouterLink>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 p-4">
          <div class="fs-2 mb-2">❤️</div>
          <h3 class="h5 fw-bold">Mis Favoritos</h3>
          <p class="text-secondary small mb-3">
            Guardá tus Pokémon favoritos en localStorage y administralos desde la vista de Favoritos.
          </p>
          <RouterLink to="/favoritos" class="mt-auto text-danger fw-semibold text-decoration-none">
            Ver favoritos →
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero-poke {
  background: linear-gradient(135deg, #1e293b 0%, #7f1d1d 100%);
}

.hero-img {
  filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.35));
}
</style>
