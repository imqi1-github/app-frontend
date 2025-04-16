import {onMounted, ref} from "vue";

export function usePWAInstall() {
  const deferredPrompt = ref(null)
  const canInstall = ref(false)

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      canInstall.value = true
    })
  })

  const installApp = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt()
      const choiceResult = await deferredPrompt.value.userChoice
      if (choiceResult.outcome === 'accepted') {
        console.log('用户接受安装')
      } else {
        console.log('用户取消安装')
      }
      deferredPrompt.value = null
      canInstall.value = false
    }
  }

  return {
    canInstall,
    installApp,
  }
}