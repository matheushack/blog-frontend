<template>
    <v-dialog v-model="show" width="auto">
        <v-card max-width="400" prepend-icon="mdi-update" :text="error" title="Atenção">
            <template v-slot:actions>
                <v-btn
                        class="ms-auto"
                        text="Ok"
                        @click="show = false"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'alert',
    props: ['dialog', 'message'],
    computed: {
        show: {
            get() {
                return this.dialog
            },
            set(value) {
                if (!value) {
                    this.$emit('close')
                }
            }
        },
        error: {
            get() {
                return this.message
            }
        }
    }
}
</script>
