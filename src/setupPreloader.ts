import Asset from "./Asset"
import gsap from 'gsap'
import { PreloaderEvent, PRELOAD_COMPLETED_EVENT } from "./Preloader/PreloaderEvent";

export function setupPreloader(selector: string, galleryWrapper: HTMLElement) {
  let length = 0
  let numberOfAssets = 0
  let images: any[];

  const preloaderElement = document.querySelector(selector)!
  const logoElement = preloaderElement.querySelectorAll('.preloader__logo span span')
  const titleElement = preloaderElement.querySelectorAll('.preloader__title span span')
  const progressElement = preloaderElement.querySelector('.preloader__progress__text')

  const initPreloader = async () => {
    await show()
    await fetchImages()
    await displayImages()
  }

  const show = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const timeline = gsap.timeline({})

      timeline.to(preloaderElement, {
        autoAlpha: 1,
      })


      timeline.to(logoElement, {
        autoAlpha: 1,
        delay: 0.4,
        display: 'inline-block',
        y: '-50%',
        ease: "back.inOut",
        stagger: 0.04,
      });

      timeline.to(titleElement, {
        autoAlpha: 1,
        display: 'inline-block',
        y: '-50%',
        ease: "back.inOut",
        stagger: 0.1,
        onComplete: resolve
      });
    })
  }

  const hide = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const timeline = gsap.timeline({})
      timeline.to(logoElement, {
        autoAlpha: 0,
        display: 'inline-block',
        y: '100%',
        ease: "back.inOut",
        stagger: 0.04,
      });

      timeline.to(preloaderElement, {
        autoAlpha: 0,
        y: '100%',
        ease: 'expo.inOut',
        duration: 1,
        onComplete: resolve
      })

    })
  }

  const fetchImages = async () => {
    const query = {
      method: 'GET',
    }
    const xhrResponse = await fetch('https://picsum.photos/v2/list?page=2&limit=50', query)
    images = await xhrResponse.json()
    numberOfAssets = images.length
  }

  const displayImages = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      images.forEach((media: any) => {
        //image
        const image = new Image()
        image.crossOrigin = 'Anonymous'
        image.classList.add('gallery__media')
        image.alt = `Author : ${media.author}`
        image.src = media.download_url

        image.onload = () => {
          Asset.getInstance().pushImage(image)
          //figure
          const figureElement = document.createElement('figure')
          figureElement.classList.add('gallery__media__wrapper')
          figureElement.appendChild(image)

          galleryWrapper.append(figureElement)

          onAssetPreloaded()
        }
      })
      resolve(true)
    })


  }

  const onAssetPreloaded = () => {
    length++
    const percent = length / numberOfAssets

    if (progressElement) {
      progressElement.innerHTML = `${Math.round(percent * 100)}%`
    }


    if (percent === 1) {
      onPreloadFinished()
    }
  }

  const onPreloadFinished = () => {
    hide()
    PreloaderEvent.fire(PRELOAD_COMPLETED_EVENT)
  }

  initPreloader()
}
