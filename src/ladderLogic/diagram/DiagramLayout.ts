import { Program } from "../compiler/Compiler"
import { CoilNode } from "../compiler/nodes/CoilNode"
import { LineNode } from "../compiler/nodes/LineNode"
import { PlugNode } from "../compiler/nodes/PlugNode"
import { SocketNode } from "../compiler/nodes/SocketNode"
import { SwitchNode, SwitchType } from "../compiler/nodes/SwitchNode"

export type Component = { id: string, prev: string, start: number } & (
    { type: "switch", sprite: SwitchType, ref: string } |
    { type: "coil", invert: boolean, ref: string } |
    { type: "plug", offset: number, target: SocketNode } |
    { type: "socket" }
)

export interface Line {
    top: number
    width: number
    components: Component[]
}

export class DiagramLayout {
    constructor(
        public readonly program: Program,
        public readonly lines: Line[]
    ) { }

    public static create(program: Program) {
        const processed = new Set<LineNode>()
        const output: Line[] = []
        const lineLookup = new Map<LineNode, Line>()
        const socketLookup = new Map<SocketNode, Component>()
        const queue = [...program.lines].reverse()
        const dependenciesProcessed = new Set<LineNode>()

        function pushLine(line: Line, node: LineNode) {
            line.top = output.length
            output.push(line)

            for (const component of line.components) {
                if (component.type == "plug") {
                    component.offset = lineLookup.get(component.target.line)!.top - line.top
                    component.start = socketLookup.get(component.target)!.start
                }
            }

            for (const dependency of node.dependencies) {
                const line = lineLookup.get(dependency)!
                pushLine(line, dependency)
            }
        }

        while (queue.length > 0) {
            const lineNode = queue.pop()!
            const line: Line = {
                top: 0,
                components: [],
                width: 0
            }

            if (processed.has(lineNode)) continue
            if (lineNode.dependencies.length > 0 && !dependenciesProcessed.has(lineNode)) {
                queue.push(lineNode, ...lineNode.dependencies)
                dependenciesProcessed.add(lineNode)
                continue
            }

            for (const node of lineNode.children) {
                const prefix = { id: node.id, prev: node.prev, start: (line.components[line.components.length - 1]?.start ?? -1) + 1 }
                if (node instanceof SwitchNode) {
                    line.components.push({ ...prefix, type: "switch", sprite: node.type, ref: node.ref })
                    continue
                }

                if (node instanceof CoilNode) {
                    line.components.push({ ...prefix, type: "coil", invert: node.invert, ref: node.ref })
                    continue
                }

                if (node instanceof SocketNode) {
                    const ref = node.ref!
                    const refLine = lineLookup.get(ref)!

                    prefix.start = Math.max(prefix.start, refLine.width - 1)
                    const socket: Component = { ...prefix, type: "socket" }
                    line.components.push(socket)
                    socketLookup.set(node, socket)
                    continue
                }

                if (node instanceof PlugNode) {
                    const target = node.target
                    line.components.push({ ...prefix, type: "plug", target, offset: 0 })
                    continue
                }
            }

            line.width = (line.components[line.components.length - 1]?.start ?? 0) + 1

            processed.add(lineNode)
            lineLookup.set(lineNode, line)

            if (!lineNode.dependent) {
                pushLine(line, lineNode)
            }

        }

        return new DiagramLayout(program, output)
    }
}