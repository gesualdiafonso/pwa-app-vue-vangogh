<script>
export default {
  name: 'InstallButtonComponent',
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false,
      alreadyInstalled: false,
      modalMessage: '',
      modal: null,
    }
  },
  mounted() {
    // Escuta o evento do Chrome quando o app está pronto pra instalar
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallButton = true
      console.log('[PWA] beforeinstallprompt capturado')
    })

    // Quando o app é instalado, registramos no IndexedDB
    window.addEventListener('appinstalled', async () => {
      console.log('[PWA] Aplicativo instalado com sucesso!')
      this.showInstallButton = false
      this.alreadyInstalled = true
      await this.saveInstallStatusIndexedDB()
      this.$emit('app-installed')
      this.sendInstallNotification()
    })

    this.checkIfAlreadyInstalled()
    setInterval(this.checkIfAlreadyInstalled, 5000) // segurança para navegadores que demoram a detectar
  },
  methods: {
    async checkIfAlreadyInstalled() {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true

      const wasInstalled = await this.getInstallStatusFromIndexedDB()

      if ((isStandalone || wasInstalled) && !this.alreadyInstalled) {
        this.alreadyInstalled = true
        this.showInstallButton = true
        this.$emit('app-already-installed')
      }
    },

    handleClick() {
      const modalEl = document.getElementById('confirmInstallModal')
      if (!modalEl) return
      document.activeElement?.blur()
      this.modal = new window.bootstrap.Modal(modalEl)
      this.modalMessage = this.alreadyInstalled
        ? 'El aplicativo ya está instalado. ¿Desea abrirlo?'
        : '¿Desea instalar el aplicativo de Van Gogh?'
      this.modal.show()
    },

    async installApp() {
      if (this.alreadyInstalled) {
        // Redireciona para abrir o app (standalone ou nova aba)
        window.open(window.location.origin, '_blank', 'noopener')
        return
      }

      if (!this.deferredPrompt) return

      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('[PWA] Usuário aceitou a instalação')
        await this.saveInstallStatusIndexedDB()
        this.$emit('app-installed')
      } else {
        console.log('[PWA] Usuário rejeitou a instalação')
        alert('Instalação cancelada.')
      }

      this.deferredPrompt = null
    },

    async saveInstallStatusIndexedDB() {
      const db = await this.openDB()
      const tx = db.transaction('settings', 'readwrite')
      const store = tx.objectStore('settings')
      await store.put(true, 'pwaInstalled')
      await tx.done
    },

    async getInstallStatusFromIndexedDB() {
      try {
        const db = await this.openDB()
        const tx = db.transaction('settings', 'readonly')
        const store = tx.objectStore('settings')
        return (await store.get('pwaInstalled')) === true
      } catch {
        return false
      }
    },

    openDB() {
      return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('VanGoghApp', 1)
        request.onerror = () => reject()
        request.onsuccess = () => resolve(request.result)
        request.onupgradeneeded = (event) => {
          const db = event.target.result
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings')
          }
        }
      })
    },

    sendInstallNotification() {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('App instalado com sucesso!', {
            body: 'Você pode abrir o aplicativo de Van Gogh direto da sua tela inicial.',
            icon: '/images/icono/VanGoghApp192x192.png',
            badge: '/images/icono/VanGoghApp192x192.png',
            vibrate: [100, 50, 100],
          })
        })
      }
    },
  },
}
</script>

<template>
  <div>
    <button class="btn btn-outline-info text-center" v-if="showInstallButton" @click="handleClick">
      {{ alreadyInstalled ? 'Abrir App' : 'Instalar App' }}
    </button>

    <!-- Modal de Confirmação -->
    <div
      class="modal fade"
      id="confirmInstallModal"
      tabindex="-1"
      aria-labelledby="confirmInstallModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="confirmInstallModalLabel">
              {{ alreadyInstalled ? 'Abrir App?' : 'Instalar App?' }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fechar"
            ></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-primary" @click="installApp">
              {{ alreadyInstalled ? 'Abrir App' : 'Instalar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal-backdrop {
  z-index: 0 !important;
}
</style>
