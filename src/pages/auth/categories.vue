<template>
    <v-container fluid style="height: 100%">
        <v-layout style="height: 100%">
            <auth-aside :user="user"/>

            <v-main style="height: 100%">
                <v-breadcrumbs :items="breadcrumbs" class="mb-10"/>

                <div class="text-h5 ma-5 font-weight-bold">
                    Categorias
                </div>

                <v-btn v-bind="props" color="success" class="float-end" prepend-icon="mdi-plus"
                       @click="dialog = true">
                    Nova categoria
                </v-btn>

                <v-data-table-server
                        v-model:items-per-page="itemsPerPage"
                        :headers="headers"
                        :items="serverItems"
                        :items-length="totalItems"
                        :loading="loading"
                        :search="search"
                        :options.sync="options"
                        item-value="name"
                        @update:options="loadItems"
                >
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="Editar">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="warning" size="small" class="mx-2" icon="mdi-pencil"
                                       @click="editDialog(item)"/>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Deletar">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="red" size="small" class="mx-2" icon="mdi-delete"
                                       @click="deleteDialog(item)"/>
                            </template>
                        </v-tooltip>
                    </template>
                </v-data-table-server>
            </v-main>
        </v-layout>

        <v-dialog
                v-model="dialog"
                max-width="600"
                persistent
        >
            <v-card
                    :prepend-icon="!form.id ? 'mdi-plus' : 'mdi-pencil'"
                    :title="!form.id ? 'Nova categoria' : 'Editar categoria'"
            >
                <v-form validate-on="submit lazy" @submit.prevent="submit">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12">
                                <v-text-field
                                        label="Nome*"
                                        v-model="form.name"
                                        :rules="rules.name"
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <small class="text-caption text-medium-emphasis">*campos obrigatórios</small>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                                text="Cancelar"
                                variant="plain"
                                @click="closeDialog"
                        ></v-btn>

                        <v-btn
                                color="primary"
                                text="Salvar"
                                variant="tonal"
                                :loading="newLoading"
                                type="submit"
                        ></v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

import Swal from 'sweetalert2'
import AuthAside from "@/components/auth-aside.vue";
import {listApi, newApi, updateApi, deleteApi} from "@/services/crud"

export default {
    name: "categories",
    props: ['user'],
    components: {AuthAside},
    data() {
        return {
            breadcrumbs: ['Admin', 'Categorias'],
            itemsPerPage: 10,
            headers: [
                {title: 'ID', key: 'id', align: 'start'},
                {title: 'Categoria', key: 'name', align: 'start'},
                {title: '', key: 'actions', align: 'end', sortable: false},
            ],
            options: {},
            search: '',
            serverItems: [],
            loading: true,
            totalItems: 0,
            dialog: false,
            newLoading: false,
            form: {
                id: null,
                name: '',
            },
            rules: {
                name: [
                    value => {
                        if (value?.length > 0) return true
                        return 'O nome é obrigatório.'
                    },
                ]
            },
        };
    },
    methods: {
        loadItems({page, itemsPerPage, sortBy}) {
            this.loading = true
            listApi.fetch({page, itemsPerPage, sortBy}, 'categories').then(({items, total}) => {
                this.serverItems = items
                this.totalItems = total
                this.loading = false
            })
        },
        editDialog(item) {
            this.form.id = item.id;
            this.form.name = item.name;
            this.dialog = true;
        },
        deleteDialog(item) {
            let self = this;

            Swal.fire({
                title: "Excluir categoria",
                html: "Tem certeza que deseja excluir a categoria <strong>" + item.name + "</strong>?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#ccc",
                confirmButtonText: "Excluir"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteApi.fetch(item, 'categories').then((response) => {
                        if (response.success) {
                            Swal.fire({
                                title: "Categoria",
                                text: "Categoria deletada com sucesso",
                                icon: "success"
                            });

                            self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: response.message
                            });
                        }
                    })
                }
            });
        },
        closeDialog() {
            this.form.id = null;
            this.form.name = null;
            this.dialog = false;
        },
        async submit(event) {
            this.newLoading = true
            let self = this;
            const results = await event

            if (results.valid && !this.form.id) {
                newApi.fetch(this.form, 'categories').then((response) => {
                    self.closeDialog();

                    if (response.data.id) {
                        Swal.fire({
                            title: "Categoria",
                            text: "Categoria cadastrada com sucesso",
                            icon: "success"
                        });

                        self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response.message
                        });
                    }
                })
            } else if (results.valid && this.form.id) {
                updateApi.fetch(this.form, 'categories').then((response) => {
                    self.closeDialog();

                    if (response.data.id) {
                        Swal.fire({
                            title: "Categoria",
                            text: "Categoria editada com sucesso",
                            icon: "success"
                        });

                        self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response.message
                        });
                    }
                })
            }

            this.newLoading = false;
        },
    }
}
</script>
