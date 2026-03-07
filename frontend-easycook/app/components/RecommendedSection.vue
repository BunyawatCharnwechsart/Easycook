<script setup>
const config = useRuntimeConfig()
const { data: categoryItems } = await useAsyncData('categories', () => 
    $fetch(`${config.public.apiBase}/category`)
)

</script>

<template>
    <div class="flex gap-20 justify-center">
        <div
            v-for="category in categoryItems"
            :key="category.categoryid"
            class="flex flex-col items-center"
        >
            <img 
                src="/Recommendedimg.png"
                class="w-[80%] aspect-square rounded-full object-cover"
            >
            <p class="mt-2 text-xl">{{ category.categoryname }}</p>
        </div>
    </div>
</template>