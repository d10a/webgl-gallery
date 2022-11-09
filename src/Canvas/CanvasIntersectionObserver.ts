import { EventEmitter } from "@billjs/event-emitter"
import { Mesh } from 'ogl'

interface CanvasSizes {
    width: number
    height: number
}

interface MeshPosition {
    x: number
    y: number
}

interface MeshScale {
    x: number
    y: number
}

interface MeshCoord {
    position: MeshPosition
    scale: MeshScale,
    mesh: Mesh
}

export class CanvasIntersectionObserver extends EventEmitter {

    public static TOP_LIMIT_REACHED = 'event:top_limit_reached'
    public static TOP_THRESHOLD_REACHED = 'event:top_treshold_reached'
    public static BOTTOM_LIMIT_REACHED = 'event:bottom_limit_reached'
    public static BOTTOM_TRESHOLD_REACHED = 'event:bottom_treshold_reached'

    public observe(scrollDirection: string, sizes: CanvasSizes, meshCoord: MeshCoord) {
        if (scrollDirection === undefined) {
            return
        }

        //bound limits
        const top = (sizes.height * 0.5) - (meshCoord.scale.y * 0.5);
        const bottom = (sizes.height * -0.5) + (meshCoord.scale.y * 0.5);
        const left = (sizes.width * -0.5) + (meshCoord.scale.x * 0.5);
        const right = (sizes.width * 0.5) - (meshCoord.scale.x * 0.5);

        //bounds outside
        const disapearTop = top + meshCoord.scale.y
        const disapearBottom = bottom - meshCoord.scale.y
        const disapearLeft = left - meshCoord.scale.x
        const disapearRight = right + meshCoord.scale.x

        if (scrollDirection === 'up') {
            //top position limit
            if (meshCoord.position.y > top) {
                this.fire(CanvasIntersectionObserver.TOP_LIMIT_REACHED, meshCoord.mesh)
            }

            //top : mesh disapeared from canvas
            if (meshCoord.position.y >= disapearTop) {
                this.fire(CanvasIntersectionObserver.TOP_THRESHOLD_REACHED, meshCoord.mesh)
            }
        }

        if (scrollDirection === 'down') {
            if (meshCoord.position.y < bottom) {
                this.fire(CanvasIntersectionObserver.BOTTOM_LIMIT_REACHED, meshCoord.mesh)
            }

            //Bottom disapear
            if (meshCoord.position.y <= disapearBottom) {
                this.fire(CanvasIntersectionObserver.BOTTOM_TRESHOLD_REACHED, meshCoord.mesh)
            }
        }


        //left limit
        if (meshCoord.position.x < left) {
            // console.log('LEFT LIMIT')
        }

        //left disapear
        if (meshCoord.position.x <= disapearLeft) {
            // console.log('LEFT DISAPEAR')
        }

        //right limit
        if (meshCoord.position.x > right) {
            // console.log('RIGHT LIMIT')
        }

        //right disapear
        if (meshCoord.position.x >= disapearRight) {
            // console.log('RIGHT DISAPEAR')
        }
    }


}