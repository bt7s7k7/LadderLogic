import { defineComponent } from "vue"
import { DrawerView } from "../drawerInputVue3/DrawerView"

export const StateView = (defineComponent({
    name: "StateView",
    setup(props, ctx) {
        return () => (
            <div>
                <DrawerView class="flex-fill" />
            </div>
        )
    }
}))