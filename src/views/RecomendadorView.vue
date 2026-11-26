<script setup>
// Importamos ref para guardar la respuesta de texto que devuelve la IA y el estado de carga
import { ref } from "vue"
// Importamos la función recomendar desde el servicio de Firebase AI Logic (firebase/ai)
import { recomendar } from '@/services/recomendador'

// Variable reactiva donde se almacena la respuesta generada por la IA
const response = ref("")
// Variable reactiva para saber si ocurrió un error (como límite de cuota del plan Spark)
const esErrorCuota = ref(false)
// Variable reactiva para mostrar un mensaje mientras la IA está procesando
const cargando = ref(false)

// Recibimos por props la lista de pokemones que se están mostrando actualmente en pantalla
const props = defineProps(['personajes'])

// Función asíncrona que se ejecuta al enviar el formulario de consulta
const consultar = async (e) => {
  // Obtenemos el texto que escribió el usuario en el input con name="pregunta"
  const pregunta = e.target.pregunta.value.trim()
  if (!pregunta) return

  cargando.value = true
  esErrorCuota.value = false
  response.value = "Consultando a Gemini AI..."

  try {
    // Llamamos al servicio de IA pasándole la pregunta junto con el JSON de los pokemones cargados en pantalla
    const respuesta = await recomendar(
      pregunta +
      " responde informacion solo de estos pokemones: " +
      JSON.stringify(props.personajes)
    )
    // Guardamos el texto devuelto por Gemini para mostrarlo en la vista
    response.value = respuesta
  } catch (error) {
    console.log(error)
    const msg = String(error?.message || error || "").toLowerCase()
    // Si se alcanza el límite de uso del plan gratuito Spark (código 429 / quota), mostramos un mensaje claro
    if (msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted") || msg.includes("high demand")) {
      esErrorCuota.value = true
      response.value = "⚠️ Se alcanzó el límite de cuota gratuita de Gemini AI (Plan Spark de Firebase). Por favor, esperá unos segundos antes de realizar otra consulta."
    } else {
      esErrorCuota.value = true
      response.value = "Ocurrió un error al consultar a la IA. Verificá tu conexión e intentá de nuevo."
    }
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <!-- Panel del Asistente IA con diseño moderno oscuro -->
  <div class="ai-panel rounded-4 p-3 p-md-4 mb-4 text-white shadow-sm">
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="badge bg-warning text-dark rounded-pill">Gemini AI • Firebase AI Logic</span>
      <span class="fw-bold small text-uppercase">Asistente Recomendador Pokédex</span>
    </div>

    <!-- Formulario para enviarle una pregunta al recomendador sin recargar la página (@submit.prevent) -->
    <form class="d-flex flex-column flex-sm-row gap-2" @submit.prevent="consultar">
      <input
        class="form-control rounded-pill border-0 px-3"
        type="text"
        name="pregunta"
        id="pregunta"
        placeholder="Preguntale a la IA sobre los Pokémon cargados (ej: ¿cuál me recomendás de tipo fuego?)..."
      />
      <button class="btn btn-warning rounded-pill fw-semibold px-4" type="submit" :disabled="cargando">
        {{ cargando ? 'Pensando...' : 'Consultar' }}
      </button>
    </form>

    <!-- Mostramos la respuesta de la IA o la alerta clara si se alcanzó el límite de cuota gratuita -->
    <div
      v-if="response"
      class="mt-3 p-3 rounded-3 small"
      :class="esErrorCuota ? 'bg-danger bg-opacity-75 text-white fw-semibold' : 'bg-dark bg-opacity-50 text-warning'"
    >
      {{ response }}
    </div>
  </div>
</template>

<style scoped>
.ai-panel {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
}
</style>
