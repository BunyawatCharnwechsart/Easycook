<script setup>
const config = useRuntimeConfig()
const router = useRouter()

const loading = ref(false)
const errorMsg = ref('')
const imagePreview = ref(null)
const coverFile = ref(null)
const fileInput = ref(null)

const categories = ['ทอด', 'ผัด', 'ต้ม']

const form = reactive({
    mname: '',
    cooktime: null,
    description: '',
    categoryname: '',
    ingredients: [],
    steps: [],
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

// --- submit ---
const handleSubmit = async () => {
    errorMsg.value = ''
    if (!form.mname || !form.cooktime || !form.categoryname) {
        errorMsg.value = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'
        return
    }

    loading.value = true
    try {
        const formData = new FormData()
        formData.append('uid', '1') // TODO: เปลี่ยนเป็น uid จริงจาก auth
        formData.append('mname', form.mname)
        formData.append('cooktime', String(form.cooktime))
        formData.append('categoryname', form.categoryname)
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
    <div class="min-h-screen bg-amber-50 p-4 pb-20">
        <div class="max-w-xl mx-auto">

            <!-- Header -->
            <div class="mb-6">
                <span
                    class="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">สูตรอาหารใหม่</span>
                <h1 class="text-3xl font-bold text-gray-800 mt-2">สร้างเมนู</h1>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit" >

                <!-- Cover Image -->
                <div 
                    class="w-full h-52 rounded-xl border-2 border-dashed border-amber-300 bg-white flex items-center justify-center cursor-pointer overflow-hidden hover:border-amber-500 transition"
                    @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                    <input 
                        ref="fileInput"
                        class="hidden" 
                        type="file" accept="image/jpeg,image/png,image/webp" 
                        @change="handleFileChange" 
                    >
                    <div v-if="!imagePreview" class="text-center text-gray-400">
                        <div class="text-4xl mb-2">🍽️</div>
                        <p class="text-sm">คลิกหรือลากรูปอาหารมาวางที่นี่</p>
                        <p class="text-xs text-gray-300 mt-1">JPG, PNG, WEBP ไม่เกิน 5MB</p>
                    </div>

                    <div v-else class="relative w-full h-full">
                        <img :src="imagePreview" class="w-full h-full object-cover" >
                        <button 
                            class="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-black/70"
                            type="button"
                            @click.stop="removeImage">✕</button>
                    </div>
                </div>

                <!-- Basic Info -->
                <div class="bg-white rounded-xl p-4 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-semibold text-gray-500 block mb-1">ชื่อเมนู <span
                                    class="text-red-400">*</span></label>
                            <input 
                                v-model="form.mname" type="text" placeholder="เช่น ผัดกะเพราไก่" required
                                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-gray-50" >
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-gray-500 block mb-1">หมวดหมู่ <span
                                    class="text-red-400">*</span></label>
                            <select 
                                v-model="form.categoryname" required
                                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-gray-50">
                                <option value="" disabled>เลือกหมวดหมู่</option>
                                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="text-xs font-semibold text-gray-500 block mb-1">เวลาทำ (นาที) <span
                                class="text-red-400">*</span></label>
                        <input 
                            v-model.number="form.cooktime" type="number" min="1" placeholder="เช่น 30" required
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-gray-50" >
                    </div>

                    <div>
                        <label class="text-xs font-semibold text-gray-500 block mb-1">คำอธิบาย</label>
                        <textarea 
                            v-model="form.description" placeholder="เล่าให้ฟังว่าเมนูนี้พิเศษยังไง..." rows="3"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-gray-50 resize-none" />
                    </div>
                </div>

                <!-- Ingredients -->
                <div class="bg-white rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="font-semibold text-gray-800">🧅 วัตถุดิบ</h2>
                        <button 
                            class="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition"
                            type="button" @click="addIngredient"
                            >
                            + เพิ่ม
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="(_, i) in form.ingredients" :key="i" class="flex items-center gap-2">
                            <span
                                class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">{{
                                i + 1 }}</span>
                            <input
                                v-model="form.ingredients[i]" 
                                type="text" 
                                :placeholder="`วัตถุดิบที่ ${i + 1}`"
                                class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-gray-50"
                                >
                            <button 
                                class="text-gray-300 hover:text-red-400 transition"
                                type="button" @click="removeIngredient(i)"
                                >✕</button>
                        </div>
                        <p v-if="form.ingredients.length === 0" class="text-center text-gray-300 text-sm py-4">
                            ยังไม่มีวัตถุดิบ กด + เพิ่มได้เลย</p>
                    </div>
                </div>

                <!-- Steps -->
                <div class="bg-white rounded-xl p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="font-semibold text-gray-800">👨‍🍳 ขั้นตอนการทำ</h2>
                        <button 
                            class="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition"
                            type="button" @click="addStep"
                            >
                            + เพิ่ม
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="(_, i) in form.steps" :key="i" class="flex items-start gap-2">
                            <span
                                class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0 mt-2">{{
                                i + 1 }}</span>
                            <textarea 
                                v-model="form.steps[i].step" :placeholder="`ขั้นตอนที่ ${i + 1}`" rows="2"
                                class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 bg-gray-50 resize-none" />
                            <button 
                                class="text-gray-300 hover:text-red-400 transition mt-2"
                                type="button" @click="removeStep(i)">
                                ✕
                            </button>
                        </div>
                        <p v-if="form.steps.length === 0" class="text-center text-gray-300 text-sm py-4">ยังไม่มีขั้นตอน
                            กด + เพิ่มได้เลย</p>
                    </div>
                </div>

                <!-- Error -->
                <div v-if="errorMsg" class="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {{ errorMsg }}
                </div>

                <!-- Submit -->
                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                    <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {{ loading ? 'กำลังบันทึก...' : 'เผยแพร่เมนู 🚀' }}
                </button>

            </form>
        </div>
    </div>
</template>