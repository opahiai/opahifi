/**
 * ============================================================
 * OPAHIFI - SINGLE SOURCE OF TRUTH DATABASE
 * ============================================================
 * This file contains all the data for the OpaHiFi experience,
 * including song groups, single versions, and Opaverse content.
 *
 * To add or update a song:
 * 1. Add or edit its entry in `groups`.
 * 2. Add its `key` to `opaverseOrder` where it should appear.
 * 3. Add one or more releases to `singles`.
 */

(function () {
    if (window.opaHifiDatabase) return;

    const platformOrder = ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Other'];

    const platformIcons = {
        'Spotify': 'img/ico/spotify-white.svg',
        'Apple Music': 'img/ico/apple-white.svg',
        'YouTube Music': 'img/ico/youtubemusic-white.svg',
        'Amazon Music': 'img/ico/amazon-white.svg',
        'Other': 'img/ico/youtube-white.svg'
    };

    // Rearrange this list to change the interactive Opaverse and playlist order.
    // The keys must match entries in `groups`.
    const opaverseOrder = [
        'full-mindness',
        'hallucinatingdumdum',
        'yeahletsdobrunch',
        'splendaloverabbithell',
        'believethetruthfairy',
        'oldlovestory',
        'glittaaphoenix',
        'notyourbot-beepsleep',
        'wellwolfhowllehluya',
        'opapapaparty'
    ];

    const groups = [
        {
            key: 'full-mindness',
            title: 'Full-Mindness',
            titleLines: ['Full-', 'Mindness'],
            themeKey: 'repeating-text',
            cover: 'img/music/base/base-fullmindness.png',
            opaverse: {
                subtitle: 'SURVIVE FABULOUSLY',
                description: 'Everyday chaos takes over. Calm is not the goal anymore - surviving fabulously is. A high-contrast barrage of thoughts woven into an undeniable groove.'
            }
        },
        {
            key: 'hallucinatingdumdum',
            title: 'Hallucinating Dum Dum',
            titleLines: ['Hallucinating', 'Dum Dum'],
            themeKey: 'center-content',
            cover: 'img/music/base/base-hallucinatingdumdum.png',
            opaverse: {
                subtitle: 'THE BRAIN FILLS BLANKS',
                description: 'Human confusion mirrors AI hallucination. A surreal 3D playground where logic melts into violet and cyan haze.'
            }
        },
        {
            key: 'yeahletsdobrunch',
            title: 'Yeah, Let\'s Do Brunch',
            titleLines: ['Yeah, Let\'s', 'Do Brunch'],
            themeKey: 'brunch-parallax',
            cover: 'img/music/base/base-yeahletsdobrunch.png',
            opaverse: {
                subtitle: 'FAKE WARMTH',
                description: '"I miss you" with no follow-through. Bright morning mimosas fade into cold read receipts and deep cobalt emptiness.'
            }
        },
        {
            key: 'splendaloverabbithell',
            title: 'Splenda Love Rabbit Hell',
            titleLines: ['Splenda Love', 'Rabbit Hell'],
            cover: 'img/music/base/base-splendaloverabbithell.png',
            opaverse: {
                subtitle: 'ARTIFICIAL SWEETNESS',
                description: 'Fake love tastes good for one second and terrible after. A descent into a glossy, sticky, molten nightmare.'
            }
        },
        {
            key: 'believethetruthfairy',
            title: 'Believe the Truth fairy',
            titleLines: ['Believe the', 'Truth Fairy'],
            themeKey: 'center-content',
            cover: 'img/music/base/base-believethetruthfairy.png',
            opaverse: {
                subtitle: 'BRINGING THE RECEIPTS',
                description: 'Misinformation, lazy certainty, and online hate are challenged by a tired truth fairy. The blur fades into stark contrast.'
            }
        },
        {
            key: 'oldlovestory',
            title: 'Old Love Story',
            titleLines: ['Old Love', 'Story'],
            cover: 'img/music/base/base-oldlovestory.png',
            opaverse: {
                subtitle: 'SLOWER, MESSIER ROMANCE',
                description: 'The ride looks back at a time before disposable fast culture. Warm tones, soft glowing edges, and real connection.'
            }
        },
        {
            key: 'glittaaphoenix',
            title: 'Glittaa Phoenix',
            titleLines: ['Glittaa', 'Phoenix'],
            themeKey: 'glittaa-spin',
            cover: 'img/music/base/base-glittaaphoenix.png',
            opaverse: {
                subtitle: 'FIRE AND DANCE',
                description: 'Pain becomes glitter, rhythm, fire, and kinetic momentum. The energy spikes as we rise from the ashes.'
            }
        },
        {
            key: 'notyourbot-beepsleep',
            title: 'Not Your Bot / Beep Sleep',
            titleLines: ['Not Your Bot', 'Beep Sleep'],
            themeKey: 'text-pop',
            cover: 'img/music/base/base-notyourbot-beepsleep.png',
            opaverse: {
                subtitle: 'ABSOLUTE FREEDOM',
                description: 'Bot/toy accusations flip into freedom, sass, and release. Sharp geometric cuts, stark contrast, and electric energy.'
            }
        },
        {
            key: 'wellwolfhowllehluya',
            title: 'Wellwolf Howl-Lehluya',
            titleLines: ['Wellwolf', 'Howl-Lehluya'],
            cover: 'img/music/base/base-wellwolfhowllehluya.png',
            opaverse: {
                subtitle: 'THE MONSTER REDEFINED',
                description: 'Real power is kindness, restraint, and not becoming the predator. Deep navy shadows pierced by soft violet moon glows.'
            }
        },
        {
            key: 'opapapaparty',
            title: 'Opa pa pa party',
            titleLines: ['Opa Pa', 'Pa Party'],
            themeKey: 'center-content',
            cover: 'img/music/base/base-opapapaparty.png',
            opaverse: {
                subtitle: 'RIDE EXIT',
                description: 'The meltdown becomes celebration. Same chaos, better rhythm. We survived the ride.'
            }
        }
    ];

    const singles = [
        {
            id: 'old-love-story',
            groupKey: 'oldlovestory',
            version: 'Desert Disco Duet',
            image: 'img/music/versions/version-oldlovestory-desertdiscoduet.png',
            mixColors: ['#fff0f5', '#5c14b5'],
            lyricsPath: 'lyrics/old-love-story.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=iBtEe-Ch8Qo&list=OLAK5uy_mtnikKbgC0QYek2mnPWKJy-Ewr7E1e0zE',
                'Amazon Music': 'https://music.amazon.com/albums/B0FXB4X48G',
                'Spotify': 'https://open.spotify.com/track/5jvOt03Y3cQdBqocYmbUII',
                'Apple Music': 'https://music.apple.com/us/album/old-love-story-desert-disco-duet-single/1848551028',
                'Other': 'https://youtu.be/iBtEe-Ch8Qo?si=15gHOW9HM6DAGmjq'
            }
        },
        {
            id: 'old-love-story-opa-max-mix',
            groupKey: 'oldlovestory',
            version: 'Opa Max Mix',
            image: 'img/music/versions/version-oldlovestory-maxmix.png',
            mixColors: ['#60c6e6', '#5c14b5'],
            lyricsPath: 'lyrics/old-love-story.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=m7wP4U97FC8',
                'Amazon Music': 'https://music.amazon.com/albums/B0GHC1X6R3',
                'Spotify': 'https://open.spotify.com/track/3GZsz52AKg9ml2mMtC6EEw',
                'Apple Music': 'https://music.apple.com/ng/song/old-love-story-opa-max-mix/1869842718',
                'Other': 'https://youtu.be/m7wP4U97FC8'
            }
        },
        {
            id: 'opa-pa-pa-party',
            groupKey: 'opapapaparty',
            image: 'img/music/base/base-opapapaparty.png',
            lyricsPath: 'lyrics/opa-pa-pa-party.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/playlist?list=OLAK5uy_kyaEMBBaI0luWjB6ch9XqEbp4_dWNu3Mw',
                'Amazon Music': 'https://music.amazon.com/albums/B0FYVMVZS4',
                'Spotify': 'https://open.spotify.com/track/5dPbCqmOBoPSDe4UfQURDf',
                'Apple Music': 'https://music.apple.com/us/album/opa-pa-pa-party/1850813736?i=1850813737',
                'Other': 'https://youtu.be/B9lX6d-AIf8?si=fseyUMFxJJVAh2C8'
            }
        },
        {
            id: 'glittaa',
            groupKey: 'glittaaphoenix',
            image: 'img/music/base/base-glittaaphoenix.png',
            lyricsPath: 'lyrics/glittaa-pheonix.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=4Enfe7y6RVo&si=gjMhajy0cR3VPQ17',
                'Amazon Music': 'https://music.amazon.com/albums/B0G1N1Y83C',
                'Spotify': 'https://open.spotify.com/track/7d6kFt6vOlkTPIn4gqozy6',
                'Apple Music': 'https://music.apple.com/us/album/glittaa-phoenix-single/1853214791',
                'Other': 'https://youtu.be/4Enfe7y6RVo?si=s1UpWS4WCZy6XujX'
            }
        },
        {
            id: 'splenda-love-rabbit-hell',
            groupKey: 'splendaloverabbithell',
            version: 'Opa Max Mix',
            image: 'img/music/versions/version-splendaloverabbithell-maxmix.png',
            mixColors: ['#60c6e6', '#5c14b5'],
            lyricsPath: 'lyrics/splenda-love-rabbit-hell.txt',
            links: {
                'Spotify': 'https://open.spotify.com/track/0yILa8PArNyh1CJlfq5s2n?si=901f3fbf46fa4842',
                'Apple Music': 'https://music.apple.com/us/song/splenda-love-rabbit-hell-opa-max-mix/1872205650',
                'YouTube Music': 'https://music.youtube.com/watch?v=NR3Wcb439DI&si=p0Vz4FfM4yGb8EVE',
                'Amazon Music': 'https://music.amazon.com/albums/B0GJQZXHNL',
                'Other': 'https://youtu.be/NR3Wcb439DI?si=lXoiHaUDbYfOH40F'
            }
        },
        {
            id: 'glittaa-phoenix-sunrize-max-mix',
            groupKey: 'glittaaphoenix',
            version: 'Opa Sunrize Max Mix',
            image: 'img/music/versions/version-glittaaphoenix-sunrisemaxmix.png',
            mixColors: ['#e8d36b', '#f4c97a', '#f4af86'],
            lyricsPath: 'lyrics/glittaa-pheonix-sunrise-mix.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=LOywm64SGCY&si=iWf3mTJqF7wzVBwP',
                'Other': 'https://www.youtube.com/watch?v=LOywm64SGCY',
                'Spotify': 'https://open.spotify.com/artist/1WD2qPlo13H0gWENdreAsP',
                'Apple Music': 'https://music.apple.com/us/album/glittaa-phoenix-opa-sunrise-max-mix-single/1868781659',
                'Amazon Music': 'https://music.amazon.com/tracks/B0GGHZ6L2F'
            }
        },
        {
            id: 'believe-the-truth-fairy',
            groupKey: 'believethetruthfairy',
            image: 'img/music/base/base-believethetruthfairy.png',
            lyricsPath: 'lyrics/believe-the-truth-fairy.txt',
            links: {
                'Apple Music': 'https://music.apple.com/us/album/believe-the-truth-fairy-single/1867985683',
                'YouTube Music': 'https://music.youtube.com/watch?v=-hxtCiZO5uE&si=6RDhiG__48bZB4mj',
                'Spotify': 'https://open.spotify.com/track/2koDtHQbjsXNrNhetZfDqk?si=PDYCcyqBT9GwvMpXw5v5zg',
                'Amazon Music': 'https://music.amazon.com/albums/B0GF23N5JZ?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_hgBVvMSzssPMIipbWlbISEq4T&trackAsin=B0GF1YZG2P',
                'Other': 'https://youtu.be/-hxtCiZO5uE?si=7UXrK83pSmKyPXcC'
            }
        },
        {
            id: 'full-mindness',
            groupKey: 'full-mindness',
            version: 'Opa Mayhem Mix',
            image: 'img/music/versions/version-fullmindness-mayhemmix.png',
            mixColors: ['#60c6e6', '#5c14b5'],
            lyricsPath: 'lyrics/full-mindness.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=lE193jDewd4&si=D9lyKQ-KrLwWuZ0Z',
                'Other': 'https://youtu.be/lE193jDewd4?si=YywLQUMDj7DPgCwh',
                'Spotify': 'https://open.spotify.com/track/6lp1u1WV8q0Aqfej1YeF8v?si=35f35519ca434960',
                'Amazon Music': 'https://music.amazon.com/albums/B0GPL4Q4R5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_sac7n1RtCHUgR8GuzWLD1fZ7D&trackAsin=B0GPLBB653',
                'Apple Music': 'https://music.apple.com/ng/song/full-mindness-opa-mayhem-mix/1879704886'
            }
        },
        {
            id: 'yeah-lets-do-brunch',
            groupKey: 'yeahletsdobrunch',
            image: 'img/music/base/base-yeahletsdobrunch.png',
            lyricsPath: 'lyrics/yeah-lets-do-brunch.txt',
            links: {
                'Spotify': 'https://open.spotify.com/track/10pJOBA2Krl8QiAi7XUGE7?si=66f1ed7937454034',
                'Apple Music': 'https://music.apple.com/us/album/lets-do-brunch-single/1883970912',
                'YouTube Music': 'https://music.youtube.com/watch?v=nlRw2m9_Qh4&si=G1BKK_61Wf_EIast',
                'Amazon Music': 'https://music.amazon.com/albums/B0GS2JC8QD?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_CGFq3eGi1CLBa46vBJBJNB3oc&trackAsin=B0GS23XMP6',
                'Other': 'https://youtu.be/nlRw2m9_Qh4?si=Xe-ZF1Ogg2ynabpj'
            }
        },
        {
            id: 'wellwolf-howl-lehluya',
            groupKey: 'wellwolfhowllehluya',
            image: 'img/music/base/base-wellwolfhowllehluya.png',
            lyricsPath: 'lyrics/wellwolf-hoawlehluya.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/playlist?list=OLAK5uy_k3iThKSj0H5nDqf-dpU5EMM-ccRcglZaY&si=d2V3JFEBlqkSJi55',
                'Other': 'https://youtu.be/bjecZnXbXBc?si=Llwj6s7pyO2fRMmY',
                'Spotify': 'https://open.spotify.com/track/4OHlXoJFuPhfm4plY7Coop?si=86049caec0384f95',
                'Apple Music': 'https://music.apple.com/us/album/wellwolf-howl-lehluya-single/1894120765',
                'Amazon Music': 'https://music.amazon.com/tracks/B0GXHSFW83?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_YaZDAKqp0vQwgwM7y8yENc9Zw'
            }
        },
        {
            id: 'hallucinating',
            groupKey: 'hallucinatingdumdum',
            image: 'img/music/base/base-hallucinatingdumdum.png',
            lyricsPath: 'lyrics/hallucinating-dum-dum.txt',
            links: {
                'YouTube Music': 'https://music.youtube.com/watch?v=d5x0I9ffxwI&si=XE-Yl4gqJkmqfsJk',
                'Amazon Music': 'https://music.amazon.com/albums/B0H3PX4NXX?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_zWfHrxwuQbquYWxem0QHrLJzx&trackAsin=B0H3PZ7XM1',
                'Spotify': 'https://open.spotify.com/track/74dIXy89cJ5oPrG9MFGd3X?si=91d0eec0dfd54961',
                'Apple Music': 'https://music.apple.com/us/song/hallucinating-dum-dum/6776020941',
                'Other': 'https://youtu.be/d5x0I9ffxwI?si=3ehe5ANC_b68E693'
            }
        },
        {
            id: 'not-your-bot-beep-sleep',
            groupKey: 'notyourbot-beepsleep',
            image: 'img/music/base/base-notyourbot-beepsleep.png',
            lyricsPath: 'lyrics/not-your-bot-beep-sleep.txt',
            links: {
                'Spotify': 'https://open.spotify.com/track/4tLlgRbaw4AgpGjEJx96CO',
                'YouTube Music': 'https://music.youtube.com/watch?v=8Z90e2Zl-bw',
                'Apple Music': 'https://music.apple.com/us/song/not-your-bot-beep-sleep/6786322596',
                'Amazon Music': 'https://music.amazon.com/albums/B0H729SL3F?trackAsin=B0H72LRQ16',
                'Other': 'https://youtu.be/8Z90e2Zl-bw'
            }
        }
    ];

    const themes = {
        'default-verse': {
            classes: [],
            background: null,
            specialContent: ''
        },
        'repeating-text': {
            classes: ['theme--repeating-text'],
            background: {
                type: 'repeating-text',
                text: 'SURVIVING FABULOUSLY CHAOS '
            }
        },
        'center-content': {
            classes: ['layout--center-content']
        },
        'brunch-parallax': {
            classes: ['theme--brunch-parallax'],
            background: { type: 'parallax-text' },
            specialContent: '<div class="huge-text">GHOSTING<br>COLLAPSE</div>'
        },
        'glittaa-spin': {
            classes: ['layout--glittaa'],
            background: { type: 'conic-gradient-spin' }
        },
        'text-pop': {
            classes: ['layout--center-content', 'theme--text-pop'],
            specialContent: `<div class="pop-text pop-1">NOT YOUR BOT</div><div class="pop-text pop-2">FREEDOM</div><div class="pop-text pop-3">RELEASE</div><div class="pop-text pop-4">NO STRINGS</div>`
        }
    };

    // --- Data Processing ---
    // The rest of the application consumes this processed object.

    const singlesById = Object.fromEntries(singles.map(s => [s.id, s]));

    const groupKeys = groups.map(g => g.key);
    const missingOrderedKeys = opaverseOrder.filter(key => !groupKeys.includes(key));
    const unorderedGroupKeys = groupKeys.filter(key => !opaverseOrder.includes(key));

    if (missingOrderedKeys.length) {
        console.warn('opaverseOrder contains keys missing from groups:', missingOrderedKeys);
    }

    if (unorderedGroupKeys.length) {
        console.warn('groups contains Opaverses missing from opaverseOrder:', unorderedGroupKeys);
    }

    const groupsByKey = Object.fromEntries(groups.map(g => {
        const opaverse = g.opaverse || g.ride || {};

        return [g.key, {
            ...g,
            opaverse,
            ride: opaverse,
            songIds: [],
            singlesById: {}
        }];
    }));

    for (const single of singles) {
        const group = groupsByKey[single.groupKey];
        if (group) {
            group.songIds.push(single.id);
            group.singlesById[single.id] = single;
        }
    }

    window.opaHifiDatabase = {
        platformOrder,
        platformIcons,
        opaverseOrder,
        rideOrder: opaverseOrder,
        themes,
        groups: Object.values(groupsByKey),
        singlesById
    };
})();
