import { ref, onMounted, onUnmounted } from "vue";

export const useLazyLoad = <T>(
  fetchFn: (params: any) => Promise<any>,
  customOptions: { limit?: number } = {}
) => {
  const options = { limit: 10, ...customOptions }
  const data = ref<T[]>([])
  const loading = ref(false);
  const finished = ref(false);
  const page = ref(1);
  const total = ref(0);

  const loadMore = async () => {
    if (loading.value || finished.value) return;

    loading.value = true;
    try {
      const response = await fetchFn({
        page: page.value,
        limit: options.limit,
      });
      console.log("response", response);

      // Giả định response trả về cấu trúc { data, total } theo chuẩn TECHNICAL_STANDARDS.md
      const items = response.data || [];
      data.value = [...data.value, ...items];
      total.value = response.total || 0;

      if (data.value.length >= total.value || items.length < options.limit) {
        finished.value = true;
      } else {
        page.value++;
      }
    } catch (error) {
      console.error("LazyLoad Error:", error);
      finished.value = true;
    } finally {
      loading.value = false;
    }
  };

  // Cơ chế tự động trigger khi cuộn (có thể dùng Intersection Observer hoặc scroll event)
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore();
    }
  };

  onMounted(() => {
    loadMore(); // Tải trang đầu tiên
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    data,
    loading,
    finished,
    total,
    refresh: () => {
      data.value = [];
      page.value = 1;
      finished.value = false;
      loadMore();
    },
  };
};
