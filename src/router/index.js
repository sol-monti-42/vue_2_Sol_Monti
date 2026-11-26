// Importamos las funciones para crear el enrutador y manejar el historial del navegador (URLs limpias sin #)
import { createRouter, createWebHistory } from "vue-router"

// Creamos la instancia del router
const router = createRouter({
  // Usa la API History del navegador para navegar entre URLs sin recargar la página
  history: createWebHistory(),
  // Definición de todas las rutas de la aplicación
  routes: [
    {
      // Ruta de inicio (muestra bienvenida y listado de Pokémon destacados obtenidos con fetch)
      path: "/",
      component: () => import("@/views/HomeView.vue")
    },
    {
      // Ruta del catálogo completo paginado de pokemones
      path: "/personajes",
      alias: ["/pokemones"],
      component: () => import("@/views/PersonajesView.vue")
    },
    {
      // Ruta para ver el detalle de un Pokémon específico (/detalle/:id) con alias /personaje/:id y /pokemon/:id
      path: "/detalle/:id",
      alias: ["/personaje/:id", "/pokemon/:id"],
      component: () => import("@/views/DetalleView.vue")
    },
    {
      // Ruta del buscador por nombre y filtro por tipo y altura
      path: "/search",
      component: () => import("@/views/SearchView.vue")
    },
    {
      // Ruta de favoritos (/favoritos) donde se listan los Pokémon guardados y se pueden quitar
      path: "/favoritos",
      component: () => import("@/views/FavoritosView.vue")
    },
    {
      // Ruta de inicio de sesión con Google / GitHub
      path: "/login",
      component: () => import("@/views/LoginView.vue")
    },
    {
      // Ruta del perfil del usuario logueado
      path: "/perfil",
      component: () => import("@/views/PerfilView.vue")
    },
    {
      // Ruta para el componente recomendador con IA
      path: "/recomendador",
      component: () => import("@/views/RecomendadorView.vue")
    },
    {
      // Ruta comodín ("no encontrado" / 404) que redirige automáticamente al inicio
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }
  ]
})

// Exportamos el router para usarlo en main.js
export default router
