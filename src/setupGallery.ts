import Gallery from "./Canvas/Gallery/Gallery";
import gsap from 'gsap'

interface GalleryOptions {
  galleryElement: HTMLElement
  galleryWrapper: HTMLElement
}

export function setupGallery(galleryOptions: GalleryOptions) {

  let gallery: Gallery;

  const mouseScrollAnimationWrapper = galleryOptions.galleryElement.querySelector('.mouse__scroll__wrapper')

  const setGallery = async () => {
    createCanvas()
    onResize()

    gsap.to(mouseScrollAnimationWrapper, {
      autoAlpha: 0,
      delay: 6
    })

    gallery.bindEvents()
  }

  const onResize = (event?: any) => {
    console.log('resize')
    gallery.onResize(event)
  }

  const onMouseWheel = (event: any) => {
    gallery.onMouseWheel(event)
  }

  const createCanvas = () => {
    gallery = new Gallery({
      appendTo: document.body,
      galleryWrapper: galleryOptions.galleryElement
    });
  }

  setGallery()
  window.onresize = (event: any) => onResize(event)
  window.addEventListener('mousewheel', (event: any) => {
    onMouseWheel(event)
  })


}
