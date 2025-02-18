<script setup lang="ts">
import { ref } from 'vue';

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

const props = withDefaults(defineProps<{
    accept: "application/pdf" | "image/jpeg" | "image/png",
    multiple?: boolean,
    auto_upload?: boolean
}>(), {
    multiple: false,
    auto_upload: false
});

const emit = defineEmits<{
    (e: 'upload', files: File[]): void;
}>();


const onChange = (e: Event) => {
    if (fileInput.value?.files) {
        if (props.multiple) {
            files.value = [...fileInput.value?.files];
        } else {
            files.value = [fileInput.value?.files[0]];
        }
    }
    if (props.auto_upload) { emitFiles(); }
};

const generateThumbnail = (file: File) => {
    const fileSrc = URL.createObjectURL(file);
    return fileSrc;
};

const truncateFileName = (name: string, maxLength: number = 24) => {
    if (name.length <= maxLength) return name;

    const parts = name.split(".");
    const ext = parts.pop();
    let baseName = parts.join(".");

    const charsToShow = maxLength - ext.length - 3; // 3 for "..."
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return `${baseName.substring(0, frontChars)}...${baseName.substr(baseName.length - backChars)} .${ext}`;
};

const remove = (i: number) => {
    if (!props.multiple) {
        // Si 'multiple' est false, alors réinitialisez simplement la liste et le champ d'entrée
        if (fileInput.value) {
            fileInput.value.value = '';
        }
        files.value = [];
    } else {
        // Sinon, supprimez le fichier à l'index spécifié
        files.value.splice(i, 1);
    }

    // Si l'auto_upload est activé, envoyez la liste mise à jour des fichiers
    if (props.auto_upload) {
        emit('upload', files.value);
    }
};

const dragover = (e: DragEvent) => {
    e.preventDefault();
    isDragging.value = true;
};

const dragleave = () => {
    isDragging.value = false;
};

const drop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
        if (props.multiple) {
            files.value = [...e.dataTransfer.files];
        } else {
            files.value = [e.dataTransfer.files[0]];
        }
    }
    if (props.auto_upload) { emitFiles(); }
    isDragging.value = false;
};

const emitFiles = () => {
    if (files.value.length) {
        emit('upload', files.value);
    } else {
        alert("vous devez ajouter un fichier avant de l'envoyer");
    }
};
</script>



<template>
    <div class="main bg-white h-full rounded-xl">
        <div
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
            class="dropzone-container h-[30rem] flex justify-center items-center mb-8 p-4"
            :class="{'bg-gray-300': isDragging}"
        >
            <div>
                <Icon name="uil:upload" size="4em" class="text-blue mb-8"/>
                <p class="text-3xl mb-4">Drag & drop any file here</p>

                <label class="text-2xl cursor-pointer">
                    or
                    <span>
                        <input
                            ref="fileInput"
                            type="file"
                            :multiple="props.multiple"
                            name="file"
                            class="opacity-0 overflow-hidden absolute w-1 h-1"
                            @change="onChange"
                            :accept="props.accept"
                        />
                        <span class="text-orange-500">browse file </span>
                    </span>
                    <span>from device</span>
                </label>

                <!-- <label for="fileInput" class="file-label">
                    <div v-if="isDragging">Release to drop files here.</div>
                    <div v-else>Drop files here or <u>click here</u> to upload.</div>
                </label> -->

                <div class="preview-container mt-4" v-if="files.length">
                    <div v-for="file in files" :key="file.name" class="preview-card relative">
                        <div class="flex flex-wrap justify-center">
                            <p class="w-full">{{ truncateFileName(file.name) }}</p>
                            <img v-if="accept !== 'application/pdf'" class="preview-img" :src="generateThumbnail(file)" />
                            <iframe v-else :src="generateThumbnail(file)" frameborder="0" class="w-3/4"></iframe>
                        </div>
                        <div>
                            <button
                                @click="remove(files.indexOf(file))"
                                title="Remove file"
                                class="absolute top-0 right-8 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center"
                                type="button"
                            ><b>&times;</b>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="!props.auto_upload" class="w-full">
            <button
                @click.stop="emitFiles"
                class="bg-orange-500 text-white mx-auto block py-2 px-8 rounded-xl uppercase"
            >
                upload
            </button>
        </div>

    </div>
</template>


<style scoped>
.dropzone-container {
    border: 2px dashed #ccc;
    border-radius: 0.75rem;
    text-align: center;
    transition: all 0.3s ease;
}
</style>
