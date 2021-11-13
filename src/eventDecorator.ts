
type FilterUndefined<T> = T extends undefined ? never : T
type FilterStringArray<T> = T extends string[] ? never : T
type ToListenerObject<T extends Record<string, (...args: any[]) => any>> = {
    [P in keyof T & string as `on${Capitalize<P>}`]?: (...args: Parameters<T[P]>) => void
}
type RemoveThisType<T extends Record<string, any>> = {
    [P in keyof T]: T[P]
}
type FilterNonConst<T> = T extends { [x: string]: ((...args: any[]) => any) } ? T : {}
type GetComponentEventListeners<T extends Constraint> = ToListenerObject<FilterNonConst<RemoveThisType<FilterStringArray<FilterUndefined<T["emits"]>>>>>

type ExpandProps<T extends Constraint, A extends Record<string, any>> = Omit<T, "ffff"> & { new(...args: ConstructorParameters<T>): InstanceType<T> & { $props: A } }

type AddVModel<T extends Record<string, any>> = T extends { "onUpdate:modelValue"?: (v: any) => void } ? T & { vModel?: Parameters<NonNullable<T["onUpdate:modelValue"]>>[0] } : T

type Constraint = { new(...args: any): any, emits?: any }

export function eventDecorator<T extends Constraint>(ctor: T): ExpandProps<T, AddVModel<GetComponentEventListeners<T>>> {
    return ctor as any
}