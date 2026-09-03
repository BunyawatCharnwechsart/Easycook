<template>
    <div style="font-family: 'Bai Jamjuree'">
        <!--import navbar-->
        <navBar/>

        <!--เนื้อหา-->
        <section class="flex flex-col items-center justify-center px-4 py-8 gap-8">
            <div class="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <img 
                    src="/logomain.png" 
                    alt="logomain"
                    class="w-full h-auto object-contain"
                >
            </div>

            <!--ช่องค้นหา-->
            <div class="flex gap-3">
                <div class="relative border border-gray-300 w-100 h-10 rounded-xl flex items-center">
                    <input 
                        v-model="searchQuery"
                        type="text"
                        class="w-full h-full px-3 rounded-xl outline-none"
                        placeholder="ค้นหาเมนูอาหาร..."
                        @keyup.enter="handleSearch"
                    >
                    <img 
                        src="/searchIcon.png" alt="searchIcon"
                        class="w-5 h-5 object-contain absolute right-3"
                    >
                </div>
                <button 
                    class="bg-[#2C9A40] p-1 w-20 rounded-xl text-white cursor-pointer"
                    @click="handleSearch"
                >
                    ค้นหา
                </button>
            </div>
            
            <!--Silde ADS-->
            <ADS/>

            <!--หมวดหมู่แนะนำ-->
            <div class="flex flex-col w-full mt-10">
                <h1 class="ml-10 text-4xl">หมวดหมู่แนะนำ</h1>
                <!--Card-->
                <section class="m-10">
                    <RecommendedSection  @category-selected="onCategorySelected"/>
                </section>
                <h1 class="ml-10 mt-10 text-4xl">เมนูอาหารที่แนะนำ</h1>
                <section class="m-10">
                    <RecommendedMenu/>
                </section>
            </div>
        </section>

        <aboutFooter/>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
    const query = searchQuery.value.trim()
    if (!query) return
    router.push({ path: '/app/category-pagination', query: { q: query } })
}

const onCategorySelected = ({ categoryid, categoryname }) => {
    router.push({ 
        path: '/app/category-pagination', 
        query: { categoryId: categoryid, categoryName: categoryname } 
    })
}
</script>