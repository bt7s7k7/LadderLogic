import { Span } from "../Span"
import { ASTNode } from "./ASTNode"
import { LineNode } from "./LineNode"
import { SocketNode } from "./SocketNode"

export class PlugNode extends ASTNode {
    constructor(
        prev: string, span: Span,
        public readonly line: LineNode,
        public readonly target: SocketNode
    ) { super(prev, span) }
}