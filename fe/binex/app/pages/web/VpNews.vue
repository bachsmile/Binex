<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import CmSkeleton from '~/components/commons/CmSkeleton.vue'

import { useNewsApi } from '~/api/news'
import { useMailApi } from '~/api/mail'
import { ref } from 'vue'

definePageMeta({
  layout: 'falling',
  path: '/news'
})

const { findAll } = useNewsApi()

// Sử dụng cơ chế Lazy Load cho danh sách tin tức
const { data: newsList, loading, finished } = useLazyLoad<any>(findAll, { limit: 6 })

// Bài viết nổi bật (Lấy từ bài đầu tiên của danh sách hoặc API riêng)
const featuredNews = computed(() => newsList.value[0] || null)

// Danh sách tin tức còn lại (trừ bài nổi bật)
const secondaryNews = computed(() => newsList.value.slice(1))

const ads = [
  { id: 1, title: "Quảng cáo Binex Plus", subtitle: "Nhận ưu đãi 50% phí giao dịch", image: "/img/1778046369521.png", color: "bg-[#CCFF00]/10" }
]

const mailApi = useMailApi()
const subscribeEmail = ref('')
const isSubscribing = ref(false)

const handleSubscribe = async () => {
  if (!subscribeEmail.value) return
  isSubscribing.value = true
  try {
    const res = await mailApi.subscribe({ email: subscribeEmail.value })
    if (res?.data) {
      alert('Đăng ký nhận tin thành công!')
      subscribeEmail.value = ''
    }
  } catch (error) {
    console.error('Subscribe error:', error)
    alert('Đã có lỗi xảy ra, vui lòng thử lại sau.')
  } finally {
    isSubscribing.value = false
  }
}
</script>

<template>
  <div class="news-page min-h-screen bg-black text-white pt-28 px-6 pb-20">
    <CiHeader />
    <div class="max-w-7xl mx-auto">
      <!-- Header Title -->
      <div class="mb-16">
        <h1 class="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Tin tức & <br/> <span class="text-[#CCFF00]">Truyền thông</span></h1>
        <p class="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">Cập nhật những diễn biến mới nhất từ hệ sinh thái Binex</p>
      </div>

      <!-- Featured News Section -->
      <div v-if="loading && newsList.length === 0">
        <CmSkeleton height="500px" borderRadius="3rem" className="mb-20" />
      </div>
      <NuxtLink v-else-if="featuredNews" :to="`/news/${featuredNews.id}`" class="group relative block w-full h-[500px] rounded-[3rem] overflow-hidden border border-white/10 mb-20">
        <img :src="featuredNews.image || '/img/hero_tropical.png'" class="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-12 max-w-3xl">
          <span class="px-4 py-1.5 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block">
            {{ featuredNews.category }}
          </span>
          <h2 class="text-3xl md:text-5xl font-black mb-6 leading-tight group-hover:text-[#CCFF00] transition-colors uppercase tracking-tighter">
            {{ featuredNews.title }}
          </h2>
          <p class="text-white/60 text-lg line-clamp-2 mb-6">{{ featuredNews.summary }}</p>
          <div class="text-white/30 text-xs font-bold uppercase tracking-widest">{{ new Date(featuredNews.createdAt).toLocaleDateString('vi-VN') }}</div>
        </div>
      </NuxtLink>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- News List -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Real Data -->
            <NuxtLink v-for="item in secondaryNews" :key="item.id" :to="`/news/${item.id}`" class="group">
              <div class="aspect-video rounded-3xl overflow-hidden border border-white/10 mb-6 bg-white/5">
                <img :src="item.image || '/img/hero_tropical.png'" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="space-y-4">
                <div class="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest">{{ item.category }}</div>
                <h3 class="text-xl font-bold leading-snug group-hover:text-white/80 transition-colors">{{ item.title }}</h3>
                <div class="text-white/30 text-xs font-medium">{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</div>
              </div>
            </NuxtLink>

            <!-- Loading Skeleton -->
            <template v-if="loading">
              <div v-for="i in 4" :key="i" class="space-y-4">
                <CmSkeleton height="180px" borderRadius="1.5rem" />
                <CmSkeleton width="30%" height="10px" />
                <CmSkeleton width="90%" height="20px" />
                <CmSkeleton width="40%" height="12px" />
              </div>
            </template>
          </div>

          <!-- End of List -->
          <div v-if="finished && newsList.length > 0" class="text-center py-12 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
            Bạn đã xem hết tin tức
          </div>
        </div>

        <!-- Sidebar (Ads & Tags) -->
        <div class="space-y-12">
          <!-- Advertisement -->
          <div v-for="ad in ads" :key="ad.id" :class="['p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group', ad.color]">
            <div class="relative z-10">
              <div class="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest mb-4">Quảng cáo</div>
              <h4 class="text-2xl font-black text-white mb-2 leading-tight">{{ ad.title }}</h4>
              <p class="text-white/60 text-sm mb-8">{{ ad.subtitle }}</p>
              <button class="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#CCFF00] transition-colors">
                Khám phá ngay
              </button>
            </div>
            <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <img :src="ad.image" class="w-40 h-40 object-contain" />
            </div>
          </div>

          <!-- Newsletter -->
          <div class="p-10 rounded-[2.5rem] bg-white/5 border border-white/10">
            <h4 class="text-lg font-bold mb-6">Đăng ký nhận tin</h4>
            <div class="space-y-4">
              <input 
                v-model="subscribeEmail"
                type="email" 
                placeholder="Email của bạn..." 
                class="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-3 text-sm focus:border-[#CCFF00] outline-none transition-all" 
              />
              <button 
                @click="handleSubscribe"
                :disabled="isSubscribing"
                class="w-full py-3 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isSubscribing ? 'Đang gửi...' : 'Gửi ngay' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-page {
  font-family: 'Inter', sans-serif;
}
</style>

<style scoped>
.news-page {
  font-family: 'Inter', sans-serif;
}
</style>
