<template>
    <NuxtLink
        :to="`/${menu.menuid}`"
        class="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer flex no-underline text-inherit"
    >
        <div class="relative w-48 shrink-0">
            <img v-if="menu.cover_image" :src="menu.cover_image" :alt="menu.mname" class="w-full h-full object-cover">
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-400 text-xs">ไม่มีรูปภาพ</span>
            </div>
        </div>
        <div class="flex flex-col justify-between p-4 flex-1">
            <div>
                <div class="flex justify-between items-start">
                    <h2 class="font-bold text-base">{{ menu.mname }}</h2>
                    <button
                        class="shrink-0 ml-2 transition-colors"
                        :class="savedIds?.has(menu.menuid) ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'"
                        @click="(e) => toggleSave?.(e, menu.menuid)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2"
                            :fill="savedIds?.has(menu.menuid) ? 'currentColor' : 'none'">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ menu.description }}</p>
                <div class="flex flex-wrap gap-2 mt-3">
                    <span v-if="menu.categoryname" class="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                        {{ menu.categoryname }}
                    </span>
                    <span v-if="menu.cooktime" class="text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-full border border-orange-200">
                        ⏱ {{ menu.cooktime }} นาที
                    </span>
                </div>
            </div>
            <div>
                <div class="flex items-center gap-2 mt-4">
                    <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img v-if="menu.author_image || menu.author_avatar" :src="menu.author_image || menu.author_avatar" class="w-full h-full object-cover">
                    </div>
                    <p class="text-sm font-medium leading-tight">{{ menu.author_name }}</p>
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
</template>

<script setup>
import { inject } from 'vue'

defineProps({ menu: Object })

// รับ savedIds และ toggleSave จาก parent (main.vue) ผ่าน provide/inject
const savedIds = inject('savedIds', null)
const toggleSave = inject('toggleSave', null)
</script>