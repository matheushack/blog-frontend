<template>
    <v-container fluid style="height: 100%">
        <v-layout style="height: 100%">
            <auth-aside :user="user"/>

            <v-main style="height: 100%">
                <v-breadcrumbs :items="breadcrumbs" class="mb-10"/>

                <div class="text-h5 ma-5 font-weight-bold">
                    Publicações
                </div>

                <v-btn v-bind="props" color="success" class="float-end" prepend-icon="mdi-plus"
                       @click="dialog = true">
                    Nova publicação
                </v-btn>


                <v-data-table-server
                        v-model:items-per-page="itemsPerPage"
                        :headers="headers"
                        :items="serverItems"
                        :items-length="totalItems"
                        :loading="loading"
                        :search="search"
                        item-value="name"
                        @update:options="loadItems"
                >
                    <template v-slot:item.category="{ item }">
                        {{ item.category.name }}
                    </template>
                    <template v-slot:item.tags="{ item }">
                        <v-chip color="primary" variant="flat">{{ item.tags.length }}</v-chip>
                    </template>
                    <template v-slot:item.comments="{ item }">
                        <v-chip color="primary" variant="flat">{{ item.comments.length }}</v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-tooltip text="Visualizar">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="default" size="small" class="mx-2" icon="mdi-eye"
                                       :to="{ name: 'detail', params: { id: item.id } }" target="_blank"/>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Comentários" v-if="item.comments.length">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="info" size="small" class="mx-2"
                                       icon="mdi-comment-account-outline"
                                       @click="commentDialog(item)"/>
                            </template>
                        </v-tooltip>
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
                    :title="!form.id ? 'Nova publicação' : 'Editar publicação'"
            >
                <v-form validate-on="submit lazy" @submit.prevent="submit">
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12">
                                <v-text-field
                                        label="Título*"
                                        v-model="form.title"
                                        :rules="rules.title"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12">
                                <v-select
                                        :items="categories"
                                        item-value="id"
                                        item-title="name"
                                        v-model="form.category_id"
                                        :rules="rules.category_id"
                                        filled
                                        label="Categoria*"
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="12">
                                <v-textarea v-model="form.content" label="Conteúdo*"
                                            :rules="rules.content"></v-textarea>
                            </v-col>
                        </v-row>

                        <v-row dense>
                            <v-col cols="12">
                                <v-file-input v-model="form.image"
                                              accept="image/*"
                                              label="Imagem"
                                ></v-file-input>
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


        <v-dialog
                v-model="dialogComments"
                max-width="1080"
                persistent
        >
            <v-card>
                <v-card-title>
                    <v-icon icon="mdi-comment-account-outline"/>
                    Comentários ({{ comments.length }})
                </v-card-title>
                <v-form validate-on="submit lazy" @submit.prevent="submit">
                    <v-card-text>
                        <v-table class="mt-5 pa-0">
                            <tbody>
                            <tr
                                    v-for="item in comments"
                                    :key="item.id"
                            >
                                <td class="py-5">
                                    <div class="w-100 font-weight-bold">
                                        <v-icon icon="mdi-calendar"></v-icon>
                                        Comentário em {{ item.created_at }}
                                    </div>
                                    <div class="w-100 font-weight-bold">
                                        <v-icon icon="mdi-account-circle"></v-icon>
                                        {{ item.name ?? 'Anônimo' }}
                                    </div>
                                    <div class="w-100 mt-5">
                                        {{ item.comment }}
                                    </div>
                                </td>
                                <td class="text-right">
                                    <v-tooltip text="Deletar">
                                        <template v-slot:activator="{ props }">
                                            <v-btn v-bind="props" color="red" size="small" class="mx-2"
                                                   icon="mdi-delete"
                                                   @click="deleteCommentDialog(item)"/>
                                        </template>
                                    </v-tooltip>
                                </td>
                            </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                                text="Cancelar"
                                variant="plain"
                                @click="closeDialog"
                        ></v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<style>
.swal-in-dialog {
    z-index: 9999;
}
</style>

<script>
import AuthAside from "@/components/auth-aside.vue";
import {getApi, listApi, newApi, updateApi, deleteApi} from "@/services/crud"
import Swal from "sweetalert2";

