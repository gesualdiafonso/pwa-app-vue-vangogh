<script>
export default {
  name: 'ResultadoComponent',
  emits: ['reset'],
  props: ['obra'],
  data() {
    return {
      canUseWebShare: false,
    }
  },
  computed: {
    facebookShareUrl() {
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    },
  },
  mounted() {
    ;(this.currentUrl = window.location.href),
      setTimeout(() => {
        if (!this.obra || !this.obra.name) {
          console.warn('Prop obra ainda não disponível. Evite execuções reativas muito cedo.')
        }
      }, 100)
    this.canUseWebShare = !!navigator.share
  },
  methods: {
    compartir() {
      if (!this.canUseWebShare) {
        alert('Seu navegador não suporta compartilhamento nativo.')
        return
      }

      navigator
        .share({
          title: `Minha obra de Van Gogh é: ${this.obra.name}`,
          text: `${this.obra.reflection} - Descubra qual obra combina com você!`,
          url: window.location.href,
        })
        .then(() => console.log('[Web Share] Compartilhado!'))
        .catch((err) => console.warn('[Web Share] Cancelado ou falhou', err))
    },
    textoAlCompartir() {
      return encodeURIComponent(
        `¡Acabo de descubrir que mi obras es "${this.obra.name}" de Van Gogh!\n\n"${this.obra.reflection}"\n\nHaga la prueba aquí --> ${window.location.href}`,
      )
    },
  },
}
</script>
<template>
  <div class="decor-line animated slide-in-right delay-2 mt-5 w-100"></div>
  <div
    class="w-100 d-flex flex-column flex-lg-row gap-5 py-5 justify-content-center align-items-center"
  >
    <div class="w-100">
      <h3 class="text-center my-5 title">{{ obra.name }}</h3>
      <span class="text-center mb-2 fs-4 fw-bold fst-italic">{{ obra.reflection }}</span>
      <p class="text-start my-4">{{ obra.descriptUno }}</p>
      <p class="text-start">{{ obra.descriptDos }}</p>
      <button @click="$emit('reset')" class="btn btn-primary mt-4 w-100">Refazer Teste</button>

      <!-- Bloco de compartir -->
      <div class="mt-4 text-center">
        <h4 class="mb-3">Compartir Resultado</h4>
        <div class="d-flex justify-content-center gap-3">
          <!-- WhatsApp -->
          <a
            :href="`https://wa.me/?text=${textoAlCompartir()}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-success"
          >
            <v-icon name="bi-whatsapp" scale="1.5" />
          </a>
          <!-- Facebook -->
          <a
            :href="facebookShareUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            <v-icon name="bi-facebook" scale="1.5" />
          </a>
          <!-- Twitter / X -->
          <a
            :href="`https://twitter.com/intent/tweet?text=${textoAlCompartir()}`"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-info text-white"
          >
            <v-icon name="bi-twitter" scale="1.5" />
          </a>
          <!-- SMS -->
          <a :href="`sms:?&body=${textoAlCompartir()}`" class="btn btn-dark"> SMS </a>
          <!-- Email -->
          <a
            :href="`mailto:?subject=Mi Obra de Van Gogh&body=${textoAlCompartir()}`"
            class="btn btn-secondary"
          >
            <v-icon name="co-minutemailer" scale="1.5" />
          </a>
          <!-- Web Share API -->
          <button class="btn btn-outline-primary" @click="compartir">
            <v-icon name="co-telegram-plane" scale="1.5" />
          </button>
        </div>
      </div>
    </div>
    <div class="w-100">
      <img :src="obra.image" :alt="obra.portada" class="img-fluid w-100" />
    </div>
  </div>
  <div class="decor-line animated slide-in-right delay-2 mt-5 w-100"></div>
</template>
