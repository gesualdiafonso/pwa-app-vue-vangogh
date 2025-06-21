import usePushNotifications from '@/usePushNotification'

const push = usePushNotifications()

export default {
  requestPermission() {
    push.requestPermission()
  },

  notificarAgora(titulo, body) {
    push.sendNotification(titulo, {
      body,
      icon: '/images/iconos/VanGoghApp192x192.png',
      vibrate: [100, 50, 100],
    })
  },

  agendarRecordatorio(delay = 1000 * 60 * 60 * 24 * 15) {
    // Garante que vai funcionar mesmo com PWA offline e o app aberto
    setTimeout(() => {
      push.sendNotification('Tu esencia artística está esperando...', {
        body: 'Han pasado 15 días desde tu test. ¿Quieres ver si algo ha cambiado?',
        icon: '/images/iconos/VanGoghApp192x192.png',
        vibrate: [100, 50, 100],
      })
    }, delay)
  },

  verificarSeDeveNotificar() {
    const salvo = localStorage.getItem('vg_resultado_formulario')
    if (!salvo) return false

    try {
      const { timestamp } = JSON.parse(salvo)
      const diasPassados = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
      return diasPassados >= 15
    } catch (e) {
      console.warn('Erro ao verificar notificação agendada:', e)
      return false
    }
  },

  notificarSeNecessario() {
    if (this.verificarSeDeveNotificar()) {
      this.notificarAgora(
        '¡Recordamos del test artístico!',
        'Han pasado 15 días desde tu última prueba. ¿Listo para una nueva obra?',
      )
    }
  },
}
