export default defineNuxtRouteMiddleware((to) => {
  let userAgent = ''
  
  // Kiểm tra môi trường Server hoặc Client để lấy User-Agent
  if (import.meta.server) {
    const headers = useRequestHeaders(['user-agent'])
    userAgent = headers['user-agent'] || ''
  } else {
    userAgent = navigator.userAgent
  }

  // Regex nhận diện thiết bị di động phổ biến
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isMobileRoute = to.path.startsWith('/mobile/') || to.path === '/mobile'

  // 1. Nếu là Mobile nhưng đang ở route Web -> Chuyển sang Mobile
  if (isMobile && !isMobileRoute) {
    const mobilePath = to.path === '/' ? '/mobile' : `/mobile${to.path}`
    return navigateTo(mobilePath)
  }

  // 2. Nếu là Desktop nhưng đang ở route Mobile -> Chuyển về Web
  if (!isMobile && isMobileRoute) {
    let webPath = to.path === '/mobile' ? '/' : to.path.replace(/^\/mobile/, '')
    // Đảm bảo không bị trống path
    if (!webPath) webPath = '/'
    return navigateTo(webPath)
  }
})
