<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')

const handleResetPassword = () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        return
    }

    if (password.value.length < 6) {
        errorMessage.value = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'รหัสผ่านไม่ตรงกัน'
        return
    }

    successMessage.value = 'ตั้งรหัสผ่านใหม่สำเร็จ'
}
</script>

<template>
    <div class="min-h-screen flex">

        <!-- LEFT IMAGE -->
        <div class="hidden md:block flex-[1.9] relative">
            <img src="/easycook-mian.png" class="absolute inset-0 w-full h-full object-cover object-left" />
        </div>

        <!-- RIGHT FORM -->
        <div class="flex-1 flex items-center justify-center bg-white">

            <div class="w-full max-w-md p-10 bg-white rounded-3xl shadow-lg">

                <!-- LOGO -->
                <div class="flex justify-center mb-5">
                    <img src="/logomain.png" class="h-10" />
                </div>

                <h2 class="text-2xl font-bold text-center mb-6">
                    ลืมรหัสผ่าน
                </h2>

                <form class="space-y-5" @submit.prevent="handleResetPassword">

                    <!-- Email -->
                    <div>
                        <label class="block text-sm text-gray-600">อีเมลที่ใช้ล็อกอิน</label>
                        <input v-model="email" type="email" placeholder="กรอกอีเมลของคุณ"
                            class="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm text-gray-600">รหัสผ่านใหม่</label>

                        <div class="relative mt-1">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-green-500" />

                            <button type="button" @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Confirm -->
                    <div>
                        <label class="block text-sm text-gray-600">ยืนยันรหัสผ่านใหม่</label>

                        <div class="relative mt-1">
                            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-green-500" />

                            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
                    <button type="submit"
                        class="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                        ตั้งรหัสผ่านใหม่
                    </button>

                    <p class="text-center text-sm">
                        กลับไป
                        <NuxtLink to="/app/login" class="text-green-600 hover:underline">
                            เข้าสู่ระบบ
                        </NuxtLink>
                    </p>

                </form>

            </div>

        </div>

    </div>
</template>