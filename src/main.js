// Importamos la función createApp de Vue para inicializar nuestra aplicación
import { createApp } from 'vue'
// Importamos el componente raíz de la aplicación
import App from './App.vue'
// Importamos los estilos CSS de Bootstrap para el diseño general
import "bootstrap/dist/css/bootstrap.min.css"
// Importamos el JavaScript de Bootstrap (necesario para el menú desplegable responsive, modales, etc.)
import "bootstrap/dist/js/bootstrap.bundle.min.js"
// Importamos la configuración de rutas (Vue Router)
import router from './router/index.js'
// Importamos el plugin de TanStack Vue Query para manejar caché de peticiones a la API
import { VueQueryPlugin } from "@tanstack/vue-query"

// Importamos los estilos base de Vuetify (usado en la vista de Perfil)
import 'vuetify/styles'
// Importamos la función para crear la instancia de Vuetify
import { createVuetify } from 'vuetify'
// Importamos todos los componentes de Vuetify (v-card, v-container, v-avatar, etc.)
import * as components from 'vuetify/components'
// Importamos todas las directivas de Vuetify
import * as directives from 'vuetify/directives'

// Creamos la instancia de Vuetify pasándole los componentes y directivas
const vuetify = createVuetify({
  components,
  directives,
})

// Creamos la aplicación Vue con App.vue, registramos los plugins y la montamos en el div #app del index.html
createApp(App)
  .use(router)         // Habilita el sistema de rutas (<RouterView> y <RouterLink>)
  .use(VueQueryPlugin) // Habilita el cliente de caché de Vue Query en toda la app
  .use(vuetify)        // Habilita los componentes visuales de Vuetify
  .mount('#app')       // Renderiza la aplicación dentro del elemento con id="app"
