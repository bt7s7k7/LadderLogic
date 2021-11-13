import { EditorFromTextArea, fromTextArea } from "codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/material-darker.css"
import { defineComponent, nextTick, onMounted, ref, watch } from "vue"
import { eventDecorator } from "../../eventDecorator"

export const CodeEditor = eventDecorator(defineComponent({
    name: "CodeEditor",
    props: {
        modelValue: { type: String, default: "" }
    },
    emits: {
        "update:modelValue": (value: string) => true,
        change: () => true
    },
    setup(props, ctx) {
        const textarea = ref<HTMLTextAreaElement>()
        let editor: EditorFromTextArea | null = null

        watch(() => props.modelValue, newValue => {
            if (!editor) return
            if (newValue != editor.getValue()) editor.setValue(newValue)
        })

        onMounted(() => {
            editor = fromTextArea(textarea.value!, {
                lineNumbers: true,
                theme: "material-darker",
                extraKeys: {
                    "Ctrl-S": () => ctx.emit("change")
                }
            })

            editor.setValue(props.modelValue)

            editor.getWrapperElement().classList.add("absolute-fill")
            nextTick(() => editor!.refresh())

            editor.on("change", () => {
                const newValue = editor!.getValue()
                if (props.modelValue != newValue) ctx.emit("update:modelValue", newValue)
            })

            editor.on("blur", () => {
                ctx.emit("change")
            })
        })

        return () => (
            <div>
                <textarea ref={textarea} value="" />
            </div>
        )
    }
}))