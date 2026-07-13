// enemies.js — enemy definitions, Reach Out tables, and troops.
//
// Every regular enemy is a sad little doodle warped by the Smudge; each can be
// resolved peacefully via Reach Out. calmNeed = hearts to fill; hearts land at
// most one per round, only while the doodle is listening (emotion shifted away
// from its distressed default — see battle.js doReach for the storm gate).
// reach option: { label, good, text } — text is what happens.
// Bosses: rallyText announces the second wind below half HP.

export const ENEMIES = {
  sniffle: {
    name: "Sniffle", img: "en_sniffle",
    hp: 30, atk: 10, def: 3, spd: 6, emotion: "gloomy",
    intro: "Sniffle drips quietly. It looks like it's been crying for days.",
    acts: [
      { kind: "attack", mult: 1.0, msg: "{e} sneezes a storm of soggy confetti!" },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} sobs. The sadness is contagious..." },
      { kind: "idle", msg: "{e} hiccups and wobbles in place." },
    ],
    calmNeed: 2,
    reach: [
      { label: "Offer a tissue", good: true, text: "Sniffle takes the tissue with both nubs. It blows its button nose. HONK." },
      { label: "Pat gently", good: true, text: "You pat the soggy little ghost. It leans into your hand." },
      { label: "Stare", good: false, text: "You stare. Sniffle cries harder. Oh no." },
    ],
    peaceText: "Sniffle smiles a tiny wet smile, folds itself into a neat square, and drifts away.",
    reward: { item: "cookie" },
  },
  scribble: {
    name: "Scribbles", img: "en_scribble",
    hp: 41, atk: 13, def: 4, spd: 12, emotion: "grumpy",
    intro: "Scribbles bristles like static. Something in its tangle hurts.",
    acts: [
      { kind: "attack", mult: 1.1, msg: "{e} ricochets off your head!" },
      { kind: "attack", mult: 0.8, msg: "{e} swats with a frazzled tail!" },
      { kind: "emotion", target: "self", emotion: "grumpy", msg: "{e} gets itself even more worked up!" },
    ],
    calmNeed: 2,
    reach: [
      { label: "Untangle a line", good: true, text: "You gently pull one loose line free. Scribbles untenses, just a little." },
      { label: "Hum softly", good: true, text: "You hum. The tangle slows its vibrating to listen." },
      { label: "Poke it", good: false, text: "You poke the tangle. Your finger gets stuck. Everyone is upset." },
    ],
    peaceText: "Scribbles unravels into one long, relieved line, then curls up into a tidy ball of yarn and rolls off, purring.",
    reward: { item: "juice" },
  },
  thornbud: {
    name: "Thornbud", img: "en_thornbud",
    hp: 56, atk: 15, def: 8, spd: 4, emotion: "grumpy",
    intro: "Thornbud refuses to bloom. It glares at you, arms crossed.",
    acts: [
      { kind: "attack", mult: 1.2, msg: "{e} flings a fistful of thorns!" },
      { kind: "defend", msg: "{e} curls its petals tighter." },
      { kind: "emotion", target: "player", emotion: "grumpy", msg: "{e} grumbles something so rude you can't help getting mad." },
    ],
    calmNeed: 3,
    reach: [
      { label: "Compliment its thorns", good: true, text: "\"Those are excellent thorns,\" you say. Thornbud pretends not to care. Its petals loosen slightly." },
      { label: "Water it", good: true, text: "You share your juice box. Thornbud drinks angrily. Then less angrily." },
      { label: "Yank a petal", good: false, text: "You yank. OW. Bad idea for everyone involved." },
    ],
    peaceText: "Thornbud hmphs, turns away... and blooms when it thinks you can't see. It's a magnificent flower.",
    reward: { item: "cookie" },
  },
  buttoncrab: {
    name: "Clasp", img: "en_buttoncrab",
    hp: 62, atk: 16, def: 10, spd: 7, emotion: "gloomy",
    intro: "Clasp scuttles sideways, trailing loose threads. It's coming unsewn.",
    acts: [
      { kind: "attack", mult: 1.0, msg: "{e} pinches with a safety-pin claw!" },
      { kind: "defend", msg: "{e} hides under its button." },
      { kind: "attack", mult: 1.3, msg: "{e} panics and does a spinning pinch attack!" },
    ],
    calmNeed: 3,
    reach: [
      { label: "Sew the loose thread", good: true, text: "You tuck the loose thread back through a buttonhole. Clasp sighs with its whole shell." },
      { label: "Wave hello", good: true, text: "You wave. Clasp waves back with both claws, then gets embarrassed." },
      { label: "Snip the thread", good: false, text: "NO. WRONG. Clasp clutches its unraveling side, horrified." },
    ],
    peaceText: "Clasp, freshly mended, does a happy sideways dance and burrows into the felt sand.",
    reward: { item: "juice" },
  },
  inklet: {
    name: "Inklet", img: "en_inklet",
    hp: 53, atk: 15, def: 4, spd: 8, emotion: "gloomy",
    intro: "A little blob of the Smudge... but it's reaching up at you. It just wants to be held.",
    acts: [
      { kind: "attack", mult: 1.0, msg: "{e} splashes cold ink on you!" },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} looks up at you. Its eyes are so empty it makes your chest hurt." },
      { kind: "idle", msg: "{e} wobbles. A single drop rolls down its side." },
    ],
    calmNeed: 2,
    reach: [
      { label: "Pick it up", good: true, text: "It's freezing cold. You hold it anyway. It gets a little warmer." },
      { label: "Show it a doodle", good: true, text: "You draw a tiny sun and show it. The Inklet presses against the drawing." },
      { label: "Shoo it", good: false, text: "It doesn't leave. It just droops." },
    ],
    peaceText: "The Inklet glows faintly from inside, turns a deep friendly blue, and hops away leaving tiny flower-shaped ink prints.",
    reward: { item: "cookie" },
  },


  // ------------------------------------------------- Eraser Dunes (denial)
  fine: {
    name: "Fine", img: "en_fine",
    hp: 58, atk: 16, def: 5, spd: 9, emotion: "giggly",
    intro: "Fine holds up a smiling mask on a stick. Behind it, two real eyes are not smiling at all.",
    acts: [
      { kind: "attack", mult: 1.0, msg: "{e} bonks you with the mask stick! \"EVERYTHING'S GREAT!\"" },
      { kind: "emotion", target: "self", emotion: "giggly", msg: "{e} laughs a laugh with no bottom to it." },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e}'s real eyes look at you over the mask. Your chest goes heavy." },
    ],
    calmNeed: 3,
    reach: [
      { label: "\"You can put it down.\"", good: true, text: "The mask dips an inch. The real face is tired and small and much better." },
      { label: "Sit with it", good: true, text: "You sit down next to Fine and say nothing. The mask arm slowly gets tired." },
      { label: "Peek behind the mask", good: true, text: "You don't grab. You just peek. Fine lets you. That's new for both of you." },
      { label: "\"Nice smile!\"", good: false, text: "The mask snaps back up, brighter and worse. \"THANKS!! EVERYTHING'S GREAT!!\"" },
    ],
    peaceText: "Fine lowers the mask all the way, has one honest little cry, and folds the stick into a walking cane. It waves goodbye with its actual face.",
    reward: { item: "cookie" },
  },
  blanket: {
    name: "Blanket Bunny", img: "en_blanket",
    hp: 60, atk: 15, def: 6, spd: 7, emotion: "gloomy",
    intro: "Blanket Bunny keeps looking over its shoulder at the half of itself that isn't there anymore.",
    acts: [
      { kind: "attack", mult: 1.1, msg: "{e} thumps with its one drawn foot!" },
      { kind: "defend", msg: "{e} tries to hide its missing half behind its ears." },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} whispers: \"do you remember the rest of me? anyone?\"" },
    ],
    calmNeed: 3,
    reach: [
      { label: "Describe its tail", good: true, text: "\"Round. Fluffy. Cotton-white,\" you say, like you can see it. The faint pencil lines get braver." },
      { label: "Hold the faded paw", good: true, text: "You hold the paw that's only outline. It squeezes back. Outlines can do that, apparently." },
      { label: "Draw one line back", good: true, text: "You re-draw a single line of its hip, slow and careful. It watches like it's remembering how to be." },
      { label: "\"It's gone.\"", good: false, text: "The pencil lines go fainter. Wrong thing. Very wrong thing." },
    ],
    peaceText: "Blanket Bunny looks over its shoulder one more time... and its missing half is a little less missing. It hops off, uneven and alive.",
    reward: { item: "juice" },
  },
  // ------------------------------------------------- If-Then Works (bargaining)
  ticktick: {
    name: "Tick-Tick", img: "en_ticktick",
    hp: 66, atk: 17, def: 6, spd: 14, emotion: "grumpy",
    intro: "Tick-Tick vibrates with terrible urgency. It is late for something that already happened.",
    acts: [
      { kind: "attack", mult: 1.2, msg: "{e} rings both bell-ears right in your face!" },
      { kind: "attack", mult: 0.9, msg: "{e} swats with its pendulum tail!" },
      { kind: "emotion", target: "player", emotion: "grumpy", msg: "{e} ticks louder and louder. HURRY. HURRY. Your teeth clench." },
    ],
    calmNeed: 3,
    reach: [
      { label: "\"There's time.\"", good: true, text: "The ticking stumbles. \"...there is?\" There is. There's all of it, in fact." },
      { label: "Breathe on the count", good: true, text: "You breathe in for four ticks, out for four. Tick-Tick's pendulum slows to match." },
      { label: "Cover the bells, gently", good: true, text: "You rest your palms on its bell-ears. Warm quiet. It leans into it." },
      { label: "Check the time", good: false, text: "You look at its face like a clock. It shrieks - THAT'S ALL ANYONE DOES." },
    ],
    peaceText: "Tick-Tick winds all the way down, sighs like a settling house, and starts ticking again - slow, even, unhurried. Bedtime-story speed.",
    reward: { item: "juice" },
  },
  redo: {
    name: "Redo Mouse", img: "en_redo",
    hp: 72, atk: 16, def: 12, spd: 8, emotion: "gloomy",
    intro: "Redo Mouse pushes its little cart around the same dotted circle, wearing the path into a groove.",
    acts: [
      { kind: "attack", mult: 1.1, msg: "{e} runs you over with the eraser cart!" },
      { kind: "defend", msg: "{e} hides under the cart. The wheels keep turning." },
      { kind: "attack", mult: 1.3, msg: "{e} does the loop FASTER, like that will change where it goes!" },
    ],
    calmNeed: 3,
    reach: [
      { label: "Step into the circle", good: true, text: "You stand on the dotted line. The mouse stops. Nobody ever stood there before." },
      { label: "\"One more lap won't fix it.\"", good: true, text: "The mouse looks at its groove, then at you. Its key slows half a turn." },
      { label: "Point somewhere new", good: true, text: "You point off the path, at nothing in particular. The mouse stares like you invented direction." },
      { label: "Push the cart for it", good: false, text: "You push. The mouse panics - the loop must be done RIGHT, which means BY IT, FOREVER." },
    ],
    peaceText: "Redo Mouse tips its cart over on purpose. Erasers everywhere. It steps over the dotted line like a border, and just... walks. Anywhere. Wobbly with freedom.",
    reward: { item: "sandwich" },
  },

  // ------------------------------------------------------------- bosses
  tangle: {
    name: "TANGLE", img: "boss_tangle", boss: true,
    hp: 112, atk: 15, def: 6, spd: 9, emotion: "grumpy",
    intro: "TANGLE roars like a scribbled-out sentence. Every angry word ever left unsaid, wadded into one.",
    acts: [
      { kind: "attack", mult: 1.2, msg: "{e} lashes out with a whip of jagged lines!" },
      { kind: "attack", mult: 0.9, targets: "all", msg: "{e} rains snapped pencil points on everyone!" },
      { kind: "emotion", target: "player", emotion: "grumpy", msg: "{e} shrieks words that aren't words. Your ears burn. Your fists clench." },
      { kind: "emotion", target: "self", emotion: "grumpy", msg: "{e} winds itself tighter and TIGHTER." },
    ],
    calmNeed: 5,
    reach: [
      { label: "\"I'm listening.\"", good: true, text: "The scribbles slow. Somewhere inside, something is trying to talk." },
      { label: "Find the loose end", good: true, text: "You spot one trembling line sticking out, and hold it steady." },
      { label: "Breathe with it", good: true, text: "You breathe in... and out. Slow. The scribbles start to match your rhythm without meaning to." },
      { label: "Yell back", good: false, text: "You yell. It yells LOUDER. This is going nowhere." },
    ],
    rallyText: "TANGLE knots itself into one furious fist. It is not done being heard.",
    peaceText: "The scribbles loosen, breathe out, and settle into a page of neat, calm handwriting. It almost looks like an apology.",
    winText: "TANGLE frays apart into drifting pencil shavings. The angry words are quiet now, one way or another.",
  },
  swan: {
    name: "THE PAPER SWAN", img: "boss_swan", boss: true,
    hp: 140, atk: 18, def: 6, spd: 7, emotion: "gloomy",
    intro: "The Paper Swan bows its creased neck. It guards its crumpled wing the way you guard a memory that hurts.",
    acts: [
      { kind: "attack", mult: 1.1, msg: "{e} slices the air with a razor-fold wing!" },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} sings one low paper note. It sounds like missing someone." },
      { kind: "attack", mult: 1.4, msg: "{e} dives in a rush of torn feathers!" },
      { kind: "defend", msg: "{e} folds itself smaller, hiding the crumpled wing." },
    ],
    calmNeed: 6,
    reach: [
      { label: "Smooth a crease", good: true, text: "You smooth one crease with your thumb. The Swan shivers but lets you." },
      { label: "\"It still flies?\"", good: true, text: "You ask about the crumpled wing. The Swan lifts it, trembling. It does. Differently, but it does." },
      { label: "Sing to her", good: true, text: "You sing the fireflies' little tune, off-key. The Swan's folded neck lifts, remembering the words." },
      { label: "Look away", good: false, text: "You can't look at the broken part. The Swan folds it out of sight. Nothing gets better." },
    ],
    rallyText: "The Swan spreads BOTH wings - even the crumpled one - and the air goes sharp with paper edges.",
    peaceText: "The Swan unfolds - all the way, fearlessly - and refolds itself around its dents. It flies. Crooked and beautiful.",
    winText: "The Swan comes apart into clean white sheets that drift down like snow. On one of them, a child has drawn two kids on swings.",
  },
  keeper: {
    name: "THE BELL KEEPER", img: "boss_keeper", boss: true,
    hp: 135, atk: 17, def: 6, spd: 6, emotion: "gloomy",
    intro: "The Bell Keeper holds up a small silver bell. When it rings, you flinch before you even know why.",
    acts: [
      { kind: "attack", mult: 1.2, msg: "{e} strikes with a stiff porcelain hand!" },
      { kind: "bell", msg: "{e} rings the little bell. RING-RING. The sound goes through you like cold water." },
      { kind: "attack", mult: 1.0, targets: "all", msg: "{e} sweeps its lantern beam across everyone!" },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} looks at you with painted eyes full of sorry." },
    ],
    calmNeed: 6,
    reach: [
      { label: "Listen to the bell", good: true, text: "You make yourself listen, all the way to the end of the ring. It's just a bell. It was always just a bell." },
      { label: "\"It wasn't the bell's fault.\"", good: true, text: "The Keeper's cracked face tilts. Its grip on the bell softens." },
      { label: "Hold its gloved hand", good: true, text: "You take the stiff porcelain hand. It's cold, then a little less cold. Nobody blames a hand for ringing a warning." },
      { label: "Cover your ears", good: false, text: "You cover your ears. The ringing gets louder INSIDE." },
    ],
    rallyText: "The Bell Keeper's cracks glow faintly. It raises the little bell with both hands now.",
    peaceText: "The Bell Keeper kneels and offers you the bell. It's tiny in your hand. It rings once, clear and harmless, like a bicycle passing safely by.",
    winText: "The Keeper bows, cracks spreading, and comes apart into white sand. The little bell lands softly on top. It doesn't ring.",
  },

  smoother: {
    name: "THE SMOOTHER", img: "boss_smoother", boss: true,
    hp: 170, atk: 18, def: 7, spd: 8, emotion: "giggly",
    intro: "The Smoother smiles with its whole soft face. \"NOTHING IS WRONG HERE,\" it explains, kindly. Inside its belly, faint erased doodles drift like fish.",
    acts: [
      { kind: "attack", mult: 1.1, msg: "{e} pats you flat with a soft enormous hand. It means well. It says so." },
      { kind: "attack", mult: 0.9, targets: "all", msg: "{e} sweeps its dusting brush. The air fills with pink crumbs of things that used to be drawn!" },
      { kind: "emotion", target: "self", emotion: "giggly", msg: "{e} smiles harder. \"SEE? ALL BETTER. ALL SMOOTH.\"" },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} offers, gently: \"I could smooth yours too. The hurting picture. You'd never have to look again.\"" },
    ],
    calmNeed: 6,
    reach: [
      { label: "\"It WAS drawn.\"", good: true, text: "The doodles in its belly press against the pale skin, like they heard. The smile flickers." },
      { label: "Name the erased dog", good: true, text: "\"There was a dog. Right there. It had a spot over one eye.\" The Smoother's brush hand trembles." },
      { label: "\"Smooth isn't healed.\"", good: true, text: "The Smoother opens its eyes for the first time. They are very old and very tired of smiling." },
      { label: "Ask it to erase the pain", good: false, text: "It brightens terribly and raises the brush. Wrong. WRONG. You want to remember - you want to WANT to remember." },
    ],
    rallyText: "The Smoother's smile goes wide and thin as paper. \"LAST OFFER,\" it says, still kind. \"BLANK IS PAINLESS.\"",
    peaceText: "The Smoother exhales a lifetime of held smiles. The ghost doodles pour out of it like fish returning to a river, faint but swimming. \"...they stayed,\" it whispers. \"I rubbed and rubbed, and they stayed.\" It looks almost happy. Actually happy, this time.",
    winText: "The Smoother comes apart into a drift of pink crumbs. The ghost doodles it held escape upward like bubbles, and somewhere in the dunes, a faint dog barks once.",
  },
  oracle: {
    name: "THE WIND-UP ORACLE", img: "boss_oracle", boss: true,
    hp: 160, atk: 19, def: 7, spd: 9, emotion: "gloomy",
    intro: "The Wind-Up Oracle's key turns slowly, slowly. \"WELCOME BACK,\" it says, though you have never been here. \"EVERYONE COMES BACK. REWIND?\"",
    acts: [
      { kind: "attack", mult: 1.2, msg: "{e} snaps its tin fingers - the moment replays, and the flinch hits you fresh!" },
      { kind: "attack", mult: 0.9, targets: "all", msg: "{e} opens the stage curtains. Everyone watches the little paper figures freeze mid-step. It costs something every time." },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e} offers the hourglass where the sand falls up. \"ONE MORE IF. ON THE HOUSE.\"" },
      { kind: "defend", msg: "{e} winds its own key tight and waits. Patience is its whole body." },
    ],
    calmNeed: 7,
    reach: [
      { label: "\"No trade.\"", good: true, text: "The Oracle's smile doesn't move, but the key stutters. Nobody has ever said no before." },
      { label: "Watch the play to the END", good: true, text: "You make yourself watch the whole moment - past the freeze, to the after. The Oracle watches YOU instead. It has never seen the after." },
      { label: "\"Ifs aren't doors.\"", good: true, text: "\"They're WINDOWS,\" the Oracle snaps - the first crack in its voice. Windows you can't climb through. It knows. It's known for ages." },
      { label: "Wind its key for it", good: true, text: "You turn the key one gentle notch - not to rewind. Just so it doesn't run down alone. Its glass-bead eyes go soft." },
      { label: "Ask what it would cost", good: false, text: "The Oracle names the price. It's exactly what you have. It's ALWAYS exactly what you have. The booth gets colder." },
    ],
    rallyText: "The Oracle's key spins backward on its own. Every gauge in the theatre swings to the same moment. \"FINAL SHOWING,\" it announces.",
    peaceText: "The Oracle takes the hourglass... and turns it the RIGHT way up. Sand falls down, the way time does. \"THE THEATRE IS CLOSING,\" it says, and sounds relieved, like a shopkeeper at the end of the longest day. The curtains close on the frozen moment, gently, like tucking it in.",
    winText: "The Oracle's key winds down and out. The booth folds flat, the tickets scatter, and the little paper figures on the stage finally finish their step, walk off, and are gone.",
  },
  unfinished: {
    name: "THE UNFINISHED ONE", img: "boss_unfinished", boss: true,
    hp: 330, atk: 25, def: 10, spd: 10, emotion: "grumpy", rotate: true, calmNeed: 10,
    intro: "Something enormous uncurls: half of it magnificent, half of it construction lines. The finished eye fixes on you. \"YOU STOPPED,\" it says. \"YOU NEVER EVEN NAMED ME.\"",
    acts: [
      { kind: "attack", mult: 1.3, msg: "{e} strikes with the finished claw - beautiful and precise!" },
      { kind: "attack", mult: 0.9, targets: "all", msg: "{e} sweeps its sketch-wing. The construction lines cut like paper edges!" },
      { kind: "emotion", target: "self", emotion: "grumpy", msg: "{e} rakes its own scaffolding. \"WHY DID YOU START ME IF YOU WEREN'T GOING TO FINISH?\"" },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "{e}'s unfinished eye - the circle with the cross - looks at you. It can't see. It's never seen." },
    ],
    reach: [
      { label: "\"You scared me.\"", good: true, text: "The truth. You drew it too big, too real, and eleven-year-old you slammed the book. It blinks its good eye. It never considered being TOO MUCH." },
      { label: "Name it, finally", good: true, text: "\"EMBER,\" you say. The name you almost gave it. The scaffolding shivers like it heard music." },
      { label: "Trace one line, no eraser", good: true, text: "You finish one line of its wing freehand, wobbly, honest. It holds absolutely still, the way you hold still for someone brave." },
      { label: "\"Unfinished isn't unloved.\"", good: true, text: "Both eyes - the seeing and the unseeing - point at you. Somewhere inside, a pencil line un-tenses." },
      { label: "Promise to redraw it", good: false, text: "\"REDRAW?\" it roars. It doesn't want to be REPLACED. It wants to be CONTINUED. The scaffolding bristles." },
    ],
    rallyText: "The Unfinished One rears to its full height - and for one second the sketch half fills itself in with pure imagination, vast and burning. \"THIS IS WHAT I COULD HAVE BEEN.\"",
    peaceText: "Ember settles. The construction lines don't fill in - but they stop trembling, and that's not the same as unfinished. That's UNDERWAY. It presses its huge finished cheek against your whole body, once, carefully. \"KEEP THE BOOK OPEN,\" it says. \"I LIKE HEARING YOU DRAW.\"",
    winText: "The Unfinished One comes apart the way a sketch does - line by line, in reverse order of being loved. The last thing to fade is the finished eye, still looking at you. You finished something today. It isn't the feeling you expected.",
  },
  smudge: {
    name: "THE SMUDGE", img: "boss_smudge", boss: true, final: true,
    hp: 999, atk: 16, def: 99, spd: 1, emotion: "neutral",
    immune: true, // attacks are soaked; only Reach Out works
    intro: "The Smudge rises like a wave that never crashes. Deep inside it, someone unfinished is reaching out.",
    acts: [
      { kind: "attack", mult: 0.9, targets: "all", msg: "Cold ink washes over everyone. It doesn't hate you. That's the worst part." },
      { kind: "emotion", target: "player", emotion: "gloomy", msg: "The ink whispers with your own voice: \"It was your fault.\"" },
      { kind: "idle", msg: "The Smudge waits. It has all the time you refuse to spend." },
    ],
    calmNeed: 4,
    reachStory: true, // options unlock from collected pages, in order
    reach: [
      { label: "Remember the fort", good: true, page: 1, text: "The fairy lights. The flashlight. Two kids drawing one world. The ink flinches from the warmth of it." },
      { label: "Remember the swings", good: true, page: 2, text: "The sky. The swan-shaped cloud. Ren yelling \"WE'RE FLYING!\" The ink thins. The outline inside is clearer now." },
      { label: "Remember the promise", good: true, page: 3, text: "Two hooked pinkies over an open book. \"Before summer ends.\" A promise doesn't stop being one because it got hard. The ink trembles." },
      { label: "Say the true thing", good: true, page: 4, text: "\"I said it should've been you who moved away. I didn't mean it. I'm sorry. I'M SORRY.\" The ink goes still." },
    ],
    peaceText: "The Smudge doesn't shatter. It settles - like ink finally drying - into the shape of the last page. Waiting for an ending.",
    winText: "",
  },
};

export const TROOPS = {
  t_sniffle: ["sniffle"],
  t_scribble: ["scribble"],
  t_meadow_pair: ["sniffle", "scribble"],
  t_thornbud: ["thornbud"],
  t_woods_pair: ["thornbud", "sniffle"],
  t_crab: ["buttoncrab"],
  t_bay_pair: ["buttoncrab", "scribble"],
  t_inklet: ["inklet"],
  t_inklet_pair: ["inklet", "inklet"],
  t_boss_tangle: ["tangle"],
  t_boss_swan: ["swan"],
  t_boss_keeper: ["keeper"],
  t_boss_smudge: ["smudge"],
  t_fine: ["fine"],
  t_dunes_pair: ["fine", "blanket"],
  t_blanket: ["blanket"],
  t_ticktick: ["ticktick"],
  t_works_pair: ["ticktick", "redo"],
  t_redo: ["redo"],
  t_boss_smoother: ["smoother"],
  t_boss_oracle: ["oracle"],
  t_boss_unfinished: ["unfinished"],
};
