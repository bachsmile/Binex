<script setup lang="ts">
definePageMeta({
  layout: 'falling',
  path: '/modules/wedding/VpWeddHome'
})
</script>

<template>
  <div class="home-page min-h-screen">
    <!-- 1. Hero Section - Large Glass Card -->
    <section class="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div class="glass-card overflow-hidden group">
        <div class="absolute inset-0 z-0">
          <img 
            src="/img/hero.png" 
            class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            alt="Hero Background"
          />
          <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div class="relative z-10 p-12 md:p-24 flex flex-col items-center text-center">
          <span class="px-4 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm mb-6 animate-fade-in">
            Nền tảng quản lý tiệc cưới thế hệ mới
          </span>
          <h1 class="text-5xl md:text-8xl font-bold mb-8 leading-tight tracking-tight text-white drop-shadow-2xl">
            Kiến Tạo <br/>
            <span class="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">Hạnh Phúc</span> Trọn Vẹn
          </h1>
          <p class="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
            Từ danh sách khách mời đến kế hoạch ngân sách, mọi thứ đều nằm trong tầm tay bạn. Hãy để Binex cùng bạn viết nên câu chuyện tình yêu hoàn mỹ nhất.
          </p>
          <div class="flex gap-4">
            <button class="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-medium transition-all transform hover:-translate-y-1 shadow-lg shadow-pink-500/20">
              Bắt đầu ngay
            </button>
            <button class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-2xl font-medium transition-all">
              Khám phá tính năng
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Asymmetric Photo Grid -->
    <section class="py-20 px-6 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 class="text-4xl font-bold text-white mb-4">Khoảnh khắc tinh tế</h2>
          <p class="text-white/50 max-w-md text-lg">Vẻ đẹp nằm ở những chi tiết nhỏ nhất được chăm chút tỉ mỉ.</p>
        </div>
        <div class="h-px flex-1 bg-white/10 mx-10 hidden md:block"></div>
        <button class="text-pink-300 hover:text-pink-200 transition-colors flex items-center gap-2">
          Xem tất cả ảnh <Icon name="ph:arrow-right" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 h-[800px]">
        <!-- Ảnh chính lệch trái -->
        <div class="md:col-span-7 relative group overflow-hidden rounded-[40px] shadow-2xl">
          <img src="/img/couple.png" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex items-end">
            <p class="text-white text-xl">Câu chuyện của chúng ta</p>
          </div>
        </div>
        
        <!-- Cột phải 2 ảnh lệch nhau -->
        <div class="md:col-span-5 grid grid-rows-2 gap-8">
          <div class="relative group overflow-hidden rounded-[40px] shadow-xl mt-12">
            <img src="/img/decor.png" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
          </div>
          <div class="relative group overflow-hidden rounded-[40px] shadow-xl -mt-6 mb-12">
            <img src="/img/hero.png" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs border border-white/20">
              Luxury Hall
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Feature Cards Section -->
    <section class="py-20 bg-surface/50 border-y border-white/5 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-4xl font-bold text-white mb-6">Mọi thứ bạn cần cho một lễ cưới hoàn hảo</h2>
          <div class="w-24 h-1 bg-pink-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="feature-card group">
            <div class="icon-box">
              <Icon name="ph:users-three-duotone" class="text-4xl text-pink-400" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Quản lý khách mời</h3>
            <p class="text-white/50 leading-relaxed mb-6">
              Tạo danh sách, gửi thiệp mời điện tử và theo dõi xác nhận tham dự (RSVP) tự động thời gian thực.
            </p>
            <NuxtLink to="/wedding/guest" class="text-pink-400 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              Khám phá ngay <Icon name="ph:arrow-right" />
            </NuxtLink>
          </div>

          <!-- Card 2 -->
          <div class="feature-card group">
            <div class="icon-box bg-purple-500/10">
              <Icon name="ph:currency-circle-dollar-duotone" class="text-4xl text-purple-400" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Kiểm soát ngân sách</h3>
            <p class="text-white/50 leading-relaxed mb-6">
              Quản lý chi phí chi tiết, dự báo ngân sách và nhắc nhở các khoản thanh toán cần hoàn thành.
            </p>
            <NuxtLink to="/finance" class="text-purple-400 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              Khám phá ngay <Icon name="ph:arrow-right" />
            </NuxtLink>
          </div>

          <!-- Card 3 -->
          <div class="feature-card group">
            <div class="icon-box bg-indigo-500/10">
              <Icon name="ph:calendar-check-duotone" class="text-4xl text-indigo-400" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Lịch trình sự kiện</h3>
            <p class="text-white/50 leading-relaxed mb-6">
              Sắp xếp thứ tự các nghi thức, phân công nhiệm vụ và đảm bảo mọi khoảnh khắc diễn ra đúng kế hoạch.
            </p>
            <button class="text-indigo-400 font-medium group-hover:gap-3 flex items-center gap-2 transition-all">
              Khám phá ngay <Icon name="ph:arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Premium Footer -->
    <footer class="pt-32 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full -z-10"></div>
      
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div class="md:col-span-2">
            <div class="text-3xl font-bold text-white mb-8 tracking-tighter">BINEX <span class="text-pink-500">WEDDING</span></div>
            <p class="text-white/40 max-w-sm mb-8 leading-relaxed">
              Binex là nền tảng quản lý tiệc cưới toàn diện nhất, mang lại sự tiện nghi và sang trọng cho ngày trọng đại của bạn.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/50 transition-all text-white">
                <Icon name="ph:facebook-logo" />
              </a>
              <a href="#" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/50 transition-all text-white">
                <Icon name="ph:instagram-logo" />
              </a>
              <a href="#" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/50 transition-all text-white">
                <Icon name="ph:tiktok-logo" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="text-white font-bold mb-6">Liên kết nhanh</h4>
            <ul class="space-y-4 text-white/40">
              <li><a href="#" class="hover:text-pink-400 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" class="hover:text-pink-400 transition-colors">Gói dịch vụ</a></li>
              <li><a href="#" class="hover:text-pink-400 transition-colors">Tính năng</a></li>
              <li><a href="#" class="hover:text-pink-400 transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-6">Hỗ trợ</h4>
            <ul class="space-y-4 text-white/40">
              <li><a href="#" class="hover:text-pink-400 transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" class="hover:text-pink-400 transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" class="hover:text-pink-400 transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        
        <div class="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 text-white/20 text-sm gap-4">
          <p>© 2024 Binex Wedding. All rights reserved.</p>
          <div class="flex gap-8">
            <p>Made with ❤️ for your special day</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  background-color: #0c0c0e; /* Darker theme for premium feel */
}

.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 48px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 40px;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4);
}

.icon-box {
  width: 80px;
  height: 80px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s forwards;
}
</style>