import { ref } from 'vue'

export default function usePushNotifications() {
  const permission = ref(Notification.permission)

  const requestPermission = async () => {
    const result = await Notification.requestPermission()
    permission.value = result
    return result
  }

  const sendNotification = (title, options = {}) => {
    if (permission.value !== 'granted') {
      console.warn('🔕 Permissão negada para notificações.')
      return
    }

    // 🔁 Compatível com navegadores com ou sem SW ativo
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, options)
        })
        .catch((err) => {
          console.warn('⚠️ Erro ao usar SW, caindo para Notification:', err)
          new Notification(title, options)
        })
    } else {
      // Fallback direto se não tiver SW ou ainda não ativo
      new Notification(title, options)
    }
  }

  return {
    permission,
    requestPermission,
    sendNotification,
  }
}
