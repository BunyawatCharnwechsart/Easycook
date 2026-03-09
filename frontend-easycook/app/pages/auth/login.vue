<script setup>
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const config = useRuntimeConfig()
const showPassword = ref(false)

const identifier = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    errorMessage.value = ''

    if (!identifier.value || !password.value) {
        errorMessage.value = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        return
    }

    isLoading.value = true

    try {
        const res = await fetch(`${config.public.apiBase}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: identifier.value,
                password: password.value,
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            errorMessage.value = data.message || 'เกิดข้อผิดพลาด'
            return
        }

        // เก็บ token และ user ไว้ใน localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        navigateTo('/app/main')

    } catch {
        errorMessage.value = 'ไม่สามารถเชื่อมต่อ server ได้'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex">

        <!-- LEFT IMAGE -->
        <div class="hidden md:block flex-[1.9] relative">
            <img src="/Easycook mian.png" class="absolute inset-0 w-full h-full object-cover object-left" >
        </div>

        <!-- RIGHT FORM -->
        <div class="flex-1 flex items-center justify-center bg-white">
            <div class="w-full max-w-md p-12 bg-white rounded-3xl shadow-xl">

                <!-- LOGO -->
                <div class="flex justify-center mb-6">
                    <img src="/logomain.png" alt="EasyCook Logo" class="h-14 object-contain" >
                </div>

                <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">
                    เข้าสู่ระบบ
                </h2>

                <form class="space-y-5" @submit.prevent="handleLogin">

                    <!-- Username / Email -->
                    <div>
                        <label class="block text-sm text-gray-600">ชื่อผู้ใช้งาน หรือ อีเมล</label>
                        <input
                            v-model="identifier" type="text" placeholder="กรอกชื่อผู้ใช้งานหรืออีเมล"
                            class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" >
                    </div>

                    <!-- Password -->
                    <div>
                        <label class="block text-sm text-gray-600">รหัสผ่าน</label>
                        <div class="relative mt-1">
                            <input
                                v-model="password" :type="showPassword ? 'text' : 'password'"
                                placeholder="กรอกรหัสผ่าน"
                                class="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-green-500" >
                            <button
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition"
                                type="button" @click="showPassword = !showPassword"
                                >
                                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                <EyeSlashIcon v-else class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div class="text-right">
                        <a href="#" class="text-sm text-blue-500 hover:underline">ลืมรหัสผ่าน?</a>
                    </div>

                    <!-- ERROR -->
                    <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

                    <!-- BUTTON -->
                    <button
                        type="submit" :disabled="isLoading"
                        class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                    </button>

                    <p class="text-center text-sm mt-4">
                        ยังไม่มีบัญชี?
                        <NuxtLink to="/auth/register" class="text-green-600 font-medium hover:underline">
                            สมัครบัญชี
                        </NuxtLink>
                    </p>

                </form>
            </div>
        </div>
    </div>
</template>