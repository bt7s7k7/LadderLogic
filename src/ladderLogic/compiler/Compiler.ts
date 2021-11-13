
export class Span {
    constructor(
        public readonly code: string,
        public readonly line: number,
        public readonly column: number,
        public readonly length: number
    ) { }
}

export class Diagnostic {
    constructor(
        public readonly message: string,
        public readonly span: Span
    ) { }
}

export class Compiler {
    public compile(code: string) {
        const ast = this.parse(code)
        if (ast instanceof Diagnostic) return [ast]
    }

    public parse(code: string) {
        let line = 0
        let column = 0

        class ParsingError extends Error {
            public name = "ParsingError"
            public diagnostic

            constructor(message: string) {
                super(message)
                this.diagnostic = new Diagnostic(message, new Span(code, line, column, 2))
            }
        }

        try {
            line++
            column += 2
            throw new ParsingError("Parser is not implemented")
        } catch (err) {
            if (err instanceof ParsingError) return err.diagnostic
            else throw err
        }

        return null
    }
}