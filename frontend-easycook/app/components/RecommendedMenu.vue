<script setup>
const config = useRuntimeConfig()

const { data: menus } = await useAsyncData('menus', () =>
    $fetch(`${config.public.apiBase}/menu/recommend`)
)

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
    } catch (err) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
})

async function toggleSave(e, menuid) {
    e.preventDefault()
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
        if (isSaved) {
            savedIds.value.delete(menuid)
        } else {
            savedIds.value.add(menuid)
        }
        savedIds.value = new Set(savedIds.value) // trigger reactivity
    } catch (err) {
        return c.json({ error: err?.message || String(err) }, 500)
    }
}
</script>

<template>
    <div class="m-1">
        <div class="flex flex-wrap gap-5">
            <NuxtLink
                v-for="m in menus"
                :key="m.menuid"
                :to="`/app/${m.menuid}`"
                class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer w-80 no-underline text-inherit"
            >
                <!-- รูปภาพ -->
                <div class="relative">
                    <img 
                        v-if="m.cover_image"
                        :src="m.cover_image"
                        :alt="m.menuname"
                        class="w-full h-48 object-cover"
                    >
                    <!-- ปุ่ม bookmark -->
                    <button
                        class="absolute top-2 right-2 bg-white/70 backdrop-blur rounded-full p-1.5 transition-colors"
                        :class="savedIds.has(m.menuid) ? 'text-orange-500' : 'text-gray-500'"
                        @click="(e) => toggleSave(e, m.menuid)"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 cursor-pointer" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                            :fill="savedIds.has(m.menuid) ? 'currentColor' : 'none'">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>

                <!-- ข้อมูล -->
                <div class="p-3">
                    <h1 class="font-bold">{{ m.mname }}</h1>
                    <p class="font-normal text-sm text-gray-500 mt-1">{{ m.description }}</p>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>