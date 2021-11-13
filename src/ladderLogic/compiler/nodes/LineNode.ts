import { Span } from "../Span"
import { ASTNode } from "./ASTNode"

export class LineNode {
    public readonly children: ASTNode[] = []
    public dependencies: LineNode[] = []
    public dependent: LineNode | null = null

    constructor(
        public readonly id: string,
        public readonly span: Span
    ) { }
}