import { Renderer, Camera, Transform } from 'ogl'
import { SizesInterface } from './Gallery/Interface'



export default abstract class Canvas {

    private parentElement: HTMLElement
    private renderer: Renderer
    protected gl: any
    protected camera: Camera
    protected scene: Transform
    protected sizes: SizesInterface;
    private id: string

    abstract onResize(event): void;

    constructor(appendTo: HTMLElement, id: string) {
        this.parentElement = appendTo
        this.id = id
        this.createRenderer()
        this.createCamera()
        this.sizes = {
            aspectRatio: 0,
            canvas: { width: 0, height: 0 },
            viewport: { width: 0, height: 0 },
            screen: { width: 0, height: 0 },
        }

        this.createScene()
    }

    private createScene() {
        this.scene = new Transform();
    }

    private createRenderer() {
        this.renderer = new Renderer({
            alpha: true // transparency
        })
        this.gl = this.renderer.gl
        this.gl.canvas.id = this.id
        this.parentElement.appendChild(this.gl.canvas)
    }

    private createCamera() {
        this.camera = new Camera(this.gl);
        // this.camera.fov = 45
        // this.camera.position.z = 50;
    }

    protected updateSizes() {
        //aspect ratio
        this.sizes.aspectRatio = window.innerWidth / window.innerHeight;
        // let width, height;
        // if (aspectRatio>=1){
        //     width = 1;
        //     height = (window.innerHeight/window.innerWidth) * width;
        // }else{
        //     width = aspectRatio;
        //     height = 1;
        // }
        //window sizes
        this.sizes.screen = {
            height: window.innerHeight,
            width: window.innerWidth
        }

        this.renderer.setSize(this.sizes.screen.width, this.sizes.screen.height);
        // this.camera.aspect = this.sizes.screen.width / this.sizes.screen.height
        this.camera.perspective({
            aspect: window.innerWidth / window.innerHeight,
        });

        //canvas sizes
        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect
        this.sizes.canvas = {
            width,
            height,
        }
    }

    protected updateCanvas(event?) {
        this.renderer.render({
            scene: this.scene,
            camera: this.camera
        });
    }
}