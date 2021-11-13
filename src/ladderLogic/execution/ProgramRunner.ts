import { markRaw } from "vue"
import { Program } from "../compiler/Compiler"

export class ProgramRunner {
    public readonly STATE_LIMIT = 20
    public tick = 0

    public readonly states: Record<string, boolean>[] = []
    public componentState: Record<string, boolean> = {}
    public iterate() {
        const state = this.states[this.states.length - 1] ?? this.program.makeDefaultState()
        const prevState = this.states[this.states.length - 2] ?? this.program.makeDefaultState()

        const { newState, componentState } = this.program.iterate(state, prevState)
        this.componentState = componentState

        this.states.push(newState)

        if (this.states.length > this.STATE_LIMIT) {
            this.states.shift()
        }

        this.tick++
    }

    constructor(
        public readonly program: Program
    ) {
        return markRaw(this)
    }
}