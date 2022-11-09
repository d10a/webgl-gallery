import gsap from 'gsap'
import { SizesInterface } from './Interface'

interface ScrollDirectionInterface {
    direction?: string
    current: number
    target: number
    lerp: number
    allowHorizontal: boolean
    allowVertical: boolean
}

interface SpeedInterface {
    current: number
    target: number
    lerp: number
}

interface GallerySizes {
    width: number
    height: number
}

export default class ScrollGallery {
    public pixelX: number
    public pixelY: number
    public scroll: ScrollDirectionInterface
    public speed: SpeedInterface
    public velocity: number
    public x: number
    public y: number
    public isScrolling: boolean = false
    public gallerySizes: GallerySizes

    constructor(horizontal = false, vertical = false) {


        this.velocity = 4

        this.speed = {
            current: 0,
            target: 0,
            lerp: 0.2
        }

        this.scroll = {
            current: 0,
            target: 0,
            lerp: 0.5,
            allowHorizontal: horizontal,
            allowVertical: vertical
        }
    }

    public onMouseWheel(pixelX: number, pixelY: number) {
        this.pixelX = pixelX
        this.pixelY = pixelY

        if (this.scroll.allowVertical) {
            if (pixelY > 0) {
                this.scroll.direction = 'up'
                this.scroll.target += pixelY
            }
            if (pixelY < 0) {
                this.scroll.direction = 'down'
                this.scroll.target += pixelY
            }
        }

        if (this.scroll.allowHorizontal) {
            if (pixelX > 0) {
                this.scroll.direction = 'left'
                this.scroll.target += pixelX
            }
            if (pixelX < 0) {
                this.scroll.direction = 'right'
                this.scroll.target += pixelX
            }
        }




        this.scroll.target += pixelY
        this.velocity = (pixelX > 0 || pixelY) ? 3 : - 3

        this.isScrolling = true

        this.updateY()
    }



    private updateY() {
        this.scroll.target += this.velocity
        //speed
        this.speed.target = (this.scroll.target - this.scroll.current) * 0.0005
        this.speed.current = gsap.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)

        //current Y
        this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)

        this.y = this.scroll.current
    }

    updateGallerySizes(galleryBounds: any, sizes: SizesInterface) {
        this.gallerySizes = {
            height: (galleryBounds.height / window.innerHeight) * sizes.canvas.height,
            width: (galleryBounds.width / window.innerWidth) * sizes.canvas.width,
        }
    }
}