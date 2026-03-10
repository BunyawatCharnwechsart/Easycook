<template>
    <div style="font-family: 'Bai Jamjuree', sans-serif" class="min-h-screen flex flex-col bg-white">
        <navBar />

        <!-- Top Error Banner -->
        <div v-if="showBanner"
            class="w-full bg-red-500 text-white flex items-center gap-3 px-6 py-3 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
            {{ bannerMsg }}
        </div>

        <!-- Header -->
        <section class="max-w-5xl mx-auto w-full px-6 pt-16 pb-10 flex flex-col items-center gap-3">
            <div class="relative w-36 h-36">
                <div class="w-full h-full rounded-full overflow-hidden bg-gray-200">
                    <img
                        :src="user?.profile_image || `https://ui-avatars.com/api/?name=${user?.name}&background=16a34a&color=fff`"
                        alt="profile"
                        class="w-full h-full object-cover" />
                </div>
            </div>
            <p class="text-gray-500 text-sm text-center leading-relaxed">
                หน้านี้ใช้สำหรับแก้ไขและอัปเดตชื่อผู้ใช้<br />
                เพื่อให้ข้อมูลในระบบเป็นปัจจุบันและถูกต้อง
            </p>
        </section>

        <!-- Form -->
        <section class="max-w-5xl mx-auto w-full px-6 pb-16 flex flex-col gap-5">

            <!-- ชื่อ -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-gray-700">ชื่อ</label>
                <div class="flex items-center w-full border rounded-md px-4 py-2.5 gap-2 transition"
                    :class="errors.name
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 focus-within:ring-2 focus-within:ring-green-500'">
                    <svg v-if="errors.name" xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
                    </svg>
                    <input
                        v-model="form.name"
                        type="text"
                        :placeholder="errors.name || 'กรอกชื่อของคุณ'"
                        class="flex-1 bg-transparent outline-none text-sm"
                        :class="errors.name ? 'placeholder-red-400 text-red-500' : 'text-gray-800'"
                        @input="clearError('name')" />
                </div>
                <p v-if="errors.name" class="text-red-400 text-xs">{{ errors.name }}</p>
            </div>

            <!-- อีเมล (แสดงอย่างเดียว) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-gray-700">อีเมล</label>
                <input
                    :value="user?.email"
                    type="email"
                    disabled
                    class="w-full border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed outline-none" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-between mt-6">
                <button
                    @click="onCancel"
                    class="px-16 py-2.5 border-2 border-orange-500 text-orange-500 font-bold rounded-md hover:bg-orange-50 transition text-sm">
                    ยกเลิก
                </button>
                <button
                    @click="onSave"
                    :disabled="saving"
                    class="px-16 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition text-sm disabled:bg-green-300 flex items-center gap-2">
                    <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
                </button>
            </div>
        </section>

        <aboutFooter />
    </div>
</template>

<script setup>
const config = useRuntimeConfig()
const router = useRouter()

const user = ref(null)
const form = ref({ name: '' })
const errors = ref({ name: '' })
const showBanner = ref(false)
const bannerMsg = ref('ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูลอีกครั้ง')
const saving = ref(false)

onMounted(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return navigateTo('/auth/login')
    user.value = JSON.parse(stored)
    form.value.name = user.value.name || ''
})

function clearError(field) {
    errors.value[field] = ''
    showBanner.value = false
}

function validate() {
    errors.value.name = ''
    if (!form.value.name.trim()) {
        errors.value.name = 'กรุณากรอกชื่อ'
        return false
    }
    if (form.value.name.trim().length > 20) {
        errors.value.name = 'ห้ามมากกว่า 20 ตัวอักษร'
        return false
    }
    return true
}

function onCancel() {
    router.back()
}

async function onSave() {
    showBanner.value = false

    if (!validate()) {
        showBanner.value = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
    }

    saving.value = true
    try {
        const token = localStorage.getItem('token')
        const uid = user.value.id

        const result = await $fetch(`${config.public.apiBase}/users/${uid}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: { name: form.value.name.trim() },
        })

        // อัปเดต localStorage ด้วย name ใหม่
        const updated = { ...user.value, name: result.user.name }
        localStorage.setItem('user', JSON.stringify(updated))
        user.value = updated

        router.push('/app/profile')

    } catch (err) {
        bannerMsg.value = err?.data?.error || 'ไม่สามารถบันทึกข้อมูลได้'
        showBanner.value = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
        saving.value = false
    }
}
</script>