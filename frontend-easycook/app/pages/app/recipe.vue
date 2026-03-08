<script setup>
import { TrashIcon, PhotoIcon } from "@heroicons/vue/24/outline"

const config = useRuntimeConfig()
const router = useRouter()

const loading = ref(false)
const errorMsg = ref('')
const imagePreview = ref(null)
const coverFile = ref(null)
const fileInput = ref(null)

// Category modal
const showCategoryModal = ref(false)
const selectedCategory = ref('')
const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref('')

// Fetch categories from API
const fetchCategories = async () => {
    categoriesLoading.value = true
    categoriesError.value = ''
    try {
        const data = await $fetch(`${config.public.apiBase}/category`)
        categories.value = data
    } catch {
        categoriesError.value = 'ไม่สามารถโหลดหมวดหมู่ได้'
    } finally {
        categoriesLoading.value = false
    }
}

onMounted(() => {
    fetchCategories()
})

// Delete modal
const showDeleteModal = ref(false)

const form = reactive({
    mname: '',
    cooktime: '',
    description: '',
    ingredients: [''],
    steps: [{ step: '' }],
})

// --- image ---
const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFile(file)
}

const handleDrop = (e) => {
    const file = e.dataTransfer?.files[0]
    if (file) setFile(file)
}

const setFile = (file) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { errorMsg.value = 'รองรับเฉพาะ jpg, png, webp'; return }
    if (file.size > 5 * 1024 * 1024) { errorMsg.value = 'ไฟล์ใหญ่เกิน 5MB'; return }
    coverFile.value = file
    imagePreview.value = URL.createObjectURL(file)
    errorMsg.value = ''
}

const removeImage = () => {
    coverFile.value = null
    imagePreview.value = null
    if (fileInput.value) fileInput.value.value = ''
}

// --- ingredients ---
const addIngredient = () => form.ingredients.push('')
const removeIngredient = (i) => form.ingredients.splice(i, 1)

// --- steps ---
const addStep = () => form.steps.push({ step: '' })
const removeStep = (i) => form.steps.splice(i, 1)

// --- category ---
const confirmCategory = () => {
    showCategoryModal.value = false
}

const openCategoryModal = () => {
    if (categories.value.length === 0) fetchCategories()
    showCategoryModal.value = true
}

// --- delete ---
const confirmDelete = () => {
    showDeleteModal.value = false
    router.push('/app/testapi')
}

