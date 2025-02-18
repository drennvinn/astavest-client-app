<script setup lang="ts">
import VueCollapsible from 'vue-height-collapsible/vue3';


const active1: any = ref(1);
</script>


<template>
    <div class="panel rounded-md bg-white dark:bg-black">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">FAQ</h5>
        </div>
        <Accordion class="mb-8">
            <AccordionItem>
                <template #title>Cooment retirer?</template>
                <p>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,
                    non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                    put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
                    wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer
                    farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </p>
            </AccordionItem>
            <AccordionItem>
                <template #title>Comment déposer?</template>
                <p>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,
                    non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                    put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
                    wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer
                    farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </p>
            </AccordionItem>
            <AccordionItem>
                <template #title>Section 3</template>
                <p>Contenu de la section 3...</p>
            </AccordionItem>
            <AccordionItem>
                <template #title>Section 4</template>
                <p>Contenu de la section 4...</p>
            </AccordionItem>
        </Accordion>
    </div>
</template>