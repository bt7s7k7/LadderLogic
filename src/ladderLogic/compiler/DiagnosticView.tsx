import { defineComponent } from "vue"
import { findNthOccurrence, unreachable, voidValue } from "../../comTypes/util"
import { Diagnostic } from "./Diagnostic"

export const DiagnosticView = (defineComponent({
    name: "DiagnosticView",
    props: {
        diagnostic: { type: Diagnostic, required: true }
    },
    setup(props, ctx) {

        function drawUnderline() {
            if (!props.diagnostic.span) return null
            return Array.from({ length: props.diagnostic.span.column }, () => " ").concat(Array.from({ length: props.diagnostic.span.length }, () => "~")).join("")
        }

        function getLineText() {
            if (!props.diagnostic.span) return null
            const line = props.diagnostic.span.line
            const content = props.diagnostic.span.code
            const start = line == 0 ? 0 : ((voidValue(findNthOccurrence(content, "\n", line), -1) ?? unreachable()) + 1)
            const end = voidValue(content.indexOf("\n", start), -1) ?? content.length

            return content.slice(start, end)
        }

        return () => (
            <div class="border border-danger rounded p-2 flex column gap-1">
                <code class="text-danger">{props.diagnostic.message}</code>
                {props.diagnostic.span != null && <div class="flex row gap-2 text-primary">
                    <div class="flex column">
                        <code>{props.diagnostic.span.line + 1} |</code>
                    </div>
                    <div class="flex column flex-fill">
                        <pre class="m-0 text-white">{getLineText()}</pre>
                        <pre class="m-0" style={{ marginTop: "-6px", pointerEvents: "none" }}>{drawUnderline()}</pre>
                    </div>
                </div>}
            </div>
        )
    }
}))