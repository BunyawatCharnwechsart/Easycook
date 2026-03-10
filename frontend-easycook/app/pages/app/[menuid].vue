<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const menuid = Number(route.params.menuid)

const { data: menu, pending, error } = await useFetch(`${config.public.apiBase}/menu/${menuid}`)

const isSaved = ref(false)

onMounted(async () => {
    const stored = localStorage.getItem('user')
    if (!stored) return

    const uid = JSON.parse(stored).id
    const token = localStorage.getItem('token')
    try {
        const data = await $fetch(`${config.public.apiBase}/savedmenu/${uid}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        isSaved.value = data.some(m => m.menuid === menuid)
    } catch(err) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

async function toggleSave() {
    const stored = localStorage.getItem('user')
    if (!stored) return navigateTo('/auth/login')

    const uid = JSON.parse(stored).id
    const token = localStorage.getItem('token')

    try {
        await $fetch(`${config.public.apiBase}/savedmenu`, {
            method: isSaved.value ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: { uid, menuid }
        })
        isSaved.value = !isSaved.value
    } catch(err) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
}
</script>

<template>
    <div class="min-h-screen bg-white font-sans text-gray-900">
        <navBar />

        <!-- Loading -->
        <div v-if="pending" class="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-gray-400">
            <div class="w-10 h-10 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin"></div>
            <p>กำลังโหลด...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error || !menu" class="flex items-center justify-center min-h-[50vh] text-gray-400">
            <p>ไม่พบเมนูนี้</p>
        </div>

        <main v-else>
            <!-- Hero Section -->
            <section class="py-20">
                <div class="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row gap-8 items-start">

                    <!-- Left: Image -->
                    <div class="shrink-0 w-full sm:w-56 h-56 rounded-xl overflow-hidden shadow-lg">
                        <img
                            :src="menu.cover_image || '/placeholder-food.jpg'" :alt="menu.mname"
                            class="w-full h-full object-cover">
                    </div>

                    <!-- Right: Info -->
                    <div class="flex-1 flex flex-col gap-3">

                        <!-- Author -->
                        <div class="flex items-center gap-3">
                            <img
                                :src="menu.profile_image || `https://ui-avatars.com/api/?name=${menu?.author_name}&background=16a34a&color=fff`"
                                :alt="menu.author_name"
                                class="w-11 h-11 rounded-full object-cover border-2 border-gray-100">
                            <div class="flex flex-col">
                                <span class="text-sm font-semibold text-gray-900">{{ menu.author_name }}</span>
                                <span class="text-xs text-gray-400">#{{ menu.author_username }}</span>
                            </div>
                        </div>

                        <!-- Badges -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-orange-50 text-orange-500 border border-orange-200">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M3 12h18M3 18h18" />
                                </svg>
                                {{ menu.categoryname }}
                            </span>
                            <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                เวลา {{ menu.cooktime }} นาที
                            </span>
                            <!-- ปุ่ม bookmark -->
                            <button
                                class="ml-auto w-9 h-9 flex items-center justify-center rounded-lg border transition-colors"
                                :class="isSaved
                                    ? 'border-orange-400 bg-orange-50 text-orange-500'
                                    : 'border-gray-200 bg-white text-gray-400 hover:border-orange-400 hover:text-orange-500'"
                                @click="toggleSave">
                                <svg 
                                    width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                    :fill="isSaved ? 'currentColor' : 'none'">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            </button>
                        </div>

                        <!-- Title -->
                        <h1 class="text-2xl font-bold text-gray-900 leading-snug">{{ menu.mname }}</h1>

                        <!-- Description -->
                        <p class="text-sm text-gray-500 leading-relaxed">{{ menu.description }}</p>
                    </div>
                </div>
            </section>

            <!-- Content -->
            <div class="max-w-3xl mx-auto px-6 pb-16">

                <!-- Ingredients -->
                <section class="mt-8 mb-10">
                    <h2 class="text-lg font-bold text-gray-900 pb-2.5 mb-5 border-b-2 border-gray-100">วัตถุดิบ</h2>
                    <div class="grid grid-cols-3 gap-y-2 gap-x-10">
                        <div
                            v-for="item in menu.ingredients" :key="item.ingredient_order"
                            class="relative pl-3.5 text-sm text-gray-600 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-500">
                            {{ item.ingredient_name }}
                        </div>
                    </div>
                </section>

                <!-- Steps -->
                <section class="flex flex-col gap-9">
                    <div v-for="step in menu.steps" :key="step.step_order" class="flex flex-col gap-3">
                        <h3 class="text-base font-bold text-orange-500">ขั้นตอนที่ {{ step.step_order }}</h3>
                        <p class="text-sm text-gray-600 leading-loose">{{ step.step }}</p>
                        <img
                            v-if="step.step_image" :src="step.step_image" :alt="`ขั้นตอนที่ ${step.step_order}`"
                            class="w-full max-w-lg rounded-xl object-cover mt-1">
                    </div>
                </section>
            </div>
        </main>

        <AboutFooter />
    </div>
</template>