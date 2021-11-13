import { autoFilter, runString } from "../../comTypes/util"
import { Diagnostic } from "./Diagnostic"
import { CoilNode } from "./nodes/CoilNode"
import { LineNode } from "./nodes/LineNode"
import { PlugNode } from "./nodes/PlugNode"
import { SocketNode } from "./nodes/SocketNode"
import { SwitchNode, SwitchType } from "./nodes/SwitchNode"
import { Span } from "./Span"

export interface Program {
    makeDefaultState(): Record<string, boolean>
    iterate(state: Record<string, boolean>, prevState: Record<string, boolean>): { newState: Record<string, boolean>, componentState: Record<string, boolean> }
    refs: string[]
}

export class Compiler {
    public compile(code: string) {
        const program = this.parse(code)
        if (program instanceof Diagnostic) return [program]
        let result: Program
        try {
            result = runString({
                env: {},
                url: "generated://generated/generated.js",
                source: autoFilter([
                    "return {",
                    "    makeDefaultState: () => ({",
                    [...program.refs.values()].map(v => `        ${v}: false,`),
                    "    }),",
                    "    iterate(state, prevState) {",
                    "        const newState = this.makeDefaultState()",
                    [...(function* () {
                        yield ""

                        const componentVars: string[] = []
                        const processed = new Set<LineNode>()
                        const queue = [...program.lines]

                        while (queue.length > 0) {
                            const line = queue.pop()!
                            if (processed.has(line)) continue
                            if (line.dependencies.length > 0) {
                                queue.push(line, ...line.dependencies)
                                line.dependencies.length = 0
                            }

                            processed.add(line)

                            for (const node of line.children) {
                                const prefix = `        const ${node.id} =`

                                componentVars.push(node.id)

                                if (node instanceof SwitchNode) {
                                    if (node.type == "normal") yield `${prefix} ${node.prev} && state.${node.ref}`
                                    if (node.type == "inverted") yield `${prefix} ${node.prev} && !state.${node.ref}`
                                    if (node.type == "positive") yield `${prefix} ${node.prev} && state.${node.ref} && !prevState.${node.ref}`
                                    if (node.type == "negative") yield `${prefix} ${node.prev} && !state.${node.ref} && prevState.${node.ref}`
                                    continue
                                } else if (node instanceof CoilNode) {
                                    yield `        const ${node.id} = ${node.prev}; newState.${node.ref} ||= ${node.invert ? "!" : ""}${node.id}`
                                    continue
                                } else if (node instanceof SocketNode) {
                                    yield `        const ${node.id} = ${node.prev} || ${node.ref!.id}`
                                    continue
                                } else if (node instanceof PlugNode) {
                                    yield `        const ${node.id} = ${node.prev}; const ${node.line.id} = ${node.id}`
                                    continue
                                }

                                throw new Error(`Unknown component node "${node.constructor.name}"`)
                            }

                            yield ""
                        }

                        yield `        return { newState, componentState: {${componentVars.join(", ")}} }`
                    })()],
                    "    },",
                    "}"
                ]).join("\n")
            })
        } catch (err: any) {
            return [new Diagnostic("Failed codegen: " + err.message, null)]
        }

        result.refs = [...program.refs]

        return result
    }

    public parse(code: string) {
        let lineNum = 0
        let columnNum = 0

        function makePos() {
            return new Span(code, lineNum, columnNum)
        }

        class ParsingError extends Error {
            public name = "ParsingError"
            public diagnostic

            constructor(
                message: string,
                span = makePos().span(1)
            ) {
                super(message)
                this.diagnostic = new Diagnostic(message, span)
            }
        }

        function* splitLines() {
            let index = 0

            while (index < code.length) {
                let lineEnd = code.indexOf("\n", index)
                if (lineEnd == -1) lineEnd = code.length
                yield code.slice(index, lineEnd)
                index = lineEnd + 1
                lineNum++
            }
        }

        function* tokenize(line: string) {
            columnNum = 0

            function isWhitespace(char: string) {
                return char == " "
            }

            function findWhitespace() {
                while (!isWhitespace(line[columnNum]) && columnNum < line.length) columnNum++
            }

            function findToken() {
                if (columnNum >= line.length) return false

                while (isWhitespace(line[columnNum])) {
                    if (columnNum >= line.length) return false
                    columnNum++
                }

                return true
            }

            while (findToken()) {
                const start = columnNum
                findWhitespace()
                yield { text: line.slice(start, columnNum), span: new Span(code, lineNum, start, columnNum - start) }
            }
        }

        let limiter = 0

        try {
            const lines: LineNode[] = []
            const socketStack: SocketNode[] = []
            const refs = new Set<string>()

            for (const line of splitLines()) {
                const lineNode = new LineNode("line_" + lineNum, makePos())
                lines.push(lineNode)
                let last = false
                const sockets: SocketNode[] = []
                const plugs: PlugNode[] = []
                top: for (const token of tokenize(line)) {
                    const prevID = lineNode.children[lineNode.children.length - 1]?.id ?? "true"
                    if (last) throw new ParsingError("Expected end of line", token.span)
                    limiter++
                    if (limiter > 1000) throw new ParsingError("Parser infinite loop")

                    if (token.text == "^") {
                        const socket = new SocketNode(prevID, token.span, lineNode)
                        lineNode.children.push(socket)
                        sockets.push(socket)
                        continue
                    }

                    if (token.text == ">") {
                        const plug = new PlugNode(prevID, token.span, lineNode)
                        lineNode.children.push(plug)
                        const socket = socketStack.pop()
                        if (!socket) throw new ParsingError("There is no socket to connect this plug", token.span)
                        socket.ref = lineNode
                        lineNode.dependent = socket.line
                        socket.line.dependencies.push(lineNode)
                        plugs.push(plug)
                        continue
                    }

                    for (const [prefix, invert] of [
                        ["(", false],
                        ["!(", true]
                    ] as [string, boolean][]) {
                        if (token.text.startsWith(prefix)) {
                            if (token.text[token.text.length - 1] != ")") throw new ParsingError("Expected closing brace", token.span.end(-1))
                            const ref = token.text.slice(prefix.length, -1)
                            refs.add(ref)
                            lineNode.children.push(new CoilNode(prevID, token.span, invert, ref))
                            continue top
                        }
                    }

                    for (const [prefix, type] of [
                        [".", "normal"],
                        ["!", "inverted"],
                        ["p:", "positive"],
                        ["n:", "negative"]
                    ] as [string, SwitchType][]) {
                        if (token.text.startsWith(prefix)) {
                            const ref = token.text.substr(prefix.length)
                            refs.add(ref)
                            lineNode.children.push(new SwitchNode(prevID, token.span, type, ref))
                            continue top
                        }
                    }

                    throw new ParsingError(`Unknown token "${token.text}"`, token.span)
                }

                socketStack.push(...sockets.reverse())
            }

            if (socketStack.length > 0) throw new ParsingError("No plug for this socket", socketStack.pop()!.span)

            return { lines, refs }
        } catch (err) {
            if (err instanceof ParsingError) return err.diagnostic
            else throw err
        }
    }
}