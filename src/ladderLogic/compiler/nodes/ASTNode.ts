import { Span } from "../Span"

export class ASTNode {
    public readonly id = this.constructor.name.replace(/Node$/, "").toLowerCase() + "_" + this.span.line + "_" + this.span.column

    constructor(
        public readonly prev: string,
        public readonly span: Span
    ) { }
}