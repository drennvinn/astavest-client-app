<script setup lang="ts">
interface FileWithPreview {
    file: File;
    id: string;
    preview: string;
}

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: 'Upload a file'
    }
})

const files = ref<FileWithPreview[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['update:modelValue']);
const emitFiles = () => {
    emit('update:modelValue', files.value.map(fileWithPreview => fileWithPreview.file));
};

watch(files, emitFiles, { deep: true });

const addFile = (file: File) => {
    // Si multiple est false et qu'il y a déjà un fichier, on ne fait rien
    if (!props.multiple && files.value.length > 0) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const fileWithPreview: FileWithPreview = {
            file,
            id: URL.createObjectURL(file),
            preview: file.type.startsWith('image/') ? e.target?.result as string : '',
        }
        files.value.push(fileWithPreview);
        emitFiles();
    }
    reader.readAsDataURL(file);
}

const onFileSelected = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        Array.from(input.files).forEach(addFile);
    }
}

const removeFile = (fileToRemove: FileWithPreview) => {
    files.value = files.value.filter(file => file.id !== fileToRemove.id);
    emitFiles();
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<template>
    <div class="w-full">
        <div class="relative border border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <!-- Zone de drop et input -->
            <div
                class="flex items-center justify-center w-full"
                @drop.prevent="($event) => { isDragging = false; Array.from($event.dataTransfer?.files || []).forEach(addFile); }"
                @dragover.prevent="() => isDragging = true"
                @dragleave.prevent="() => isDragging = false"
            >
                <label
                    class="w-full h-full cursor-pointer p-4 m-0"
                    :class="{ 'bg-blue-50': isDragging }"
                >
                    <div class="flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span class="text-sm text-gray-600">{{ label }}</span>
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        :multiple="multiple"
                        class="hidden"
                        @change="onFileSelected"
                    />
                </label>
            </div>

            <!-- Liste des fichiers -->
            <div v-if="files.length > 0" class="mt-2 space-y-2">
                <div
                    v-for="fileWithPreview in files"
                    :key="fileWithPreview.id"
                    class="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                    <div class="flex items-center space-x-2">
                        <img
                            v-if="fileWithPreview.file.type.startsWith('image/')"
                            :src="fileWithPreview.preview"
                            :alt="fileWithPreview.file.name"
                            class="w-8 h-8 object-cover rounded"
                        />
                        <svg
                            v-else
                            class="w-8 h-8 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div class="flex flex-col">
                            <span class="text-sm truncate max-w-xs">{{ fileWithPreview.file.name }}</span>
                            <span class="text-xs text-gray-500">{{ formatFileSize(fileWithPreview.file.size) }}</span>
                        </div>
                    </div>
                    <button
                        @click="removeFile(fileWithPreview)"
                        class="p-1 hover:bg-gray-200 rounded-full"
                    >
                        <svg class="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.max-w-xs {
    max-width: 20rem;
}
</style>