<template>
    <div>
        <ClientFormCkWizard />

        <!-- <div>
            <button @click="showModal = true" class="btn btn-info">
                Ouvrir la modal
            </button>

            <Modal
                v-model="showModal"
                :close-on-click-outside="false"
                title="Ma Modal"
                size="lg"
                @confirm="handleConfirm"
            >
                <p>Contenu de la modal</p>
            </Modal>
        </div> -->

    </div>
</template>



<script setup lang="ts">
const showModal = ref(false);
const handleConfirm = () => {
    console.log('Confirmation clicked');
};
</script>




<style scoped></style>
