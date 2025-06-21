<script>
import InstallButtonComponent from '@/components/InstallButtonComponent.vue'
import PushNotificationComponent from '@/components/PushNotificationComponent.vue'
import { RouterLink } from 'vue-router'
export default {
  name: 'HomeView',
  components: {
    RouterLink,
    InstallButtonComponent,
    PushNotificationComponent,
  },
  data() {
    return {
      showSuccess: false,
      showWarning: false,
    }
  },
  methods: {
    showSuccessAlert() {
      this.showSuccess = true
      this.showWarning = false
    },
    showAlreadyInstalledAlert() {
      this.showWarning = true
      this.showSuccess = false
    },
  },
}
</script>

<template>
  <section class="header">
    <div class="container d-flex flex-column flex-lg-row">
      <div class="mt-5 d-flex flex-column justify-content-center contenedor">
        <div>
          <span class="subtitle">Sumérjase en los colores del alma de Vincent Van Gogh.</span>
        </div>
        <div>
          <h2 class="title">Qué Obra de Van Gogh representa tu esencia?</h2>
        </div>
        <div>
          <p class="subtitle-inform">
            Averigua con este test de arte qué cuadro de Van Gogh refleja tus emociones, tu forma de
            ver el mundo y la intensidad de tu alma creativa.
          </p>
          <div class="d-flex flex-column gap-3">
            <div class="d-flex flex-column flex-md-row gap-3">
              <RouterLink class="btn btn btn-outline-info text-center" to="/formulario"
                >Descubra...
              </RouterLink>
              <InstallButtonComponent
                @app-installed="showSuccessAlert"
                @app-already-installed="showAlreadyInstalledAlert"
              />
            </div>

            <div class="d-flex flex-column">
              <!-- Alerta de sucesso -->
              <div v-if="showSuccess" class="alert alert-success mt-3" role="alert">
                <h4 class="alert-heading">Aplicativo Instalado!</h4>
                <p>
                  Felicitaciones! El aplicativo de Van Gogh fue instalado com suceso. Ahora lo
                  puedes acceder sus pinturas, refazer seu questionário pessoal e compartilhar com
                  seus amigos!
                </p>
                <hr />
                <p class="mb-0">Aproveche la experiência completa!</p>
              </div>

              <!-- Alerta de já instalado -->
              <div v-if="showWarning" class="alert alert-warning mt-3" role="alert">
                <strong>Atención!</strong> El aplicativo ya se encuentra instalado en su
                dispositivo.
              </div>
            </div>
          </div>
          <div>
            <PushNotificationComponent />
          </div>
        </div>
      </div>
      <div class="img-position">
        <img src="/public/images/altoretrato_van_gogh.jpg" alt="" />
      </div>
      <span class="moveleft">Vincent Van Gogh</span>
      <span class="moveright">Vincent Van Gogh</span>
    </div>
  </section>
</template>
