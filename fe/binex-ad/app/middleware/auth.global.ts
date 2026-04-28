export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("auth_token");
  const role = useCookie("user_role");

  // Define allowed roles for admin project
  const allowedRoles = ["ad", "sp-ad"];

  // 1. Allow public pages (login, register, home)
  if (to.path === "/" || to.path === "/login" || to.path === "/register") {
    // If already logged in with correct role and trying to access auth pages, redirect to dashboard? 
    // Actually if they go to / let them see it for now since it's the hero section.
    if ((to.path === "/login" || to.path === "/register") && token.value && allowedRoles.includes(role.value)) {
      return navigateTo("/dashboard"); // Or leave it alone. Let's just not redirect if they hit /
    }
    return;
  }

  // 2. Check for token
  if (!token.value) {
    return navigateTo("/login");
  }

  // 3. Check for roles (ad or sp-ad)
  if (!allowedRoles.includes(role.value)) {
    // If role is not allowed, clear cookies and force login
    // In a real app, you might redirect to an "unauthorized" page instead
    token.value = null;
    role.value = null;
    return navigateTo("/login");
  }
});
