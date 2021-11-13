
export class Span {
    public span(length: number) {
        return new Span(this.code, this.line, this.column, length)
    }

    public end(length = 1) {
        const offset = length < 0 ? (length *= -1, length - 1) : length
        return new Span(this.code, this.line, this.column + this.length - offset, length)
    }

    constructor(
        public readonly code: string,
        public readonly line: number,
        public readonly column: number,
        public readonly length: number = 1
    ) { }
}
