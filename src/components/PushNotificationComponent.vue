<template>
  <div class="push-wrapper">
    <button @click="ativarNotificacao">🔔 Activar Notificaciones</button>
    <p v-if="permission === 'granted'">Notificaciones activas!</p>
    <p v-else-if="permission === 'denied'">Notificaciones bloqueadas!</p>
  </div>
</template>

<script>
export default {
  name: 'PushNotification',
  data() {
    return {
      permission: Notification.permission,
    }
  },
  methods: {
    async ativarNotificacao() {
      try {
        const result = await Notification.requestPermission()
        this.permission = result

        if (result === 'granted') {
          this.enviarNotificacao('Van Gogh está com usted! 🌌', {
            body: 'La obra ideal para vos ya te esperta.',
            icon: '/images/iconos/VanGoghApp192x192.png',
          })
        }
      } catch (err) {
        console.error('Erro al solicitar permisiones:', err)
      }
    },
    enviarNotificacao(titulo, opcoes) {
      if (this.permission === 'granted') {
        new Notification(titulo, opcoes)
      } else {
        console.warn('Permisión negada para notificaciones.')
      }
    },
  },
}
</script>

<style scoped>
.push-wrapper {
  padding: 1rem;
  background: #fdb74e52;
  border-radius: 10px;
  margin: 1rem auto;
  text-align: center;
}
button {
  background: #f0982a;
  border: none;
  color: white;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
