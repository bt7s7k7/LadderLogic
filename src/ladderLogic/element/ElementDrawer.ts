import { Color } from "../../drawer/Color"
import { DrawerInput } from "../../drawerInput/DrawerInput"
import { EventListener } from "../../eventLib/EventListener"

export class ElementDrawer extends EventListener {
    public get drawer() { return this.drawerInput.drawer }

    public draw() {
        this.drawer.setStyle(Color.black).fillRect()

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