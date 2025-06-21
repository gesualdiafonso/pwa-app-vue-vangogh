<script>
import FormularioComponent from '@/components/FormularioComponent.vue'
import obrasService from '@/services/obrasService'
import usePushNotifications from '@/usePushNotification'

export default {
  name: 'FormularioView',
  components: {
    FormularioComponent,
  },
  data() {
    return {
      obras: [],
      selectArtId: null,
      hoveredArt: null,
      resultado: null,
      push: usePushNotifications(),
    }
  },
  methods: {
    scrollNext() {
      const container = document.getElementById('customCarousel')
      container.scrollBy({
        left: 420,
        behavior: 'smooth',
      })
    },
    scrollPrev() {
      const container = document.getElementById('customCarousel')
      container.scrollBy({
        left: -420,
        behavior: 'smooth',
      })
    },
    toggleDetails(artId) {
      this.selectArtId = this.selectArtId === artId ? null : artId
    },
    calcularResultado(respuestas, resultadoFinal) {
      this.resultado = resultadoFinal
    },
  },
  created() {
    this.obras = obrasService.getAllObras()

    // Verificacmos si existe resultado antiguo con +15días
    const salvo = localStorage.getItem('vg_resultado_formulario')
    if (salvo) {
      const { timestamp } = JSON.parse(salvo)
      const diasPassados = Date.now() - timestamp / (1000 * 60 * 60 * 24)
      if (diasPassados >= 15) {
        this.push.sendNotification('Recordamos del test artístico', {
          body: '¡Han pasado 15 días desde tu última prueba! ¿Listo para descubrir una nueva obra?',
          icon: '/images/iconos/VanGoghApp192x192.png',
        })
      }
    }
  },
  mounted() {
    this.push.requestPermission()
  },
  computed: {
    selectedObra() {
      return this.obras.find((obra) => obra.id === this.selectArtId) || null
    },
  },
}
</script>
<template>
  <section class="mb-5 container container">
    <div class="position-relative mt-5">
      <!-- Botão Esquerda -->
      <button class="carousel-control-prev" type="button" @click="scrollPrev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <!-- Scroll Container -->
      <div id="customCarousel" class="d-flex overflow-auto gap-3">
        <div
          class="flex-shrink-0 text-center position-relative"
          v-for="artes in obras"
          :key="artes.id"
          style="scroll-snap-align: start"
        >
          <div
            class="w-100 h-100"
            style="cursor: pointer"
            @click="toggleDetails(artes.id)"
            @mouseover="hoveredArt = artes.id"
            @mouseleave="hoveredArt = null"
          >
            <img
              :src="artes.image"
              class="d-block"
              width="300"
              height="400"
              :alt="`${artes.name}, ${artes.portada}`"
            />
          </div>
          <!-- Overlay visivel só em caso de hover -->
          <div
            class="w-100 p-1 position-absolute bottom-0 bg-white"
            v-show="hoveredArt === artes.id"
          >
            <h3 class="mb-0 fw-semibold">{{ artes.name }}</h3>
            <span class="text-muted">{{ artes.portada }}</span>
          </div>
        </div>
      </div>
      <!-- Botão Direita -->
      <button class="carousel-control-next" type="button" @click="scrollNext">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
    <!-- Detalhes visíveis somente se selecionado -->
    <transition name="fade">
      <div
        v-if="selectedObra"
        class="mt-2 p-3text-start d-flex flex-row justify-content-center align-items-center mx-auto px-5"
      >
        <div class="w-100">
          <h3 class="fw-bold">{{ selectedObra.name }}</h3>
          <p>{{ selectedObra.descriptUno }}</p>
          <p>{{ selectedObra.descriptDos }}</p>
          <small class="text-muted">{{ selectedObra.portada }}</small>
        </div>
        <div class="w-100">
          <img
            :src="selectedObra.image"
            class="d-block mx-auto"
            width="300"
            height="400"
            :alt="`${selectedObra.name}, ${selectedObra.portada}`"
          />
        </div>
      </div>
    </transition>
  </section>
  <FormularioComponent
    ref="formComp"
    :preguntas="preguntas"
    :opciones="opciones"
    :campos="campos"
    :respuestas="respuestas"
    :resultado="resultado"
    :obras="obras"
    @calcular="calcularResultado"
    @reset="resetForm"
  />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
