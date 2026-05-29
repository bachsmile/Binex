<script setup lang="ts">
import { ref } from 'vue';

const isOpen = defineModel<boolean>('isOpen', { default: false });

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'toast', message: string, type?: 'success' | 'error'): void;
}>();

const userApi = useUserApi();
const createLoading = ref(false);
const createError = ref('');

const createForm = ref({
  userName: '',
  password: '',
  code: useCookie('user_code').value || '',
});

const handleCreateUser = async () => {
  if (!createForm.value.userName.trim()) {
    createError.value = 'Vui lòng nhập tên đăng nhập'; 
    return;
  }
  if (createForm.value.userName.trim().length < 3) {
    createError.value = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    return;
  }
  if (!createForm.value.password) {
    createError.value = 'Vui lòng nhập mật khẩu';
    return;
  }
  if (createForm.value.password.length < 6) {
    createError.value = 'Mật khẩu phải có ít nhất 6 ký tự';
    return;
  }

  createLoading.value = true;
  createError.value = '';

  try {
    const response = await userApi.create({
      userName: createForm.value.userName.trim(),
      password: createForm.value.password,
      code: createForm.value.code || undefined,
    });

    if (response && response.status) {
      emit('toast', 'Thêm tài khoản người dùng mới thành công!', 'success');
      isOpen.value = false;
      // Reset form
      createForm.value = {
        userName: '',
        password: '',
        code: useCookie('user_code').value || '',
      };
      emit('success'); // trigger list refresh
    } else {
      const errMsg = userApi.error.value?.message;
      createError.value = Array.isArray(errMsg)
        ? (errMsg[0] || 'Tạo người dùng thất bại. Vui lòng kiểm tra lại.')
        : (errMsg || 'Tạo người dùng thất bại. Vui lòng kiểm tra lại.');
    }
  } catch (err: any) {
    createError.value = err.message || 'Có lỗi hệ thống xảy ra.';
  } finally {
    createLoading.value = false;
  }
};
</script>

<template>
  <CmDialog
    v-model:isOpen="isOpen"
    title="Thêm tài khoản người dùng mới"
    size="md"
  >
    <div class="space-y-5">
      <!-- Error alert if any -->
      <div 
        v-if="createError" 
        class="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-xl text-xs font-bold text-red-500 flex items-center gap-2 select-none"
      >
        <Icon name="heroicons:information-circle" class="text-base shrink-0" />
        <span>{{ createError }}</span>
      </div>

      <div class="space-y-4">
        <!-- Username Input -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 select-none">
            Tên đăng nhập <span class="text-red-500">*</span>
          </label>
          <CmInput 
            v-model="createForm.userName"
            placeholder="Nhập tên đăng nhập của tài khoản mới"
            icon="heroicons:user"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
            Mật khẩu <span class="text-red-500">*</span>
          </label>
          <CmInput 
            v-model="createForm.password"
            type="password"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            icon="heroicons:lock-closed"
          />
        </div>

        <!-- Referral / Manager Code Input -->
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-555 select-none">
            Mã người giới thiệu / quản lý
          </label>
          <CmInput 
            v-model="createForm.code"
            placeholder="Nhập mã code giới thiệu hoặc mã để gán nhóm"
            icon="heroicons:ticket"
          />
          <p class="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed select-none">
            Mặc định mã giới thiệu của bạn được tự động điền để gán tài khoản mới trực thuộc bạn quản lý.
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <CmButton 
        variant="ghost" 
        size="md" 
        class="text-xs font-semibold px-5" 
        :disabled="createLoading"
        @click="isOpen = false"
      >
        Hủy bỏ
      </CmButton>
      <CmButton 
        variant="primary" 
        size="md" 
        class="text-xs font-bold px-5 shadow-sm shadow-primary/10" 
        :loading="createLoading"
        @click="handleCreateUser"
      >
        Tạo tài khoản
      </CmButton>
    </template>
  </CmDialog>
</template>
