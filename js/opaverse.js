import { OpaverseController } from './opaverse/OpaverseController.js';

document.addEventListener('DOMContentLoaded', () => {
    new OpaverseController(window.opaHifiDatabase);
});
