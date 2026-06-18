class OpaHifiAboutPage {
    static sections = [
        {
            title: "What is OpaHiFi?",
            open: true,
            body: [
                {
                    type: "paragraph",
                    text: "OpaHiFi is a musical project for a loud mind in a quiet room — a place where noise becomes rhythm, panic becomes choreography, and the meltdown becomes the dance floor."
                },
                {
                    type: "paragraph",
                    text: "The vibe breaks down into this suspiciously convenient, absolutely-not-forced acronym:"
                }
            ]
        },
        {
            title: "O — Overflow",
            body: [
                {
                    type: "paragraph",
                    text: "Overflow is the messy part. The part where:"
                },
                {
                    type: "list",
                    items: [
                        "chaos stops visiting and officially becomes your roommate",
                        "you start hallucinating like a dumb bot",
                        "your life keeps texting “let’s do brunch”",
                        "fake calm puts on a cute outfit and calls itself Full-Mindness"
                    ]
                },
                {
                    type: "paragraph",
                    text: "Overflow is the moment the cup spills and the floor becomes the beat."
                }
            ]
        },
        {
            title: "P — Perspective",
            body: [
                {
                    type: "paragraph",
                    text: "Perspective is when the fog thins and the fake stuff loses its costume."
                },
                {
                    type: "list",
                    items: [
                        "your new love is basically Splenda",
                        "old love suddenly looks more real than the swipe-and-ghost circus",
                        "even bitcoin has two sides, and truth fairies are at risk"
                    ]
                },
                {
                    type: "paragraph",
                    text: "Perspective is the zoom-out that hurts first, then heals."
                }
            ]
        },
        {
            title: "A — Ascension",
            body: [
                {
                    type: "paragraph",
                    text: "Ascension sounds dramatic. Good. It should."
                },
                {
                    type: "paragraph",
                    text: "It’s more than a pick-me-up — it’s a lift-off."
                },
                {
                    type: "list",
                    items: [
                        "rise like a Phoenix or a category-5 hurricane of rhythm and glitter",
                        "find the Wellwolf inside and try to make this world a better place for all",
                        "party like no other in an Opa party with all your party people"
                    ]
                },
                {
                    type: "paragraph",
                    text: "Ascension is the moment the floor becomes the dance."
                }
            ]
        },
        {
            title: "Who is Opa?",
            body: [
                {
                    type: "paragraph",
                    text: "Opa is the guide through the noise."
                },
                {
                    type: "paragraph",
                    text: "Not a guru. Not a robot. Not your life coach."
                },
                {
                    type: "paragraph",
                    text: "Opa is the energy recycler in the room — taking chaos, confusion, heartbreak, bad ideas, and emotional static, then turning them back into movement, laughter, truth, kindness, and lift."
                },
                {
                    type: "paragraph",
                    text: "Pressure is the rhythm. Anxiety is the beat. Opa is the DJ."
                }
            ]
        }
    ];

    constructor(root) {
        this.root = root;
        this.rendered = false;
    }

    activate() {
        this.render();
    }

    deactivate() {}

    render() {
        if (!this.root || this.rendered) return;
        this.rendered = true;

        const panel = document.createElement("div");
        panel.className = "ophf-aboutPanel";

        const intro = document.createElement("section");
        intro.className = "ophf-aboutIntro";

        const kicker = document.createElement("p");
        kicker.className = "ophf-aboutKicker";
        kicker.textContent = "About OPAHiFi";

        const title = document.createElement("h2");
        title.className = "ophf-aboutTitle";
        title.textContent = "Dance thru the Meltdown";

        const deck = document.createElement("p");
        deck.className = "ophf-aboutDeck";
        deck.textContent = "A loud-minded manifesto about overflow, perspective, ascension, and turning static into motion.";

        intro.appendChild(kicker);
        intro.appendChild(title);
        intro.appendChild(deck);

        const accordions = document.createElement("div");
        accordions.className = "ophf-aboutAccordions";

        OpaHifiAboutPage.sections.forEach((section) => {
            const details = document.createElement("details");
            details.className = "ophf-aboutSection";
            if (section.open) details.open = true;

            const summary = document.createElement("summary");
            summary.className = "ophf-aboutSummary";
            summary.textContent = section.title;

            const body = document.createElement("div");
            body.className = "ophf-aboutBody";

            section.body.forEach((block) => {
                if (block.type === "paragraph") {
                    const p = document.createElement("p");
                    p.className = "ophf-aboutParagraph";
                    p.textContent = block.text;
                    body.appendChild(p);
                    return;
                }

                if (block.type === "list") {
                    const ul = document.createElement("ul");
                    ul.className = "ophf-aboutList";
                    block.items.forEach((item) => {
                        const li = document.createElement("li");
                        li.className = "ophf-aboutListItem";
                        li.textContent = item;
                        ul.appendChild(li);
                    });
                    body.appendChild(ul);
                }
            });

            details.appendChild(summary);
            details.appendChild(body);
            accordions.appendChild(details);
        });

        panel.appendChild(intro);
        panel.appendChild(accordions);
        this.root.appendChild(panel);
    }
}

window.OpaHifiAboutPage = OpaHifiAboutPage;
