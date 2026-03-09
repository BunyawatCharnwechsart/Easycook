<script setup>
const user = ref(null)

onMounted(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
        user.value = JSON.parse(stored)
    }
})
</script>

<template>
    <nav class="w-full bg-white px-8 py-4 border-gray-300 border">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <div class="flex">
            <nuxt-link to="/app/main">
                <img src="/logonavbar.png" alt="logoeasycook" class="h-10 w-auto">
            </nuxt-link>
        </div>

        <ul class="flex items-center gap-20 text-black font-medium">
            <nuxt-link to="/app/recipe">
                <li class="cursor-pointer hover:underline transition-all duration-200">เพิ่มสูตร</li>
            </nuxt-link>
            <nuxt-link to="/app/category">
                <li class="cursor-pointer hover:underline transition-all duration-200">หมวดหมู่</li>
            </nuxt-link>
            <nuxt-link to="/app/about">
                <li class="cursor-pointer hover:underline transition-all duration-200">เกี่ยวกับ</li>
            </nuxt-link>
        </ul>

        <ul class="flex items-center gap-4">

            <!-- ยังไม่ได้ login -->
            <template v-if="!user">
                <li>
                    <button class="px-4 py-2 text-black cursor-pointer hover:underline transition-all duration-200">
                        <nuxt-link to="/auth/login">เข้าสู่ระบบ</nuxt-link>
                    </button>
                </li>
                <li>
                    <button class="px-4 py-2 bg-[#2C9A40] text-white rounded-lg hover:bg-black transition-colors duration-200 cursor-pointer">
                        <nuxt-link to="/auth/register">ลงทะเบียน</nuxt-link>
                    </button>
                </li>
            </template>

            <!-- login แล้ว -->
            <template v-else>
                <li class="font-medium text-gray-700">
                    สวัสดี, {{ user.name }}
                </li>
            </template>

        </ul>

        </div>
    </nav>
</template>