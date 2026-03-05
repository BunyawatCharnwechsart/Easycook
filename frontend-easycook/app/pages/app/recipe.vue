<script setup>
import { ref } from "vue"
import { TrashIcon, PhotoIcon } from "@heroicons/vue/24/outline"

/* FORM */
const title = ref("")
const time = ref("")
const description = ref("")
const ingredients = ref("")
const recipeImage = ref(null)

/* ERROR */
const errors = ref({})
const showError = ref(false)

/* CATEGORY */
const showCategoryModal = ref(false)
const selectedMain = ref("")
const selectedCook = ref("")

const mainCategories = [
  "อาหารจานเดียว",
  "อาหารตามสั่ง",
  "อาหารไทย",
  "อาหารจีน",
  "อาหารญี่ปุ่น",
  "อาหารเกาหลี",
  "อาหารอีสาน"
]

const cookTypes = [
  "ผัด", "ทอด", "ต้ม", "แกง", "ยำ", "อบ", "นึ่ง", "ปิ้ง / ย่าง"
]

/* DELETE MODAL */
const showDeleteModal = ref(false)

/* STEPS */
const steps = ref([
  { text: "" },
  { text: "" }
])

const addStep = () => {
  steps.value.push({ text: "" })
}

const removeStep = (index) => {
  steps.value.splice(index, 1)
}



/* VALIDATE */
const validate = () => {

  errors.value = {}

  if (!recipeImage.value)
    errors.value.image = "กรุณาอัปโหลดรูปเมนูอาหาร"

  if (!title.value)
    errors.value.title = "กรุณากรอกชื่อเมนูอาหาร"

  if (!description.value)
    errors.value.description = "กรุณากรอกคำอธิบายสูตรอาหาร"

  if (!selectedMain.value || !selectedCook.value)
    errors.value.category = "กรุณาเลือกหมวดหมู่"

  if (!ingredients.value)
    errors.value.ingredients = "กรุณากรอกส่วนผสม"

  steps.value.forEach((step, index) => {
    if (!step.text) {
      errors.value[`step${index}`] = "กรุณาเพิ่มขั้นตอนการทำอาหาร"
    }
  })

  showError.value = Object.keys(errors.value).length > 0
  return !showError.value
}

/* SUBMIT */
const submitForm = () => {
  if (!validate()) return
  console.log("submit success")
}

/* CATEGORY SAVE */
const confirmCategory = () => {
  showCategoryModal.value = false
}

/* DELETE */
const confirmDelete = () => {
  showDeleteModal.value = false
}
</script>

