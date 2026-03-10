<script setup>
const user = ref(null)
const showDropdown = ref(false)
const dropdownRef = ref(null)

onMounted(() => {
    const stored = localStorage.getItem('user')
    if (stored) user.value = JSON.parse(stored)

    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false
    }
}

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = null
    showDropdown.value = false
    navigateTo('/auth/login')
}
</script>

<template>
    <nav class="w-full bg-white px-8 py-4 border-gray-300 border">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <div class="flex">
            <nuxt-link to="/main">
                <img src="/Logonavbar.png" alt="logoeasycook" class="h-10 w-auto">
            </nuxt-link>
        </div>

        <ul class="flex items-center gap-20 text-black font-medium">
            <nuxt-link to="/recipe">
                <li class="cursor-pointer hover:underline transition-all duration-200">เพิ่มสูตร</li>
            </nuxt-link>
            <nuxt-link to="/category-pagination">
                <li class="cursor-pointer hover:underline transition-all duration-200">หมวดหมู่</li>
            </nuxt-link>
            <nuxt-link to="/about">
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
                <li ref="dropdownRef" class="relative">
                    <!-- Profile button -->
                    <button class="flex items-center" @click="showDropdown = !showDropdown">
                        <img
                            :src="user.profile_image || `https://ui-avatars.com/api/?name=${user?.name}&background=16a34a&color=fff`"
                            alt="profile"
                            class="w-9 h-9 rounded-full object-cover cursor-pointer">
                    </button>

                    <!-- Dropdown -->
                    <div
                        v-if="showDropdown"
                        v-click-outside="() => showDropdown = false"
                        class="absolute right-0 mt-3 px-3 w-70 bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                        <!-- User info -->
                        <div class="flex items-center gap-3 px-4 py-4 border-">
                            <img
                                :src="user.profile_image || `https://ui-avatars.com/api/?name=${user?.name}&background=16a34a&color=fff`"
                                alt="profile"
                                class="w-12 h-12 rounded-full object-cover">
                            <div>
                                <p class="font-semibold text-sm">{{ user.name }}</p>
                                <p class="text-xs text-gray-400">@{{ user.username }}</p>
                            </div>
                        </div>

                        <!-- Menu items -->
                        <nuxt-link to="/app/profile" @click="showDropdown = false">
                            <div class="px-4 py-4 text-center font-medium hover:bg-gray-200 cursor-pointer rounded-xl border- transition">
                                โปรไฟล์
                            </div>
                        </nuxt-link>

                        <nuxt-link to="/auth/resetpassword" @click="showDropdown = false">
                            <div class="px-4 py-4 text-center font-medium hover:bg-gray-200 cursor-pointer rounded-xl border- transition">
                                เปลี่ยนรหัสผ่าน
                            </div>
                        </nuxt-link>

                        <!-- Logout -->
                        <div class="px-4 py-4">
                            <button
                                class="cursor-pointer w-full flex items-center justify-center gap-2 border border-red-400 text-red-500 py-2 rounded-xl hover:bg-red-50 transition"
                                @click="handleLogout">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                                </svg>
                                ลงชื่อออก
                            </button>
                        </div>

                    </div>
                </li>
            </template>

        </ul>

        </div>
    </nav>
</template>