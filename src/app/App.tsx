import { defineComponent } from "vue"
import { DynamicsEmitter } from "../vue3gui/DynamicsEmitter"

export const App = defineComponent({
    name: "App",
    setup(props, ctx) {
        return () => (
            <DynamicsEmitter>
                <router-view />
            </DynamicsEmitter>
        )
    }
})