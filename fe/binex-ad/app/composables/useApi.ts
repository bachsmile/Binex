import { ref } from "vue";
import type { ApiError } from "~/types/api-error";

export const useApi = () => {
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  const config = useRuntimeConfig();

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

    const token = useCookie("auth_token").value;
    const upperMethod = method.toUpperCase();

    const fetchOptions: any = {
      method: upperMethod,
      baseURL: config.public.apiBaseUrl,
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    };

    if (payload) {
      if (["GET", "DELETE"].includes(upperMethod)) {
        fetchOptions.params = payload;
      } else {
        fetchOptions.body = payload;
      }
    }

    try {
      const response = await $fetch(url, fetchOptions);
      
      // Transform successful response to comply with ApiResponse (status: boolean)
      if (response && typeof response === "object") {
        const resObj = response as any;
        const hasStatusCode = "statusCode" in resObj;
        
        if (hasStatusCode) {
          const isSuccess = resObj.statusCode >= 200 && resObj.statusCode < 300;
          return {
            status: isSuccess,
            message: resObj.message || "Thao tác thành công",
            data: resObj.data !== undefined ? resObj.data : resObj,
            ...(resObj.total !== undefined ? { total: resObj.total } : {}),
          } as any as T;
        }
        
        if (!("status" in resObj)) {
          resObj.status = true;
        }
      }
      
      return response as T;
    } catch (err: any) {
      error.value = err.data as E;
      console.error(`[API Error ${url}]:`, err.data);
      
      // If the server returned a structured response, return it directly so the caller can check response.status
      if (err.data && typeof err.data === "object" && "status" in err.data) {
        return err.data as T;
      }
      
      // Fallback structured ApiResponse for generic network / server failures
      return {
        status: false,
        message: err.data?.message || err.message || "Đã có lỗi hệ thống xảy ra",
        data: null,
      } as any as T;
    } finally {
      loading.value = false;
    }
  };

  // Backward compatibility alias for the admin portal codebase
  const callApi = async (method: string, url: string, payload: any = null, options: any = {}) => {
    return call(url, method, payload, options);
  };

  return {
    call,
    callApi,
    loading,
    error,
  };
};
