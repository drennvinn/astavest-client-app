
/**
 * Defines the possible behaviors of the accordion
 * @enum {string}
 */
export enum AccordionBehavior {
    Single = 'single',
    Multiple = 'multiple',
    ToggleAll = 'toggle-all'
}

/**
 * Context interface provided to child AccordionItems
 */
export interface AccordionContext {
    registerItem: () => number;
    isOpen: (id: number) => boolean;
    toggle: (id: number) => void;
    nextId: Ref<number>;
    transitionDuration: number;
}

// Injection key for type-safe provide/inject
export const AccordionKey: InjectionKey<AccordionContext> = Symbol('accordion');
