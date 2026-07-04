export class VerseViewModel {
    constructor(verseData, index, totalVerses, themes) {
        const num = String(index + 1).padStart(2, '0');
        const hueStep = totalVerses > 1 ? (360 - 210) / (totalVerses - 1) : 0;
        const currentHue = 360 - (index * hueStep);

        this.themeKey = verseData.themeKey || 'default-verse';
        this.key = verseData.key;
        this.line1 = verseData.titleLines[0] || '';
        this.line2 = verseData.titleLines[1] || '';
        this.img = verseData.cover;
        this.subtitle = `${num} // ${verseData.ride?.subtitle || ''}`;
        this.description = verseData.ride?.description || '';
        this.color = `hsl(${currentHue}, 100%, 50%)`;
        this.lightColor = `hsl(${currentHue}, 100%, 75%)`;
        this.id = verseData.key;
        this.theme = { ...themes['default-verse'], ...themes[this.themeKey] };
    }
}
