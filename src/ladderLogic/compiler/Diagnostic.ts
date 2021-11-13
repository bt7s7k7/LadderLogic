import { Span } from "./Span"


export class Diagnostic {
    constructor(
        public readonly message: string,
        public readonly span: Span | null
    ) { }
}
