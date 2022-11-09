import { Transform } from 'ogl'

// export interface SizesInterface {
//     viewport: any,
//     screen: any,
//     mediaCount: number
// }

interface ScreenSizes {
    width: number
    height: number
}

interface CanvasSizes {
    width: number
    height: number
}

interface ViewportSizes {
    width: number
    height: number
}

export interface SizesInterface {
    aspectRatio: number
    screen: ScreenSizes
    viewport: ViewportSizes
    canvas: CanvasSizes
}

export default interface MediaOptions {
    element: HTMLImageElement
    geometry: any
    index: number
    gl: any
    scene: Transform,
    sizes: SizesInterface
    mediaCount: number
}

export interface MediaPositionInterface {
    x: number
    y: number
}

export interface MediaExtraInterface {
    x: number
    y: number
}

export interface ScrollMeshEdgePosition {
    first: { x: number, y: number }
    last: { x: number, y: number }
}
// Fullscreen image ----------------------------------------------
export interface MediaFullscreenOptionsInterface {
    geometry: any
    gl: any
    scene: Transform,
}

export interface FullscreenImageData {
    index: number,
    width: number,
    height: number,
    sizes: SizesInterface
}
// ------------------------------------------------------------------
export interface MousePosition {
    x: number,
    y: number,
}