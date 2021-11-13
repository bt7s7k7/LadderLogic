import { Color } from "../../drawer/Color"
import { Point } from "../../drawer/Point"
import { DrawerInput } from "../../drawerInput/DrawerInput"
import { EventListener } from "../../eventLib/EventListener"
import { STATE } from "../State"
import { Component } from "./DiagramLayout"

const COMPONENT_SIZE = 30
const PADDING = 15
const COLOR_ON = Color.green
const COLOR_OFF = Color.white.lerp(Color.black, 0.5)

export class DiagramDrawer extends EventListener {
    public get drawer() { return this.drawerInput.drawer }

    public draw() {
        this.drawer.setStyle(Color.black).fillRect()
        const layout = STATE.diagramLayout
        const componentStates = STATE.programRunner ? STATE.programRunner.componentState : {}
        const variableStates = STATE.programRunner && STATE.programRunner.states.length > 1 ? STATE.programRunner.states[STATE.programRunner.states.length - 2] : {}
        if (!layout) return

        this.drawer.save()
        this.drawer.translate(new Point(10, 10))
        this.drawer.setStrokeWidth(2)
        for (const line of layout.lines) {
            let lastComponent: Component | null = null
            for (const component of line.components) {
                const input = component.prev == "true" ? true : (componentStates[component.prev] ?? false)
                const output = componentStates[component.id] ?? false
                const x = component.start * COMPONENT_SIZE

                if (component.type == "switch" || component.type == "coil") {
                    this.drawer.setStyle(input ? COLOR_ON : COLOR_OFF)
                    this.drawer.beginPath()
                        .move(new Point(x, COMPONENT_SIZE / 2))
                        .lineTo(new Point(x + COMPONENT_SIZE / 3, COMPONENT_SIZE / 2))
                        .stroke()

                    if (component.type == "switch") {
                        this.drawer.beginPath()
                            .move(new Point(x + COMPONENT_SIZE / 3, COMPONENT_SIZE / 6))
                            .lineTo(new Point(x + COMPONENT_SIZE / 3, COMPONENT_SIZE / 6 * 5))
                            .stroke()

                        this.drawer.setStyle(Color.white)
                        if (component.sprite == "positive" || component.sprite == "negative") {
                            this.drawer.fillText(component.sprite == "positive" ? "P" : "N", new Point(x + COMPONENT_SIZE / 2, COMPONENT_SIZE / 2), { baseline: "middle", align: "center", size: 10 })
                        }
                    } else if (component.type == "coil") {
                        this.drawer.beginPath()
                            .arc(new Point(x + COMPONENT_SIZE, COMPONENT_SIZE / 2), COMPONENT_SIZE / 3 * 2, Math.PI - 0.5, Math.PI + 0.5)
                            .stroke()
                    }

                    if ((component.type == "switch" && component.sprite == "inverted") || (component.type == "coil" && component.invert)) {
                        this.drawer.setStyle(Color.white)
                        this.drawer.beginPath()
                            .move(new Point(x + COMPONENT_SIZE / 3 - 5, COMPONENT_SIZE / 6 + 2))
                            .lineTo(new Point(x + COMPONENT_SIZE / 3 * 2 + 5, COMPONENT_SIZE / 6 * 5 - 2))
                            .stroke()
                    }

                    this.drawer.setStyle(output ? COLOR_ON : COLOR_OFF)
                    this.drawer.beginPath()
                        .move(new Point(x + COMPONENT_SIZE / 3 * 2, COMPONENT_SIZE / 2))
                        .lineTo(new Point(x + COMPONENT_SIZE, COMPONENT_SIZE / 2))
                        .stroke()

                    if (component.type == "switch") {
                        this.drawer.beginPath()
                            .move(new Point(x + COMPONENT_SIZE / 3 * 2, COMPONENT_SIZE / 6))
                            .lineTo(new Point(x + COMPONENT_SIZE / 3 * 2, COMPONENT_SIZE / 6 * 5))
                            .stroke()
                    } else if (component.type == "coil") {
                        this.drawer.beginPath()
                            .arc(new Point(x, COMPONENT_SIZE / 2), COMPONENT_SIZE / 3 * 2, Math.PI * 2 - 0.5, Math.PI * 2 + 0.5)
                            .stroke()
                    }

                    const ref = variableStates[component.ref] ?? false
                    this.drawer.setStyle(ref ? COLOR_ON : COLOR_OFF).fillText(component.ref, new Point(x + COMPONENT_SIZE / 2, COMPONENT_SIZE * 1.2), { align: "center", baseline: "middle", size: 12 })
                } else if (component.type == "socket") {
                    this.drawer.setStyle(input ? COLOR_ON : COLOR_OFF)
                    this.drawer.beginPath()
                        .move(new Point(lastComponent ? (lastComponent.start + 1) * COMPONENT_SIZE : 0, COMPONENT_SIZE / 2))
                        .lineTo(new Point(x + COMPONENT_SIZE / 2, COMPONENT_SIZE / 2))
                        .stroke()
                    this.drawer.setStyle(output ? COLOR_ON : COLOR_OFF)
                    this.drawer.beginPath()
                        .move(new Point(x + COMPONENT_SIZE / 2, COMPONENT_SIZE / 2))
                        .lineTo(new Point(x + COMPONENT_SIZE, COMPONENT_SIZE / 2))
                        .stroke()
                } else if (component.type == "plug") {
                    this.drawer.setStyle(input ? COLOR_ON : COLOR_OFF)
                    this.drawer.beginPath()
                        .move(new Point(lastComponent ? (lastComponent.start + 1) * COMPONENT_SIZE : 0, COMPONENT_SIZE / 2))
                        .lineTo(new Point(x + COMPONENT_SIZE / 2, COMPONENT_SIZE / 2))
                        .lineTo(new Point(x + COMPONENT_SIZE / 2, component.offset * (COMPONENT_SIZE + PADDING) + COMPONENT_SIZE / 2))
                        .stroke()
                }

                lastComponent = component
            }

            this.drawer.translate(new Point(0, COMPONENT_SIZE + PADDING))
        }

        this.drawer.restore()
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