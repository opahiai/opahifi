import { OpaverseViewModel } from './OpaverseViewModel.js';

export class DataManager {
    constructor(database) {
        const opaverseOrder = database?.opaverseOrder || database?.rideOrder || [];
        const allGroups = database?.groups || [];
        const groupsByKey = Object.fromEntries(allGroups.map(g => [g.key, g]));
        const themes = database?.themes || {};
        const opaverses = opaverseOrder.map(key => groupsByKey[key]).filter(Boolean);

        this.opaverseViewModels = opaverses.map((verseData, index) =>
            new OpaverseViewModel(verseData, index, opaverses.length, themes)
        );
    }

    getData() {
        return this.opaverseViewModels;
    }
}
