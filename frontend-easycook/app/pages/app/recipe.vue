<script setup>
import { ref } from "vue"
import { TrashIcon, PhotoIcon } from "@heroicons/vue/24/outline"

const title = ref("")
const category = ref("")
const time = ref("")
const description = ref("")
const ingredients = ref("")

const recipeImage = ref(null)

const steps = ref([
  { text: "", image: null },
  { text: "", image: null }
])

const errors = ref({})
const showError = ref(false)

/* 🔴 เพิ่มตัวนี้ */
const showDeleteModal = ref(false)

const validate = () => {
  errors.value = {}

  if (!recipeImage.value) errors.value.image = "กรุณาอัปโหลดรูปเมนูอาหาร"
  if (!title.value) errors.value.title = "กรุณากรอกชื่อเมนูอาหาร"
  if (!category.value) errors.value.category = "กรุณาระบุหมวดหมู่อาหาร"
  if (!time.value) errors.value.time = "กรุณาระบุเวลาในการปรุงอาหาร"
  if (!description.value) errors.value.description = "กรุณากรอกคำอธิบายเมนูอาหาร"
  if (!ingredients.value) errors.value.ingredients = "กรุณากรอกส่วนผสม"

  steps.value.forEach((step, index) => {
    if (!step.text) {
      errors.value[`step${index}`] = "กรุณาเพิ่มขั้นตอนการทำอาหาร"
    }
  })

  showError.value = Object.keys(errors.value).length > 0
  return !showError.value
}

const addStep = () => {
  steps.value.push({ text: "", image: null })
}

const removeStep = (index) => {
  steps.value.splice(index, 1)
}

const handleRecipeImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    recipeImage.value = URL.createObjectURL(file)
  }
}

const handleStepImage = (e, index) => {
  const file = e.target.files[0]
  if (file) {
    steps.value[index].image = URL.createObjectURL(file)
  }
}

const submitForm = () => {
  if (!validate()) return
  console.log("submit success")
}

/* 🔴 ฟังก์ชันลบ */
const confirmDelete = () => {
  console.log("delete post")
  showDeleteModal.value = false
}
</script>

<template>
<div class="min-h-screen bg-gray-100 p-10">

<div class="max-w-6xl mx-auto bg-white p-8 rounded-2xl">

<!-- Header -->
<div class="flex justify-between mb-6">

<div class="flex items-center gap-3">
<img src="https://i.pravatar.cc/40" class="w-10 h-10 rounded-full" />

<div>
<p class="font-semibold">ประยุท จันอังคาร</p>
<p class="text-sm text-gray-400">ผู้เขียน</p>
</div>
</div>

<div class="flex gap-3">

<!-- 🔴 ปุ่มลบ -->
<button
@click="showDeleteModal = true"
class="border border-red-400 text-red-500 px-5 py-2 rounded-lg"
>
ลบ
</button>

<button
@click="submitForm"
class="bg-green-600 text-white px-5 py-2 rounded-lg"
>
โพสต์
</button>

</div>
</div>

<!-- ERROR BAR -->
<div
v-if="showError"
class="bg-red-500 text-white p-3 rounded mb-6"
>
ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูลอีกครั้ง
</div>

<!-- TOP -->
<div class="grid grid-cols-3 gap-6">

<!-- Upload recipe image -->
<div>

<label
class="bg-gray-200 h-80 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
:class="{'border-2 border-red-500': errors.image}"
>

<input
type="file"
accept="image/*"
class="hidden"
@change="handleRecipeImage"
/>

<img
v-if="recipeImage"
:src="recipeImage"
class="absolute inset-0 w-full h-full object-cover"
/>

<div v-if="!recipeImage" class="flex flex-col items-center text-gray-400">

<PhotoIcon class="w-10 h-10"/>

<p class="text-sm mt-2">
อัปโหลดรูปเมนูที่คุณทำ
</p>

</div>

</label>

<p v-if="errors.image" class="text-red-500 text-sm mt-1">
⚠ {{ errors.image }}
</p>

</div>

