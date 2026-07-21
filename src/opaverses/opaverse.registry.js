import { ohSongModule as ohFullMindnessModule } from "./full-mindness/index.js";
import { ohSongModule as ohHallucinatingDumDumModule } from "./hallucinating-dum-dum/index.js";
import { ohSongModule as ohYeahLetsDoBrunchModule } from "./yeah-lets-do-brunch/index.js";
import { ohSongModule as ohSplendaLoveRabbitHellModule } from "./splenda-love-rabbit-hell/index.js";
import { ohSongModule as ohBelieveTheTruthFairyModule } from "./believe-the-truth-fairy/index.js";
import { ohSongModule as ohOldLoveStoryModule } from "./old-love-story/index.js";
import { ohSongModule as ohGlittaaPhoenixModule } from "./glittaa-phoenix/index.js";
import { ohSongModule as ohNotYourBotBeepSleepModule } from "./not-your-bot-beep-sleep/index.js";
import { ohSongModule as ohDoThePanicarenaModule } from "./do-the-panicarena/index.js";
import { ohSongModule as ohWellwolfHowlLehluyaModule } from "./wellwolf-howl-lehluya/index.js";
import { ohSongModule as ohOpaPaPaPartyModule } from "./opa-pa-pa-party/index.js";

export const OH_OPAVERSE_MODULES = Object.freeze([
  ohFullMindnessModule,
  ohHallucinatingDumDumModule,
  ohYeahLetsDoBrunchModule,
  ohSplendaLoveRabbitHellModule,
  ohBelieveTheTruthFairyModule,
  ohOldLoveStoryModule,
  ohGlittaaPhoenixModule,
  ohNotYourBotBeepSleepModule,
  ohDoThePanicarenaModule,
  ohWellwolfHowlLehluyaModule,
  ohOpaPaPaPartyModule
]);

export const OH_JOURNEY_MODULES = Object.freeze(OH_OPAVERSE_MODULES.slice(0, 3));
