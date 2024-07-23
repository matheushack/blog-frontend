<template>
    <v-container fluid v-if="post.id">
        <v-breadcrumbs :items="breadcrumbs" class="my-10"/>

        <v-card
                class="mx-auto" elevation="0">
            <v-img
                    class="align-end text-white"
                    height="300"
                    :lazy-src="post.image"
                    :src="post.image"
                    aspect-ratio="1"
                    cover
            >
                <template v-slot:error>
                    <v-img
                            class="mx-auto"
                            height="300"
                            max-width="500"
                            src="https://picsum.photos/500/300?image=232"
                    ></v-img>
                </template>
            </v-img>

            <v-card-title class="pt-4">{{ post.title }}</v-card-title>
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

            <v-card-text>
                {{ post.content }}
            </v-card-text>
        </v-card>

        <v-card class="mt-10" elevation="0">

            <v-card-title class="pt-4">Comentários ({{ comments.length }})</v-card-title>

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
                    </tr>
                    <tr>
                        <td class="pt-5">
                            <v-text-field v-model="newCommentName" label="Nome"></v-text-field>
                            <v-textarea v-model="newComment" label="Comentário"></v-textarea>
                            <v-btn color="cyan-darken-4" class="float-end" text="Comentar" @click="comment"
                                   :loading="newCommentLoading"/>
                        </td>
                    </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <v-overlay
                :model-value="overlay"
                class="align-center justify-center"
        >
            <v-progress-circular
                    color="primary"
                    size="64"
                    indeterminate
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const detailApi = {
    async fetch(slug) {
        return new Promise(async resolve => {
            const response = await axios.get(`${API_URL}/blog/post/${slug}`);
            resolve({post: response.data.data});
        })
    },
}

const commentApi = {
    async fetch(slug, name, comment) {
        return new Promise(async resolve => {
            const response = await axios.post(`${API_URL}/blog/post/${slug}/comment`, {
                name: name,
                comment: comment
            });
            resolve({comments: response.data.data});
        })
    },
}

export default {
    name: "detail",
    computed: {
        slug() {
            return this.$route.params.slug;
        }
    },
    data() {
        return {
            breadcrumbs: ['Home', 'Publicação'],
            post: {},
            comments: [],
            newCommentLoading: false,
            newCommentName: '',
            newComment: '',
        };
    },
    methods: {
        fetchDetail() {
            let self = this;
            let slug = this.$route.params.id;

            detailApi.fetch(slug).then(({post}) => {
                self.post = post
                self.comments = post.comments
                self.breadcrumbs.push(post.title)
            });
        },
        comment() {
            let self = this;
            let slug = this.$route.params.id;

            this.newCommentLoading = true;

            commentApi.fetch(slug, this.newCommentName, this.newComment).then(({comments}) => {
                self.comments = comments
                self.newCommentName = null;
                self.newComment = null;
                self.newCommentLoading = false;
            });

        }
    },
    mounted() {
        this.fetchDetail()
    }
}
</script>
