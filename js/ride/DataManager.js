import { VerseViewModel } from './VerseViewModel.js';

export class DataManager {
    constructor(database) {
        const rideOrder = database?.rideOrder || [];
        const allGroups = database?.groups || [];
        const groupsByKey = Object.fromEntries(allGroups.map(g => [g.key, g]));
        const themes = database?.themes || {};
        const rideVerses = rideOrder.map(key => groupsByKey[key]).filter(Boolean);

        this.processedVerses = rideVerses.map((verseData, index) =>
            new VerseViewModel(verseData, index, rideVerses.length, themes)
        );
    }

    getData() {
        return this.processedVerses;
    }
}
