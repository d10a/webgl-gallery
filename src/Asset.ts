//Singleton class for assets managment (the assets are loaded inside the preloader)
export default class Asset {

    private static instance: Asset;
    private imageElements: any;
    private images: Map<number, any>


    private constructor(selector: string) {
        this.images = new Map<number, any>()
        //this.imageElements = Array.from(document.querySelectorAll(selector))
        //console.log(this.imageElements, selector)
    }

    public static getInstance(selector = ''): Asset {
        if (!Asset.instance) {
            Asset.instance = new Asset(selector);
        }
        return Asset.instance;
    }

    public listImagesElements(): Map<number, any> {
        return this.images
    }

    public getImage(index: number): any {
        return this.images.get(index)
    }

    pushImage(imageInstance: any): void {
        this.images.set(this.images.size, imageInstance)
    }

}