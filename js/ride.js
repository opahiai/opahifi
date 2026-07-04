import { RideController } from './ride/RideController.js';

document.addEventListener('DOMContentLoaded', () => {
    new RideController(window.opaHifiDatabase);
});
