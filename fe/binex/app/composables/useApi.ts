import { ref } from "vue";
import type { ApiError } from "~/types/api-error";

export const useApi = () => {
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const call = async <T = any, E = ApiError>(
    url: string,
    method: string = "GET",
    payload: any = null,
    options: any = {},
  ): Promise<T> => {
    loading.value = true;
    error.value = null;

    const token = useCookie("auth_token").value;
    const upperMethod = method.toUpperCase();

    try {
      const response = await $fetch<T>(url, {
        baseURL: apiBaseUrl,
        method: upperMethod,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        body: ["GET", "DELETE"].includes(upperMethod) ? undefined : payload,
        params: ["GET", "DELETE"].includes(upperMethod) ? payload : undefined,
        ...options,
      });
      return response;
    } catch (err: any) {
      error.value = err.data as E;
      console.error(`[API Error ${url}]:`, err.data);
      return null as any;
    } finally {
      loading.value = false;
    }
  };

  return {
    call,
    loading,
    error,
  };
};
