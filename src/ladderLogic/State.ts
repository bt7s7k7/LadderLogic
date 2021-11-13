import { reactive } from "vue"
import { EventEmitter } from "../eventLib/EventEmitter"
import { EventListener } from "../eventLib/EventListener"
import { Compiler, Diagnostic } from "./compiler/Compiler"

class State extends EventListener {
    public readonly onCodeChanged = new EventEmitter()

    public compiler = new Compiler()
    public code = localStorage.getItem("ladder:code") ?? ""
    public diagnostics: Diagnostic[] = []

    public runCompiler() {
        const result = this.compiler.compile(this.code)
        if (result instanceof Array) {
            this.diagnostics = result
        } else {
            this.diagnostics = []
        }
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