// --- submit ---
const handleSubmit = async () => {
    errorMsg.value = ''
    if (!form.mname || !form.cooktime || !selectedCategory.value) {
        errorMsg.value = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'
        return
    }

    loading.value = true
    try {
        const formData = new FormData()
        formData.append('uid', '1') // TODO: เปลี่ยนเป็น uid จริงจาก auth
        formData.append('mname', form.mname)
        formData.append('cooktime', String(form.cooktime))
        formData.append('categoryname', selectedCategory.value)
        if (form.description) formData.append('description', form.description)
        formData.append('ingredients', JSON.stringify(form.ingredients.filter(i => i.trim())))
        formData.append('steps', JSON.stringify(form.steps.filter(s => s.step.trim())))
        if (coverFile.value) formData.append('cover_image', coverFile.value)

        await $fetch(`${config.public.apiBase}/menu`, {
            method: 'POST',
            body: formData,
        })

        router.push('/app/testapi')
    } catch (err) {
        errorMsg.value = err?.data?.error || err?.message || 'เกิดข้อผิดพลาด'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div style="font-family: 'Bai Jamjuree'">
        <navBar />
        <div class="min-h-screen bg-gray-100 p-10">
            <div class="max-w-6xl mx-auto bg-white p-8 rounded-2xl">

                <!-- ERROR BANNER -->
                <div v-if="errorMsg" class="bg-red-500 text-white px-4 py-3 rounded mb-6 flex items-center gap-2">
                    ⚠ {{ errorMsg }}
                </div>

                <!-- HEADER -->
                <div class="flex justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/40" class="w-10 h-10 rounded-full" >
                        <div>
                            <p class="font-semibold">ผู้ใช้งาน</p>
                            <p class="text-sm text-gray-400">ผู้เขียน</p>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button
                            type="button"
                            class="border border-red-400 text-red-500 px-5 py-2 rounded-lg"
                            @click="showDeleteModal = true">
                            ลบ
                        </button>
                        <button
                            type="button"
                            :disabled="loading"
                            class="bg-green-600 text-white px-5 py-2 rounded-lg disabled:bg-green-300 flex items-center gap-2"
                            @click="handleSubmit">
                            <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            {{ loading ? 'กำลังบันทึก...' : 'โพสต์' }}
                        </button>
                    </div>
                </div>

                <!-- TOP GRID -->
                <div class="grid grid-cols-3 gap-6">

                    <!-- IMAGE -->
                    <div>
                        <label
                            class="bg-gray-200 h-80 rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
                            @click="triggerFileInput"
                            @dragover.prevent
                            @drop.prevent="handleDrop">
                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                class="hidden"
                                @change="handleFileChange" >

                            <img 
                                v-if="imagePreview" :src="imagePreview"
                                class="absolute inset-0 w-full h-full object-cover" >

                            <div v-if="imagePreview" class="absolute top-2 right-2">
                                <button
                                    type="button"
                                    class="bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black/70"
                                    @click.stop="removeImage">✕</button>
                            </div>

                            <div v-if="!imagePreview" class="flex flex-col items-center text-gray-400">
                                <PhotoIcon class="w-10 h-10" />
                                <p class="text-sm mt-2">อัปโหลดรูปเมนูที่คุณทำ</p>
                                <p class="text-xs text-gray-300 mt-1">JPG, PNG, WEBP ไม่เกิน 5MB</p>
                            </div>
                        </label>
                    </div>

                    <!-- RIGHT SIDE -->
                    <div class="col-span-2 space-y-4">

                        <!-- MENU NAME -->
                        <div>
                            <input
                                v-model="form.mname"
                                type="text"
                                placeholder="เพิ่มชื่อเมนูของคุณ"
                                class="w-full bg-gray-100 rounded-lg p-3 border border-transparent focus:border-amber-400 outline-none" >
                        </div>

                        <!-- CATEGORY + TIME -->
                        <div class="flex items-center gap-3 flex-wrap">
                            <p class="text-sm">หมวดหมู่</p>
                            <button
                                type="button"
                                class="bg-green-600 text-white px-4 py-2 rounded-lg"
                                @click="openCategoryModal">
                                หมวดหมู่
                            </button>
                            <div v-if="selectedCategory" class="bg-sky-300 px-4 py-2 rounded-lg text-sm">
                                {{ selectedCategory }}
                            </div>

                            <p class="text-sm ml-4">เวลาที่ใช้</p>
                            <input
                                v-model.number="form.cooktime"
                                type="number"
                                min="1"
                                placeholder="เช่น 30 นาที"
                                class="bg-gray-100 rounded-lg p-3 w-44 border border-transparent focus:border-amber-400 outline-none" >
                        </div>

                        <!-- DESCRIPTION -->
                        <div>
                            <textarea
                                v-model="form.description"
                                placeholder="คำอธิบายสูตรอาหาร"
                                rows="5"
                                class="w-full bg-gray-100 rounded-xl p-4 border border-transparent focus:border-amber-400 outline-none resize-none" />
                        </div>

                    </div>
                </div>

                <!-- INGREDIENTS -->
                <div class="mt-8">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="font-semibold">ส่วนผสม</h2>
                        <button
                            type="button"
                            class="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition"
                            @click="addIngredient">
                            + เพิ่ม
                        </button>
                    </div>

                    <div class="space-y-2">
                        <div v-for="(_, i) in form.ingredients" :key="i" class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                                {{ i + 1 }}
                            </span>
                            <input
                                v-model="form.ingredients[i]"
                                type="text"
                                :placeholder="`วัตถุดิบที่ ${i + 1}`"
                                class="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-amber-400 outline-none" >
                            <button
                                v-if="i > 0"
                                type="button"
                                class="text-gray-300 hover:text-red-400 transition"
                                @click="removeIngredient(i)">
                                <TrashIcon class="w-5 h-5" />
                            </button>
                            <div v-else class="w-5 h-5 shrink-0" />
                        </div>
                        <p v-if="form.ingredients.length === 0" class="text-center text-gray-300 text-sm py-4">
                            ยังไม่มีวัตถุดิบ กด + เพิ่มได้เลย
                        </p>
                    </div>
                </div>

                <!-- STEPS -->
                <div class="mt-8">
                    <h2 class="font-semibold mb-4">วิธีทำ / ขั้นตอนการทำ</h2>

                    <div v-for="(_, i) in form.steps" :key="i" class="flex gap-4 items-start mb-4">
                        <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-2">
                            {{ i + 1 }}
                        </span>
                        <textarea
                            v-model="form.steps[i].step"
                            :placeholder="`ขั้นตอนที่ ${i + 1}`"
                            rows="3"
                            class="flex-1 bg-gray-100 rounded-lg p-3 border border-transparent focus:border-amber-400 outline-none resize-none" />
                        <button
                            v-if="i > 0"
                            type="button"
                            class="text-gray-300 hover:text-red-400 transition mt-2"
                            @click="removeStep(i)">
                            <TrashIcon class="w-6 h-6" />
                        </button>
                        <div v-else class="w-6 h-6 shrink-0 mt-2" />
                    </div>

                    <p v-if="form.steps.length === 0" class="text-center text-gray-300 text-sm py-4">
                        ยังไม่มีขั้นตอน กด + เพิ่มได้เลย
                    </p>

                    <div class="flex justify-center mt-6">
                        <button
                            type="button"
                            class="bg-green-600 text-white px-10 py-3 rounded-lg"
                            @click="addStep">
                            + วิธีทำ / ขั้นตอนการทำ
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- CATEGORY MODAL -->
        <div v-if="showCategoryModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-6 w-125">
                <h2 class="text-lg font-semibold mb-4">เลือกหมวดหมู่</h2>

                <!-- Loading -->
                <div v-if="categoriesLoading" class="flex justify-center py-8">
                    <svg class="animate-spin w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                </div>

                <!-- Error -->
                <div v-else-if="categoriesError" class="text-red-500 text-sm py-4 text-center">
                    ⚠ {{ categoriesError }}
                    <button type="button" class="block mx-auto mt-2 text-green-600 underline text-sm" @click="fetchCategories">
                        ลองใหม่
                    </button>
                </div>

                <!-- Categories list -->
                <div v-else>
                    <p class="mb-2 font-medium">ประเภทอาหาร</p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        <button
                            v-for="item in categories" :key="item.categoryname"
                            type="button"
                            :class="['px-4 py-2 rounded-lg border transition', selectedCategory === item.categoryname ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200']"
                            @click="selectedCategory = item.categoryname">
                            {{ item.categoryname }}
                        </button>
                    </div>
                </div>

                <div class="flex justify-end gap-2">
                    <button type="button" class="px-4 py-2 border rounded-lg" @click="showCategoryModal = false">
                        ยกเลิก
                    </button>
                    <button type="button" class="px-4 py-2 bg-green-600 text-white rounded-lg" @click="confirmCategory">
                        บันทึก
                    </button>
                </div>
            </div>
        </div>

        <!-- DELETE MODAL -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-8 w-96 text-center">
                <div class="flex justify-center mb-4">
                    <div class="bg-red-100 p-4 rounded-full">
                        <TrashIcon class="w-8 h-8 text-red-500" />
                    </div>
                </div>
                <h2 class="text-lg font-semibold mb-2">ลบโพสต์นี้ใช่ไหม?</h2>
                <p class="text-gray-500 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์ของคุณ</p>
                <div class="flex justify-center gap-4">
                    <button type="button" class="px-6 py-3 border rounded-lg w-32" @click="showDeleteModal = false">
                        ยกเลิก
                    </button>
                    <button type="button" class="px-6 py-3 bg-red-500 text-white rounded-lg w-32" @click="confirmDelete">
                        ลบ
                    </button>
                </div>
            </div>
        </div>

        <aboutFooter />
    </div>
</template>