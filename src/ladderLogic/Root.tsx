import { mdiFastForward, mdiPause, mdiSkipNext, mdiSkipPrevious } from "@mdi/js"
import { defineComponent } from "vue"
import { Button } from "../vue3gui/Button"
import { Icon } from "../vue3gui/Icon"
import { CodeEditor } from "./compiler/CodeEditor"
import { DiagnosticView } from "./compiler/DiagnosticView"
import { ElementView } from "./element/ElementView"
import { STATE } from "./State"
import "./style.scss"

export const Root = (defineComponent({
    name: "Root",
    setup(props, ctx) {
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
                    <code class="mx-2">Tick: {"0".padStart(3, " ")}</code>
                    <Button clear> <Icon icon={mdiPause} /> </Button>
                    <Button clear> <Icon icon={mdiSkipNext} /> </Button>
                    <Button clear> <Icon icon={mdiFastForward} /> </Button>
                </div>
                <div class="flex row flex-basis-300 border-top">
                </div>
            </div>
        )
    }
}))