import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { Root } from "../ladderLogic/Root"

const routes: RouteRecordRaw[] = [
    {
        name: "Home",
        path: "/",
        component: Root
    },
    // {
    //     path: '/about',
    //     name: 'About',
    //     component: () => import(/* webpackChunkName: "about" */ './routes/About.tsx')
    // }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})