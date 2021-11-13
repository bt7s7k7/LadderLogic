import { Span } from "../Span"
import { ASTNode } from "./ASTNode"

export type SwitchType = "normal" | "inverted" | "positive" | "negative"

export class SwitchNode extends ASTNode {
    constructor(
        prev: string, span: Span,
        public readonly type: SwitchType,
        public readonly ref: string
    ) { super(prev, span) }
}