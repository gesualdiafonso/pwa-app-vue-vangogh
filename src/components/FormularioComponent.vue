<script>
import notificationService from '@/services/notificationService'
import ResultadoComponent from './ResultadoComponent.vue'

// Función de LocalStorage que será reutilizable
function recuperarResultado() {
  try {
    return JSON.parse(localStorage.getItem('resultadoVanGogh')) || null
  } catch (e) {
    console.error('Error al recuperar los datos:', e)
    return null
  }
}

export default {
  name: 'FormularioComponent',
  props: ['resultado', 'obras'],
  emits: ['calcular', 'reset'],
  components: {
    ResultadoComponent,
  },
  data() {
    return {
      resultadoFinal: null,
      respuestaMapId: {
        clima: {
          noche: [4],
          sol: [3, 1],
          lluvia: [2],
          viento: [6],
          entardecer: [5],
        },
        lugar: {
          cielo: [4],
          flor: [3, 1],
          casa: [2],
          puente: [6],
          cafe: [5],
        },
        color: {
          azul: [4, 2],
          amarillo: [3, 5],
          verde: [1, 6],
          naranja: [5, 3],
          gris: [2, 6],
        },
        arte: {
          espejo: [2, 4],
          cotidiano: [6, 2],
          libertad: [3, 1],
          espiritualidad: [4, 1],
          historia: [5, 2],
        },
        personalidad: {
          idealista: [4, 1],
          intenso: [3, 2],
          sensible: [2, 4],
          alegre: [3, 5],
          observador: [6, 2],
        },
        frase: {
          rotina: [6],
          universo: [4],
          energia: [3],
          pensamientos: [5],
          paz: [1, 2],
        },
      },
      preguntas: {
        clima: '¿Cuál clima te inspira más?',
        lugar: '¿Dónde te sientes más tú?',
        color: '¿Cuál color vibra contigo?',
        arte: '¿Qué te atrae en el arte?',
        personalidad: '¿Cómo te defines?',
        frase: '¿Cuál frase resuena contigo?',
      },
      opciones: {
        clima: {
          noche: 'Cielos estrellados y brisa fresca de noche',
          sol: 'Sol radiante en un campo dorado',
          lluvia: 'Lluvia suave en una tarde tranquila',
          viento: 'Viento fuerte en el campo abierto',
          entardecer: 'Atardecer naranja sobre una ciudad viva',
        },
        lugar: {
          cielo: 'Un cielo infinito lleno de emociones',
          flor: 'Una flor que brilla con fuerza propia',
          casa: 'Un rincón donde me siento en casa',
          puente: 'Un puente entre dos mundos',
          cafe: 'Un café con luces cálidas en la noche',
        },
        color: {
          azul: 'Azul profundo',
          amarrillo: 'Amarillo radiante',
          verde: 'Verde suave',
          naranja: 'Naranja quemado',
          gris: 'Gris azulado',
        },
        arte: {
          espejo: 'Un espejo del alma',
          cotidiano: 'Una forma de encontrar belleza en lo cotidiano',
          libertad: 'Un grito de libertad',
          espiritualidad: 'Una conexión espiritual con el universo',
          historia: 'Una historia silenciosa esperando ser contada',
        },
        personalidad: {
          idealista: 'Idealista',
          intenso: 'Intenso',
          sensible: 'Sensible',
          alegre: 'Alegre y lleno/a de vida',
          observador: 'Observador/a del mundo',
        },
        frase: {
          rotina: '“Veo belleza donde otros ven rutina.“',
          universo: '“Mi mente es un universo en expansión.“',
          energia: '“Mi alma vibra con la energía de la vida.“',
          pensamientos: '“A veces, me pierdo en mis pensamientos más profundos.“',
          paz: '“Encuentro paz en lo sencillo.“',
        },
      },
      campos: ['clima', 'lugar', 'color', 'arte', 'personalidad', 'frase'],
      respuestas: {
        clima: '',
        lugar: '',
        color: '',
        arte: '',
        personalidad: '',
        frase: '',
      },
      //   resultado: recuperarResultadoVanGogh(),
    }
  },
  methods: {
    // Función para calcular el resultado basado en las respuestas del usuario
    calcularResultado() {
      const incompletas = this.campos.filter((campo) => !this.respuestas[campo])
      if (incompletas.length) {
        alert('Por favor, completa todas las preguntas.')
        return
      }

      let score = {}
      for (const campo of this.campos) {
        const valor = this.respuestas[campo]
        const obras = this.respuestaMapId[campo][valor] || []
        obras.forEach((id) => {
          score[id] = (score[id] || 0) + 1
        })
      }

      const mejorId = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0]
      const resultadoFinal = this.obras.find((obra) => obra.id === parseInt(mejorId))

      this.$emit('calcular', this.respuestas, resultadoFinal)

      localStorage.setItem('resultadoVanGogh', JSON.stringify(resultadoFinal))

      this.resultadoFinal = resultadoFinal
    },
    // Función para resetear el formulario y el resultado
    resetForm() {
      this.resultadoFinal = null
      this.campos.forEach((campo) => {
        this.respuestas[campo] = ''
      })
      // Limpiar resultado del localStorage
      localStorage.removeItem('resultadoVanGogh')
    },
  },
  mounted() {
    notificationService.requestPermission()
    notificationService.notificarSeNecessario()
    const resultadoGuardado = recuperarResultado()
    if (resultadoGuardado) {
      this.resultadoFinal = resultadoGuardado
    } else if (this.resultado) {
      this.resultadoFinal = this.resultado
    }
  },
  watch: {
    resultado(newVal) {
      if (newVal === null) {
        this.resultadoFinal = null
      }
    },
  },
}
</script>

<template>
  <section class="container">
    <transition name="slider">
      <div v-if="!resultadoFinal">
        <div class="row w-100 justify-content-center align-items-center p-0">
          <div class="col-12 col-lg-6">
            <h3 class="text-center my-5 title">¿Qué Obra de Van Gogh Representa tu Esencia?</h3>
            <form @submit.prevent="calcularResultado">
              <div v-for="campo in campos" :key="campo" class="mb-3">
                <label :for="campo" class="form-label">{{ preguntas[campo] }}</label>
                <select v-model="respuestas[campo]" class="form-select" :id="campo">
                  <option disabled value="">Selecciona una opción</option>
                  <option v-for="(opcion, key) in opciones[campo]" :key="key" :value="key">
                    {{ opcion }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mt-3">Ver Resultado</button>
            </form>
          </div>
          <div class="d-none d-lg-block text-end col-lg-6">
            <img src="/public/images/altoretrato_van_gogh.jpg" alt="Van Gogh" class="img-fluid" />
          </div>
        </div>
      </div>
    </transition>
    <transition name="slider">
      <ResultadoComponent
        v-if="resultadoFinal"
        key="resultado"
        :obra="resultadoFinal"
        @reset="resetForm"
      />
    </transition>
  </section>
</template>

<style scoped>
.slider-enter-active,
.slider-leave-active {
  transition: all 0.5s ease;
  position: absolute;
  width: 100%;
}

.slider-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slider-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slider-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slider-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
