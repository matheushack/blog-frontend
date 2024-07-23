<template>
    <v-container fluid>
        <v-breadcrumbs :items="breadcrumbs" class="my-10"/>

        <v-container>
            <v-row class="mx-auto">
                <v-col class="mx-auto" :sm="12" :md="5" :lg="5">
                    <v-card title="Login" elevation="4">
                        <div class="pa-5">
                            <v-alert type="error" class="mb-5" v-if="errors" :text="errors"/>

                            <v-form @submit.prevent="handleLogin">
                                <v-text-field v-model="email" label="Email" required/>
                                <v-text-field type="password" v-model="password" label="Senha" required/>
                                <v-btn type="submit">Login</v-btn>
                            </v-form>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script>
import {login} from '@/services/auth';

export default {
    name: "login",
    data() {
        return {
            errors: null,
            breadcrumbs: ['Home', 'Login'],
            email: null,
            password: null,
        };
    },
    methods: {
        async handleLogin() {
            try {
                await login(this.email, this.password);
                this.$emit('auth', true);
                this.$router.push({name: 'dashboard'});
            } catch (error) {
                this.$emit('auth', false);
                this.errors = error.message;
            }
        },
    },
}
</script>
