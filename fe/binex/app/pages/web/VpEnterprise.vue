<script setup lang="ts">
import CmHeader from '~/components/commons/CmHeader.vue';

definePageMeta({
  layout: 'falling',
  path: '/enterprise'
})
</script>

<template>
  <CmHeader />
  <div class="enterprise-page min-h-screen bg-black text-white">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6 pt-20">
      <div class="absolute inset-0 z-0">
        <img src="/img/hero_tropical.png" class="w-full h-full object-cover opacity-30 grayscale" />
        <div class="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
      </div>
      
      <div class="relative z-10 text-center max-w-5xl">
        <div class="text-[#CCFF00] uppercase tracking-[0.5em] font-black text-xs mb-10 animate-fade-in">
          Đối tác chiến lược toàn cầu
        </div>
        <h1 class="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter animate-slide-up uppercase">
          Nâng tầm <span class="text-[#CCFF00]">Doanh nghiệp</span> <br/>
          <span class="text-white/80">Trong kỷ nguyên số</span>
        </h1>
        <p class="text-base md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-300">
          Binex cung cấp hệ sinh thái giải pháp toàn diện, giúp doanh nghiệp tối ưu hóa vận hành, quản trị thông minh và bứt phá doanh thu bền vững.
        </p>
      </div>
    </section>

    <!-- Mission Section with clean structure -->
    <section class="py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
          <div class="space-y-12">
            <div>
              <h2 class="text-3xl md:text-4xl font-black mb-6 tracking-tighter uppercase leading-none">Tầm nhìn & Sứ mệnh</h2>
              <div class="w-16 h-1 bg-[#CCFF00]"></div>
            </div>
            
            <div class="space-y-8 text-white/60 text-lg md:text-xl leading-relaxed font-medium">
              <p>
                Chúng tôi tin rằng công nghệ không chỉ là công cụ, mà là đòn bẩy để tạo ra những giá trị bền vững cho cộng đồng doanh nghiệp Việt Nam.
              </p>
              <p>
                Với Binex, mỗi doanh nghiệp là một mảnh ghép quan trọng trong hệ sinh thái số, nơi sự sáng tạo và hiệu quả được đặt lên hàng đầu.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-12 pt-8">
              <div class="space-y-1">
                <div class="text-4xl font-black text-white tabular-nums">500+</div>
                <div class="text-[9px] uppercase font-black tracking-[0.2em] text-[#CCFF00]">Đối tác tin dùng</div>
              </div>
              <div class="space-y-1">
                <div class="text-4xl font-black text-white tabular-nums">99%</div>
                <div class="text-[9px] uppercase font-black tracking-[0.2em] text-[#CCFF00]">Tỉ lệ hài lòng</div>
              </div>
            </div>
          </div>

          <div class="relative mt-20 lg:mt-0">
             <div class="absolute -top-20 -right-20 w-64 h-64 bg-[#CCFF00]/10 blur-[100px] rounded-full"></div>
             <div class="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                <Icon name="ph:buildings-duotone" class="text-[15rem] text-white/5" />
                <div class="absolute inset-0 bg-gradient-to-tr from-[#CCFF00]/10 to-transparent"></div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Google Maps Section - Refined Layout -->
    <section class="py-32 bg-white/[0.02] border-y border-white/5">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <div class="max-w-2xl">
            <h2 class="text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase leading-none text-white">Văn phòng Binex</h2>
            <p class="text-white/40 text-sm uppercase tracking-widest font-bold">Ghé thăm chúng tôi tại trung tâm công nghệ</p>
          </div>
          <div class="text-left md:text-right space-y-2 border-l-2 md:border-l-0 md:border-r-2 border-[#CCFF00] px-6 md:px-0 md:pr-6">
            <div class="text-white font-black uppercase tracking-widest text-sm">Trụ sở chính</div>
            <div class="text-white/40 text-sm max-w-[250px] leading-relaxed">
              47 Xuân Thiều 14, Hải Vân,<br> TP. Đà Nẵng, Việt Nam
            </div>
          </div>
        </div>

        <!-- Styled Map Container -->
        <div class="relative h-[600px] w-full rounded-[4rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d479.15872616242865!2d108.1347587276529!3d16.10333775952884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421f0041435ee3%3A0xd920d8a12c2b4ba0!2zTmjDoCBCw6FjaA!5e0!3m2!1svi!2s!4v1778036785489!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="true" 
            loading="lazy" 
          ></iframe>
          
          <!-- Contact Overlay - Positioned better -->
          <div class="absolute top-10 left-10 p-10 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] max-w-sm shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700">
            <h4 class="text-white font-black uppercase tracking-[0.2em] mb-8 text-xs text-[#CCFF00]">Kết nối ngay</h4>
            <div class="space-y-8">
              <div class="flex items-center gap-6">
                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Icon name="ph:phone-call-fill" class="text-[#CCFF00] text-xl" />
                </div>
                <div>
                  <div class="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Hotline</div>
                  <div class="text-base font-bold text-white tracking-tight">1900 8888</div>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Icon name="ph:paper-plane-tilt-fill" class="text-[#CCFF00] text-xl" />
                </div>
                <div>
                  <div class="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Email</div>
                  <div class="text-base font-bold text-white tracking-tight">contact@binex.vn</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Space -->
    <div class="py-32 text-center">
      <NuxtLink to="/" class="group inline-flex items-center gap-4 text-white/20 hover:text-[#CCFF00] transition-all uppercase text-xs font-black tracking-[0.5em]">
        <Icon name="ph:arrow-left-bold" class="group-hover:-translate-x-2 transition-transform" />
        Quay lại trang chủ
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.enterprise-page {
  font-family: 'Inter', sans-serif;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-up {
  animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fade-in 1.5s ease forwards;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>
