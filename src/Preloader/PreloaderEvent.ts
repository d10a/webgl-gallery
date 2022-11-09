import { EventEmitter } from "@billjs/event-emitter";


const PRELOAD_COMPLETED_EVENT = "event:preload_completed"

const PreloaderEvent = new EventEmitter();

export { PreloaderEvent, PRELOAD_COMPLETED_EVENT }
