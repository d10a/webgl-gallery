import { EventEmitter } from "@billjs/event-emitter";


const MEDIA_SELECTED = "event:media_selected"
const MEDIA_SELECTED_DISPLAYED = "event:media_selected_displayed"

const GalleryEvent = new EventEmitter();

export {
    GalleryEvent,
    MEDIA_SELECTED,
    MEDIA_SELECTED_DISPLAYED
}
