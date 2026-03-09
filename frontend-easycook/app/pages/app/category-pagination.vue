<template>
    <div style="font-family: 'Bai Jamjuree'">
        <navBar />

        <section class="flex flex-col items-center justify-center px-4 py-8 gap-8">
            <div class="flex gap-3 items-center relative">
                <!-- Search Input -->
                <div class="relative border border-gray-300 w-100 h-10 rounded-xl flex items-center">
                    <input
                        v-model="searchQuery"
                        @keyup.enter="doSearch"
                        type="text"
                        class="w-full h-full px-3 rounded-xl outline-none"
                        placeholder="ค้นหาเมนูอาหาร..."
                    >
                    <img src="/searchIcon.png" alt="searchIcon" class="w-5 h-5 object-contain absolute right-3">
                </div>

                <!-- ค้นหา Button -->
                <button @click="doSearch" class="bg-[#2C9A40] px-4 w-20 h-10 rounded-xl text-white cursor-pointer">
                    ค้นหา
                </button>

                <!-- หมวดหมู่ Dropdown -->
                <div class="relative" ref="dropdownRef">
                    <button @click="toggleDropdown"
                        class="px-4 w-48 h-10 rounded-xl text-gray-700 cursor-pointer border border-gray-300 bg-white flex items-center justify-between gap-2">
                        <span>ตัวเลือกหมวดหมู่</span>
                        <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Dropdown Panel -->
                    <div v-if="isOpen"
                        class="absolute top-12 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-6 w-[700px]">
                        <div class="mb-4">
                            <span class="font-bold text-lg">หมวดหมู่</span>
                            <span class="text-gray-400 text-sm ml-2">เลือกหมวดหมู่ที่ต้องการค้นหา</span>
                        </div>

                        <div class="flex gap-4">
                            <div class="flex-1">
                                <p class="font-semibold mb-3">หมวดหมู่อาหารหลัก</p>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="cat in mainCategories" :key="cat"
                                        @click="toggleCategory(cat, 'main')" :class="[
                                            'px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                                            selectedMain.includes(cat)
                                                ? 'bg-[#2C9A40] text-white border-[#2C9A40]'
                                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-[#2C9A40]'
                                        ]">
                                        {{ cat }}
                                    </button>
                                </div>
                            </div>
                            <div class="w-px bg-gray-200 mx-2"></div>
                            <div class="flex-1">
                                <p class="font-semibold mb-3">หมวดหมู่ตามประเภทการปรุง</p>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="cat in cookingCategories" :key="cat"
                                        @click="toggleCategory(cat, 'cooking')" :class="[
                                            'px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                                            selectedCooking.includes(cat)
                                                ? 'bg-[#2C9A40] text-white border-[#2C9A40]'
                                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-[#2C9A40]'
                                        ]">
                                        {{ cat }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                            <button @click="clearAll" class="text-gray-500 hover:text-gray-700 text-sm cursor-pointer">
                                ล้างทั้งหมด
                            </button>
                            <button @click="confirmSearch"
                                class="bg-[#2C9A40] text-white px-6 py-2 rounded-xl text-sm cursor-pointer hover:bg-[#237a32]">
                                ค้นหมวดหมู่
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== โหมดปกติ: แสดง RecommendedSection ===== -->
        <section v-if="!hasSearched">
            <div class="flex flex-col w-full mt-10">
                <h1 class="ml-10 text-4xl font-bold">หมวดหมู่แนะนำ</h1>
                <section class="m-10">
                    <RecommendedSection />
                </section>
                <h1 class="ml-10 mt-10 text-4xl font-bold">เมนูอาหารที่แนะนำ</h1>
                <section class="m-10">
                    <Cardmenu />
                </section>
            </div>
        </section>

        <!-- ===== โหมดค้นหา: แสดงผลลัพธ์ + pagination ===== -->
        <section v-else class="px-10 mt-10">
            <h1 class="text-4xl font-bold mb-2">รายการเมนูที่ค้นหาพบ</h1>
            <p class="text-gray-400 text-sm mb-8">
                พบ {{ totalResults }} รายการ
                <span v-if="searchQuery"> สำหรับ "{{ searchQuery }}"</span>
            </p>

            <!-- Loading -->
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="w-10 h-10 border-4 border-[#2C9A40] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- ไม่พบผลลัพธ์ -->
            <div v-else-if="paginatedResults.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-lg">ไม่พบเมนูที่ตรงกับการค้นหา</p>
            </div>

            <!-- Grid ผลลัพธ์ -->
            <div v-else class="grid grid-cols-2 gap-6">
                <div
                    v-for="m in paginatedResults"
                    :key="m.menuid"
                    class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer flex"
                >
                    <!-- รูปภาพซ้าย -->
                    <div class="relative w-48 shrink-0">
                        <img v-if="m.cover_image" :src="m.cover_image" :alt="m.mname" class="w-full h-full object-cover">
                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span class="text-gray-400 text-xs">ไม่มีรูปภาพ</span>
                        </div>
                    </div>

                    <!-- ข้อมูลขวา -->
                    <div class="flex flex-col justify-between p-4 flex-1">
                        <div>
                            <div class="flex justify-between items-start">
                                <h2 class="font-bold text-base">{{ m.mname }}</h2>
                                <button class="text-gray-400 hover:text-gray-600 shrink-0 ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </div>
                            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ m.description }}</p>
                            <div class="flex flex-wrap gap-2 mt-3">
                                <span v-if="m.categoryname"
                                    class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                                    {{ m.categoryname }}
                                </span>
                                <span v-if="m.cooktime"
                                    class="text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-full border border-orange-200">
                                    ⏱ {{ m.cooktime }} นาที
                                </span>
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center gap-2 mt-4">
                                <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    <img v-if="m.author_avatar" :src="m.author_avatar" class="w-full h-full object-cover" />
                                </div>
                                <p class="text-sm font-medium leading-tight">{{ m.author_name }}</p>
                            </div>
                            <div class="flex justify-end items-center mt-3 text-sm text-gray-500 hover:text-gray-700 gap-1">
                                <span>กดเพื่อเพิ่มเติม</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12 mb-10">
                <!-- ปุ่มย้อนกลับ -->
                <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="w-9 h-9 rounded-full border flex items-center justify-center transition"
                    :class="currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:border-[#2C9A40] hover:text-[#2C9A40] cursor-pointer'"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <!-- เลขหน้า -->
                <template v-for="page in displayedPages" :key="page">
                    <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
                    <button v-else
                        @click="goToPage(page)"
                        class="w-9 h-9 rounded-full border text-sm font-medium transition cursor-pointer"
                        :class="page === currentPage
                            ? 'bg-[#2C9A40] text-white border-[#2C9A40]'
                            : 'text-gray-600 border-gray-300 hover:border-[#2C9A40] hover:text-[#2C9A40]'"
                    >
                        {{ page }}
                    </button>
                </template>

                <!-- ปุ่มถัดไป -->
                <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="w-9 h-9 rounded-full border flex items-center justify-center transition"
                    :class="currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:border-[#2C9A40] hover:text-[#2C9A40] cursor-pointer'"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>

        <aboutFooter />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import navBar from "~/components/NavBar.vue";
