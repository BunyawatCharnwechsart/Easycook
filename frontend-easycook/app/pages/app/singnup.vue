<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'รหัสผ่านไม่ตรงกัน'
    return
  }

  successMessage.value = 'สมัครบัญชีสำเร็จ 🎉'
}
</script>

<template>
  <div class="min-h-screen flex">

    <!-- LEFT IMAGE -->
    <div class="hidden md:block flex-[1.9] relative">
      <img
        src="/Easycook mian.png"
        class="absolute inset-0 w-full h-full object-cover object-left"
      />
    </div>

    <!-- RIGHT FORM -->
    <div class="flex-1 flex items-center justify-center bg-white">
    <div class="w-full max-w-md p-12 bg-white rounded-3xl shadow-xl">

        <!-- LOGO -->
        <div class="flex justify-center mb-4">
          <img src="/logomain.png" class="h-12" />
        </div>

        <h2 class="text-2xl font-bold text-center mb-6">
          สมัครบัญชี
        </h2>

        <form class="space-y-5" @submit.prevent="handleRegister">

          <!-- Username -->
          <div>
            <label class="block text-sm text-gray-600">ชื่อผู้ใช้</label>
            <input
              v-model="username"
              type="text"
              class="w-full mt-1 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm text-gray-600">อีเมล</label>
            <input
              v-model="email"
              type="email"
              class="w-full mt-1 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm text-gray-600">รหัสผ่าน</label>
            <div class="relative mt-1">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm text-gray-600">ยืนยันรหัสผ่าน</label>
            <div class="relative mt-1">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition"
              >
                <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- ERROR -->
          <p v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </p>

          <!-- SUCCESS -->
          <p v-if="successMessage" class="text-green-600 text-sm">
            {{ successMessage }}
          </p>

          <!-- BUTTON -->
          <button
            type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-medium"
          >
            สมัครบัญชี
          </button>

          <p class="text-center text-sm mt-3">
            มีบัญชีแล้ว?
            <NuxtLink to="/app/login" class="text-green-600 font-medium hover:underline">
              เข้าสู่ระบบ
            </NuxtLink>
          </p>

        </form>

      </div>
    </div>

  </div>
</template>
