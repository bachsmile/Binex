<script setup lang="ts">
import CmHeader from '~/components/commons/CmHeader.vue'
import CmSkeleton from '~/components/commons/CmSkeleton.vue'
import { useNewsApi } from '~/api/news'

definePageMeta({
  layout: 'falling',
  path: '/news/:id'
})

const route = useRoute()
const id = route.params.id as string
const { findOne } = useNewsApi()

// Gọi dữ liệu thật từ API
const { data: response, pending, error } = await useAsyncData(`news-${id}`, () => findOne(id))

const article = computed(() => response.value?.data || null)

const relatedNews = [
  { id: 2, title: "Cách tối ưu hóa dòng tiền cho doanh nghiệp", date: "05 Th05, 2026" },
  { id: 3, title: "Thị trường Crypto: Xu hướng quý 2", date: "04 Th05, 2026" }
]
</script>

<template>
  <div class="article-detail min-h-screen bg-black text-white pt-28 pb-32">
    <CmHeader/>
    <div class="max-w-7xl mx-auto px-6">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-4 mb-12 text-[10px] font-black uppercase tracking-widest text-white/30">
        <NuxtLink to="/" class="hover:text-white">Trang chủ</NuxtLink>
        <Icon name="ph:caret-right-bold" />
        <NuxtLink to="/news" class="hover:text-white">Tin tức</NuxtLink>
        <Icon name="ph:caret-right-bold" />
        <span class="text-[#CCFF00]">Chi tiết</span>
      </div>
      <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div class="lg:col-span-8 space-y-12">
          <CmSkeleton width="100px" height="15px" />
          <CmSkeleton width="80%" height="40px" />
          <CmSkeleton width="100%" height="400px" borderRadius="3.5rem" />
          <div class="space-y-4">
            <CmSkeleton width="100%" height="20px" />
            <CmSkeleton width="100%" height="20px" />
            <CmSkeleton width="60%" height="20px" />
          </div>
        </div>
      </div>

      <div v-else-if="article" class="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <!-- Main Article Content -->
        <div class="lg:col-span-8">
          <div class="mb-12">
            <span class="text-[#CCFF00] text-xs font-black uppercase tracking-widest mb-6 block">{{ article.category }}</span>
            <h1 class="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter uppercase">{{ article.title }}</h1>
            <div class="flex items-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
              <span class="flex items-center gap-2">
                <Icon name="ph:calendar-blank-fill" /> 
                {{ new Date(article.createdAt).toLocaleDateString('vi-VN') }}
              </span>
              <span v-if="article.author" class="flex items-center gap-2"><Icon name="ph:user-fill" /> {{ article.author }}</span>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="rounded-[3.5rem] overflow-hidden border border-white/10 mb-16 shadow-2xl">
            <img :src="article.image || '/img/hero_tropical.png'" class="w-full h-auto opacity-70" />
          </div>

          <!-- Article Text -->
          <div class="prose prose-invert max-w-none prose-p:text-white/60 prose-p:text-lg prose-p:leading-relaxed" v-html="article.content"></div>

          <!-- Social Share -->
          <div class="mt-20 pt-10 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
            <div class="flex items-center gap-4">
              <span class="text-[10px] font-black uppercase tracking-widest text-white/40">Chia sẻ bài viết:</span>
              <div class="flex gap-4">
                <button class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all">
                  <Icon name="ph:facebook-logo-fill" />
                </button>
                <button class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all">
                  <Icon name="ph:linkedin-logo-fill" />
                </button>
              </div>
            </div>
            <NuxtLink to="/news" class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#CCFF00] transition-colors">
              <Icon name="ph:arrow-left-bold" /> Quay lại danh sách
            </NuxtLink>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-16">
          <!-- Related News -->
          <div class="p-10 rounded-[3rem] bg-white/5 border border-white/10">
            <h3 class="text-xl font-black mb-8 uppercase tracking-tighter">Tin liên quan</h3>
            <div class="space-y-8">
              <NuxtLink v-for="item in relatedNews" :key="item.id" :to="`/news/${item.id}`" class="block group">
                <h4 class="font-bold text-white/80 group-hover:text-[#CCFF00] transition-colors mb-2 leading-snug">{{ item.title }}</h4>
                <div class="text-[10px] text-white/20 font-bold uppercase tracking-widest">{{ item.date }}</div>
              </NuxtLink>
            </div>
          </div>

          <!-- Large Ad Banner -->
          <div class="relative rounded-[3rem] overflow-hidden aspect-[3/4] group">
            <img src="/img/hero_tropical.png" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s]" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-0 p-10 flex flex-col justify-end">
              <div class="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest mb-4">Ad Campaign</div>
              <h4 class="text-3xl font-black mb-6 uppercase tracking-tighter">Khám phá sức mạnh Binex Pro</h4>
              <button class="w-full py-4 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-detail {
  font-family: 'Inter', sans-serif;
}
</style>
