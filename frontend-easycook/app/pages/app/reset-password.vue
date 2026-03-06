<template>
  <div style="font-family: 'Bai Jamjuree', sans-serif" class="min-h-screen flex flex-col bg-white">
    <navBar />

    <section class="flex-1 flex flex-col items-center px-4 py-12">
      <div class="w-full max-w-2xl">

        <!-- Title -->
        <h1 class="text-4xl font-bold text-center mb-3">เปลี่ยนรหัสผ่านใหม่</h1>
        <p class="text-center font-semibold text-gray-800 mb-6">
          เพื่อเพิ่มความปลอดภัยของบัญชี โปรดตั้งรหัสผ่านใหม่ที่ไม่ซ้ำกับรหัสเดิม และมีอย่างน้อย 8 ตัวอักษร
        </p>

        <!-- Error Banner -->
        <div v-if="submitError"
          class="flex items-center gap-2 bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {{ submitError }}
        </div>

        <!-- รหัสผ่านปัจจุบัน -->
        <div class="mb-5">
          <label class="block font-semibold mb-2">รหัสผ่านปัจจุบัน</label>
          <div class="relative">
            <input
              v-model="currentPassword"
              :type="showCurrent ? 'text' : 'password'"
              placeholder="รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม"
              class="w-full h-14 px-4 pr-12 rounded-xl border text-sm outline-none transition"
              :class="errors.currentPassword
                ? 'border-red-400 bg-red-50 text-red-500 placeholder-red-300'
                : 'border-gray-300 bg-gray-50'"
              @input="errors.currentPassword = ''"
            />
            <button type="button" @click="showCurrent = !showCurrent"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="!showCurrent" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="errors.currentPassword" class="text-red-500 text-xs mt-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {{ errors.currentPassword }}
          </p>
        </div>

        <!-- รหัสผ่านใหม่ -->
        <div class="mb-5">
          <label class="block font-semibold mb-2">รหัสผ่านใหม่</label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showNew ? 'text' : 'password'"
              placeholder="ตั้งรหัสผ่านใหม่อย่างน้อย 8 ตัวอักษร"
              class="w-full h-14 px-4 pr-12 rounded-xl border text-sm outline-none transition"
              :class="errors.newPassword
                ? 'border-red-400 bg-red-50 text-red-500 placeholder-red-300'
                : 'border-gray-300 bg-gray-50'"
              @input="errors.newPassword = ''"
            />
            <button type="button" @click="showNew = !showNew"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="!showNew" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="errors.newPassword" class="text-red-500 text-xs mt-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {{ errors.newPassword }}
          </p>
        </div>

        <!-- ยืนยันรหัสผ่านใหม่ -->
        <div class="mb-10">
          <label class="block font-semibold mb-2">ยืนยันรหัสผ่านใหม่</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="กรุณากรอกรหัสผ่านใหม่อีกครั้งให้ตรงกัน"
              class="w-full h-14 px-4 pr-12 rounded-xl border text-sm outline-none transition"
              :class="errors.confirmPassword
                ? 'border-red-400 bg-red-50 text-red-500 placeholder-red-300'
                : 'border-gray-300 bg-gray-50'"
              @input="errors.confirmPassword = ''"
            />
            <button type="button" @click="showConfirm = !showConfirm"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="!showConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between gap-6">
          <button @click="handleCancel"
            class="flex-1 h-14 rounded-2xl border-2 border-red-500 text-red-500 font-bold text-lg hover:bg-red-50 transition cursor-pointer">
            ยกเลิก
          </button>
          <button @click="handleSubmit"
            class="flex-1 h-14 rounded-2xl bg-[#2C9A40] text-white font-bold text-lg hover:bg-[#237a32] transition cursor-pointer">
            บันทึก
          </button>
        </div>

      </div>
    </section>

    <aboutFooter />
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import navBar from "~/components/navBar.vue"
import aboutFooter from "~/components/aboutFooter.vue"

const config = useRuntimeConfig()
const router = useRouter()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const submitError = ref('')
const errors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validate = () => {
  let valid = true
  errors.value = { currentPassword: '', newPassword: '', confirmPassword: '' }

  if (!currentPassword.value) {
    errors.value.currentPassword = 'กรุณากรอกรหัสผ่านปัจจุบัน'
    valid = false
  }
  if (!newPassword.value) {
    errors.value.newPassword = 'กรุณากรอกรหัสผ่านใหม่'
    valid = false
  } else if (newPassword.value.length < 8) {
    errors.value.newPassword = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร'
    valid = false
  } else if (newPassword.value === currentPassword.value) {
    errors.value.newPassword = 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม'
    valid = false
  }
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'กรุณายืนยันรหัสผ่านใหม่'
    valid = false
  } else if (confirmPassword.value !== newPassword.value) {
    errors.value.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  submitError.value = ''
  if (!validate()) {
    submitError.value = 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาตรวจสอบข้อมูลอีกครั้ง'
    return
  }

  try {
    await $fetch(`${config.public.apiBase}/auth/change-password`, {
      method: 'POST',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }
    })
    router.push('/profile')
  } catch (err) {
    submitError.value = err?.data?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาตรวจสอบข้อมูลอีกครั้ง'
  }
}

const handleCancel = () => {
  router.back()
}
</script>