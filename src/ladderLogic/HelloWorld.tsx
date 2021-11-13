import { defineComponent } from "vue"
import { eventDecorator } from "../eventDecorator"

export const HelloWorld = eventDecorator(defineComponent({
    name: "HelloWorld",
    setup(props, ctx) {
        return () => (
            <div class="flex center flex-fill">
                <div>Hello World!</div>
            </div>
        )
    }
}))