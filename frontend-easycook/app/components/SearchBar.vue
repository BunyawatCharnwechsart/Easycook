<template>
    <section class="flex flex-col items-center justify-center px-4 py-8 gap-8">
        <div class="flex gap-3 items-center relative">

            <!-- Search Input -->
            <div class="relative border border-gray-300 w-100 h-10 rounded-xl flex items-center">
                <input
                    v-model="localQuery"
                    type="text"
                    class="w-full h-full px-3 rounded-xl outline-none"
                    placeholder="ค้นหาเมนูอาหาร..."
                    @keyup.enter="handleSearch"
                >
                <img src="/searchIcon.png" alt="searchIcon" class="w-5 h-5 object-contain absolute right-3">
            </div>

            <!-- ค้นหา Button -->
            <button
                class="bg-[#2C9A40] px-4 w-20 h-10 rounded-xl text-white cursor-pointer"
                @click="handleSearch"
            >
                ค้นหา
            </button>

            <!-- หมวดหมู่ Dropdown -->
            <div ref="dropdownRef" class="relative">
                <button
                    class="px-4 w-48 h-10 rounded-xl text-gray-700 cursor-pointer border border-gray-300 bg-white flex items-center justify-between gap-2"
                    @click="toggleDropdown"
                >
                    <span>ตัวเลือกหมวดหมู่</span>
                    <!-- badge จำนวนที่เลือก -->
                    <span v-if="selectedCategories.length > 0" class="bg-[#2C9A40] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {{ selectedCategories.length }}
                    </span>
                    <svg v-else class="w-4 h-4 transition-transform shrink-0" :class="{ 'rotate-180': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Dropdown Panel -->
                <div v-if="isOpen" class="absolute top-12 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-6 w-96">
                    <div class="mb-4">
                        <span class="font-bold text-lg">หมวดหมู่</span>
                        <span class="text-gray-400 text-sm ml-2">เลือกหมวดหมู่ที่ต้องการค้นหา</span>
                    </div>

                    <!-- Loading -->
                    <div v-if="loadingCategories" class="flex justify-center py-6">
                        <div class="w-6 h-6 border-2 border-[#2C9A40] border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    <!-- Category Pills -->
                    <div v-else class="flex flex-wrap gap-2">
                        <button
                            v-for="cat in categories"
                            :key="cat.categoryid"
                            :class="[
                                'px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                                selectedCategories.includes(cat.categoryid)
                                    ? 'bg-[#2C9A40] text-white border-[#2C9A40]'
                                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-[#2C9A40]'
                            ]"
                            @click="toggleCategory(cat.categoryid)"
                        >
                            {{ cat.categoryname }}
                        </button>
                    </div>

                    <div class="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                        <button class="text-gray-500 hover:text-gray-700 text-sm cursor-pointer" @click="clearAll">
                            ล้างทั้งหมด
                        </button>
                        <button
                            class="bg-[#2C9A40] text-white px-6 py-2 rounded-xl text-sm cursor-pointer hover:bg-[#237a32]"
                            @click="handleSearch"
                        >
                            ค้นหมวดหมู่
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const config = useRuntimeConfig()
const emit = defineEmits(['search'])

const localQuery = ref('')
const isOpen = ref(false)
const dropdownRef = ref(null)

// ===== Categories จาก API =====
const categories = ref([])
const loadingCategories = ref(false)
const selectedCategories = ref([])   // เก็บ categoryid ที่เลือก

const fetchCategories = async () => {
    loadingCategories.value = true
    try {
        const data = await $fetch(`${config.public.apiBase}/category`)
        categories.value = data
    } catch (err) {
        console.error(err)
    } finally {
        loadingCategories.value = false
    }
}

const toggleCategory = (categoryid) => {
    const idx = selectedCategories.value.indexOf(categoryid)
    if (idx === -1) selectedCategories.value.push(categoryid)
    else selectedCategories.value.splice(idx, 1)
}

const clearAll = () => {
    selectedCategories.value = []
}

// ===== Search =====
const handleSearch = () => {
    isOpen.value = false
    emit('search', {
        query: localQuery.value,
        categoryIds: [...selectedCategories.value]   // ← ส่ง id แทน string
    })
}

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const handleClickOutside = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    fetchCategories()
    document.addEventListener('mousedown', handleClickOutside)
})
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>