import { VerseViewModel } from './VerseViewModel.js';

export class DataManager {
    constructor(database) {
        const opaverseOrder = database?.opaverseOrder || database?.rideOrder || [];
        const allGroups = database?.groups || [];
        const groupsByKey = Object.fromEntries(allGroups.map(g => [g.key, g]));
        const themes = database?.themes || {};
        const opaverses = opaverseOrder.map(key => groupsByKey[key]).filter(Boolean);

        this.processedVerses = opaverses.map((verseData, index) =>
            new VerseViewModel(verseData, index, opaverses.length, themes)
        );
    }

    getData() {
        return this.processedVerses;
    }
}
