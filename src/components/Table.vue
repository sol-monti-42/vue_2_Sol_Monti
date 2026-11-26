<script setup>
// Importamos el componente Item que representa cada tarjeta (Card) de un Pokémon
import Item from './Item.vue';
// Recibimos por props la lista de pokemones ("personajes") desde la vista padre
const { personajes } = defineProps(['personajes'])
// Definimos el evento cambio-favorito para avisarle a la vista de Favoritos cuando se agrega o quita un elemento
const emit = defineEmits(['cambio-favorito'])
</script>

<template>
  <!-- Grilla responsive mobile-first (1 columna en 375px, 2 en sm, 3 en md y 5 en lg) -->
  <!-- Usamos TransitionGroup para animar las tarjetas al agregar o quitar de favoritos -->
  <TransitionGroup
    name="lista-fav"
    tag="div"
    class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4 my-2"
  >
    <Item
      v-for="personaje in personajes"
      :key="personaje.name"
      :personaje="personaje"
      @cambio-favorito="emit('cambio-favorito', $event)"
    />
  </TransitionGroup>
</template>

<style scoped>
.lista-fav-enter-active,
.lista-fav-leave-active {
  transition: all 0.3s ease;
}

.lista-fav-enter-from,
.lista-fav-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(15px);
}

.lista-fav-move {
  transition: transform 0.3s ease;
}
</style>
