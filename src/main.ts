import './style.scss'

import { setupGallery } from './setupGallery'
import { setupPreloader } from './setupPreloader'
import Asset from './Asset'
import { PreloaderEvent, PRELOAD_COMPLETED_EVENT } from './Preloader/PreloaderEvent'
import gsap from 'gsap'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <div id="preloader">
    <h1 class="preloader__logo">
      <span><span>W</span></span>
      <span><span>e</span></span>
      <span><span>b</span></span>
      <span><span>G</span></span>
      <span><span>L</span></span>
      <span><span></span></span>
      <span><span>G</span></span>
      <span><span>a</span></span>
      <span><span>l</span></span>
      <span><span>l</span></span>
      <span><span>e</span></span>
      <span><span>r</span></span>
      <span><span>y</span></span>
    </h1>
    <h2 class="preloader__title">
      <span><span>David Gassama</span></span>
      <span><span>Creative Developer Freelance</span>&nbsp;</span>
    </h2>
    <p class="preloader__progress__text"></p>
  </div>
  <div id="gallery">
    <div class="mouse__scroll__wrapper">
      <p class="mouse__scroll__text">Scroll</p>
      <span class="mouse__scroll_object"></span>
    </div>
    <div class="gallery__wrapper">
    </div>
  </div>
`

const gallerySelector = '#gallery'
const preloaderSelector = '#preloader'
const galleryElement = <HTMLElement>document.querySelector(gallerySelector)!
const galleryWrapper = <HTMLElement>galleryElement.querySelector('.gallery__wrapper')!


setupPreloader(preloaderSelector, galleryWrapper)
PreloaderEvent.on(PRELOAD_COMPLETED_EVENT, () => {
  gsap.to(gallerySelector, {
    autoAlpha: 1
  })

  setupGallery({
    galleryElement,
    galleryWrapper
  })
})





// 

// const animateIn = gsap.timeline()

// const gallery = new Gallery({
//   appendTo: galleryElement,
//   galleryWrapper,
//   mediasElements,
// });

// GalleryEvent.on(MEDIA_SELECTED_DISPLAYED, (event: any) => {
//   animateIn.to(gallerySelector, {
//     backgroundColor: event.data,
//     //delay: 0.5,
//     duration: 1,
//     ease: "slow(1, 0.7, false)",
//   })
// })

