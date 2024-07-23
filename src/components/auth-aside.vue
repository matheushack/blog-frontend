<template>
    <v-navigation-drawer
            v-model="aside"
            :rail="rail"
            permanent
            @click="rail = false"
    >
        <v-list-item
                prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
                :title="user.name"
                nav>
            <template v-slot:append>
                <v-btn
                        icon="mdi-chevron-left"
                        variant="text"
                        @click.stop="rail = !rail"
                ></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-tooltip text="Dashboard">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" link prepend-icon="mdi-view-dashboard" title="Dashboard"
                                 :active="isActive('dashboard')" active-color="cyan-darken-4"
                                 @click.stop="goTo('dashboard')"></v-list-item>
                </template>
            </v-tooltip>

            <v-tooltip text="Categorias">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" link prepend-icon="mdi-select-group" title="Categorias" :active="isActive('categories')"
                                 active-color="cyan-darken-4"
                                 @click.stop="goTo('categories')"></v-list-item>
                </template>
            </v-tooltip>

            <v-tooltip text="Publicações">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" link prepend-icon="mdi-post" title="Publicações" :active="isActive('posts')"
                                 active-color="cyan-darken-4"
                                 @click.stop="goTo('posts')"></v-list-item>
                </template>
            </v-tooltip>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'auth-aside',
    props: ['user'],
    data() {
        return {
            aside: true,
            rail: true,
        };
    },
    methods: {
        isActive(route) {
            return this.$route.name === route;
        },
        goTo(route) {
            this.rail = true;
            this.$router.push({name: route});
        },
    },
}
</script>
