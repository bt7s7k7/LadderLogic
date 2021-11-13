import { mdiElectricSwitch, mdiElectricSwitchClosed } from "@mdi/js"
import { defineComponent } from "vue"
import { defineDrawerInputConsumer } from "../../drawerInput/DrawerInputConsumer"
import { DrawerView } from "../../drawerInputVue3/DrawerView"
import { Button } from "../../vue3gui/Button"
import { Icon } from "../../vue3gui/Icon"
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
                        <div class="absolute top-0 flex column w-100" style={{ top: 9 + "px" }}>
                            {STATE.programRunner.program.refs.map(ref => (
                                <div style={{ flexBasis: (TILE_HEIGHT + TILE_PADDING) + "px" }} class="flex column px-1">
                                    <small>
                                        <Button
                                            clear
                                            class={[`text-${STATE.programRunner!.forceState[ref] ? "success" : "white"}`]}
                                            onClick={() => STATE.programRunner!.forceState[ref] = !STATE.programRunner!.forceState[ref]}
                                        >
                                            <Icon icon={STATE.programRunner!.forceState[ref] ? mdiElectricSwitchClosed : mdiElectricSwitch} />
                                        </Button>
                                    </small>
                                    <small class="mr-2 text-right">{ref}</small>
                                </div>
                            ))}
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