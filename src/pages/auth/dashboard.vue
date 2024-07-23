<template>
    <v-container fluid style="height: 100%">
        <v-layout style="height: 100%">
            <auth-aside :user="user"/>

            <v-main style="height: 100%">
                <v-breadcrumbs :items="breadcrumbs" class="mb-10"/>
            </v-main>
        </v-layout>
    </v-container>
</template>

<script>
import AuthAside from "@/components/auth-aside.vue";

export default {
    name: "dashboard",
    props: ['user'],
    components: {AuthAside},
    data() {
        return {
            breadcrumbs: ['Home', 'Dashboard'],
        };
    }
}
</script>
