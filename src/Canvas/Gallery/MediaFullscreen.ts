import { FullscreenImageData, MediaFullscreenOptionsInterface } from "./Interface";
import { Program, Mesh, Texture } from 'ogl'
//@ts-ignore
import vertex from './glsl/fullscreen/vertex.glsl?raw'
//@ts-ignore
import fragment from './glsl/fullscreen/fragment.glsl?raw'

import { GalleryEvent, MEDIA_SELECTED, MEDIA_SELECTED_DISPLAYED } from "./GalleryEvent";
import Asset from "../../Asset";

export default class MediaFullscreen {

    private texture: Texture
    private program: Program
    private mesh: Mesh
    private options: MediaFullscreenOptionsInterface
    private uniforms: any
    private imageData: FullscreenImageData
    private backgroundColors: string[]

    constructor(options: MediaFullscreenOptionsInterface) {
        this.options = options
        this.backgroundColors = [
            'rgb(89, 77, 62)',
            'rgb(23, 35, 29)',
            'rgb(164, 196, 185)',
            'rgb(19, 115, 153)',
            'rgb(179, 211, 198)',
            'rgb(179, 211, 198)',
            'rgb(179, 211, 198)',
            'rgb(179, 211, 198)',
            'rgb(179, 211, 198)',
        ]
    }

    private createTexture() {
        this.texture = new Texture(this.options.gl)

    }

    public update() {
        if (this.texture !== undefined) {
            this.uniforms.uTime.value += 0.01

            if (this.uniforms.uAlpha.value < 1.0) {
                this.uniforms.uAlpha.value += 0.01
            }
        }

    }

    public onImageSelected(imageData: FullscreenImageData) {
        if (this.texture === undefined) {
            this.createTexture()
            this.createProgram()
            this.createMesh()
        }

        this.imageData = imageData
        const image = Asset.getInstance().getImage(this.imageData.index)

        this.texture.image = image

        this.updateScale()

        // GalleryEvent.fire(
        //     MEDIA_SELECTED_DISPLAYED,
        //     this.backgroundColors[this.imageData.index]
        // )

        this.uniforms.uAlpha.value = 0.0
        this.uniforms.uTime.value = 0.0

        // console.log(image.getBoundingClientRect())
    }

    private updateScale() {
        const height = this.imageData.height / window.innerHeight
        const width = this.imageData.width / window.innerWidth
        const factor = 3.5
        // this.mesh.scale.x = (this.imageData.sizes.canvas.width * width) * factor
        // this.mesh.scale.y = (this.imageData.sizes.canvas.height * height) * factor

        const imageRatio = this.imageData.width / this.imageData.height

        this.mesh.scale.y = this.imageData.sizes.canvas.height
        this.mesh.scale.x = this.mesh.scale.y * imageRatio


        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 1;
    }

    private initUniforms() {
        this.uniforms = {
            uTexture: { value: this.texture },
            uDuration: { value: 1.0 },
            uTime: { value: 0.0 },
            uAlpha: { value: 0.0 }
        }
    }

    private createProgram() {
        this.initUniforms()
        this.program = new Program(this.options.gl, {
            vertex,
            fragment,
            uniforms: this.uniforms,
            transparent: true,
        });
    }
    private createMesh() {
        this.mesh = new Mesh(this.options.gl, {
            geometry: this.options.geometry,
            program: this.program
        })
        this.mesh.setParent(this.options.scene)
    }
}