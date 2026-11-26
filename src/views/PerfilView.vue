<script setup>
// Importamos onMounted y ref de Vue
import { onMounted, ref } from 'vue'
// Importamos el componente Table para reutilizarlo mostrando las tarjetas de pokemones favoritos
import Table from "../components/Table.vue"

// Variable reactiva donde cargamos los datos del usuario desde localStorage
const usuario = ref(null)

// Al montarse el componente, leemos la clave 'perfil' guardada en localStorage
onMounted(() => {
  usuario.value = JSON.parse(localStorage.getItem('perfil'))
})
</script>

<template>
  <!-- Si existe un usuario logueado en localStorage, mostramos su perfil maquetado con Vuetify -->
  <v-container v-if="usuario" class="py-8">
    <v-row justify="center">
      <!-- Tarjeta superior de Perfil de Entrenador con gradiente oscuro/rojo -->
      <v-col cols="12" lg="11">
        <v-card class="trainer-header text-white pa-6" rounded="xl" elevation="4">
          <div class="d-flex flex-column flex-sm-row align-center ga-5">
            <!-- Avatar circular con la foto de Google/GitHub -->
            <v-avatar size="110" color="white" class="elevation-3">
              <v-img :src="usuario.photoURL" cover alt="Foto de perfil"></v-img>
            </v-avatar>
            <!-- Datos personales del entrenador -->
            <div class="text-center text-sm-start">
              <span class="badge bg-warning text-dark rounded-pill px-3 py-1 mb-2">
                Licencia de Entrenador
              </span>
              <h1 class="text-h5 font-weight-bold mb-1">¡Hola, {{ usuario.nombre }}!</h1>
              <p class="text-body-2 opacity-80 mb-0">{{ usuario.email }}</p>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Tarjeta inferior con la grilla de Pokemones Favoritos -->
      <v-col cols="12" lg="11" class="pt-2">
        <v-card class="bg-white text-dark" rounded="xl" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between px-6 py-4">
            <span class="text-h6 font-weight-bold">❤️ Mi Equipo de Favoritos</span>
            <span class="badge bg-danger rounded-pill">
              {{ usuario.favoritos?.length || 0 }} guardados
            </span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-5">
            <!-- Si el usuario tiene al menos un favorito guardado, renderizamos las tarjetas con Table -->
            <div v-if="usuario.favoritos?.length">
              <Table :personajes="usuario.favoritos" />
            </div>
            <!-- Si todavía no agregó favoritos, mostramos un mensaje e invitación a la Pokédex -->
            <v-sheet v-else class="bg-light text-secondary pa-6 text-center" rounded="lg">
              <p class="text-body-1 mb-3">Todavía no agregaste ningún Pokémon a tus favoritos.</p>
              <RouterLink to="/personajes" class="btn btn-danger btn-sm rounded-pill px-4">
                Explorar Pokédex
              </RouterLink>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Si no hay sesión iniciada en localStorage, invitamos a ir al Login -->
  <div v-else class="container py-5 text-center">
    <div class="card border-0 shadow-sm rounded-4 p-5 mx-auto" style="max-width: 460px;">
      <h2 class="h5 fw-bold mb-2">No has iniciado sesión</h2>
      <p class="text-secondary small mb-4">Iniciá sesión para ver tu perfil y guardar tus Pokémon favoritos.</p>
      <RouterLink to="/login" class="btn btn-danger rounded-pill px-4">Ir a Ingresar</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.trainer-header {
  background: linear-gradient(135deg, #1e293b 0%, #991b1b 100%) !important;
}
</style>
