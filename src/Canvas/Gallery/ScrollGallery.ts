import gsap from 'gsap'
import { SizesInterface } from './Interface'

interface ScrollDirectionInterface {
    direction?: string
    currentX: number
    currentY: number
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

interface Touch {
    isDown: boolean
    distanceX: number
    distanceY: number
    startX: number
    startY: number
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
    public touch: Touch

    constructor(horizontal = false, vertical = false) {
        this.x = 0
        this.y = 0

        this.pixelX = 0;
        this.pixelY = 0;

        this.velocity = 4

        this.gallerySizes = {
            width: 0,
            height: 0,
        }

        this.speed = {
            current: 0,
            target: 0,
            lerp: 0.2
        }

        this.scroll = {
            currentX: 0,
            currentY: 0,
            target: 0,
            lerp: 0.5,
            allowHorizontal: horizontal,
            allowVertical: vertical
        }

        this.touch = {
            isDown: false,
            distanceX: 0,
            distanceY: 0,
            startX: 0,
            startY: 0,
        }
    }

    public onScroll(pixelX: number, pixelY: number) {
        if (this.touch.isDown) {
            pixelY = pixelY * 0.2
            this.scroll.lerp = 0.3
        }

        this.pixelX = pixelX
        this.pixelY = pixelY

        if (this.scroll.allowVertical) {
            this.scroll.target += pixelY
            if (pixelY > 0) {
                this.scroll.direction = 'up'
            }
            if (pixelY < 0) {
                this.scroll.direction = 'down'
            }
        }

        if (this.scroll.allowHorizontal) {
            this.scroll.target += pixelX
            if (pixelX > 0) {
                this.scroll.direction = 'left'
            }
            if (pixelX < 0) {
                this.scroll.direction = 'right'
            }
        }

        this.scroll.target += pixelY
        this.velocity = (pixelX > 0 || pixelY > 0) ? 3 : - 3

        this.isScrolling = true

        if (this.scroll.allowVertical) {
            this.updateY()
        }

    }

    private updateY() {
        this.scroll.target += this.velocity
        //speed
        this.speed.target = (this.scroll.target - this.scroll.currentY) * 0.0005
        this.speed.current = gsap.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)

        //current Y
        this.scroll.currentY = gsap.utils.interpolate(this.scroll.currentY, this.scroll.target, this.scroll.lerp)

        this.y = this.scroll.currentY
    }

    onResize(galleryBounds: any, sizes: SizesInterface) {
        this.gallerySizes = {
            height: (galleryBounds.height / window.innerHeight) * sizes.canvas.height,
            width: (galleryBounds.width / window.innerWidth) * sizes.canvas.width,
        }
    }
}