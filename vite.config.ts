import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import * as dotenv from "dotenv"
import { defineConfig } from "vite"



// https://vitejs.dev/config/
export default defineConfig(() => {
    dotenv.config()

    return {
        plugins: [vue(), vueJsx()],
        server: {
            port: +process.env.PORT ?? 8080
        }
    }
})
