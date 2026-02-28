<script setup>
const config = useRuntimeConfig()

const menus = await $fetch(`${config.public.apiBase}/menu`)
</script>

<template>
    <div class="bg-amber-400 p-4">
        <h1 class="text-xl font-bold mb-2">รายการเมนูทั้งหมด</h1>

        <div
            v-for="m in menus"
            :key="m.menuid"
            class="bg-white mb-4 p-4 rounded"
        >
            <!-- ข้อมูลหลัก -->
            <h2 class="text-lg font-bold">{{ m.mname }}</h2>
            <p class="text-gray-500 text-sm">หมวดหมู่: {{ m.categoryname }} · เวลา: {{ m.cooktime }} นาที</p>
            <p class="text-gray-400 text-sm">โดย: {{ m.author_name }}</p>
            <p class="text-gray-400 text-sm">menuid: {{ m.menuid }}</p>
            <p v-if="m.description" class="mt-2 text-gray-700">{{ m.description }}</p>

            <!-- วัตถุดิบ -->
            <div class="mt-4">
                <h3 class="font-semibold mb-1">วัตถุดิบ</h3>
                <ul class="list-disc list-inside text-sm text-gray-700">
                    <li v-for="ing in m.ingredients" :key="ing.ingredientid">
                        {{ ing.ingredient_name }}
                        <span v-if="ing.quantity"> {{ ing.quantity }}</span>
                        <span v-if="ing.unit"> {{ ing.unit }}</span>
                    </li>
                </ul>
            </div>

            <!-- ขั้นตอนการทำ -->
            <div class="mt-4">
                <h3 class="font-semibold mb-1">ขั้นตอนการทำ</h3>
                <ol class="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    <li v-for="s in m.steps" :key="s.stepid">
                        {{ s.step }}
                        <img
                            v-if="s.step_image"
                            :src="s.step_image"
                            class="mt-1 rounded w-40"
                        >
                    </li>
                </ol>
            </div>
        </div>
    </div>
</template>