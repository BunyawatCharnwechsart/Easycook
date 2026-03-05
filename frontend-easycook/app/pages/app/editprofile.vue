<template>
  <div style="font-family: 'Bai Jamjuree', sans-serif" class="min-h-screen flex flex-col bg-white">
    <navBar />

    <!-- Header -->
    <section class="max-w-5xl mx-auto w-full px-6 pt-16 pb-10 flex flex-col items-center gap-3">
      <!-- Avatar with camera button -->
      <div class="relative w-36 h-36">
        <div class="w-full h-full rounded-full overflow-hidden bg-gray-200">
          <img
            v-if="profileImage"
            :src="profileImage"
            alt="profile"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
        </div>

        <!-- Camera icon button -->
        <button
          @click="triggerFileInput"
          class="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </button>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mt-2">แก้ไขโปรไฟล์</h1>
      <p class="text-gray-500 text-sm text-center leading-relaxed">
        หน้านี้ใช้สำหรับแก้ไขและอัปเดตข้อมูลส่วนตัวของผู้ใช้<br />
        เพื่อให้ข้อมูลในระบบเป็นปัจจุบันและถูกต้อง
      </p>
    </section>

    <!-- Form -->
    <section class="max-w-5xl mx-auto w-full px-6 pb-16 flex flex-col gap-5">
      <!-- ชื่อ + นามสกุล -->
      <div class="grid grid-cols-2 gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-gray-700">ชื่อ</label>
          <input
            v-model="form.firstName"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-gray-700">นามสกุล</label>
          <input
            v-model="form.lastName"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- ชื่อผู้ใช้ -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
        <input
          v-model="form.username"
          type="text"
          class="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- อีเมล -->
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-700">อีเมล</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-between mt-6">
        <button
          @click="onCancel"
          class="px-16 py-2.5 border-2 border-orange-500 text-orange-500 font-bold rounded-md hover:bg-orange-50 transition text-sm"
        >
          ยกเลิก
        </button>
        <button
          @click="onSave"
          class="px-16 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition text-sm"
        >
          บันทึก
        </button>
      </div>
    </section>

    <aboutFooter />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import navBar from "~/components/navBar.vue";
import aboutFooter from "~/components/aboutFooter.vue";

const router = useRouter();

// Profile image
const fileInput = ref(null);
const profileImage = ref(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function onFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    profileImage.value = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// Form data — replace with real user data from API/store
const form = ref({
  firstName: "",
  lastName: "",
  username: "@ppppad",
  email: "ppapapa@gmail.com",
});

function onCancel() {
  router.back();
}

function onSave() {
  // TODO: call API to update profile
  console.log("Saving profile:", form.value);
  router.back();
}
</script>   