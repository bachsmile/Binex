export default defineNuxtRouteMiddleware((to) => {
  const allowedRoles = ['ad', 'sp-ad', 'ma']
  const publicPages = ['/login', '/register']

  // Read cookies using useCookie — fully reactive and unified for SSR and CSR
  const token = useCookie('auth_token')
  const role = useCookie('user_role')

  const tokenValue = token.value
  const roleValue = role.value

  // 1. Trang public (login, register)
  if (publicPages.includes(to.path)) {
    if (tokenValue && roleValue && allowedRoles.includes(roleValue)) {
      return navigateTo('/')
    }
    return
  }

  // 2. Check token
  if (!tokenValue) {
    return navigateTo('/login')
  }

  // 3. Check role
  if (!roleValue || !allowedRoles.includes(roleValue)) {
    return navigateTo('/login')
  }
})