import Asset from "./Asset"
import gsap from 'gsap'
import { PreloaderEvent, PRELOAD_COMPLETED_EVENT } from "./Preloader/PreloaderEvent";
import { resolve } from "path";
import { rejects } from "assert";

export function setupPreloader(selector: string, galleryWrapper: HTMLElement) {
  let length = 0
  let numberOfAssets = 0
  let images: string[] = [
    'https://picsum.photos/id/84/1024/768',
    'https://picsum.photos/id/82/1024/768',
    'https://picsum.photos/id/83/1024/768',
    'https://picsum.photos/id/80/1024/768',
    'https://picsum.photos/id/71/1024/768',
    'https://picsum.photos/id/63/1024/768',
    'https://picsum.photos/id/61/1024/768',
    'https://picsum.photos/id/92/1024/768',
    'https://picsum.photos/id/96/1024/768',
    'https://picsum.photos/id/95/1024/768',
    'https://picsum.photos/id/99/1024/768',
    'https://picsum.photos/id/102/1024/768',
    'https://picsum.photos/id/104/1024/768',
    'https://picsum.photos/id/107/1024/768',
    'https://picsum.photos/id/106/1024/768',
    'https://picsum.photos/id/110/1024/768',
    'https://picsum.photos/id/111/1024/768',
    'https://picsum.photos/id/115/1024/768',
    'https://picsum.photos/id/119/1024/768',
    'https://picsum.photos/id/122/1024/768',
    'https://picsum.photos/id/124/1024/768',
    'https://picsum.photos/id/128/1024/768',
    'https://picsum.photos/id/137/1024/768',
    'https://picsum.photos/id/151/1024/768',
  ];

  const preloaderElement = document.querySelector(selector)!
  const logoElement = preloaderElement.querySelectorAll('.preloader__logo span span')
  const titleElement = preloaderElement.querySelectorAll('.preloader__title span span')
  const progressElement = preloaderElement.querySelector('.preloader__progress__text')

  const initPreloader = async () => {
    try {
      await show()
      await displayImages()
    } catch (error) {
      // console.log(error)
    }
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
        // autoAlpha: 0,
        duration: 0.8,
        y: '100%',
        ease: 'expo.inOut',
        onComplete: resolve
      })

    })
  }

  //@deprecated
  const fetchImages = async () => {
    return new Promise((resolve, reject) => {
      const query = {
        method: 'GET',
      }
      Promise.all([
        fetch('https://picsum.photos/1080/720', query),
        fetch('https://picsum.photos/1080/720', query),
        fetch('https://picsum.photos/1080/720', query),
        fetch('https://picsum.photos/1080/720', query),
        fetch('https://picsum.photos/1080/720', query),
      ]).then((results: any[]) => {
        resolve(results)
      })

    })
  }

  const displayImages = (): Promise<boolean> => {
    return new Promise((resolve) => {
      numberOfAssets = images.length;
      images.forEach((mediaSrc: any) => {
        //image
        const image = new Image()
        image.crossOrigin = 'Anonymous'
        image.classList.add('gallery__media')
        // image.alt = `Author : ${media.author}`
        image.src = mediaSrc

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
