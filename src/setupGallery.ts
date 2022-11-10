import Gallery from "./Canvas/Gallery/Gallery";
import gsap from 'gsap'
import { isTouchEnabled } from "./utils/Touch";

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

  const createCanvas = () => {
    gallery = new Gallery({
      appendTo: document.body,
      galleryWrapper: galleryOptions.galleryElement
    });
  }

  const onResize = (event?: any) => {
    gallery.onResize(event)
  }

  const onMouseWheel = (event: any) => {
    gallery.onMouseWheel(event)
  }
  const onTouchDown = (event: any) => {
    gallery.onTouchDown(event)
  }
  const onTouchMove = (event: any) => {
    gallery.onTouchMove(event)
  }
  const onTouchUp = (event: any) => {
    gallery.onTouchUp(event)
  }


  /* Launch gallery */
  setGallery()

  window.onresize = (event: any) => onResize(event)

  window.addEventListener('mousewheel', (event: any) => {
    onMouseWheel(event)
  })

  // if (isTouchEnabled()) {
  window.addEventListener('touchstart', (event: any) => {
    onTouchDown(event)
  })

  window.addEventListener('touchmove', (event: any) => {
    onTouchMove(event)
  })

  window.addEventListener('touchend', (event: any) => {
    onTouchUp(event)
  })
  // }



}
