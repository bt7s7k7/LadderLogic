import { reactive } from "vue"
import { EventEmitter } from "../eventLib/EventEmitter"
import { EventListener } from "../eventLib/EventListener"
import { Compiler, Program } from "./compiler/Compiler"
import { Diagnostic } from "./compiler/Diagnostic"
import { DiagramLayout } from "./diagram/DiagramLayout"
import { ProgramRunner } from "./execution/ProgramRunner"

class State extends EventListener {
    public readonly onCodeChanged = new EventEmitter()
    public readonly onStateChanged = new EventEmitter()

    public compiler = new Compiler()
    public code = localStorage.getItem("ladder:code") ?? ""
    public diagnostics: Diagnostic[] = []
    public program: Program | null = null
    public programRunner: ProgramRunner | null = null
    public diagramLayout: DiagramLayout | null = null
    public running = true

    public runCompiler() {
        this.diagnostics = []
        this.program = null
        this.programRunner = null
        this.diagramLayout = null

        const result = this.compiler.compile(this.code)
        if (result instanceof Array) {
            this.diagnostics = result
            this.onStateChanged.emit()
            return
        }

        this.program = result
        this.programRunner = new ProgramRunner(result)
        this.diagramLayout = DiagramLayout.create(this.program)
        this.onStateChanged.emit()
    }

    public iterateProgram() {
        if (!this.programRunner) return

        this.programRunner.iterate()

        this.onStateChanged.emit()
    }

    public reset() {
        this.runCompiler()
    }

    constructor() {
        super()

        const self = reactive(this) as this

        self.onCodeChanged.add(self, () => {
            if (self.code != this.program?.source) {
                localStorage.setItem("ladder:code", self.code)
                self.runCompiler()
            }
        })

        self.runCompiler()

        return self
    }
}

window.addEventListener("beforeunload", () => {
    localStorage.setItem("ladder:code", STATE.code)
})

setInterval(() => {
    if (STATE.running) STATE.iterateProgram()
}, 100)

export const STATE = new State()
// @ts-ignore
window._state = STATE