import RecommendedSection from '~/components/RecommendedSection.vue';
import Cardmenu from '~/components/CardMenu.vue';
import aboutFooter from '~/components/AboutFooter.vue';

const config = useRuntimeConfig()

// ===== Search State =====
const searchQuery = ref('')
const hasSearched = ref(false)
const isLoading = ref(false)
const searchResults = ref([])
const currentPage = ref(1)
const ITEMS_PER_PAGE = 16

// ===== Dropdown State =====
const isOpen = ref(false)
const dropdownRef = ref(null)

const mainCategories = [
    "อาหารจานเดียว", "อาหารจานหลัก",
    "อาหารจานด่วน", "อาหารตามสั่ง",
    "อาหารเมนูเส้น", "อาหารไทย",
    "อาหารนานาชาติ", "อาหารสุขภาพ",
    "อาหารมังสวิรัติ/เจ", "อาหารหวาน/ของหวาน",
    "เครื่องดื่ม"
]

const cookingCategories = [
    "ผัด", "ทอด", "ต้ม", "ครุก / ยำ",
    "นึ่ง", "ย่าง", "อบ", "ตุ๋น",
    "หมัก", "ดอง", "รมควัน", "ผัดน้ำ",
    "แกง"
]

const selectedMain = ref([])
const selectedCooking = ref([])

// ===== Computed =====
const totalResults = computed(() => searchResults.value.length)
const totalPages = computed(() => Math.ceil(totalResults.value / ITEMS_PER_PAGE))

const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE
    return searchResults.value.slice(start, start + ITEMS_PER_PAGE)
})

const displayedPages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const pages = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
    } else {
        pages.push(1)
        if (current > 3) pages.push('...')
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
            pages.push(i)
        }
        if (current < total - 2) pages.push('...')
        pages.push(total)
    }
    return pages
})

// ===== Methods =====
const doSearch = async () => {
    isLoading.value = true
    hasSearched.value = true
    currentPage.value = 1

    try {
        const params = new URLSearchParams()
        if (searchQuery.value) params.append('q', searchQuery.value)
        selectedMain.value.forEach(c => params.append('main', c))
        selectedCooking.value.forEach(c => params.append('cooking', c))

        const data = await $fetch(`${config.public.apiBase}/menu/search?${params.toString()}`)
        searchResults.value = data
    } catch (err) {
        console.error(err)
        searchResults.value = []
    } finally {
        isLoading.value = false
    }
}

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleDropdown = () => { isOpen.value = !isOpen.value }

const toggleCategory = (cat, type) => {
    if (type === 'main') {
        const idx = selectedMain.value.indexOf(cat)

        if (idx === -1) {
        selectedMain.value.push(cat)
        } else {
        selectedMain.value.splice(idx, 1)
        }

    } else {
        const idx = selectedCooking.value.indexOf(cat)

        if (idx === -1) {
        selectedCooking.value.push(cat)
        } else {
        selectedCooking.value.splice(idx, 1)
        }
  }
}

const clearAll = () => {
    selectedMain.value = []
    selectedCooking.value = []
}

const confirmSearch = () => {
    isOpen.value = false
    doSearch()
}

const handleClickOutside = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside))
onUnmounted(() => document.removeEventListener("mousedown", handleClickOutside))
</script>