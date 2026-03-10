<script setup>
const config = useRuntimeConfig()
const { data: categoryItems } = await useAsyncData('categories', () =>
    $fetch(`${config.public.apiBase}/category`)
)

const emit = defineEmits(['category-selected'])

const categoryImageMap = {
    'ผัด': '/fry.png',
    'ต้ม': '/boiled.png',
    'แกง': '/curry.png',
    'ยำ': '/salad.png',
    'ตุ๋น': '/stewed.png',
    'ทอด': '/fry.png',
}

const getCategoryImage = (categoryname) => {
    return categoryImageMap[categoryname] || '/Recommendedimg.png'
}
</script>

<template>
    <div class="flex gap-20 justify-center">
        <div
            v-for="category in categoryItems"
            :key="category.categoryid"
            class="flex flex-col items-center cursor-pointer group"
            @click="emit('category-selected', { categoryid: category.categoryid, categoryname: category.categoryname })">
            <img
                :src="getCategoryImage(category.categoryname)"
                class="w-[80%] aspect-square rounded-full object-cover transform group-hover:scale-105">
            <p class="mt-2 text-xl group-hover:text-[#2C9A40] transition-colors">{{ category.categoryname }}</p>
        </div>
    </div>
</template>