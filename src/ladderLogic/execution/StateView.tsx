import { defineComponent } from "vue"
import { defineDrawerInputConsumer } from "../../drawerInput/DrawerInputConsumer"
import { DrawerView } from "../../drawerInputVue3/DrawerView"
import { STATE } from "../State"
import { StateDrawer, TILE_HEIGHT, TILE_PADDING } from "./StateDrawer"

export const StateView = (defineComponent({
    name: "StateView",
    setup(props, ctx) {

        const consumer = defineDrawerInputConsumer((self, drawerInput) => new StateDrawer(drawerInput))

        return () => (
            <div>
                {STATE.programRunner ? (
                    <div class="absolute-fill scroll">
                        <div class="w-fill" style={{ minHeight: "100%", height: ((TILE_HEIGHT + TILE_PADDING) * STATE.program!.refs.length + TILE_PADDING) + "px" }}>
                            <DrawerView class="absolute-fill" consumer={consumer} />
                        </div>
                    </div>
                ) : (
                    <div class="absolute-fill flex center muted">
                        Missing compiled program
                    </div>
                )}
            </div>
        )
    }
}))