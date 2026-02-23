<template>
    <div class="flex gap-20 justify-center">
        <!--Use V-for(is vue loop syntax)-->
        <div
            v-for="(img, index) in images"
            :key="index"
            class="flex flex-col items-center"
        >
            <img :src="img.png" class="w-full aspect-square rounded-full object-cover">
            <p class="mt-2 text-xl">{{ img.title }}</p>
        </div>
    </div>
</template>

<script setup>
const images = [
    { png: '/Recommendedimg.png', title: 'wwwwww' },
    { png: '/Recommendedimg.png', title: 'wwwwww' },
    { png: '/Recommendedimg.png', title: 'wwwwww' },
    { png: '/Recommendedimg.png', title: 'wwwwww' },
]
</script>