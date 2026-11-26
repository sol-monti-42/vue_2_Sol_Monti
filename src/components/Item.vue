<script setup>
// Importamos onMounted (ciclo de vida), ref (estado reactivo) y computed (propiedades calculadas)
import { onMounted, ref, computed } from 'vue'
// Importamos useRoute para saber en qué ruta estamos y ocultar el botón de quitar en /perfil
import { useRoute } from 'vue-router'

// Obtenemos la ruta actual
const route = useRoute()

// Recibimos el objeto del Pokémon actual mediante la prop "personaje"
const { personaje } = defineProps(['personaje'])
// Definimos el evento para notificar cuando cambia el estado de favorito
const emit = defineEmits(['cambio-favorito'])

// Calculamos el ID del Pokémon: usa personaje.id si existe, o lo extrae del final de la URL de PokéAPI
const id = computed(() => personaje?.id || personaje?.url?.split('/').filter(Boolean).pop())

// Calculamos la URL de la imagen (sprite) del Pokémon
const sprite = computed(
  () =>
    personaje?.sprite ||
    (id.value ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id.value}.png` : '')
)

// Estado reactivo booleano para saber si este Pokémon ya está guardado en favoritos
const isFavorito = ref(false)

// Cuando el componente se monta en pantalla, verificamos en localStorage si ya es favorito
onMounted(() => {
  // Leemos el usuario guardado en localStorage bajo la clave 'perfil'
  const usuario = JSON.parse(localStorage.getItem('perfil'))
  // Si el usuario tiene una lista de favoritos y este Pokémon está adentro, marcamos isFavorito en true
  if (usuario?.favoritos?.find((p) => p.name == personaje.name)) {
    isFavorito.value = true
  }
})

// Función para agregar o quitar este Pokémon de la lista de favoritos en localStorage
const agregarfavorito = (personaje) => {
  // Obtenemos los datos actuales del perfil desde localStorage (o creamos uno local si no inició sesión)
  const usuario = JSON.parse(localStorage.getItem('perfil')) || {
    nombre: 'Entrenador Pokémon',
    email: '',
    photoURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
    favoritos: []
  }
  // Si el usuario todavía no tiene el array de favoritos creado, lo inicializamos vacío
  if (!usuario.favoritos) {
    usuario.favoritos = []
  }
  // Comprobamos si el Pokémon ya está en favoritos
  if (usuario.favoritos.find((p) => p.name == personaje.name)) {
    // Si ya estaba, lo quitamos filtrando todos los que tengan distinto nombre
    usuario.favoritos = usuario.favoritos.filter((p) => p.name != personaje.name)
    isFavorito.value = false
  } else {
    // Si no estaba, lo agregamos al array de favoritos
    usuario.favoritos.push(personaje)
    isFavorito.value = true
  }
  // Guardamos el objeto usuario actualizado nuevamente en localStorage
  localStorage.setItem('perfil', JSON.stringify(usuario))
  // Emitimos el evento para que la vista /favoritos actualice su lista en tiempo real
  emit('cambio-favorito', personaje)
}
</script>

<template>
  <!-- Columna de la grilla para esta tarjeta de Pokémon -->
  <div class="col">
    <div class="card poke-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <!-- Encabezado de la tarjeta con el número de ID y botón de favorito -->
      <div class="d-flex justify-content-between align-items-center px-3 pt-3">
        <span class="badge bg-dark bg-opacity-10 text-secondary rounded-pill fw-bold">
          #{{ String(id).padStart(3, '0') }}
        </span>
        <!-- Botón para agregar o quitar de favoritos (se oculta en /perfil, pero se muestra en /favoritos y demás vistas) -->
        <button
          v-if="route.path !== '/perfil'"
          type="button"
          class="btn btn-sm rounded-pill px-2 py-0 fw-semibold"
          :class="isFavorito ? 'btn-danger' : 'btn-outline-danger'"
          @click="agregarfavorito(personaje)"
        >
          <span v-if="isFavorito">♥ Quitar</span>
          <span v-else>♡ Favorito</span>
        </button>
      </div>

      <!-- Círculo central con la imagen (sprite) del Pokémon -->
      <div class="text-center my-2">
        <div class="sprite-circle mx-auto d-flex align-items-center justify-content-center">
          <img v-if="sprite" :src="sprite" :alt="personaje.name" width="84" height="84" class="poke-img" />
        </div>
      </div>

      <!-- Cuerpo de la tarjeta con nombre, tipos y medidas -->
      <div class="card-body pt-0 text-center d-flex flex-column">
        <!-- Nombre del Pokémon -->
        <h5 class="card-title fw-bold text-capitalize mb-1">{{ personaje.name }}</h5>

        <!-- Etiqueta con el tipo o tipos del Pokémon -->
        <p class="mb-3">
          <span class="badge bg-warning text-dark text-capitalize rounded-pill px-3">
            {{ personaje.types || 'Pokémon' }}
          </span>
        </p>

        <!-- Cuadro con Altura y Peso -->
        <div class="row g-1 bg-light rounded-3 py-2 mb-3 small text-secondary">
          <div class="col-6 border-end">
            <div class="fw-semibold text-dark">{{ personaje.height ?? '-' }} dm</div>
            <div class="text-muted" style="font-size: 0.75rem;">Altura</div>
          </div>
          <div class="col-6">
            <div class="fw-semibold text-dark">{{ personaje.weight ?? '-' }} hg</div>
            <div class="text-muted" style="font-size: 0.75rem;">Peso</div>
          </div>
        </div>

        <!-- Botón inferior que navega a la ruta de detalle /detalle/:id -->
        <RouterLink :to="'/detalle/' + id" class="btn btn-dark btn-sm rounded-pill mt-auto w-100 fw-semibold">
          Ver ficha →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poke-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.poke-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.sprite-circle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: radial-gradient(circle, #fef3c7 0%, #f1f5f9 75%);
}

.poke-card:hover .poke-img {
  transform: scale(1.12);
}
.poke-img {
  transition: transform 0.2s ease;
}
</style>
