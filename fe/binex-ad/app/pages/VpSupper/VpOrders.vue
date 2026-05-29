<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServiceApi, type ServiceGroup } from '~/api/service';
import { usePayApi } from '~/api/pay';

definePageMeta({
  path: '/supper/orders',
  layout: 'supper'
});

const serviceApi = useServiceApi();
const payApi = usePayApi();

const systemsList = ref<any[]>([]);
const listLoading = ref(false);

// Toast overlay state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'error'>('success');

const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 4000);
};

const getHost = (sys: any) => {
  const name = sys.name.toLowerCase();
  if (name.includes('core')) return 'api.binex.com';
  if (name.includes('analytics')) return 'analytics.binex.com';
  if (name.includes('payment') || name.includes('gateway')) return 'payment.binex.com';
  if (name.includes('wedding') || name.includes('thiệp')) return 'wedding.binex.com';
  return 'services.binex.com';
};

const fetchSystemsWithOrderCounts = async () => {
  listLoading.value = true;
  try {
    const res = await serviceApi.findAll();
    if (res && res.status && Array.isArray(res.data)) {
      const services = res.data;
      
      // Fetch actual transaction count for each service via payApi
      const countsPromises = services.map(async (item) => {
        try {
          const payRes = await payApi.getPaymentRequests({ serviceId: item.id, page: 1, limit: 1 });
          if (payRes && payRes.status && payRes.data) {
            return payRes.data.total || 0;
          }
        } catch (err) {
          console.warn(`Failed to fetch count for service ${item.id}`, err);
        }
        return 0;
      });

      const counts = await Promise.all(countsPromises);

      systemsList.value = services.map((item, idx) => {
        return {
          ...item,
          status: 'active',
          ordersCount: counts[idx],
          isReal: true
        };
      });
    } else {
      systemsList.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch systems for orders:', err);
    triggerToast('Không thể kết nối tới máy chủ API!', 'error');
  } finally {
    listLoading.value = false;
  }
};

const manageSystemOrders = (sys: any) => {
  navigateTo(`/supper/orders/${sys.id}`);
};

onMounted(() => {
  fetchSystemsWithOrderCounts();
});
</script>

<template>
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Header Section -->
    <section class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
          Quản lý Đơn hàng hệ thống
        </h1>
        <p class="text-xs sm:text-sm text-zinc-450 dark:text-zinc-555 font-medium mt-2">
          Theo dõi và xử lý các đơn hàng dịch vụ, ấn phẩm và tài khoản của các hệ thống trực thuộc platform Binex.
        </p>
      </div>
    </section>

    <!-- Loading Spinner -->
    <div v-if="listLoading" class="flex-1 py-20 flex flex-col items-center justify-center">
      <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs text-zinc-400 dark:text-zinc-555 font-bold mt-4">Đang tải danh sách hệ thống...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="systemsList.length === 0" class="flex-1 py-12 flex flex-col items-center justify-center">
      <CmEmpty 
        title="Không tìm thấy hệ thống" 
        description="Hiện tại không có hệ thống nào hoạt động hoặc cấu hình đơn hàng chưa được khởi tạo."
      />
    </div>

    <!-- Systems Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <CmCard 
        v-for="sys in systemsList" 
        :key="sys.id" 
        class="border border-zinc-150/80 dark:border-zinc-850 hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
      >
        <!-- Card Background Gradient on Hover -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div class="p-5 flex-1 flex flex-col justify-between relative z-10">
          <div>
            <!-- Title & Status Header -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 text-primary border border-primary/10 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon :name="sys.icon || 'heroicons:shopping-bag'" class="text-lg" />
                </div>
                <div>
                  <h3 class="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 group-hover:text-primary transition-colors">
                    {{ sys.name }}
                  </h3>
                  <p class="text-[10px] text-zinc-400 dark:text-zinc-550 font-semibold mt-0.5">{{ getHost(sys) }}</p>
                </div>
              </div>

              <span 
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase select-none font-sans"
                :class="sys.status === 'active' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-100/30'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450 border border-amber-100/30'"
              >
                <span class="w-1 h-1 rounded-full bg-current animate-pulse"></span>
                {{ sys.status }}
              </span>
            </div>

            <!-- Description Block -->
            <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-4 line-clamp-2 leading-relaxed">
              {{ sys.description || 'Không có mô tả chi tiết cho hệ thống này.' }}
            </p>

            <!-- Stats Block -->
            <div class="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-900 mt-5 pt-4">
              <div>
                <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Tổng Đơn hàng</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <p class="text-sm font-black text-zinc-800 dark:text-zinc-200">
                    {{ sys.ordersCount }}
                  </p>
                  <span 
                    v-if="sys.isReal"
                    class="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-1 py-0.2 rounded border border-emerald-500/20"
                  >
                    Real
                  </span>
                  <span 
                    v-else
                    class="text-[8px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded border border-zinc-200 dark:border-zinc-700"
                  >
                    Demo
                  </span>
                </div>
              </div>
              <div>
                <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Thứ tự ưu tiên</p>
                <p class="text-sm font-black text-zinc-800 dark:text-zinc-200 mt-1">#{{ sys.priority || 1 }}</p>
              </div>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="border-t border-zinc-100 dark:border-zinc-900 mt-5 pt-4 flex justify-end shrink-0">
            <CmButton 
              variant="primary" 
              size="sm" 
              icon="heroicons:chevron-right-20-solid"
              class="text-[10px] font-extrabold shadow-sm shadow-primary/10 transition-transform duration-300 group-hover:translate-x-0.5"
              @click="manageSystemOrders(sys)"
            >
              Quản lý Đơn hàng
            </CmButton>
          </div>
        </div>
      </CmCard>
    </div>

    <!-- Beautiful Toast Notification Overlay -->
    <Transition name="slide">
      <div 
        v-if="showToast" 
        class="fixed top-6 right-6 z-[100] max-w-sm w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border rounded-2xl p-4 shadow-lg flex items-start gap-3 transition-all duration-300"
        :class="toastType === 'success' ? 'border-emerald-150/80 dark:border-emerald-950/30' : 'border-red-150/80 dark:border-red-950/30'"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="toastType === 'success' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30' : 'bg-red-50 text-red-500 dark:bg-red-950/30'"
        >
          <Icon :name="toastType === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'" class="text-xl" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-zinc-900 dark:text-white leading-tight select-none">
            {{ toastType === 'success' ? 'Thành công' : 'Thất bại' }}
          </p>
          <p class="text-[11px] text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
            {{ toastMessage }}
          </p>
        </div>
        <CmButton 
          variant="ghost"
          size="sm"
          class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
          @click="showToast = false"
        >
          <Icon name="heroicons:x-mark" class="text-sm" />
        </CmButton>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
