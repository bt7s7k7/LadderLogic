import { Span } from "../Span"
import { ASTNode } from "./ASTNode"

export class CoilNode extends ASTNode {
    constructor(
        prev: string, span: Span,
        public readonly invert: boolean,
        public readonly ref: string
    ) { super(prev, span) }
}