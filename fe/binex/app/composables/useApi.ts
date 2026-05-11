import axios from "axios";
import { ref } from "vue";
import type { ApiError } from "~/types/api-error";

export const useApi = () => {
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const instance = axios.create({
    baseURL: apiBaseUrl,
  });

  const call = async <T = any, E = ApiError>(
    url: string,
    method: string = "GET",
    payload: any = null,
    options: { serverOnly?: boolean, [key: string]: any } = {},
  ): Promise<T> => {
    // 1. Guard for server-only APIs
    if (options.serverOnly && import.meta.client) {
      console.warn(`[API Skip] ${url} is server-only.`);
      return null as any;
    }

    loading.value = true;
    error.value = null;

    // 2. Automatic SSR Configuration
    const isSSR = import.meta.server;
    const finalBaseUrl = (isSSR ? (config.apiServerUrl || config.public.apiBaseUrl) : config.public.apiBaseUrl) as string;
    const ssrHeaders = isSSR ? useRequestHeaders(['cookie', 'authorization']) : {};

    const instance = axios.create({
      baseURL: finalBaseUrl,
    });

    const token = useCookie("auth_token").value;
    const upperMethod = method.toUpperCase();

    try {
      const response = await instance.request({
        url,
        method: upperMethod,
        headers: {
          ...ssrHeaders,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        data: ["GET", "DELETE"].includes(upperMethod) ? undefined : payload,
        params: ["GET", "DELETE"].includes(upperMethod) ? payload : undefined,
        ...options,
      });
      return response.data as T;
    } catch (err: any) {
      error.value = err.response?.data as E;
      console.error(`[API Error ${url}]:`, err.response?.data);
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
