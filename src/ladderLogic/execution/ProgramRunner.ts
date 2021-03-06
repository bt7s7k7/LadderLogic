import { markRaw, reactive } from "vue"
import { Program } from "../compiler/Compiler"

export class ProgramRunner {
    public readonly STATE_LIMIT = 26
    public tick = 0

    public readonly states: Record<string, boolean>[] = []
    public componentState: Record<string, boolean> = {}
    public forceState: Record<string, boolean> = reactive({})
    public iterate() {
        const state = this.states[this.states.length - 1] ?? this.program.makeDefaultState()
        const prevState = this.states[this.states.length - 2] ?? this.program.makeDefaultState()

        for (const [key, force] of Object.entries(this.forceState)) {
            if (force) state[key] = true
        }

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