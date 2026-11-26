import {
  getAI,                  // Inicia el servicio de Inteligencia Artificial de Firebase (Firebase AI Logic)
  getGenerativeModel,     // Permite elegir el modelo generativo (Gemini)
  GoogleAIBackend         // Usa el backend de Google administrado por Firebase (sin exponer API key de Gemini)
} from "firebase/ai"
// Importamos la app inicializada de Firebase
import { app } from "./firebase.js"

// Inicializamos el servicio de IA vinculado a nuestro proyecto de Firebase en el plan gratuito Spark
const ia = getAI(app, { backend: new GoogleAIBackend() })
// Configuramos el modelo Gemini activo en Firebase AI
const model = getGenerativeModel(ia, { model: "gemini-3.5-flash-lite" })

// Función que recibe el mensaje del usuario y consulta al modelo Gemini
export async function recomendar(mensaje) {
  // Armamos el prompt dándole contexto e instrucciones al modelo para que solo recomiende pokemones de la lista cargada
  const prompt = "Sos un recomendador de Pokémon dentro de una pagina web, solo debes responder en texto plano y respuestas menores a 80 palabras, no inventes pokemones: " + mensaje
  // Enviamos el prompt a Gemini y esperamos la respuesta
  const respuesta = await model.generateContent(prompt)
  // Extraemos y devolvemos el texto plano de la respuesta
  return respuesta.response.text()
}
