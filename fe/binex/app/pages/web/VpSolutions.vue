<script setup lang="ts">
import CiHeader from '~/components/integrations/CiHeader.vue'
import CmGlowLine from '~/components/commons/CmGlowLine.vue'

definePageMeta({
  layout: 'falling',
  path: '/solutions'
})

const painPoints = [
  { icon: 'ph:files-bold', title: 'Quản lý rời rạc', desc: 'Sử dụng quá nhiều công cụ (Excel, phần mềm lẻ tẻ) khiến dữ liệu bị phân mảnh.' },
  { icon: 'ph:money-wavy-bold', title: 'Mất kiểm soát dòng tiền', desc: 'Không nắm bắt được luồng tiền realtime, dẫn đến khó khăn trong kế hoạch tài chính.' },
  { icon: 'ph:clock-countdown-bold', title: 'Quy trình thủ công', desc: 'Tốn quá nhiều thời gian cho các thao tác lặp lại và dễ xảy ra sai sót.' },
  { icon: 'ph:chart-line-down-bold', title: 'Thiếu dữ liệu Realtime', desc: 'Ra quyết định dựa trên số liệu cũ, làm giảm khả năng cạnh tranh.' },
]

const features = [
  { 
    category: 'Tài chính & Dòng tiền', 
    list: [
      { title: 'Quản lý thu chi', desc: 'Theo dõi chi tiết mọi giao dịch phát sinh.' },
      { title: 'Quản lý công nợ', desc: 'Tự động nhắc nợ và đối soát chính xác.' },
      { title: 'Dự báo tài chính', desc: 'AI phân tích và dự báo dòng tiền tương lai.' }
    ]
  },
  { 
    category: 'Vận hành doanh nghiệp', 
    list: [
      { title: 'Workflow tự động', desc: 'Số hóa toàn bộ quy trình làm việc.' },
      { title: 'Quản lý Task', desc: 'Giao việc và theo dõi tiến độ trực quan.' },
      { title: 'Phân quyền thông minh', desc: 'Bảo mật dữ liệu theo từng cấp bậc.' }
    ]
  },
  { 
    category: 'Báo cáo & Analytics', 
    list: [
      { title: 'Dashboard Realtime', desc: 'Toàn cảnh doanh nghiệp trong một màn hình.' },
      { title: 'Biểu đồ trực quan', desc: 'Chuyển hóa con số khô khan thành hình ảnh.' },
      { title: 'Theo dõi KPI', desc: 'Đo lường hiệu suất nhân sự và phòng ban.' }
    ]
  }
]

const benefits = [
  { label: 'Giảm sai sót', value: '70%', color: 'text-[#CCFF00]' },
  { label: 'Tiết kiệm thời gian', value: '45%', color: 'text-white' },
  { label: 'Tăng hiệu suất', value: '2x', color: 'text-[#CCFF00]' },
]
</script>

