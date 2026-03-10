<template>
    <div style="font-family: 'Bai Jamjuree'">
        <navBar />
        <SearchBar @search="onSearch" />

        <!-- ===== โหมดปกติ: หน้าแรก ===== -->
        <section v-if="!hasSearched && !selectedCategoryId">
            <div class="flex flex-col w-full mt-10">
                <h1 class="ml-10 text-4xl font-bold">หมวดหมู่แนะนำ</h1>
                <section class="m-10">
                    <RecommendedSection @category-selected="onCategorySelected" />
                </section>
                <h1 class="ml-10 mt-10 text-4xl font-bold">เมนูอาหารที่แนะนำ</h1>
                <section class="m-10">
                    <CardMenu />
                </section>
            </div>
        </section>

        <!-- ===== โหมดเลือก Category ===== -->
        <section v-else-if="selectedCategoryId && !hasSearched" class="px-10 my-20">
            <button
                class="flex items-center gap-1 text-gray-500 hover:text-[#2C9A40] transition text-sm cursor-pointer mb-4"
                @click="clearCategory">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                กลับหน้าหลัก
            </button>
            <h1 class="text-4xl font-bold mb-2">{{ selectedCategoryName }}</h1>
            <p class="text-gray-400 text-sm mb-8">พบ {{ totalResults }} รายการ</p>
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="w-10 h-10 border-4 border-[#2C9A40] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="paginatedResults.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-lg">ไม่พบเมนูในหมวดหมู่นี้</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-6">
                <MenuCard v-for="m in paginatedResults" :key="m.menuid" :menu="m" />
            </div>
            <PaginationBar :current-page="currentPage" :total-pages="totalPages" :displayed-pages="displayedPages" @go-to-page="goToPage" />
        </section>

        <!-- ===== โหมดค้นหา ===== -->
        <section v-else class="px-10 mt-20 mb-30">
            <button
                class="flex items-center gap-1 text-gray-500 hover:text-[#2C9A40] transition text-sm cursor-pointer mb-6"
                @click="clearSearch">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                กลับหน้าหลัก
            </button>
            <h1 class="text-4xl font-bold mb-2">รายการเมนูที่ค้นหาพบ</h1>
            <p class="text-gray-400 text-sm mb-8">
                พบ {{ totalResults }} รายการ
                <span v-if="searchQuery"> สำหรับ "{{ searchQuery }}"</span>
            </p>
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="w-10 h-10 border-4 border-[#2C9A40] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="paginatedResults.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-lg">ไม่พบเมนูที่ตรงกับการค้นหา</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-6">
                <MenuCard v-for="m in paginatedResults" :key="m.menuid" :menu="m" />
            </div>
            <PaginationBar :current-page="currentPage" :total-pages="totalPages" :displayed-pages="displayedPages" @go-to-page="goToPage" />
        </section>

        <aboutFooter />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from "vue"
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()

// ── Saved state ───────────────────────────────────────────
const savedIds = ref(new Set())

onMounted(async () => {
    const stored = localStorage.getItem('user')
    if (!stored) return
    const uid = JSON.parse(stored).id
    const token = localStorage.getItem('token')
    try {
        const data = await $fetch(`${config.public.apiBase}/savedmenu/${uid}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        savedIds.value = new Set(data.map(m => m.menuid))
    } catch(err) {
        return console.log(err)
    }
})

async function toggleSave(e, menuid) {
    e?.preventDefault()
    const stored = localStorage.getItem('user')
    if (!stored) return navigateTo('/auth/login')
    const uid = JSON.parse(stored).id
    const token = localStorage.getItem('token')
    const isSaved = savedIds.value.has(menuid)
    try {
        await $fetch(`${config.public.apiBase}/savedmenu`, {
            method: isSaved ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: { uid, menuid }
        })
        if (isSaved) { savedIds.value.delete(menuid) } else { savedIds.value.add(menuid) }
        savedIds.value = new Set(savedIds.value)
    } catch(err) {
        return console.log(err)
    }
}

provide('savedIds', savedIds)
provide('toggleSave', toggleSave)

// ── Search / Category ─────────────────────────────────────
const searchQuery = ref('')
const hasSearched = ref(false)
const isLoading = ref(false)
const searchResults = ref([])
const currentPage = ref(1)
const ITEMS_PER_PAGE = 16

const selectedCategoryId = ref(null)
const selectedCategoryName = ref('')

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
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
        if (current < total - 2) pages.push('...')
        pages.push(total)
    }
    return pages
})

const onSearch = async ({ query, categoryIds }) => {
    searchQuery.value = query
    hasSearched.value = true
    selectedCategoryId.value = null
    currentPage.value = 1
    isLoading.value = true
    searchResults.value = []
    try {
        const params = new URLSearchParams()
        if (query) params.append('q', query)
        categoryIds.forEach(id => params.append('categoryId', id))
        const data = await $fetch(`${config.public.apiBase}/menu/search?${params.toString()}`)
        searchResults.value = data
    } catch (err) {
        console.error(err)
        searchResults.value = []
    } finally {
        isLoading.value = false
    }
}

const clearSearch = () => {
    hasSearched.value = false
    searchQuery.value = ''
    searchResults.value = []
    currentPage.value = 1
}

const onCategorySelected = async ({ categoryid, categoryname }) => {
    selectedCategoryId.value = categoryid
    selectedCategoryName.value = categoryname
    hasSearched.value = false
    currentPage.value = 1
    isLoading.value = true
    searchResults.value = []
    try {
        const data = await $fetch(`${config.public.apiBase}/category/${categoryid}/menu`)
        searchResults.value = data
    } catch (err) {
        console.error(err)
        searchResults.value = []
    } finally {
        isLoading.value = false
    }
}

const clearCategory = () => {
    selectedCategoryId.value = null
    selectedCategoryName.value = ''
    searchResults.value = []
    currentPage.value = 1
}

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
    const q = route.query.q
    const categoryId = route.query.categoryId
    const categoryName = route.query.categoryName
    if (q) {
        onSearch({ query: q, categoryIds: [] })
    } else if (categoryId) {
        onCategorySelected({ categoryid: categoryId, categoryname: categoryName })
    }
})
</script>