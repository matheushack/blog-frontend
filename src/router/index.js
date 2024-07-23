/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import { authToken } from '@/services/auth';
import Index from '@/pages/index'
import Detail from '@/pages/detail'
import Login from '@/pages/login'
import Dashboard from '@/pages/auth/dashboard'
import Categories from '@/pages/auth/categories'
import Posts from '@/pages/auth/posts'

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index
    },
    {
        path: '/detalhe/:id',
        name: 'detail',
        component: Detail
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/admin/dashboard',
        name: 'dashboard',
        component: Dashboard,
        beforeEnter: (to, from, next) => {
            if (authToken()) {
                next();
            } else {
                next('/login');
            }
        },
    },
    {
        path: '/admin/categories',
        name: 'categories',
        component: Categories,
        beforeEnter: (to, from, next) => {
            if (authToken()) {
                next();
            } else {
                next('/login');
            }
        },
    },
    {
        path: '/admin/posts',
        name: 'posts',
        component: Posts,
        beforeEnter: (to, from, next) => {
            if (authToken()) {
                next();
            } else {
                next('/login');
            }
        },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if (!localStorage.getItem('vuetify:dynamic-reload')) {
            console.log('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
        } else {
            console.error('Dynamic import error, reloading page did not fix it', err)
        }
    } else {
        console.error(err)
    }
})

router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
