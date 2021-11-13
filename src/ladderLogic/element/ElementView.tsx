import { defineComponent } from "vue"
import { defineDrawerInputConsumer } from "../../drawerInput/DrawerInputConsumer"
import { DrawerView } from "../../drawerInputVue3/DrawerView"
import { ElementDrawer } from "./ElementDrawer"

export const ElementView = (defineComponent({
    name: "ElementView",
    setup(props, ctx) {

        const consumer = defineDrawerInputConsumer((self, drawerInput) => new ElementDrawer(drawerInput))

        return () => (
            <div>
                <DrawerView class="absolute-fill" consumer={consumer} />
            </div>
        )
    }
}))