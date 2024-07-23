<template>
    <v-container fluid>
        <v-breadcrumbs :items="breadcrumbs" class="my-10"/>

        <div class="text-h3 my-10 font-weight-bold">
            Blog
        </div>

        <v-row>
            <v-col cols="12" v-for="(post, key) in posts" :key="post.id">
                <v-card class="mx-auto" link :to="{ name: 'detail', params: { id: post.id } }">
                    <v-img
                            class="align-end text-white"
                            height="300"
                            :lazy-src="post.image"
                            :src="post.image"
                            aspect-ratio="1"
                            cover
                    >
                        <v-card-title>{{ post.title }} - {{ post.slug }}</v-card-title>
                        <template v-slot:error>
                            <v-img
                                    class="mx-auto"
                                    height="300"
                                    max-width="500"
                                    src="https://picsum.photos/500/300?image=232"
                            ></v-img>
                        </template>
                    </v-img>

                    <v-card-subtitle class="pt-4">
                        <div class="w-100">
                            <v-icon icon="mdi-calendar"></v-icon>
                            Publicado em {{ post.created_at }}
                        </div>
                        <div class="w-100">
                            <v-icon icon="mdi-account-circle"></v-icon>
                            {{ post.author.name }}
                        </div>
                    </v-card-subtitle>

                    <v-card-text>{{ post.content }}</v-card-text>

                    <v-card-actions>
                        <v-btn color="cyan-darken-4" text="Ler mais" :to="{ name: 'detail', params: { id: post.id } }"/>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <div class="text-center">
            <v-pagination
                    active-color="cyan-darken-4"
                    v-model="page"
                    :length="totalItems"
                    :total-visible="10"
                    @input="loadItems"
            ></v-pagination>
        </div>
    </v-container>
</template>

<script>
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const listApi = {
    async fetch(page, itemsPerPage) {
        return new Promise(async resolve => {
            const response = await axios.get(`${API_URL}/blog/posts`, {
                params: {
                    withoutFilterUser: true,
                    page: page,
                    per_page: itemsPerPage
                }
            });

            resolve({items: response.data.data, total: response.data.meta.total});
        })
    },
}

export default {
    name: "index",
    data() {
        return {
            breadcrumbs: ['Home'],
            itemsPerPage: 1,
            posts: [],
            loading: true,
            page: 1,
            totalItems: 0,
        };
    },
    watch: {
        page: {
            handler() {
                this.loadItems()
            },
            deep: true,
        },
    },
    methods: {
        loadItems() {
            let self = this;
            this.loading = true
            listApi.fetch(this.page, this.itemsPerPage).then(({items, total}) => {
                self.posts = items
                self.totalItems = total
                self.loading = false
            })
        },
    },
    mounted() {
        this.loadItems()
    }
}
</script>
