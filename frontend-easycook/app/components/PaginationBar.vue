<template>
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12 mb-10">
        <button
            class="w-9 h-9 rounded-full border flex items-center justify-center transition"
            :disabled="currentPage === 1"
            :class="currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:border-[#2C9A40] hover:text-[#2C9A40] cursor-pointer'"
            @click="emit('go-to-page', currentPage - 1)"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <template v-for="page in displayedPages" :key="page">
            <span v-if="page === '...'" class="px-2 text-gray-400">...</span>
            <button
                v-else
                class="w-9 h-9 rounded-full border text-sm font-medium transition cursor-pointer"
                :class="page === currentPage ? 'bg-[#2C9A40] text-white border-[#2C9A40]' : 'text-gray-600 border-gray-300 hover:border-[#2C9A40] hover:text-[#2C9A40]'"
                @click="emit('go-to-page', page)"
            >
                {{ page }}
            </button>
        </template>

        <button
            :disabled="currentPage === totalPages"
            class="w-9 h-9 rounded-full border flex items-center justify-center transition"
            :class="currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:border-[#2C9A40] hover:text-[#2C9A40] cursor-pointer'"
            @click="emit('go-to-page', currentPage + 1)"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</template>

<script setup>
defineProps({
    currentPage: Number,
    totalPages: Number,
    displayedPages: Array
})
const emit = defineEmits(['go-to-page'])
</script>