export default {
    name: "posts",
    props: ['user'],
    components: {AuthAside},
    data() {
        return {
            breadcrumbs: ['Admin', 'Publicações'],
            itemsPerPage: 10,
            headers: [
                {title: 'ID', key: 'id', align: 'start'},
                {title: 'Título', key: 'title', align: 'start'},
                {title: 'Categoria', key: 'category', align: 'start'},
                {title: 'Tags', key: 'tags', align: 'center'},
                {title: 'Comentários', key: 'comments', align: 'center'},
                {title: '', key: 'actions', align: 'end'},
            ],
            search: '',
            serverItems: [],
            loading: true,
            totalItems: 0,
            dialog: false,
            dialogComments: false,
            newLoading: false,
            form: {
                id: null,
                title: null,
                category_id: null,
                content: null,
                image: null,
                tags: [],
            },
            categories: [],
            comments: [],
            rules: {
                title: [
                    value => {
                        if (value) return true
                        return 'O nome é obrigatório.'
                    },
                ],
                category_id: [
                    value => {
                        if (value) return true
                        return 'A categoria é obrigatória.'
                    },
                ],
                content: [
                    value => {
                        if (value) return true
                        return 'O conteúdo é obrigatório.'
                    },
                ]
            },
        };
    },
    methods: {
        loadCategories() {
            this.loading = true
            this.categories = [];

            getApi.fetch('blog/categories', {}).then((response) => {
                this.categories = response.data;
            });
        },
        loadItems({page, itemsPerPage, sortBy}) {
            this.loading = true
            listApi.fetch({page, itemsPerPage, sortBy}, 'posts').then(({items, total}) => {
                this.serverItems = items
                this.totalItems = total
                this.loading = false
            })
        },
        editDialog(item) {
            this.form.id = item.id;
            this.form.title = item.title;
            this.form.category_id = item.category_id;
            this.form.content = item.content;
            this.form.image = item.image;
            this.form.tags = item.tags;
            this.dialog = true;
        },
        commentDialog(item) {
            this.comments = item.comments;
            this.dialogComments = true;
        },
        deleteDialog(item) {
            let self = this;

            Swal.fire({
                title: "Excluir publicação",
                html: "Tem certeza que deseja excluir a publicação <strong>" + item.title + "</strong>?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#ccc",
                confirmButtonText: "Excluir"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteApi.fetch(item, 'posts').then((response) => {
                        if (response.success) {
                            Swal.fire({
                                title: "Publicação",
                                text: "Publicação deletada com sucesso",
                                icon: "success"
                            });

                            self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: response.message,
                                customClass: {
                                    container: 'swal-in-dialog'
                                }
                            });
                        }
                    })
                }
            });
        },
        deleteCommentDialog(item) {
            let self = this;

            Swal.fire({
                title: "Excluir comentário",
                html: "Tem certeza que deseja excluir o comentário?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#ccc",
                confirmButtonText: "Excluir",
                customClass: {
                    container: 'swal-in-dialog'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteApi.fetch(item, 'comments').then((response) => {
                        if (response.success) {
                            Swal.fire({
                                title: "Comentário",
                                text: "Comentário deletado com sucesso",
                                icon: "success"
                            });

                            self.closeDialog();
                            self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: response.message,
                                customClass: {
                                    container: 'swal-in-dialog'
                                }
                            });
                        }
                    })
                }
            });
        },
        closeDialog() {
            this.form.id = null;
            this.form.title = null;
            this.form.category_id = null;
            this.form.content = null;
            this.form.image = null;
            this.form.tags = [];
            this.comments = [];
            this.dialog = false;
            this.dialogComments = false;
        },
        async submit(event) {
            this.newLoading = true
            let self = this;
            const results = await event

            if (results.valid && !this.form.id) {
                newApi.fetch(this.form, 'posts').then((response) => {
                    self.closeDialog();

                    if (response.data) {
                        Swal.fire({
                            title: "Publicação",
                            text: "Publicação cadastrada com sucesso",
                            icon: "success"
                        });

                        self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: response.message,
                            customClass: {
                                container: 'swal-in-dialog'
                            }
                        });
                    }
                })
            } else if (results.valid && this.form.id) {
                updateApi.fetch(this.form, 'posts').then((response) => {
                    self.closeDialog();

                    if (response.data) {
                        Swal.fire({
                            title: "Publicação",
                            text: "Publicação editada com sucesso",
                            icon: "success"
                        });

                        self.loadItems({page: 1, itemsPerPage: self.itemsPerPage});
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            html: response.message,
                            customClass: {
                                container: 'swal-in-dialog'
                            }
                        });
                    }
                })
            }

            this.newLoading = false;
        },
    },
    mounted() {
        this.loadCategories();
    }
}
</script>
