<script setup>
const config = useRuntimeConfig()

const { data: menus } = await useAsyncData('menus', () =>
    $fetch(`${config.public.apiBase}/menu`)
)
</script>

<template>
    <div>
        <!-- Grid 2 คอลัมน์ แนวนอน -->
        <div class="grid grid-cols-2 gap-6">
            <div
                v-for="m in menus"
                :key="m.menuid"
                class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer flex"
            >
                <!-- รูปภาพซ้าย -->
                <div class="relative w-48 shrink-0">
                    <img
                        v-if="m.cover_image"
                        :src="m.cover_image"
                        :alt="m.menuname"
                        class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gray-200" />
                </div>

                <!-- ข้อมูลขวา -->
                <div class="flex flex-col justify-between p-4 flex-1">
                    <div>
                        <!-- ชื่อ + bookmark -->
                        <div class="flex justify-between items-start">
                            <h2 class="font-bold text-base">{{ m.menuname }}</h2>
                            <button class="text-gray-400 hover:text-gray-600 shrink-0 ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>

                        <!-- คำอธิบาย -->
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ m.description }}</p>

                        <!-- Tags หมวดหมู่ -->
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span
                                v-for="tag in m.categories"
                                :key="tag"
                                class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200"
                            >
                                {{ tag }}
                            </span>
                        </div>
                    </div>

                    <!-- ผู้โพสต์ + กดเพื่อเพิ่มเติม -->
                    <div>
                        <!-- ผู้โพสต์ -->
                        <div class="flex items-center gap-2 mt-4">
                            <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                <img
                                    v-if="m.author_avatar"
                                    :src="m.author_avatar"
                                    class="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p class="text-sm font-medium leading-tight">{{ m.author_name }}</p>
                                <p class="text-xs text-gray-400 leading-tight">{{ m.author_email }}</p>
                            </div>
                        </div>

                        <!-- กดเพื่อเพิ่มเติม -->
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
    </div>
</template>