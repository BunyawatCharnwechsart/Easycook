<template>
    <div style="font-family: 'Bai Jamjuree', sans-serif" class="min-h-screen flex flex-col bg-white">
        <!-- Navbar -->
        <navBar />

        <!-- Profile Section -->
        <section class="max-w-5xl mx-auto w-full px-6 pt-16 pb-10">
            <div class="flex items-center gap-8">
                <div class="relative flex-shrink-0">
                    <div class="w-36 h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-gray-200"
                        @click="triggerFileInput">
                        <img
                            v-if="profileImage"
                            :src="profileImage" alt="profile"
                            class="w-full h-full object-cover" />
                        <img
                            v-else-if="user?.name"
                            :src="`https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff&size=144`"
                            class="w-full h-full object-cover" />
                        <div v-else class="flex flex-col items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="1.2">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.4" fill="none" />
                                <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
                            </svg>
                        </div>
                    </div>
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
                </div>

                <div class="flex flex-col gap-2">
                    <h1 class="text-3xl font-bold text-gray-900">{{ user?.name || 'ผู้ใช้งาน' }}</h1>
                    <p class="text-gray-500 text-base">{{ user?.email || '' }}</p>
                    <nuxt-link to="/app/editprofile">
                        <button class="mt-2 px-16 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200 text-sm">
                            แก้ไขโปรไฟล์
                        </button>
                    </nuxt-link>
                </div>
            </div>
        </section>

        <!-- Tabs -->
        <div class="max-w-5xl mx-auto w-full px-6">
            <div class="flex border-b border-gray-200">
                <button v-for="tab in tabs" :key="tab.key"
                    class="flex-1 py-3 text-sm font-medium transition-colors duration-200" :class="activeTab === tab.key
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-400 hover:text-gray-600'" @click="activeTab = tab.key">
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-5xl mx-auto w-full px-6 py-10 flex-1">
            <!-- Empty state (สูตร tab, no recipes) -->
            <div v-if="activeTab === 'recipes' && recipes.length === 0"
                class="flex flex-col items-center justify-center py-20 gap-4">
                <!-- Inline SVG recipe book icon — no external file needed -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-28 h-28 text-gray-300" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="0.8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 class="text-xl font-bold text-gray-500">เจอสูตรถูกใจแล้วใช่ไหม?</h2>
                <p class="text-gray-400 text-sm">เก็บสูตรอร่อยไว้ที่นี่ได้เลย</p>
            </div>

            <!-- Recipe Grid -->
            <div v-if="recipesLoading" class="flex justify-center py-20">
                <svg class="animate-spin w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            </div>

            <div v-else-if="recipesError" class="text-center text-red-500 py-20">{{ recipesError }}</div>

            <div v-else-if="activeTab === 'recipes' && recipes.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <div v-for="(recipe, index) in recipes" :key="recipe.mid"
                    class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative">
                    <div class="relative">
                        <img 
                            :src="recipe.cover_image || 'https://placehold.co/400x300?text=No+Image'"
                            :alt="recipe.mname" class="w-full h-full object-cover" />
                    </div>
                    <div class="p-3 pr-2 flex items-start justify-between">
                        <div>
                            <p class="font-semibold text-gray-800 text-sm leading-snug">{{ recipe.mname }}</p>
                            <p class="text-gray-400 text-xs mt-1 leading-relaxed">{{ recipe.description }}</p>
                        </div>
                        <div class="relative ml-1 flex-shrink-0">
                            <button class="p-1 rounded hover:bg-gray-100" @click="toggleMenu(index)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="5" r="1.5" />
                                    <circle cx="12" cy="12" r="1.5" />
                                    <circle cx="12" cy="19" r="1.5" />
                                </svg>
                            </button>
                            <div v-if="openMenuIndex === index"
                                class="absolute right-0 top-7 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-24 overflow-hidden">
                                <button class="w-full text-left px-4 py-2.5 text-sm text-white bg-green-600 hover:bg-green-700 font-medium">
                                    แก้ไข
                                </button>
                                <button class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                    ลบ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Saved tab empty state -->
            <div v-if="activeTab === 'saved'" class="flex flex-col items-center justify-center py-20 gap-4">
                <div class="flex flex-col items-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-28 h-28" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="0.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-500">ยังไม่มีสูตรที่บันทึกไว้</h2>
                <p class="text-gray-400 text-sm">กดที่ไอคอนบุ๊กมาร์กเพื่อบันทึกสูตร</p>
            </div>
        </div>

        <!-- Footer -->
        <aboutFooter />
    </div>
</template>

<script setup>
import { ref } from "vue"

const config = useRuntimeConfig()

const user = ref(null)
const profileImage = ref(null)
const fileInput = ref(null)
const recipes = ref([])
const recipesLoading = ref(false)
const recipesError = ref('')
const activeTab = ref("recipes")
const openMenuIndex = ref(null)

const tabs = [
    { key: "recipes", label: "สูตร" },
    { key: "saved", label: "บันทึกแล้ว" },
]

function triggerFileInput() { fileInput.value?.click() }

function onFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { profileImage.value = ev.target.result }
    reader.readAsDataURL(file)
}

function toggleMenu(index) {
    openMenuIndex.value = openMenuIndex.value === index ? null : index
}

const fetchUserData = async (uid) => {
    recipesLoading.value = true
    recipesError.value = ''
    try {
        const token = localStorage.getItem('token')
        const data = await $fetch(`${config.public.apiBase}/usermenu/${uid}`, {
            headers: { Authorization: `Bearer ${token}` }
        })

        // อัปเดต user จาก API (ข้อมูลล่าสุด)
        user.value = data.user
        recipes.value = data.menus

    } catch {
        recipesError.value = 'ไม่สามารถโหลดข้อมูลได้'
    } finally {
        recipesLoading.value = false
    }
}

onMounted(async () => {
    const stored = localStorage.getItem('user')
    if (!stored) return navigateTo('/auth/login')

    const localUser = JSON.parse(stored)
    user.value = localUser
    profileImage.value = localUser.profile_image || null

    await fetchUserData(localUser.id)
})
</script>