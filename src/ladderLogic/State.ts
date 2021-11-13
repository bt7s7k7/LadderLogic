import { reactive } from "vue"
import { EventEmitter } from "../eventLib/EventEmitter"
import { EventListener } from "../eventLib/EventListener"
import { Compiler, Program } from "./compiler/Compiler"
import { Diagnostic } from "./compiler/Diagnostic"

class State extends EventListener {
    public readonly onCodeChanged = new EventEmitter()

    public compiler = new Compiler()
    public code = localStorage.getItem("ladder:code") ?? ""
    public diagnostics: Diagnostic[] = []
    public program: Program | null = null

    public runCompiler() {
        this.diagnostics = []
        this.program = null

        const result = this.compiler.compile(this.code)
        if (result instanceof Array) {
            this.diagnostics = result
            return
        }

        this.program = result
    }

    constructor() {
        super()

        const self = reactive(this) as this

        self.onCodeChanged.add(self, () => {
            localStorage.setItem("ladder:code", self.code)
            self.runCompiler()
        })

        self.runCompiler()

        return self
    }
}

window.addEventListener("beforeunload", () => {
    localStorage.setItem("ladder:code", STATE.code)
})

export const STATE = new State()