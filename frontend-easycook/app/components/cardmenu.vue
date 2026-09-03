<script setup>
const config = useRuntimeConfig()

const { data: menus } = await useAsyncData('menus', () =>
    $fetch(`${config.public.apiBase}/menu`)
)

// เก็บ set ของ menuid ที่ user บันทึกไว้
const savedIds = ref(new Set())

// โหลด saved list ตอน mount
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
    }catch (err) {
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
        // อัปเดต UI ทันที
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
    <div>
        <div class="grid grid-cols-2 gap-6">
            <NuxtLink
                v-for="m in menus"
                :key="m.menuid"
                :to="`/app/${m.menuid}`"
                class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer flex no-underline text-inherit"
            >
                <!-- รูปภาพซ้าย -->
                <div class="relative w-48 shrink-0">
                    <img
                        v-if="m.cover_image"
                        :src="m.cover_image"
                        :alt="m.mname"
                        class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-400 text-xs">ไม่มีรูปภาพ</span>
                    </div>
                </div>

                <!-- ข้อมูลขวา -->
                <div class="flex flex-col justify-between p-4 flex-1">
                    <div>
                        <!-- ชื่อ + bookmark -->
                        <div class="flex justify-between items-start">
                            <h2 class="font-bold text-base">{{ m.mname }}</h2>
                            <button
                                class="shrink-0 ml-2 transition-colors"
                                :class="savedIds.has(m.menuid) ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
                                @click="(e) => toggleSave(e, m.menuid)"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 cursor-pointer" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                    :fill="savedIds.has(m.menuid) ? 'currentColor' : 'none'">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>

                        <!-- คำอธิบาย -->
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ m.description }}</p>

                        <!-- Tags หมวดหมู่ + เวลา -->
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span
                                v-if="m.categoryname"
                                class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200"
                            >
                                {{ m.categoryname }}
                            </span>
                            <span
                                v-if="m.cooktime"
                                class="text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-full border border-orange-200"
                            >
                                ⏱ {{ m.cooktime }} นาที
                            </span>
                        </div>
                    </div>

                    <!-- ผู้โพสต์ + กดเพื่อเพิ่มเติม -->
                    <div>
                        <div class="flex items-center gap-2 mt-4">
                            <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                <img
                                    v-if="m.author_avatar"
                                    :src="m.author_avatar"
                                    class="w-full h-full object-cover"
                                >
                            </div>
                            <div>
                                <p class="text-sm font-medium leading-tight">{{ m.author_name }}</p>
                            </div>
                        </div>

                        <div class="flex justify-end items-center mt-3 text-sm text-gray-500 hover:text-gray-700 gap-1">
                            <span>กดเพื่อเพิ่มเติม</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>