<template>

  <div class="min-h-screen bg-gray-100 p-10">

    <div class="max-w-6xl mx-auto bg-white p-8 rounded-2xl">

      <!-- ERROR BANNER -->
      <div v-if="showError" class="bg-red-500 text-white px-4 py-3 rounded mb-6 flex items-center gap-2">
        ⚠ ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูลอีกครั้ง
      </div>

      <!-- HEADER -->
      <div class="flex justify-between mb-6">

        <div class="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" class="w-10 h-10 rounded-full" />
          <div>
            <p class="font-semibold">ประยุท จันอังคาร</p>
            <p class="text-sm text-gray-400">ผู้เขียน</p>
          </div>
        </div>

        <div class="flex gap-3">

          <button @click="showDeleteModal = true" class="border border-red-400 text-red-500 px-5 py-2 rounded-lg">
            ลบ
          </button>

          <button @click="submitForm" class="bg-green-600 text-white px-5 py-2 rounded-lg">
            โพสต์
          </button>

        </div>
      </div>

      <!-- TOP -->
      <div class="grid grid-cols-3 gap-6">

        <!-- IMAGE -->
        <div>

          <p v-if="errors.image" class="text-red-500 text-sm mb-2">
            ⚠ {{ errors.image }}
          </p>

          <label
            class="bg-gray-200 h-80 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">

            <input type="file" accept="image/*" class="hidden" @change="handleRecipeImage" />

            <img v-if="recipeImage" :src="recipeImage" class="absolute inset-0 w-full h-full object-cover" />

            <div v-if="!recipeImage" class="flex flex-col items-center text-gray-400">
              <PhotoIcon class="w-10 h-10" />
              <p class="text-sm mt-2">อัปโหลดรูปเมนูที่คุณทำ</p>
            </div>

          </label>

        </div>

        <!-- RIGHT -->
        <div class="col-span-2 space-y-4">

          <!-- TITLE -->
          <div>
            <p v-if="errors.title" class="text-red-500 text-sm mb-1">
              ⚠ {{ errors.title }}
            </p>

            <input v-model="title" placeholder="เพิ่มชื่อเมนูของคุณ" :class="[
              'w-full bg-gray-100 rounded-lg p-3 border',
              errors.title ? 'border-red-500' : 'border-transparent'
            ]" />
          </div>

          <!-- CATEGORY + TIME -->
          <div class="flex items-center gap-3">

            <p class="text-sm">หมวดหมู่</p>

            <button @click="showCategoryModal = true" class="bg-green-600 text-white px-4 py-2 rounded-lg">
              หมวดหมู่
            </button>

            <div v-if="selectedMain" class="bg-sky-300 px-4 py-2 rounded-lg">
              {{ selectedMain }}
            </div>

            <div v-if="selectedCook" class="bg-lime-300 px-4 py-2 rounded-lg">
              {{ selectedCook }}
            </div>

            <p class="text-sm ml-10">เวลาที่ใช้</p>

            <input v-model="time" placeholder="เวลา เช่น 30 นาที" :class="[
              'bg-gray-100 rounded-lg p-3 w-60 border',
              errors.time ? 'border-red-500' : 'border-transparent'
            ]" />


          </div>

          <p v-if="errors.category" class="text-red-500 text-sm">
            ⚠ {{ errors.category }}
          </p>

          <p v-if="errors.time" class="text-red-500 text-sm">
            ⚠ {{ errors.time }}
          </p>

          <!-- DESCRIPTION -->
          <div>

            <p v-if="errors.description" class="text-red-500 text-sm mb-1">
              ⚠ {{ errors.description }}
            </p>
            <textarea v-model="description" placeholder="คำอธิบายสูตรอาหาร" :class="[
              'w-full bg-gray-100 rounded-xl p-4 h-32 border',
              errors.description ? 'border-red-500' : 'border-transparent'
            ]" />

          </div>

        </div>
      </div>

      <!-- INGREDIENTS -->
      <div class="mt-8">

        <h2 class="mb-2 font-semibold">ส่วนผสม</h2>

        <p v-if="errors.ingredients" class="text-red-500 text-sm mb-1">
          ⚠ {{ errors.ingredients }}
        </p>

        <textarea v-model="ingredients" placeholder="• น้ำปลา 2 ช้อนโต๊ะ" :class="[
          'w-full bg-gray-100 rounded-lg p-3 h-20 border',
          errors.ingredients ? 'border-red-500' : 'border-transparent'
        ]" />

      </div>

      <!-- STEPS -->
      <div class="mt-8">

        <h2 class="font-semibold mb-4">
          วิธีทำ / ขั้นตอนการทำ
        </h2>

        <div v-for="(step, index) in steps" :key="index" class="flex gap-4 items-start mb-4">



          <div class="flex-1">

            <p v-if="errors[`step${index}`]" class="text-red-500 text-sm mb-1">
              ⚠ {{ errors[`step${index}`] }}
            </p>

            <textarea v-model="step.text" :placeholder="`ขั้นตอนที่ ${index + 1}`" :class="[
              'w-full bg-gray-100 rounded-lg p-3 h-28 border',
              errors[`step${index}`] ? 'border-red-500' : 'border-transparent'
            ]" />

          </div>

          <button @click="removeStep(index)" class="text-red-500">
            <TrashIcon class="w-6 h-6" />
          </button>

        </div>

        <div class="flex justify-center mt-6">

          <button @click="addStep" class="bg-green-600 text-white px-10 py-3 rounded-lg">
            + วิธีทำ / ขั้นตอนการทำ
          </button>

        </div>

      </div>

    </div>
  </div>
  <!-- CATEGORY MODAL -->
  <div v-if="showCategoryModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-[500px]">

      <h2 class="text-lg font-semibold mb-4">เลือกหมวดหมู่</h2>

      <!-- MAIN CATEGORY -->
      <p class="mb-2 font-medium">ประเภทอาหาร</p>
      <div class="flex flex-wrap gap-2 mb-4">
        <button v-for="item in mainCategories" :key="item" @click="selectedMain = item" :class="[
          'px-4 py-2 rounded-lg border',
          selectedMain === item ? 'bg-green-600 text-white' : 'bg-gray-100'
        ]">
          {{ item }}
        </button>
      </div>

      <!-- COOK TYPE -->
      <p class="mb-2 font-medium">ประเภทการทำ</p>
      <div class="flex flex-wrap gap-2 mb-6">
        <button v-for="item in cookTypes" :key="item" @click="selectedCook = item" :class="[
          'px-4 py-2 rounded-lg border',
          selectedCook === item ? 'bg-green-600 text-white' : 'bg-gray-100'
        ]">
          {{ item }}
        </button>
      </div>

      <!-- BUTTON -->
      <div class="flex justify-end gap-2">
        <button @click="showCategoryModal = false" class="px-4 py-2 border rounded-lg">
          ยกเลิก
        </button>

        <button @click="confirmCategory" class="px-4 py-2 bg-green-600 text-white rounded-lg">
          บันทึก
        </button>
      </div>

    </div>
  </div>
  <!-- DELETE MODAL -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-8 w-[420px] text-center">

      <!-- ICON -->
      <div class="flex justify-center mb-4">
        <div class="bg-red-100 p-4 rounded-full">
          <TrashIcon class="w-8 h-8 text-red-500" />
        </div>
      </div>

      <!-- TEXT -->
      <h2 class="text-lg font-semibold mb-2">
        ลบโพสต์นี้ใช่ไหม?
      </h2>

      <p class="text-gray-500 mb-6">
        คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์ของคุณ
      </p>

      <!-- BUTTON -->
      <div class="flex justify-center gap-4">

        <button @click="showDeleteModal = false" class="px-6 py-3 border rounded-lg w-32">
          ยกเลิก
        </button>

        <button @click="confirmDelete" class="px-6 py-3 bg-red-500 text-white rounded-lg w-32">
          ลบ
        </button>

      </div>

    </div>
  </div>
</template>