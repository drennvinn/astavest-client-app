<script setup lang="ts">

interface FileWithPreview {
    file: File;
    id: string;
    preview: string;
    // name: string;
    // type: string;
    // size: number;
    // lastModified: number;
}

const props = defineProps({
    multiple: {
        type: Boolean,
        default: false
    }
})

const files = ref<FileWithPreview[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// const emit = defineEmits(['upload', 'cancel']);
const emit = defineEmits(['update:modelValue']);
const emitFiles = () => {
    emit('update:modelValue', files.value.map(fileWithPreview => fileWithPreview.file))
};

watch(files, emitFiles, { deep: true });


const addFile = (file: File) => {
    // Si multiple est false et qu'il y a déjà un fichier, on ne fait rien
    if (!props.multiple && files.value.length > 0) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const fileWithPreview: FileWithPreview = {
            // ...file,
            file,
            id: URL.createObjectURL(file),
            preview: file.type.startsWith('image/') ? e.target?.result as string : '',
            // Ajoutez explicitement les propriétés du File que vous voulez conserver
            // name: file.name,
            // type: file.type,
            // size: file.size,
            // lastModified: file.lastModified,
        }
        files.value.push(fileWithPreview);
        // emit('upload', files.value);
        emitFiles();
    }
    reader.readAsDataURL(file)
}

const onFileSelected = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        Array.from(input.files).forEach(addFile)
    }
}

const dropHandler = (event: DragEvent) => {
    isDragging.value = false
    if (event.dataTransfer?.files) {
        Array.from(event.dataTransfer.files).forEach(addFile)
    }
}

const dragEnterHandler = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer?.types.includes('Files')) {
        isDragging.value = true
    }
}

const dragLeaveHandler = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = false
}

const dragOverHandler = (event: DragEvent) => {
    event.preventDefault()
    if (event.dataTransfer?.types.includes('Files')) {
        isDragging.value = true
    }
}

// const uploadFiles = () => {
//     emit('upload', files.value)
// }

// const cancelUpload = () => {
//     files.value = []
//     emit('cancel')
// }

const removeFile = (fileToRemove: FileWithPreview) => {
    files.value = files.value.filter(file => file.id !== fileToRemove.id);
    // emit('upload', files.value);
    emitFiles();
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>


<template>
    <div class="bg-gray-200 w-full rounded-lg sm:px-8 md:px-16 sm:py-8">
        <main class="container mx-auto max-w-screen-lg">
            <article aria-label="File Upload Modal" class="relative flex flex-col bg-white shadow-xl rounded-md"
                @drop.prevent="dropHandler" @dragover.prevent="dragOverHandler" @dragleave.prevent="dragLeaveHandler"
                @dragenter.prevent="dragEnterHandler">
                <!-- overlay -->
                <div id="overlay"
                    class="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md"
                    :class="{ 'draggedover': isDragging }">
                    <i>
                        <svg class="fill-current w-12 h-12 mb-3 text-blue-700" xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24">
                            <path
                                d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
                        </svg>
                    </i>
                    <p class="text-lg text-blue-700">Drop files to upload</p>
                </div>

                <!-- scroll area -->
                <section class="h-full overflow-auto p-8 w-full flex flex-col">
                    <header
                        class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                        <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                            <span>Drag and drop your</span>&nbsp;<span>files anywhere or</span>
                        </p>
                        <input ref="fileInput" type="file" :multiple="multiple" class="hidden"
                            @change="onFileSelected" />
                        <button @click.prevent="fileInput?.click()"
                            class="mt-2 rounded-md px-4 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                            Upload a file
                        </button>
                    </header>

                    <p class="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">To Upload</p>

                    <ul id="gallery" class="flex flex-1 flex-wrap -m-1">
                        <li
                            v-if="files.length === 0"
                            class="h-full w-full text-center flex flex-col items-center justify-center"
                        >
                            <img
                                class="mx-auto w-32"
                                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                                alt="no data"
                            />
                            <span class="text-small text-gray-500">No files selected</span>
                        </li>
                        <!-- <li
                            v-for="file in files" :key="file.id"
                            class="block p-1 w-1/2 sm:w-1/3 md:w-1/4 h-24"
                        > -->
                        <li
                            v-for="fileWithPreview in files"
                            :key="fileWithPreview.id"
                            class="block p-1 w-1/2 sm:w-1/3 md:w-1/4 h-24"
                        >
                            <article tabindex="0"
                                :class="[
                                    'group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm',
                                    { 'hasImage': fileWithPreview.file.type.startsWith('image/') }
                                ]"
                            >
                                <img
                                    v-if="fileWithPreview.file.type.startsWith('image/')"
                                    :src="fileWithPreview.preview"
                                    :alt="fileWithPreview.file.name"
                                    class="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"
                                />
                                <section :class="[
                                        'flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3',
                                        {'bg-black bg-opacity-50': fileWithPreview.file.type.startsWith('image/')}
                                    ]"
                                >
                                    <p
                                        :class="[
                                            'flex-1 text-sm select-none',
                                            fileWithPreview.file.type.startsWith('image/') ? 'group-hover:text-white' : 'group-hover:text-gray-800'
                                        ]"
                                    >
                                        {{ fileWithPreview.file.name.substring(0, 30) + '...' }}
                                    </p>
                                    <div class="flex">
                                        <span class="p-1 text-blue-800">
                                            <!-- icon file -->
                                            <i>
                                                <svg class="fill-current w-4 h-4 ml-auto pt-1"
                                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24">
                                                    <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                                                </svg>
                                            </i>
                                        </span>
                                        <p class="p-1 size text-sm text-gray-700m select-none">{{ formatFileSize(fileWithPreview.file.size) }}</p>
                                        <button
                                            class="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
                                            @click.stop="removeFile(fileWithPreview)"
                                        >
                                            <!-- icon delete -->
                                            <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24"viewBox="0 0 24 24">
                                                <path class="pointer-events-none" d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                                            </svg>
                                        </button>
                                    </div>
                                </section>
                            </article>
                        </li>
                    </ul>
                </section>

                <!-- sticky footer -->
                <!-- <footer class="flex justify-end px-8 pb-8 pt-4">
                    <button @click.prevent="uploadFiles"
                        class="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                        Upload now
                    </button>
                    <button @click.prevent="cancelUpload"
                        class="ml-3 rounded-md px-4 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                        Cancel
                    </button>
                </footer> -->
            </article>
        </main>
    </div>
</template>


<style scoped>
.hasImage section {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}
.hasImage:hover section {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
}
.hasImage section * { color: white; }
.hasImage:hover button:hover { background: rgba(255, 255, 255, 0.3); }

#overlay p, #overlay i { opacity: 0; }
#overlay.draggedover { background-color: rgba(255, 255, 255, 0.7); }
#overlay.draggedover p,
#overlay.draggedover i { opacity: 1; }

.group:hover .group-hover\:text-blue-800 { color: #2b6cb0; }
</style>
