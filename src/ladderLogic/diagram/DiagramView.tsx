import { defineComponent } from "vue"
import { defineDrawerInputConsumer } from "../../drawerInput/DrawerInputConsumer"
import { DrawerView } from "../../drawerInputVue3/DrawerView"
import { DiagramDrawer } from "./DiagramDrawer"

export const DiagramView = (defineComponent({
    name: "ElementView",
    setup(props, ctx) {

        const consumer = defineDrawerInputConsumer((self, drawerInput) => new DiagramDrawer(drawerInput))

        return () => (
            <div>
                <DrawerView class="absolute-fill" consumer={consumer} />
            </div>
        )
    }
}))