export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("auth_token", { maxAge: 604800, path: '/' });
  const role = useCookie("user_role", { maxAge: 604800, path: '/' });

  // Define allowed roles for admin project (ad: Admin, sp-ad: Super Admin, ma: Manager)
  const allowedRoles = ["ad", "sp-ad", "ma"];

  // 1. Allow public pages (login, register, home for testing)
  if (to.path === "/" || to.path === "/login" || to.path === "/register") {
    // If already logged in with correct role and trying to access auth pages, redirect to dashboard root (/)
    if ((to.path === "/login" || to.path === "/register") && token.value && allowedRoles.includes(role.value)) {
      return navigateTo("/");
    }
    return;
  }

  // 2. Check for token
  if (!token.value) {
    return navigateTo("/login");
  }

  // 3. Check for roles (ad, sp-ad or ma)
  if (!allowedRoles.includes(role.value)) {
    // If role is not allowed, clear cookies and force login
    token.value = null;
    role.value = null;
    return navigateTo("/login");
  }
});
