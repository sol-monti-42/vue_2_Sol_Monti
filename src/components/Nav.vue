<script setup>
// Importamos RouterLink para crear enlaces de navegación sin recargar la página
import { RouterLink } from 'vue-router'
// Importamos el componente de formulario de búsqueda que va dentro del navbar
import Search from './Search.vue'
</script>

<template>
  <!-- Barra de navegación con gradiente rojo estilo Pokédex -->
  <nav class="navbar navbar-expand-lg navbar-dark poke-navbar shadow-sm py-3">
    <div class="container">
      <!-- Marca o logo con ícono de Pokébola que lleva al inicio ("/") -->
      <RouterLink class="navbar-brand fw-bold d-flex align-items-center gap-2 fs-4" to="/">
        <span class="pokeball-dot"></span>
        <!-- Slot con nombre "logo": muestra lo que le pase App.vue o "NavBar" por defecto -->
        <slot name="logo">NavBar</slot>
      </RouterLink>

      <!-- Botón hamburguesa de Bootstrap para pantallas chicas (móviles de 375px) -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Contenedor colapsable con los enlaces de navegación y el buscador -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
          <!-- Enlace a la vista Home -->
          <li class="nav-item">
            <RouterLink class="nav-link px-3 rounded-pill" active-class="active-poke-link" to="/">Inicio</RouterLink>
          </li>
          <!-- Enlace al listado paginado de Pokemones -->
          <li class="nav-item">
            <RouterLink class="nav-link px-3 rounded-pill" active-class="active-poke-link" to="/personajes">Pokédex</RouterLink>
          </li>
          <!-- Enlace al buscador con filtro por tipo y altura -->
          <li class="nav-item">
            <RouterLink class="nav-link px-3 rounded-pill" active-class="active-poke-link" to="/search">Filtros</RouterLink>
          </li>
          <!-- Enlace a la vista de Favoritos -->
          <li class="nav-item">
            <RouterLink class="nav-link px-3 rounded-pill" active-class="active-poke-link" to="/favoritos">Favoritos</RouterLink>
          </li>
          <!-- Enlace a la vista de Perfil -->
          <li class="nav-item">
            <RouterLink class="nav-link px-3 rounded-pill" active-class="active-poke-link" to="/perfil">Mi Perfil</RouterLink>
          </li>
          <!-- Enlace a la vista de Login -->
          <li class="nav-item">
            <RouterLink class="nav-link px-3 rounded-pill" active-class="active-poke-link" to="/login">Ingresar</RouterLink>
          </li>
        </ul>
        <!-- Componente buscador ubicado a la derecha del navbar -->
        <Search />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.poke-navbar {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
}

.pokeball-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #38bdf8;
  border: 3px solid #ffffff;
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.8);
  display: inline-block;
}

.active-poke-link {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff !important;
  font-weight: 600;
}
</style>
