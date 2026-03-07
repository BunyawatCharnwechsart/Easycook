<template>
    <div style="font-family: 'Bai Jamjuree'">
        <navBar />

        <section class="flex flex-col items-center justify-center px-4 py-8 gap-8">
            <div class="flex gap-3 items-center relative">
                <!-- Search Input -->
                <div class="relative border border-gray-300 w-100 h-10 rounded-xl flex items-center">
                    <input type="text" class="w-full h-full px-3 rounded-xl outline-none" placeholder="">
                    <img src="/searchIcon.png" alt="searchIcon" class="w-5 h-5 object-contain absolute right-3">
                </div>

                <!-- ค้นหา Button -->
                <button class="bg-[#2C9A40] px-4 w-20 h-10 rounded-xl text-white cursor-pointer">
                    ค้นหา
                </button>

                <!-- หมวดหมู่ Dropdown -->
                <d iv class="relative" ref="dropdownRef">
                    <button @click="toggleDropdown"
                        class="px-4 w-48 h-10 rounded-xl text-gray-700 cursor-pointer border border-gray-300 bg-white flex items-center justify-between gap-2">
                        <span>ตัวเลือกหมวดหมู่</span>
                        <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Dropdown Panel -->
                    <div v-if="isOpen"
                        class="absolute top-12 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-6 w-[700px]">
                        <!-- Header -->
                        <div class="mb-4">
                            <span class="font-bold text-lg">หมวดหมู่</span>
                            <span class="text-gray-400 text-sm ml-2">เลือกหมวดหมู่ที่ต้องการค้นหา</span>
                        </div>

                        <div class="flex gap-4">
                            <!-- Left: หมวดหมู่อาหารหลัก -->
                            <div class="flex-1">
                                <p class="font-semibold mb-3">หมวดหมู่อาหารหลัก</p>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="cat in mainCategories" :key="cat"
                                        @click="toggleCategory(cat, 'main')" :class="[
                                            'px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                                            selectedMain.includes(cat)
                                                ? 'bg-[#2C9A40] text-white border-[#2C9A40]'
                                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-[#2C9A40] '
                                        ]">
                                        {{ cat }}
                                    </button>
                                </div>
                            </div>

                            <!-- Divider -->
                            <div class="w-px bg-gray-200 mx-2"></div>

                            <!-- Right: หมวดหมู่ตามประเภทการปรุง -->
                            <div class="flex-1">
                                <p class="font-semibold mb-3">หมวดหมู่ตามประเภทการปรุง</p>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="cat in cookingCategories" :key="cat"
                                        @click="toggleCategory(cat, 'cooking')" :class="[
                                            'px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer',
                                            selectedCooking.includes(cat)
                                                ? 'bg-[#2C9A40] text-white border-[#2C9A40]'
                                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-[#2C9A40]'
                                        ]">
                                        {{ cat }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                            <button @click="clearAll" class="text-gray-500 hover:text-gray-700 text-sm cursor-pointer">
                                ล้างทั้งหมด
                            </button>
                            <button @click="confirmSearch"
                                class="bg-[#2C9A40] text-white px-6 py-2 rounded-xl text-sm cursor-pointer hover:bg-[#237a32]">
                                ค้นหมวดหมู่
                            </button>
                        </div>
                    </div>
                </d>
            </div>
        </section>
        <section>
            <div class="flex flex-col w-full mt-10">
                <h1 class="ml-10 text-4xl font-bold ">หมวดหมู่แนะนำ</h1>
                <!--Card-->
                <section class="m-10">
                    <RecommendedSection />
                </section>
                <h1 class="ml-10 mt-10 text-4xl font-bold">เมนูอาหารที่แนะนำ</h1>
                <section class="m-10">
                    <Cardmenu/>
                </section>
            </div>
        </section>
        <!-- Footer -->
        <aboutFooter />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import navBar from "~/components/navBar.vue";
import RecommendedSection from '~/components/RecommendedSection.vue';
import aboutFooter from '~/components/aboutFooter.vue';

const isOpen = ref(false);
const dropdownRef = ref(null);

const mainCategories = [
    "อาหารจานเดียว", "อาหารจานหลัก",
    "อาหารจานด่วน", "อาหารตามสั่ง",
    "อาหารเมนูเส้น", "อาหารไทย",
    "อาหารนานาชาติ", "อาหารสุขภาพ",
    "อาหารมังสวิรัติ/เจ", "อาหารหวาน/ของหวาน",
    "เครื่องดื่ม"
];

const cookingCategories = [
    "ผัด", "ทอด", "ต้ม", "ครุก / ยำ",
    "นึ่ง", "ย่าง", "อบ", "ตุ๋น",
    "หมัก", "ดอง", "รมควัน", "ผัดน้ำ",
    "แกง"
];

const selectedMain = ref([]);
const selectedCooking = ref([]);

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const toggleCategory = (cat, type) => {
    if (type === 'main') {
        const idx = selectedMain.value.indexOf(cat);
        idx === -1 ? selectedMain.value.push(cat) : selectedMain.value.splice(idx, 1);
    } else {
        const idx = selectedCooking.value.indexOf(cat);
        idx === -1 ? selectedCooking.value.push(cat) : selectedCooking.value.splice(idx, 1);
    }
};

const clearAll = () => {
    selectedMain.value = [];
    selectedCooking.value = [];
};

const confirmSearch = () => {
    console.log("Selected:", selectedMain.value, selectedCooking.value);
    isOpen.value = false;
};

// ปิด dropdown เมื่อคลิกนอก
const handleClickOutside = (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        isOpen.value = false;
    }
};

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() => document.removeEventListener("mousedown", handleClickOutside));
</script>