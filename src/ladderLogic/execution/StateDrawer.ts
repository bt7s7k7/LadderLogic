import { unreachable } from "../../comTypes/util"
import { Color } from "../../drawer/Color"
import { Point } from "../../drawer/Point"
import { DrawerInput } from "../../drawerInput/DrawerInput"
import { EventListener } from "../../eventLib/EventListener"
import { STATE } from "../State"

export const TILE_HEIGHT = 30
export const TILE_PADDING = 14

export class StateDrawer extends EventListener {
    public get drawer() { return this.drawerInput.drawer }

    public draw() {
        this.drawer.setNativeSize()
        if (STATE.programRunner == null) unreachable()
        const refs = STATE.programRunner.program.refs
        const states = STATE.programRunner.states
        const stateLimit = STATE.programRunner.STATE_LIMIT
        const padding = stateLimit - states.length
        const tileSize = (this.drawer.size.width) / (stateLimit - 1)

        let last: Record<string, boolean> = {}


        for (let i = 0; i < stateLimit; i++) {
            const state = states[i - padding]
            const x = i * tileSize + 100 - tileSize

            if (i != stateLimit - 1 && i != 0) {
                this.drawer.setStyle(Color.white.opacity(0.1))
                    .beginPath()
                    .move(new Point(x, 0))
                    .lineTo(new Point(x, this.drawer.size.height))
                    .stroke()
            }

            if (state) {
                if (i != 0) {
                    this.drawer.setStyle(Color.green)
                    for (let i = 0; i < refs.length; i++) {
                        const ref = refs[i]
                        const y = TILE_PADDING + i * (TILE_HEIGHT + TILE_PADDING)

                        const startY = y + (last[ref] ? 0 : TILE_HEIGHT)
                        const endY = y + (state[ref] ? 0 : TILE_HEIGHT)
                        this.drawer.beginPath()
                            .move(new Point(x, startY).floor().add(0.5, 0.5))
                            .lineTo(new Point(x + tileSize / 2, startY).floor().add(0.5, 0.5))
                            .lineTo(new Point(x + tileSize / 2, endY).floor().add(0.5, 0.5))
                            .lineTo(new Point(x + tileSize, endY).floor().add(0.5, 0.5))
                            .stroke()
                    }
                }

                last = state
            }

        }

        for (let i = 0; i < refs.length; i++) {
            const ref = refs[i]
            const y = i * (TILE_HEIGHT + TILE_PADDING)
            const x = 100

            this.drawer.setStyle(Color.white.opacity(0.1))
                .beginPath()
                .move(new Point(0, y + TILE_HEIGHT + TILE_PADDING * 1.5).floor().add(0.5, 0.5))
                .lineTo(new Point(this.drawer.size.width, y + TILE_HEIGHT + TILE_PADDING * 1.5).floor().add(0.5, 0.5))
                .stroke()

            this.drawer.setStyle(Color.white).fillText(ref, new Point(x - 10, y + TILE_PADDING + TILE_HEIGHT / 2), { baseline: "middle", align: "right" })
        }
    }

    constructor(
        public readonly drawerInput: DrawerInput
    ) {
        super()

        drawerInput.onDraw.add(this, () => {
            this.draw()
        })
    }
}