import { mdiFastForward, mdiPause, mdiSkipNext, mdiSkipPrevious } from "@mdi/js"
import { defineComponent, onUnmounted, ref } from "vue"
import { EventListener } from "../eventLib/EventListener"
import { Button } from "../vue3gui/Button"
import { Icon } from "../vue3gui/Icon"
import { CodeEditor } from "./compiler/CodeEditor"
import { DiagnosticView } from "./compiler/DiagnosticView"
import { ElementView } from "./element/ElementView"
import { StateView } from "./execution/StateView"
import { STATE } from "./State"
import "./style.scss"

export const Root = (defineComponent({
    name: "Root",
    setup(props, ctx) {
        const tick = ref(STATE.programRunner?.tick ?? 0)
        const listener = new EventListener()
        onUnmounted(() => listener.dispose())
        STATE.onStateChanged.add(listener, () => {
            tick.value = STATE.programRunner?.tick ?? 0
        })

        return () => (
            <div class="flex-fill flex column">
                <div class="flex-fill flex row">
                    <div class="flex-fill flex column gap-2 p-2">
                        {STATE.diagnostics.map(diagnostic => (
                            <DiagnosticView diagnostic={diagnostic} />
                        ))}
                        <ElementView class="absolute-view border-right" />
                    </div>
                    <CodeEditor class="flex-fill" vModel={STATE.code} onChange={() => STATE.onCodeChanged.emit()} />
                </div>
                <div class="flex row border-top center-cross">
                    <Button clear> <Icon icon={mdiSkipPrevious} /> </Button>
                    <pre class="my-0 mx-2">Tick: {tick.value.toString().padStart(3, " ")}</pre>
                    <Button clear> <Icon icon={mdiPause} /> </Button>
                    <Button clear onClick={() => STATE.iterateProgram()}> <Icon icon={mdiSkipNext} /> </Button>
                    <Button clear> <Icon icon={mdiFastForward} /> </Button>
                </div>
                <StateView class="flex-basis-300 border-top" />
            </div>
        )
    }
}))