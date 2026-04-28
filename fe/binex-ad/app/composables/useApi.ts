export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');

  /**
   * Common API caller
   * @param method HTTP Method (GET, POST, etc.)
   * @param url Endpoint URL
   * @param payload Body data (for POST/PUT) or params (for GET)
   * @param options Extra FetchOptions
   */
  const callApi = async (method: string, url: string, payload: any = null, options: any = {}) => {
    const fetchOptions: any = {
      method,
      baseURL: config.public.apiBaseUrl,
      ...options,
      headers: {
        'x-role': 'admin', // Default header for this project
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...options.headers,
      },
    };

    if (payload) {
      if (method.toUpperCase() === 'GET') {
        fetchOptions.params = payload;
      } else {
        fetchOptions.body = payload;
      }
    }

    return $fetch(url, fetchOptions);
  };

  return {
    callApi
  };
};
