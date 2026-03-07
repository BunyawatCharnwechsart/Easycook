<script setup>
import navBar from '~/components/navBar.vue';
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
    <div style="font-family: 'Bai Jamjuree'">
        <navBar/>
                   
    </div>
</template>