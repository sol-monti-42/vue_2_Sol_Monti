<script setup>
// Importamos el componente de la barra de navegación superior
import Nav from './components/Nav.vue';
</script>

<template>
  <div class="app-wrapper d-flex flex-column min-vh-100">
    <!-- Encabezado principal que se mantiene visible en todas las páginas -->
    <header>
      <!-- Usamos el componente Nav y le inyectamos el nombre en el slot llamado "logo" -->
      <Nav>
        <template v-slot:logo>PokéApp</template>
      </Nav>
    </header>

    <!-- Contenido principal de cada página -->
    <!-- RouterView envuelve la vista en Transition (animación entre rutas) y KeepAlive (caché de vistas) -->
    <!-- Nota: dentro de Transition y KeepAlive no van comentarios HTML porque aceptan un único elemento hijo -->
    <div class="flex-grow-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <KeepAlive :include="['HomeView', 'PersonajesView']" :exclude="['DetalleView', 'SearchView', 'PerfilView', 'FavoritosView']">
            <component :is="Component"></component>
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>

    <!-- Pie de página con estilo Pokédex -->
    <footer class="poke-footer text-center py-3 mt-auto">
      <small>PokéApp Vue 3 • Datos obtenidos de PokéAPI</small>
    </footer>
  </div>
</template>

<style>
.app-wrapper {
  background-color: #f3f4f8;
  color: #1e293b;
}

.poke-footer {
  background-color: #1e293b;
  color: #94a3b8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
