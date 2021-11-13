import { Span } from "../Span"
import { ASTNode } from "./ASTNode"
import { LineNode } from "./LineNode"

export class SocketNode extends ASTNode {
    public ref: LineNode | null = null

    constructor(
        prev: string, span: Span,
        public readonly line: LineNode
    ) { super(prev, span) }
}