<template>
    <v-app class="bg-white">
        <toolbar :logged="logged" :user="user" @logout="handleLogout"/>

        <v-main>
            <router-view :user="user" @auth="checkAuth" @error="showError"/>
        </v-main>

        <alert :dialog="error.show" :message="error.message" @close="error.show = false"/>
    </v-app>
</template>

<script>
import Toolbar from "@/components/toolbar.vue";
import {logout, userInfo} from "@/services/auth";
import Alert from "@/components/alert.vue";

export default {
    name: "index",
    components: {Alert, Toolbar},
    data() {
        return {
            authenticate: null,
            logged: false,
            error: {
                show: false,
                message: '',
            },
            user: {},
        };
    },
    watch: {
        authenticate: {
            handler(value) {
                this.logged = value;
                if (value) {
                    this.handleUserInfo()
                } else {
                    this.$router.push({name: 'index'});
                }
            },
            deep: true,
        },
    },
    methods: {
        checkAuth(authenticate) {
            this.authenticate = authenticate;
        },
        showError(message) {
            this.error.show = true;
            this.error.message = message;
        },
        async handleUserInfo() {
            let response = await userInfo();
            this.logged = !!response.id;
            this.user = {
                id: response.id,
                name: response.name,
                email: response.email
            }
        },

        async handleLogout() {
            await logout();
            this.checkAuth(false);
        }
    },
    mounted() {
        this.handleUserInfo()
    }
}
</script>
