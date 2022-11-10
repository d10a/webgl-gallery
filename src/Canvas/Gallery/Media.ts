import { Program, Mesh, Texture } from 'ogl'

//@ts-ignore
import vertex from './glsl/tiles/vertex.glsl?raw'
//@ts-ignore
import fragment from './glsl/tiles/fragment.glsl?raw'

import MediaOptions, { MediaExtraInterface, MediaPositionInterface, MousePosition, ScrollMeshEdgePosition, SizesInterface } from './Interface'
import ScrollGallery from './ScrollGallery'
import { GalleryEvent, MEDIA_SELECTED } from './GalleryEvent'
import Asset from '../../Asset'




export default class Media {

    private mediaOptions: MediaOptions
    public index: number
    private program: Program
    private mesh: Mesh
    private texture: Texture
    private bounds: any
    private mediaWidth: number
    private mediaHeight: number
    private sizes: SizesInterface
    private image: any;
    private position: MediaPositionInterface
    private extra: MediaExtraInterface
    private uniforms: any
    private y: number = 0
    private x: number = 0

    constructor(mediaOptions: MediaOptions) {
        this.mediaOptions = mediaOptions
        this.index = this.mediaOptions.index
        this.image = Asset.getInstance().getImage(this.mediaOptions.index)

        this.createTexture()
        this.createProgram()
        this.createMesh()
        this.position = {
            x: 0,
            y: 0
        }
        this.extra = {
            x: 0,
            y: 0
        }
    }

    public onClick() {
        GalleryEvent.fire(MEDIA_SELECTED, {
            index: this.mediaOptions.index,
            width: this.bounds.width,
            height: this.bounds.height,
            sizes: this.sizes
        })
    }

    private initUniforms() {
        this.uniforms = {

            uSpeed: { value: 0 },
            uViewportSizes: { value: [this.mediaOptions.sizes.canvas.width, this.mediaOptions.sizes.canvas.height] },
            tMap: { value: this.texture },
            uAlpha: { value: 1 },
            uMouse: { value: [0, 0] },
            uVelo: { value: 0.25 },
            uPlaneSizes: { value: [0, 0] },
            uImageSizes: { value: [0, 0] },
            uTime: { value: 0.0 },
            uDuration: { value: 0.0 },

        }
    }

    private createTexture() {
        this.texture = new Texture(this.mediaOptions.gl, {
            image: this.image
        })
    }

    private createProgram() {
        this.initUniforms()
        this.program = new Program(this.mediaOptions.gl, {
            vertex,
            fragment,
            uniforms: this.uniforms,
            transparent: true,
        });
    }
    private createMesh() {
        this.mesh = new Mesh(this.mediaOptions.gl, {
            geometry: this.mediaOptions.geometry,
            program: this.program,
        })
        this.mesh.setParent(this.mediaOptions.scene)
    }

    // receive viewport and screen values
    public onResize(sizes: SizesInterface) {
        this.texture.update()
        this.mesh.updateMatrix()
        this.sizes = sizes

        this.updateScale()
        this.updatePositionX()
        this.updatePositionY(0)
        this.updatePositionZ(2)
        this.mesh
    }

    public updateFrame() {
        this.uniforms.uTime.value += 0.005
    }

    public onMouseMove(mousePosition: MousePosition) {
        this.uniforms.uMouse = [mousePosition.x, mousePosition.y]
    }

    public onScroll(scrollGallery: ScrollGallery): any {
        if (scrollGallery.scroll.direction === undefined) {
            return 0
        }

        switch (scrollGallery.scroll.direction) {
            case 'up':
                this.x -= scrollGallery.pixelY
                break;
            case 'down':
                this.x += -scrollGallery.pixelY
                break;
            case 'right':
                this.x += scrollGallery.pixelX
                break;
            case 'left':
                this.x -= -scrollGallery.pixelX
                break;
        }

        //calculate extra
        // this.sizes.canvas / 2

        this.updateBounds()

        //horizontal
        if (scrollGallery.isTouchEvent()) {
            if (['left', 'right'].includes(scrollGallery.scroll.direction)) {
                this.updatePositionX(this.x)
            }
        } else {
            if (['up', 'down'].includes(scrollGallery.scroll.direction)) {
                this.updatePositionX(this.x)
            }
        }




        this.uniforms.uSpeed.value = scrollGallery.speed.current

        return {
            position: this.mesh.position,
            scale: this.mesh.scale,
            mesh: this.mesh
        };
    }

    public getMesh() {
        return this.mesh
    }



    private updateBounds() {
        this.bounds = this.mediaOptions.element.getBoundingClientRect()
    }

    public updateScale() {
        this.updateBounds()
        const height = this.bounds.height / window.innerHeight
        const width = this.bounds.width / window.innerWidth

        this.mesh.scale.x = this.sizes.canvas.width * width
        this.mesh.scale.y = this.sizes.canvas.height * height
    }

    // private updateScaleX(widthBound) {
    //     const width = widthBound / window.innerWidth
    //     this.mesh.scale.x = this.sizes.canvas.width * width
    // }

    // private updateScaleY(heightBound) {
    //     const height = heightBound / window.innerHeight
    //     this.mesh.scale.y = this.sizes.canvas.height * height
    // }

    private updatePositionX(x = 0) {
        this.position.x = (this.bounds.left + x) / window.innerWidth
        this.mesh.position.x = (-this.sizes.canvas.width / 2) + (this.mesh.scale.x / 2) + (this.position.x * this.sizes.canvas.width)
    }

    private updatePositionY(y = 0) {
        this.position.y = (this.bounds.top + y) / window.innerHeight
        this.mesh.position.y = (this.sizes.canvas.height / 2) - (this.mesh.scale.y / 2) - (this.position.y * this.sizes.canvas.height) - this.extra.y
    }

    private updatePositionZ(z = 0) {
        this.mesh.position.z = z
    }

}