<!-- RIGHT -->
<div class="col-span-2 space-y-4">

<input
v-model="title"
placeholder="เพิ่มชื่อเมนูของคุณ"
class="w-full bg-gray-100 rounded-lg p-3"
:class="{'border border-red-500': errors.title}"
/>

<p v-if="errors.title" class="text-red-500 text-sm">
⚠ {{ errors.title }}
</p>

<div class="grid grid-cols-2 gap-4">

<div>
<input
v-model="category"
placeholder="หมวดหมู่"
class="bg-gray-100 rounded-lg p-3 w-full"
:class="{'border border-red-500': errors.category}"
/>

<p v-if="errors.category" class="text-red-500 text-sm">
⚠ {{ errors.category }}
</p>
</div>

<div>
<input
v-model="time"
placeholder="เวลา เช่น 30 นาที"
class="bg-gray-100 rounded-lg p-3 w-full"
:class="{'border border-red-500': errors.time}"
/>

<p v-if="errors.time" class="text-red-500 text-sm">
⚠ {{ errors.time }}
</p>
</div>

</div>

<textarea
v-model="description"
placeholder="คำอธิบายสูตรอาหารของคุณต้องไม่เกิน 500 ตัวอักษร"
class="w-full bg-gray-100 rounded-xl p-4 h-40 resize-none"
:class="{'border border-red-500': errors.description}"
/>

<p v-if="errors.description" class="text-red-500 text-sm">
⚠ {{ errors.description }}
</p>

</div>
</div>

<!-- Ingredients -->
<div class="mt-8">

<h2 class="mb-2 font-semibold">
ส่วนผสม
</h2>

<textarea
v-model="ingredients"
class="w-full bg-gray-100 rounded-lg p-3 h-20"
placeholder="• น้ำปลา 2 ช้อนโต๊ะ"
:class="{'border border-red-500': errors.ingredients}"
/>

<p v-if="errors.ingredients" class="text-red-500 text-sm">
⚠ {{ errors.ingredients }}
</p>

</div>

<!-- Steps -->
<div class="mt-8">

<h2 class="font-semibold mb-4">
วิธีทำ / ขั้นตอนการทำ
</h2>

<div
v-for="(step,index) in steps"
:key="index"
class="flex gap-4 items-start mb-4"
>

<label
class="w-40 h-28 bg-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
>

<input
type="file"
accept="image/*"
class="hidden"
@change="handleStepImage($event,index)"
/>

<img
v-if="step.image"
:src="step.image"
class="absolute inset-0 w-full h-full object-cover"
/>

<div v-if="!step.image" class="flex flex-col items-center text-gray-400">

<PhotoIcon class="w-8 h-8"/>

<p class="text-xs text-center">
เพิ่มรูปขั้นตอน
</p>

</div>

</label>

<textarea
v-model="step.text"
:placeholder="`ขั้นตอนที่ ${index+1}`"
class="flex-1 bg-gray-100 rounded-lg p-3 h-28"
:class="{'border border-red-500': errors[`step${index}`]}"
/>

<button
@click="removeStep(index)"
class="text-red-500"
>
<TrashIcon class="w-6 h-6"/>
</button>

</div>

<div class="flex justify-center mt-6">

<button
@click="addStep"
class="bg-green-600 text-white px-10 py-3 rounded-lg"
>
+ วิธีทำ / ขั้นตอนการทำ
</button>

</div>

</div>

</div>

</div>

<!-- 🔴 DELETE MODAL -->
<div
v-if="showDeleteModal"
class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
>

<div class="bg-white w-[600px] rounded-2xl p-10 shadow-xl">

<p class="text-xl font-semibold text-center mb-10">
คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์ของคุณ?
</p>

<div class="flex justify-between">

<button
@click="showDeleteModal = false"
class="border px-10 py-4 rounded-xl text-lg"
>
ยกเลิก
</button>

<button
@click="confirmDelete"
class="bg-red-500 text-white px-10 py-4 rounded-xl text-lg"
>
ลบ
</button>

</div>

</div>

</div>

</template>