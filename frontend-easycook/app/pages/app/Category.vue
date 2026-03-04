<template>
    <div style="font-family: 'Bai Jamjuree' ">
        <navBar />

        <section class="flex flex-col items-center justify-center px-4 py-8 gap-8">
            <div class="flex gap-3">
                <div class="relative border border-gray-300 w-100 h-10 rounded-xl flex items-center">
                    <input type="text" class="w-full h-full px-3 rounded-xl outline-none" placeholder="">
                    <img src="/searchIcon.png" alt="searchIcon" class="w-5 h-5 object-contain absolute right-3">
                </div>
                <button class="bg-[#2C9A40] p-1 w-20 rounded-xl text-white cursor-pointer">
                    ค้นหา
                </button>
                <div class="dropdown dropdown-bottom dropdown-end">
                    <div tabindex="0" role="button" class="btn m-1">ตัวเลือกหมวดหมู่</div>
                    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-200 p-10 shadow-sm">
                        <li><a>Item 1</a></li>
                        <li><a>Item 2</a></li>
                    </ul>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import navBar from "~/components/navBar.vue";
</script>