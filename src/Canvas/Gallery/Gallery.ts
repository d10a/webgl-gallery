import Media from "./Media"
import { Plane, Transform } from 'ogl'
import Canvas from "../Canvas"
import NormalizeWheel from 'normalize-wheel'
import ScrollGallery from "./ScrollGallery"
// import MediaFullscreen from "./MediaFullscreen"
import { GalleryEvent, MEDIA_SELECTED } from "./GalleryEvent"
import Asset from "../../Asset"
import MediaFullscreen from "./MediaFullscreen"
import { MousePosition } from "./Interface"
import { CanvasIntersectionObserver } from "../CanvasIntersectionObserver"

interface GalleryOptions {
    appendTo: HTMLElement
    galleryWrapper: Element
}

export default class Gallery extends Canvas {

    private mediasElements: Map<number, any>
    private geometry: Plane
    private group: Transform
    private galleryWrapper: Element

    private mousePosition: MousePosition

    private medias: Media[]
    private scrollGallery: ScrollGallery
    private mediaFullscreen: MediaFullscreen
    private canvasIntersectionObserver: CanvasIntersectionObserver
    private cam = {
        x: 0,
        y: 0,
        z: 0
    }

    constructor(galleryOptions: GalleryOptions) {
        super(galleryOptions.appendTo, 'canvas__gallery')
        this.medias = []
        this.mediasElements = Asset.getInstance().listImagesElements()
        this.galleryWrapper = galleryOptions.galleryWrapper
        this.group = new Transform()
        this.scrollGallery = new ScrollGallery(true, true)

        this.mousePosition = {
            x: 0,
            y: 0
        }

        this.createGallery()
        this.createFullscreenImage()
        this.onResize()
        this.update()

        this.group.setParent(this.scene)

        this.camera.fov = 45
        // this.camera.position.x = 0
        // this.camera.position.y = 0
        this.camera.position.z = 50
        // // this.camera.position.set(2, 2, 4)
        // this.camera.lookAt([0, 0, 0])


        this.updateSizes()


        this.canvasIntersectionObserver = new CanvasIntersectionObserver()



        this.galleryWrapper.addEventListener('click', (event: any) => {
            this.mousePosition = this.getMousePosition(event.clientX, event.clientY)

            this.medias.forEach((media: Media) => {
                const meshBounds = {
                    left: media.getMesh().position.x - (media.getMesh().scale.x * 0.5),//ok
                    right: media.getMesh().position.x + (media.getMesh().scale.x * 0.5),//ok
                    top: -(media.getMesh().position.y + (media.getMesh().scale.y * 0.5)),//ok
                    bottom: -(media.getMesh().position.y - (media.getMesh().scale.y * 0.5)),
                }

                if (
                    this.mousePosition.x > meshBounds.left
                    && this.mousePosition.x < meshBounds.right
                    && this.mousePosition.y > meshBounds.top
                    && this.mousePosition.y < meshBounds.bottom
                ) {
                    media.onClick();
                }
            })

        });

    }

    private getMousePosition(clientX: number, clientY: number) {
        const xRatio = (this.sizes.screen.width) / (this.sizes.canvas.width)
        const yRatio = (this.sizes.screen.height * 0.5) / (this.sizes.canvas.height * 0.5)

        return {
            x: (clientX / xRatio) - (this.sizes.canvas.width * 0.5),
            y: (clientY / yRatio) - (this.sizes.canvas.height * 0.5)

        }
    }



    public show() {

    }

    public hide() {

    }

    public bindEvents() {

        this.galleryWrapper.addEventListener('mousemove', (event: any) => {
            this.onMouseMove(this.getMousePosition(event.clientX, event.clientY))
        })

        // infinite scroll here
        // this.canvasIntersectionObserver.on(CanvasIntersectionObserver.TOP_THRESHOLD_REACHED, ({ data }) => {
        //     data.position.y = -10
        // })
    }

    private createGallery() {
        this.geometry = new Plane(this.gl)

        this.mediasElements.forEach((mediaElement: HTMLImageElement, index: number) => {
            const media = new Media({
                element: mediaElement,
                geometry: this.geometry,
                index,
                scene: this.group,
                gl: this.gl,
                mediaCount: this.mediasElements.size,
                sizes: this.sizes,
            })
            this.medias.push(media)
        })

    }

    private createFullscreenImage() {
        this.mediaFullscreen = new MediaFullscreen({
            geometry: this.geometry,
            scene: this.group,
            gl: this.gl,
        })

        GalleryEvent.on(MEDIA_SELECTED, (event) => {
            this.mediaFullscreen.onImageSelected(event.data)
        })
    }

    public onResize(event: any): void {
        this.updateSizes()

        this.scrollGallery.onResize(
            this.galleryWrapper.getBoundingClientRect(),
            this.sizes
        )

        this.medias.forEach((media: Media) => {
            media.onResize(this.sizes)
        })

    }

    public update() {
        window.requestAnimationFrame(this.update.bind(this));

        // this.cam.z += 0.01
        // this.cam.x -= 0.01
        // this.cam.y -= 0.02
        // this.camera.position.z += 0.01
        // this.camera.position.x += 0.02
        // this.cam.y -= 0.01

        this.camera.lookAt([this.cam.x, this.cam.y, this.cam.z])
        super.updateCanvas()
        this.medias.forEach((media: Media) => {
            media.updateFrame()
        })
        this.mediaFullscreen.update()
    }

    public onMouseWheel(event: any) {
        const { pixelX, pixelY } = NormalizeWheel(event)
        this.scrollGallery.onScroll(pixelX, pixelY)

        this.medias.forEach((media: Media) => {
            const meshPosition = media.onScroll(this.scrollGallery)

            //intersection observer
            this.canvasIntersectionObserver.observe(
                this.scrollGallery.scroll.direction,
                this.sizes.canvas,
                meshPosition
            )

        })
    }

    public onMouseMove(mousePosition: MousePosition) {
        this.medias.forEach((media: Media) => {
            media.onMouseMove(mousePosition)
        })
    }

    public onTouchDown(event: any) {
        this.scrollGallery.touch.isDown = true
        this.scrollGallery.touch.startX = event.touches ? event.touches[0].clientX : event.clientX
        this.scrollGallery.touch.startY = event.touches ? event.touches[0].clientY : event.clientY
    }

    public onTouchMove(event: any) {
        if (!this.scrollGallery.touch.isDown) {
            return
        }

        const distanceX = (event.touches)
            ? (event.touches[0].clientX - this.scrollGallery.touch.startX)
            : (event.clientX - event.touches[0].clientX)
        const distanceY = (event.touches)
            ? (event.touches[0].clientY - this.scrollGallery.touch.startY)
            : (event.clientX - event.touches[0].clientY)

        this.scrollGallery.onScroll(distanceX, distanceY)
        this.medias.forEach((media: Media) => {
            const meshPosition = media.onScroll(this.scrollGallery)

            //     //intersection observer
            //     // this.canvasIntersectionObserver.observe(
            //     //     this.scrollGallery.scroll.direction,
            //     //     this.sizes.canvas,
            //     //     meshPosition
            //     // )

        })
    }


    public onTouchUp(event: any) {
        this.scrollGallery.touch.isDown = false

    }

    destroy() {
        this.scene.removeChild(this.group)
    }
}