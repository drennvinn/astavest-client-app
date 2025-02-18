export const THEMES = ['light', 'dark'] as const
export const MENUS = ['vertical', 'collapsible-vertical', 'horizontal'] as const
export const LAYOUTS = ['full', 'boxed-layout'] as const
export const RTL_CLASSES = ['rtl', 'ltr'] as const
export const ANIMATIONS = [
    'animate__fadeIn',
    'animate__fadeInDown',
    'animate__fadeInUp',
    'animate__fadeInLeft',
    'animate__fadeInRight',
    'animate__slideInDown',
    'animate__slideInLeft',
    'animate__slideInRight',
    'animate__zoomIn'
] as const
export const NAVBARS = ['navbar-sticky', 'navbar-floating', 'navbar-static'] as const

export type Theme = typeof THEMES[number]
export type Menu = typeof MENUS[number]
export type Layout = typeof LAYOUTS[number]
export type RtlClass = typeof RTL_CLASSES[number]
export type Animation = typeof ANIMATIONS[number]
export type Navbar = typeof NAVBARS[number]

export interface ThemeConfig {
    theme: Theme;
    menu: Menu;
    layout: Layout;
    rtlClass: RtlClass;
    animation: Animation;
    navbar: Navbar;
    locale: string;
    semidark: boolean;
}

export interface LanguageItem {
    code: string
    name: string
}