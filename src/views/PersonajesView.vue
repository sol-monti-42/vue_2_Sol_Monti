<script setup>
// Importamos ref para estado reactivo y hooks de ciclo de vida para componentes dentro de <KeepAlive>
import { ref, onActivated, onDeactivated } from "vue"
// Importamos el componente Table que dibuja la grilla de tarjetas de pokemones
import Table from "../components/Table.vue"
// Importamos el componente Paginacion para cambiar de página
import Paginacion from "../components/Paginacion.vue"
// Importamos la vista RecomendadorView para hacer consultas a la IA sobre la página actual
import RecomendadorView from "./RecomendadorView.vue"
// Importamos useQueryClient de TanStack Vue Query para guardar en caché cada página consultada
import { useQueryClient } from "@tanstack/vue-query"

// Array reactivo donde guardamos los 10 pokemones de la página actual
const personajes = ref([])
// Cantidad total de páginas disponibles
const count = ref(0)
// URL para pedir la página siguiente a PokéAPI
const next = ref("")
// URL para pedir la página anterior a PokéAPI
const previous = ref("")
// Número de la página actual (arranca en 1)
const currentPage = ref(1)
// Estados reactivos de carga y de error con opción de reintentar (Requisito 7)
const cargando = ref(false)
const error = ref(null)

// Obtenemos la instancia del cliente de caché de Vue Query
const queryClient = useQueryClient()

// Se ejecuta cada vez que entramos a la vista y <KeepAlive> la reactiva desde la memoria
onActivated(() => {
  console.log("PersonajesView activated")
})
// Se ejecuta cuando salimos de la vista pero <KeepAlive> la conserva en memoria
onDeactivated(() => {
  console.log("PersonajesView deactivated")
})

// Función que consulta una página de PokéAPI usando caché de Vue Query
const fetchApi = ({ uri = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0", current = 1 } = {}) => {
  cargando.value = true
  error.value = null
  const targetUri = uri || `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(current - 1) * 10}`

  // fetchQuery busca primero en caché con la clave ['personajes', current]; si no está o expiró, ejecuta queryFn
  queryClient.fetchQuery({
    // Clave única de caché por número de página
    queryKey: ['personajes', current],
    // Función asíncrona que trae la lista de 10 pokemones y los detalles de cada uno
    queryFn: async () => {
      // 1. Pedimos la lista paginada a PokéAPI (devuelve count, next, previous y results con { name, url })
      const res = await fetch(targetUri)
      if (!res.ok) throw new Error("Error al obtener el listado de PokéAPI")
      const data = await res.json()

      // 2. Como PokéAPI en el listado solo devuelve name y url, pedimos en paralelo el detalle de esos 10 pokemones
      const results = await Promise.all(
        data.results.map(async (p) => {
          const detailRes = await fetch(p.url)
          const detail = await detailRes.json()
          // Retornamos un objeto limpio solo con los datos que necesitamos para las tarjetas, favoritos y recomendador
          return {
            id: detail.id,                                           // ID del Pokémon (ej: 1)
            name: detail.name,                                       // Nombre (ej: "bulbasaur")
            url: p.url,                                              // URL del recurso en PokéAPI
            height: detail.height,                                   // Altura
            weight: detail.weight,                                   // Peso
            base_experience: detail.base_experience,                 // Experiencia base
            types: detail.types.map((t) => t.type.name).join(", "),  // Tipos unidos por coma (ej: "grass, poison")
            sprite: detail.sprites?.front_default                    // Imagen miniatura frontal
          }
        })
      )
      // Devolvemos la respuesta original con el array results enriquecido
      return { ...data, results }
    },
    // Tiempo durante el cual la página se considera fresca en caché (5 minutos)
    staleTime: 1000 * 60 * 5
  })
    .then(data => {
      // Actualizamos las variables reactivas con los datos obtenidos
      personajes.value = data.results
      // Calculamos el total de páginas dividiendo el total de pokemones por 10
      count.value = Math.ceil(data.count / 10)
      next.value = data.next
      previous.value = data.previous
      currentPage.value = current
    })
    .catch(err => {
      console.log(err)
      error.value = "No se pudieron cargar los Pokémon de esta página. Verificá tu conexión e intentá de nuevo."
    })
    .finally(() => {
      cargando.value = false
    })
}

// Llamamos a fetchApi al iniciar el componente para cargar la página 1
fetchApi({ uri: "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0", current: 1 })
</script>

<template>
  <div class="container py-4">
    <!-- Encabezado de la sección con indicador de página actual -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
      <div>
        <h1 class="h2 fw-bold mb-0">Pokédex Nacional</h1>
        <p class="text-secondary small mb-0">Explorá las tarjetas, consultá a la IA y guardá tus Pokémon favoritos</p>
      </div>
      <span class="badge bg-danger rounded-pill px-3 py-2">
        Página {{ currentPage }} de {{ count || '...' }}
      </span>
    </div>

    <!-- Recomendador con IA: recibe la lista de pokemones actuales como prop -->
    <RecomendadorView :personajes="personajes" />

    <!-- Estado de carga (Requisito 7) -->
    <div v-if="cargando" class="text-center py-5 bg-white rounded-4 shadow-sm my-3">
      <div class="spinner-border text-danger mb-2" role="status"></div>
      <p class="text-secondary mb-0">Cargando página {{ currentPage }} de la Pokédex...</p>
    </div>

    <!-- Estado de error con botón Reintentar (Requisito 7) -->
    <div v-else-if="error" class="alert alert-danger rounded-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 my-3">
      <span>{{ error }}</span>
      <button class="btn btn-danger btn-sm rounded-pill px-4 fw-semibold" @click="fetchApi({ current: currentPage })">
        Reintentar
      </button>
    </div>

    <!-- Grilla de tarjetas que muestra los pokemones de la página actual -->
    <Table v-else :personajes="personajes" />

    <!-- Controles de paginación: escucha el evento @fetch para cambiar de página -->
    <Paginacion
      :count="count"
      :next="next"
      :previous="previous"
      :currentPage="currentPage"
      @fetch="fetchApi"
    />
  </div>
</template>

<style scoped></style>
