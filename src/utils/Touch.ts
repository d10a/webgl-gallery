export function isTouchEnabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        //@ts-ignore
        (navigator.msMaxTouchPoints > 0);
}