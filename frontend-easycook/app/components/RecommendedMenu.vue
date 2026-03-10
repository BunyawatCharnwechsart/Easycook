<script setup>
const config = useRuntimeConfig()

const { data: menus } = await useAsyncData('menus', () =>
    $fetch(`${config.public.apiBase}/menu/recommend`)
)
</script>

<template>
    <div class="m-1">
        <div class="flex flex-wrap gap-5">
            <div
                v-for="m in menus"
                :key="m.menuid"
                class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer w-80"
            >
                <!-- รูปภาพ -->
                <div class="relative">
                    <img 
                        v-if="m.cover_image"
                        :src="m.cover_image"
                        :alt="m.menuname"
                        class="w-full h-90 object-cover"
                    >
                    <!-- ปุ่ม bookmark -->
                    <button class="absolute top-2 right-2 bg-white/70 backdrop-blur rounded-full p-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>

                <!-- ข้อมูล -->
                <div class="p-3">
                    <h1 class="font-bold">{{ m.mname }}</h1>
                    <h1 class="font-normal">{{ m.description }}</h1>
                </div>
            </div>
        </div>
    </div>
</template>