<template>
  <div class="solutions-page min-h-screen bg-black text-white pt-48 pb-32">
    <CiHeader />
    
    <div class="max-w-7xl mx-auto px-6">
      <!-- Hero Solution -->
      <section class="text-center py-24 animate-fade-in relative z-10">
        <div class="text-[#CCFF00] uppercase tracking-[0.4em] font-black text-xs mb-8">Giải pháp toàn diện</div>
        <h1 class="text-5xl md:text-7xl font-black mb-10 uppercase leading-tight">
          Nền tảng quản trị <br/>
          <span class="text-white/30 italic">Tập trung & Tự động.</span>
        </h1>
        <p class="max-w-3xl mx-auto text-white/50 text-lg leading-relaxed">
          Binex cung cấp hệ sinh thái quản trị doanh nghiệp toàn diện, giúp đồng bộ dữ liệu, 
          kiểm soát dòng tiền và tối ưu vận hành trên một hệ thống duy nhất.
        </p>
      </section>

      <!-- 1. Pain Points -->
      <section class="py-24">
        <CmGlowLine class="mb-24 opacity-20" />
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <h2 class="text-4xl font-black uppercase !leading-tight">Bạn đang gặp <br/> <span class="text-[#CCFF00]">vấn đề gì?</span></h2>
          <p class="text-white/40 max-w-md uppercase text-[10px] font-bold tracking-widest leading-loose">
            Chúng tôi hiểu những khó khăn mà doanh nghiệp SME và Startup thường xuyên đối mặt trong kỷ nguyên số.
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(point, idx) in painPoints" :key="idx" class="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#CCFF00]/50 transition-all group">
            <Icon :name="point.icon" class="text-4xl text-[#CCFF00] mb-8 group-hover:scale-110 transition-transform" />
            <h3 class="text-xl font-bold mb-4">{{ point.title }}</h3>
            <p class="text-white/40 text-sm leading-relaxed">{{ point.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 2. The Solution (Transparent Visualization) -->
      <section class="py-24">
        <CmGlowLine class="mb-24 opacity-20" />
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div class="lg:col-span-4 py-10 relative z-10">
            <h2 class="text-3xl md:text-5xl font-extrabold uppercase mb-12 !leading-tight">
              Sơ đồ luồng <br/> 
              <span class="text-[#CCFF00]">Dữ liệu tập trung</span>
            </h2>
            <div class="space-y-8">
              <div v-for="(step, idx) in ['Dữ liệu nguồn (Excel, POS, Bank)', 'Cổng kết nối thông minh Binex', 'Xử lý & Chuẩn hóa (AI Engine)', 'Dashboard quản trị tập trung']" :key="idx" class="flex items-start gap-6 group">
                <div class="w-10 h-10 rounded-full border border-[#CCFF00]/30 flex-shrink-0 flex items-center justify-center text-[10px] font-black group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                  0{{ idx + 1 }}
                </div>
                <div class="text-white/60 text-sm font-medium pt-2 leading-relaxed">{{ step }}</div>
              </div>
            </div>
          </div>
          
          <div class="lg:col-span-8 bg-white/5 border border-white/10 rounded-[4rem] p-8 md:p-20 relative overflow-hidden h-[500px] md:h-[600px]">
            <!-- Visual System Diagram (CSS/SVG) -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="relative w-full h-full max-w-[500px] max-h-[500px] flex items-center justify-center">
                <!-- Center Core -->
                <div class="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-[#CCFF00] flex items-center justify-center z-20 shadow-[0_0_80px_rgba(204,255,0,0.4)] animate-pulse">
                  <img src="/img/1778046369521.png" class="w-12 md:w-16 h-auto brightness-0" />
                </div>
                
                <!-- Orbital Nodes -->
                <div v-for="i in 4" :key="i" :class="['absolute w-16 h-16 md:w-20 md:h-20 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-center transition-all animate-float z-30', `node-${i}`]">
                  <Icon :name="['ph:bank-bold', 'ph:shopping-cart-bold', 'ph:file-xls-bold', 'ph:users-four-bold'][i-1]" class="text-xl md:text-2xl text-[#CCFF00]" />
                  <!-- Label for nodes -->
                  <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-widest text-white/30">
                    {{ ['Bank', 'POS', 'Excel', 'Users'][i-1] }}
                  </div>
                </div>

                <!-- Connecting Lines (SVG) -->
                <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                  <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#CCFF00" stroke-width="1" stroke-dasharray="8,8" />
                  <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#CCFF00" stroke-width="1" stroke-dasharray="8,8" />
                  <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#CCFF00" stroke-width="1" stroke-dasharray="8,8" />
                  <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#CCFF00" stroke-width="1" stroke-dasharray="8,8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2.5 Realtime Analytics Showcase -->
      <section class="py-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="lg:col-span-2"><CmGlowLine class="mb-24 opacity-20" /></div>
        <div class="p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div class="flex justify-between items-center mb-10">
            <h3 class="text-xl font-bold uppercase !leading-tight">Phân tích dòng tiền</h3>
            <div class="px-3 py-1 bg-[#CCFF00]/10 rounded-full text-[9px] font-black text-[#CCFF00] uppercase tracking-widest">Live</div>
          </div>
          <!-- Sparkline Chart Mockup -->
          <div class="h-32 w-full flex items-end gap-1 mb-8">
            <div v-for="h in [40, 60, 30, 80, 50, 90, 70, 100, 60, 80]" :key="h" 
              class="flex-1 bg-[#CCFF00]/20 rounded-t-lg transition-all hover:bg-[#CCFF00]" 
              :style="{ height: h + '%' }">
            </div>
          </div>
          <div class="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
        </div>

        <div class="p-12 rounded-[3rem] bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 class="text-xl font-bold uppercase !leading-tight mb-8">Hiệu suất vận hành</h3>
            <div class="space-y-6">
              <div v-for="(val, label) in { 'Xử lý hóa đơn': 85, 'Duyệt Task': 92, 'Đối soát Bank': 78 }" :key="label">
                <div class="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                  <span class="text-white/40">{{ label }}</span>
                  <span class="text-[#CCFF00]">{{ val }}%</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-[#CCFF00] rounded-full transition-all duration-1000" :style="{ width: val + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Core Features -->
      <section class="py-24 bg-[#CCFF00] rounded-[4rem] p-12 md:p-20 text-black">
        <div class="mb-20">
          <h2 class="text-5xl font-black uppercase mb-6 !leading-tight">Tính năng <br/> đột phá</h2>
          <div class="h-1 w-20 bg-black"></div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div v-for="(cat, idx) in features" :key="idx" class="space-y-10">
            <h3 class="text-xs font-black uppercase tracking-[0.3em] opacity-40">{{ cat.category }}</h3>
            <div class="space-y-8">
              <div v-for="(item, iidx) in cat.list" :key="iidx" class="border-b border-black/10 pb-6 group cursor-default">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-xl font-bold">{{ item.title }}</h4>
                  <Icon name="ph:arrow-right-bold" class="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                </div>
                <p class="text-black/60 text-sm">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Benefits & USP -->
      <section class="py-24">
        <CmGlowLine class="mb-24 opacity-20" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 class="text-5xl font-black uppercase mb-8 !leading-tight">Giá trị <br/> mang lại</h2>
            <p class="text-white/50 text-lg mb-12 leading-relaxed">
              Không chỉ là tính năng, chúng tôi mang lại kết quả thực tế cho sự tăng trưởng của bạn. 
              Sự hài lòng của khách hàng là thước đo thành công duy nhất.
            </p>
            <div class="grid grid-cols-3 gap-4">
              <div v-for="(stat, idx) in benefits" :key="idx" class="text-center p-6 rounded-3xl bg-white/5 border border-white/10">
                <div :class="['text-3xl font-black mb-2', stat.color]">{{ stat.value }}</div>
                <div class="text-[9px] uppercase font-black tracking-widest text-white/30">{{ stat.label }}</div>
              </div>
            </div>
          </div>
          <div class="bg-gradient-to-br from-[#CCFF00]/20 to-transparent p-1 border border-white/10 rounded-[3rem]">
            <div class="bg-black rounded-[2.9rem] p-12 space-y-8">
              <div class="flex items-start gap-6">
                <div class="w-12 h-12 rounded-2xl bg-[#CCFF00] flex-shrink-0 flex items-center justify-center text-black">
                  <Icon name="ph:rocket-launch-fill" class="text-2xl" />
                </div>
                <div>
                  <h4 class="text-xl font-bold mb-2 uppercase">All-in-one Platform</h4>
                  <p class="text-white/40 text-sm">Loại bỏ sự phiền phức khi phải chuyển đổi giữa nhiều công cụ khác nhau.</p>
                </div>
              </div>
              <div class="flex items-start gap-6">
                <div class="w-12 h-12 rounded-2xl border border-white/20 flex-shrink-0 flex items-center justify-center">
                  <Icon name="ph:shield-star-fill" class="text-2xl text-[#CCFF00]" />
                </div>
                <div>
                  <h4 class="text-xl font-bold mb-2 uppercase">Bảo mật đa lớp</h4>
                  <p class="text-white/40 text-sm">Dữ liệu của bạn được mã hóa và bảo vệ bởi các tiêu chuẩn an ninh hàng đầu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. CTA -->
      <section class="py-24 relative rounded-[4rem] overflow-hidden p-20 text-center">
        <CmGlowLine class="absolute top-0 left-0 opacity-40" />
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div class="relative z-10">
          <h2 class="text-4xl md:text-6xl font-black mb-8 uppercase !leading-tight">Sẵn sàng tối ưu <br/> doanh nghiệp của bạn?</h2>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <button class="px-10 py-5 bg-[#CCFF00] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all">
              Bắt đầu dùng thử miễn phí
            </button>
            <button class="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.solutions-page {
  font-family: 'Inter', sans-serif;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.node-1 { top: 15%; left: 15%; animation-delay: 0s; }
.node-2 { top: 15%; right: 15%; animation-delay: 0.5s; }
.node-3 { bottom: 15%; left: 15%; animation-delay: 1s; }
.node-4 { bottom: 15%; right: 15%; animation-delay: 1.5s; }
</style>
