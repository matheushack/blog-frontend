<template>
    <div>
        <v-app-bar app :elevation="2" class="bg-cyan-darken-4">
            <v-toolbar-title>
                <router-link :to="{ name: 'index' }" class="toolbar-title-link">
                    Desafio Laravel Fullstack
                </router-link>
            </v-toolbar-title>

            <v-toolbar-items :class="['d-none',  'd-sm-flex']">
                <v-btn :to="{ name: 'login' }" v-if="!logged">Login</v-btn>
                <v-btn :to="{ name: 'dashboard' }" v-if="logged">Admin</v-btn>
                <v-btn v-if="logged" @click="$emit('logout')">Logout</v-btn>
            </v-toolbar-items>

            <v-app-bar-nav-icon @click="drawer = !drawer"
                                :class="['d-sm-none', 'd-md-none', 'd-lg-none', 'd-xl-none']"/>
        </v-app-bar>

        <v-navigation-drawer
                v-model="drawer"
                app
                temporary
                location="right"
                disable-resize-watcher
                :class="['d-sm-none', 'd-md-none', 'd-lg-none', 'd-xl-none']"
        >
            <v-list-item title="Desafio Laravel Fullstack" :subtitle="logged ? 'Admin' : ''"
                         class="my-3"></v-list-item>
            <v-divider></v-divider>

            <v-list-item :to="{ name: 'login' }" link title="Login" class="my-2" v-if="!logged"></v-list-item>
            <v-list-item :to="{ name: 'dashboard' }" link title="Dashboard" class="my-2" v-if="logged"></v-list-item>
            <v-list-item link title="Logout" class="my-2" v-if="logged" @click="$emit('logout')"></v-list-item>
        </v-navigation-drawer>
    </div>
</template>

<style>
.toolbar-title-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
}
</style>

<script>
export default {
    name: "login",
    props: ['user', 'logged'],
    data() {
        return {
            drawer: false
        };
    }
}
</script>
