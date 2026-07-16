// script.js — every cutscene, interaction and story beat in the game.
//
// Command reference (executed by src/cutscene.js):
//   { t:"say", who, face, text }        dialogue line (who: mira|biscuit|wisp|ren|name string|null)
//   { t:"choice", options:[{label, then:[]}] }
//   { t:"if", flag, is, then:[], else:[] }
//   { t:"iflt", key, value, then:[], else:[] }   numeric state compare (state[key] < value)
//   { t:"flag", key, value }
//   { t:"give", item, n }  { t:"take", item, n }
//   { t:"sfx", name }  { t:"bgm", name }  { t:"stopbgm" }
//   { t:"fade", ms }  { t:"unfade", ms }  { t:"wait", ms }
//   { t:"tp", map, x, y, facing }
//   { t:"battle", troop, flagWin, onWin:[], onPeace:[], canFlee }
//   { t:"cg", img, lines:[] }
//   { t:"heal" }  { t:"join", member }  { t:"page", n }
//   { t:"save" }  { t:"ending", which }  { t:"shake", ms }

const n = (text) => ({ t: "say", who: null, text });
const mira = (face, text) => ({ t: "say", who: "mira", face, text });
const say = (who, text) => ({ t: "say", who, text });

export const SCRIPTS = {
  // ================================================================ INTRO
  s_intro: [
    { t: "fade", ms: 1 },
    { t: "bgm", name: "bgm_real" },
    { t: "unfade", ms: 2000 },
    n("Tuesday. Or Wednesday. The days have stopped introducing themselves.\nSummer holidays make every day the same shape."),
    n("Mira's room used to be the loudest place in the building.\nNow the loudest thing in it is the refrigerator downstairs."),
    mira("neutral", "...I'm going to bed."),
    n("(Move with ARROW KEYS or WASD. Press Z or ENTER to look at things.\nThe bed is the way out of today.)"),
  ],
  s_bed: [
    { t: "if", flag: "intro_done", is: true, then: [
      n("The blankets are still warm. The Sketchbook World is waiting on the other side."),
      { t: "choice", options: [
        { label: "Go to sleep", then: [
          { t: "sfx", name: "sfx_page" },
          { t: "fade", ms: 1200 },
          { t: "stopbgm" },
          { t: "wait", ms: 700 },
          { t: "tp", map: "blank_page", x: 9, y: 8, facing: "down" },
          { t: "unfade", ms: 1200 },
        ] },
        { label: "Not yet", then: [] },
      ] },
    ], else: [
      n("You crawl under the covers and squeeze your eyes shut.\nYou know the trick by now. Count backwards from one hundred, slow,\nand be asleep before the counting reaches that day."),
      { t: "flag", key: "intro_done", value: true },
      { t: "sfx", name: "sfx_page" },
      { t: "fade", ms: 1500 },
      { t: "stopbgm" },
      { t: "wait", ms: 800 },
      { t: "tp", map: "blank_page", x: 9, y: 8, facing: "down" },
      { t: "unfade", ms: 1500 },
    ] },
  ],
  s_desk: [
    { t: "if", flag: "intro_done", is: true, then: [
      n("The real sketchbook. The one with two names on the cover.\nYou still can't open it. Not out here."),
    ], else: [
      n("Your desk. A sketchbook lies on it, closed.\nThere's a sticker on the cover: two stick figures holding one giant crayon.\nYou look away fast, like it's bright."),
    ] },
  ],
  s_window: [
    n("Three floors down, the street does street things.\nSomewhere past the rooftops is the hospital. You can't see it from here.\nYou've checked."),
  ],
  s_shelf: [
    n("Comics, a dried-out slime, a swimming trophy for 'participation'.\nAnd a gap where the walkie-talkie used to be. Ren has the other one."),
  ],
  s_picture: [
    { t: "if", flag: "interlude2", is: true, then: [
      n("The pencil drawing above the bed: a tree with a little house in its branches.\nRen drew the tree. You drew the house. You look at it properly for the\nfirst time in weeks, and it looks back, patient as ever."),
    ], else: [
      n("A drawing hangs above the bed - a tree with a tiny house in it.\nThe treehouse you two were absolutely, definitely going to build someday.\nYou keep meaning to take it down. You keep not doing it."),
    ] },
  ],
  s_chair_desk: [
    n("Your drawing chair. One leg is shorter than the others, so it rocks\nwhen you lean into a good line. Ren called it 'the metronome'."),
  ],
  s_bedroom_exit: [
    { t: "if", flag: "true_ending_walk", is: true, then: [
      { t: "fade", ms: 600 }, { t: "tp", map: "real_hall", x: 12, y: 2, facing: "down" }, { t: "unfade", ms: 600 },
    ], else: [
      { t: "if", flag: "intro_done", is: true, then: [
        { t: "fade", ms: 600 }, { t: "tp", map: "real_hall", x: 12, y: 2, facing: "down" }, { t: "unfade", ms: 600 },
      ], else: [
        n("It's late. There's nothing out there tonight except a hallway\nthat still has both your shoe prints by the door."),
      ] },
    ] },
  ],

  // ================================================================ REAL HALL
  s_hall_to_bedroom: [
    { t: "fade", ms: 600 }, { t: "tp", map: "real_bedroom", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_mom_door: [
    n("Mom's door, closed soft as a held breath.\nYou can hear the radio murmuring inside - she leaves it on\nso the apartment won't sound so empty."),
  ],
  s_hall_leftpic: [
    n("A framed drawing of a house with too many windows.\nYou made it when you were six. Mom framed it like it was art.\nIt is art, she'd say. Don't argue with the curator."),
  ],
  s_halfwall_pic: [
    n("A tiny frame on the half-wall: a pressed four-leaf clover.\nRen found it. Ren gave it away, same second, no hesitation.\nThat's just how Ren is. ...Is. You make yourself think IS."),
  ],
  s_teatable: [
    n("Two cups and a teapot, set out from force of habit.\nNobody drank from either."),
  ],
  s_fridge: [
    n("The fridge hums its one long note. Inside: a casserole from a neighbour,\nlabelled with a date, untouched. And one chocolate milk - Ren's brand.\nMom kept one in the door because Ren practically lived here.\nNobody has been able to throw it out."),
  ],
  s_kitchen: [
    { t: "if", flag: "interlude2", is: true, then: [
      n("A plate under plastic wrap, with a note in Mom's fast handwriting:\n'Ate at work. There's soup. I love you. We're okay.'\nThe 'we're okay' is underlined twice, like she's convincing both of you."),
    ], else: [
      n("The kettle is cold. Mom's shift ends after midnight again.\nThe fridge hums its one long note."),
    ] },
  ],
  s_tv: [
    n("The TV. Movie nights happened right here - one blanket, one bag of chips,\ntwo sets of elbows fighting over it.\nIt hasn't been on in weeks. The dark screen reflects the whole quiet room."),
  ],
  s_sofa: [
    { t: "if", flag: "interlude3", is: true, then: [
      n("Mom fell asleep on the sofa in her coat, phone still in her hand.\nYou put the blanket over her. She doesn't wake up.\nShe smells like hospitals. She was THERE. Visiting. Without you."),
      mira("gloomy", "...night, Mom."),
    ], else: [
      n("The sofa cushion still dips on the left, where two people used to\nfight over one bag of chips during movie night."),
    ] },
  ],
  s_photos: [
    { t: "if", flag: "interlude1", is: true, then: [
      n("You make yourself look this time.\nSchool fair. You and Ren, gap-toothed, holding a papier-mache volcano.\nSecond place. You both cried, then laughed about crying."),
      mira("gloomy", "...we were going to build a better one."),
    ], else: [
      n("Framed photos on the wall. Your eyes slide off them on purpose.\nLooking means remembering, and remembering has rules now."),
    ] },
  ],
  s_front_door: [
    { t: "if", flag: "true_ending_walk", is: true, then: [
      n("Your shoes. Your jacket. The door.\nIt's just a door. It was always just a door."),
      { t: "choice", options: [
        { label: "Go outside", then: [
          { t: "sfx", name: "sfx_door" },
          { t: "fade", ms: 1000 },
          { t: "tp", map: "real_street", x: 9, y: 11, facing: "up" },
          { t: "unfade", ms: 1400 },
        ] },
        { label: "Breathe first", then: [ mira("neutral", "One more breath. Okay.") ] },
      ] },
    ], else: [
    { t: "if", flag: "failed_walk_active", is: true, then: [
      n("Your shoes. Your jacket. The door.\nYou know where the hospital is. Everyone knows where the hospital is."),
      { t: "choice", options: [
        { label: "Go", then: [
          { t: "sfx", name: "sfx_door" },
          { t: "fade", ms: 1000 },
          { t: "tp", map: "real_street", x: 9, y: 11, facing: "up" },
          { t: "unfade", ms: 1400 },
          n("The summer street, too bright, too wide.\nOne crossing between you and the corner. One corner between you and it."),
        ] },
        { label: "Not today", then: [ mira("gloomy", "...the shoes go back by the door. They're good at waiting.") ] },
      ] },
    ], else: [
      { t: "if", flag: "interlude3", is: true, then: [
        n("A letter sits by the door, opened and read many times. From Ren's parents.\n'...visitors help, the doctors say. He'd want it to be you, Mira.'"),
        mira("gloomy", "...I can't. What if he wakes up and remembers what I said?"),
        n("The letter doesn't answer. Letters never do."),
      ], else: [
        n("The front door. Outside is the long summer street, and pity-faces,\nand the corner where you're not allowed to think about what happened.\nYou haven't gone out there without Mom in weeks."),
      ] },
    ] },
    ] },
  ],

  // ================================================================ BLANK PAGE
  s_blank_first: [
    { t: "bgm", name: "bgm_blank" },
    n("You land softly, the way you only land in dreams."),
    n("THE BLANK PAGE.\nIt goes on forever in every direction. Paper-white. Quiet as held breath."),
    { t: "if", flag: "blank_intro_done", is: true, then: [], else: [
      mira("neutral", "Okay. Same as every night. Lamp's here, cushion's here...\nWorld's still here."),
      say("???", "MIIIIIRAAAA!!"),
      n("Something small and white barrels across the page and skids to a stop:\na tissue ghost, dripping everywhere."),
      { t: "battle", troop: "t_sniffle", tutorial: true, flagWin: "blank_tut",
        onPeace: [ n("Sniffle bounces away across the page, leaving little wet dots... but it looked back at you twice. Something is scaring the doodles.") ],
        onWin: [ n("The little ghost comes apart into clean tissue squares. You feel bad. It was only scared - something in this world is scaring everything.") ] },
      mira("neutral", "The doodles never used to fight. Something's wrong with the Page."),
      n("Far to the south, where the paper darkens, a door-shaped smudge has appeared.\nIt wasn't there last night."),
      mira("gloomy", "...and THAT'S new. And bad. Definitely bad."),
      mira("neutral", "The Meadow first. If anyone knows what's going on, it's Sir Biscuit."),
      { t: "flag", key: "blank_intro_done", value: true },
      { t: "save" },
      n("(The warm lamp is a SAVE POINT. Doors lead to the drawn worlds.\nPress X or ESC for your pocket menu.)"),
    ] },
  ],
  s_lantern_save: [
    n("The little lamp glows like it's pleased to see you."),
    { t: "choice", options: [
      { label: "Rest and save", then: [
        { t: "heal" }, { t: "sfx", name: "sfx_save" }, { t: "save" },
        n("Warmth soaks into everyone's paper bones. Saved."),
      ] },
      { label: "Just warm your hands", then: [ n("Toasty.") ] },
    ] },
  ],
  s_cushion: [ n("The cushion has one job and it does it magnificently.") ],
  s_crayons: [ n("Someone's crayons, dropped mid-drawing. The sun-yellow one is missing.") ],
  // The battle guide book: found once in the hub, then carried as a key item —
  // choosing it in the pocket menu runs s_guide (see items.js `script`).
  s_guide_find: [
    n("A little book lies open on the paper floor: 'HOW TO TALK TO SAD DOODLES.'\nHalf the letters are yours. The other half are Ren's. You wrote it together,\nback when the worst monster in here was bedtime."),
    { t: "sfx", name: "sfx_confirm" },
    { t: "give", item: "guidebook" },
    { t: "flag", key: "guide_taken", value: true },
    n("You tuck the guide into your pocket. (Read it any time from POCKETS.)"),
  ],
  // Readable any time from the pockets; pages picked from a menu so players
  // can re-check one rule without re-reading the whole thing.
  s_guide: [
    n("'HOW TO TALK TO SAD DOODLES.' Half the letters are yours.\nThe other half are Ren's. You wrote it together, back when\nthe worst monster in here was bedtime."),
    { t: "choice", options: [
      { label: "Feelings beat feelings", then: [
        n("Page one. Three crayon faces chase each other in a circle:\nGIGGLY beats GRUMPY beats GLOOMY beats GIGGLY.\nHit a doodle with the feeling that beats its feeling and it lands HARDER."),
        n("Under that, in Ren's handwriting:\n'GIGGLY friends dodge sometimes. GRUMPY ones hit harder but get hit harder.\nGLOOMY ones curl up small - they take less, and ink comes back a drop a turn.'"),
      ] },
      { label: "How to reach out", then: [
        n("Page two. A doodle with a scribbled-out head, and the same doodle again,\nlistening. Under it: 'A doodle deep in a bad feeling CAN'T HEAR YOU.\nReach out once to break the storm - or change its mood with a skill - THEN talk.'"),
        n("'One heart a turn. That's as fast as anyone's heart un-hurts.\nSay something NEW each time - nobody wants the same comfort twice in a row.\nAnd if you say the WRONG thing... the storm comes back. Be brave. Be kind.'"),
        n("In the margin, in Ren's biggest letters: 'CHEER THEM UP!! a GIGGLY doodle\nlistens DOUBLE - two hearts a turn!! two of us say two DIFFERENT kind things\nin the same turn. (saying the same thing twice in a ROW is the only no-no -\ngoing back and forth between two things is fine, that's called a conversation.)'"),
        n("'but if you blow the cheer-up, the giggle goes WILD: it dodges and swings\nhard until the mood breaks. high risk. high friendship. - R.'"),
        n("At the bottom, small, in your handwriting:\n'Hearts also make them swing softer. Kindness is armor. - M.'"),
      ] },
      { label: "Staying un-torn", then: [
        n("Page three. A stick figure hiding behind a giant cookie. 'STEADY halves what\nhits you and breathes 2 ink back. Snacks work on friends, not on you-know-what.\nWisp's warm glow mends. Sir Biscuit's wall covers EVERYBODY.'"),
        n("'Warm lanterns save the story and mend the whole party.\nBig sad things get a SECOND WIND when they're half done - don't panic.\nThat's when they most need you to keep going.'"),
      ] },
      { label: "Charms & the journal", then: [
        n("A newer page, in your handwriting only. 'CHARMS: little braveries you can\nwear. One per friend. Choose a charm in POCKETS to pick who wears it.'"),
        n("'THE FRIEND JOURNAL (in POCKETS, third tab): every doodle we talk down\ngets a page. Ren would want ALL of them smiling. So do I now, I think.\nSomething big and unfinished is waiting on it.'"),
      ] },
      { label: "Put it down", then: [] },
    ] },
  ],
  s_to_meadow: [
    { t: "fade", ms: 600 }, { t: "sfx", name: "sfx_door" },
    { t: "tp", map: "meadow_1", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_to_woods: [
    { t: "iflt", key: "pages", value: 1, then: [
      n("The blue paper door is folded shut, tight as a secret.\nA note in crayon: 'STUCK. SMUDGE JAMMED THE FOLDS. - management'"),
      mira("neutral", "The Meadow first, then."),
    ], else: [
      { t: "fade", ms: 600 }, { t: "sfx", name: "sfx_door" },
      { t: "tp", map: "woods_1", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
    ] },
  ],
  s_to_bay: [
    { t: "iflt", key: "pages", value: 3, then: [
      n("The yellow door is swollen shut with ink. Through the keyhole you can\nhear the sea, going shhh, shhh, like it's comforting someone."),
    ], else: [
      { t: "fade", ms: 600 }, { t: "sfx", name: "sfx_door" },
      { t: "tp", map: "bay_1", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
    ] },
  ],
  s_to_dunes: [
    { t: "iflt", key: "pages", value: 2, then: [
      n("A pink door stands drawn on the page, soft as a whisper.\nA note in crayon: 'NOTHING WRONG IN HERE. NOTHING TO SEE. ALL SMOOTH. - mgmt'"),
      mira("neutral", "...that's a lot of nothing-wrong for one little door."),
    ], else: [
      { t: "fade", ms: 600 }, { t: "sfx", name: "sfx_door" },
      { t: "tp", map: "dunes_1", x: 10, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
    ] },
  ],
  s_to_works: [
    { t: "iflt", key: "pages", value: 4, then: [
      n("A brass-colored door, drawn with a ruler for once. From behind it,\nfaint ticking - hundreds of clocks, all disagreeing."),
    ], else: [
      { t: "fade", ms: 600 }, { t: "sfx", name: "sfx_door" },
      { t: "tp", map: "works_1", x: 10, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
    ] },
  ],
  s_to_depths: [
    { t: "iflt", key: "pages", value: 5, then: [
      n("The smudged door breathes cold on your face.\nIt isn't locked. It's just... more door than you can open yet."),
      mira("gloomy", "Not yet. I'm not... we're not ready. The pages. We need the pages."),
    ], else: [
      mira("neutral", "...Ready?"),
      say("biscuit", "Born ready. Baked ready, technically."),
      say("wisp", "I-I'll light the way. That's the one thing I know how to do."),
      { t: "if", flag: "stub_joined", is: true, then: [
        say("stub", "and if it's dark ALL the way down, good. dark is just paper\nthat hasn't met me yet."),
      ], else: [] },
      { t: "fade", ms: 900 }, { t: "sfx", name: "sfx_static" },
      { t: "tp", map: "depths_1", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 900 },
    ] },
  ],

  // ================================================================ MEADOW
  s_meadow_to_blank: [
    { t: "fade", ms: 600 }, { t: "tp", map: "blank_page", x: 2, y: 7, facing: "right" }, { t: "unfade", ms: 600 },
  ],
  s_meadow_to_meadow2: [
    { t: "fade", ms: 600 }, { t: "tp", map: "meadow_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_meadow2_to_meadow: [
    { t: "fade", ms: 600 }, { t: "tp", map: "meadow_1", x: 10, y: 1, facing: "down" }, { t: "unfade", ms: 600 },
  ],
  s_pond: [ n("The pond is one long blue spiral. The duck floats in the middle,\nsmiling the smile of someone who has never had a single problem.") ],
  s_smiley_flowers: [
    n("Three giant flowers grin down at you."),
    say("Flowers", "MIRA! MIRA! LOOK AT US! WE GREW!"),
    mira("giggly", "You grew SO much. Absolute units."),
    say("Flowers", "HEEHEE!!"),
    { t: "if", flag: "got_teacup", is: false, then: [
      say("Flowers", "OH! OH! ALSO! Something SHINY fell in the grass over by the big sun drawing! It goes ✨! We would fetch it but we are, you know. Planted."),
    ], else: [] },
  ],
  s_meadow_sign: [ n("The sign is blank. It's always been blank.\nRen said signs in dreams can't spell, so why embarrass them.") ],
  s_find_teacup: [
    { t: "sfx", name: "sfx_confirm" },
    n("Tucked in the tall grass: the CHIPPED TEACUP.\nDrawn with enormous care by someone whose hands were still learning."),
    { t: "give", item: "teacup" }, { t: "flag", key: "got_teacup", value: true },
  ],
  s_fight_sniffle: [
    { t: "battle", troop: "t_sniffle", flagWin: "meadow_en1" },
  ],
  s_fight_scribble: [
    { t: "battle", troop: "t_scribble", flagWin: "meadow_en2" },
  ],
  s_fight_meadow_pair: [
    { t: "battle", troop: "t_meadow_pair", flagWin: "meadow_en3" },
  ],
  s_cottage: [
    n("A cottage made of gingerbread, with icing gutters and a doorbell that\nplays a little fanfare. It smells like Christmas that never has to end."),
  ],
  s_picnic: [
    { t: "if", flag: "biscuit_joined", is: true, then: [
      { t: "if", flag: "meadow_boss_done", is: true, then: [
        n("The picnic blanket, saved. The teacups steam politely."),
      ], else: [
        { t: "ifhas", items: ["teacup", "cookieplate", "suncrayon"], then: [
          n("The tea party is set: teacup, cookies, and a freshly-drawn sun.\nAll that's missing is peace and quiet. The stain up north hisses."),
        ], else: [
          n("The great picnic blanket. Sir Biscuit's pride.\nIt looks wrong with the cups knocked over and the teapot hiding under a napkin."),
        ] },
      ] },
    ], else: [
      n("A picnic blanket with the cups knocked over.\nSomeone left in a hurry, or something arrived in one."),
    ] },
  ],
  s_meet_biscuit: [
    say("???", "HALT! Friend or... wait. WAIT. My eyes deceive me. MIRA OF THE TWO NAMES!"),
    n("A gingerbread knight thunders over, bottle-cap helmet askew, cape flapping."),
    say("biscuit", "You came BACK! The realm rejoices! I rejoice! The flowers already rejoiced, you probably heard them."),
    mira("giggly", "Hi, Sir Biscuit. You've got... jam? On your helmet?"),
    say("biscuit", "BATTLE JAM. Strawberry. Listen - dark tidings. A STAIN fell on the clearing three nights past, and it GROWS. It ate the gazebo. It ate the horseshoe pit. It growled at my cottage."),
    say("biscuit", "The doodles who touch it come back all wrong - crying, or scratching, or worse. I've been holding the line alone, but a knight without a party is just a cookie with anxiety."),
    mira("neutral", "Then let's fix it. Like we always fixed things."),
    say("biscuit", "THERE she is. Sir Biscuit of the Round Plate, at your service! Sword's a skewer, heart's a furnace, let's GO."),
    { t: "sfx", name: "sfx_victory" },
    // hide the NPC in the same beat the follower appears, or two Biscuits
    // stand around for the rest of the conversation
    { t: "flag", key: "biscuit_joined", value: true },
    { t: "join", member: "biscuit" },
    n("SIR BISCUIT joined the party!"),
    say("biscuit", "One thing first - the stain hates HAPPINESS. And nothing on this page is happier than a proper tea party. Fetch the old set, would you? The TEACUP is in the meadow grass. The COOKIE PLATE and the SUN CRAYON are around here somewhere."),
  ],
  s_find_plate: [
    { t: "sfx", name: "sfx_confirm" },
    n("Behind the daisies: the PLATE OF COOKIES. Drawn so lovingly\nyou can tell which cookie was meant to be whose."),
    { t: "give", item: "cookieplate" }, { t: "flag", key: "got_plate", value: true },
  ],
  s_find_crayon: [
    { t: "sfx", name: "sfx_confirm" },
    n("The SUN-YELLOW CRAYON, worn to a stub.\nEvery sun in this world came out of this crayon."),
    { t: "give", item: "suncrayon" }, { t: "flag", key: "got_crayon", value: true },
  ],
  s_meadow_stain: [
    { t: "if", flag: "biscuit_joined", is: false, then: [
      n("A blotch of gray ink spreads across the grass, hissing faintly.\nThe grass around it has gone colorless. You'd rather not touch it alone."),
    ], else: [
      { t: "ifhas", items: ["teacup", "cookieplate", "suncrayon"], then: [
        say("biscuit", "Tea's set! Sun's drawn! NOW, foul stain - behold what you're up against!"),
        n("You set the teacup, the plate, the little crayon sun.\nFor one second, the clearing remembers how to be warm."),
        n("The stain SCREAMS."),
        { t: "sfx", name: "sfx_static" }, { t: "shake", ms: 700 },
        n("It rears up off the grass, ink whirling into knots and knots into a shape -\nevery angry scribble ever scribbled, all at once."),
        { t: "battle", troop: "t_boss_tangle", boss: true, flagWin: "meadow_boss_done",
          onPeace: [
            say("biscuit", "...I'll be dipped in milk. You TALKED it down."),
            n("Where the stain was, a torn page lies in the clean grass."),
          ],
          onWin: [
            say("biscuit", "VICTORY! Sound the trumpets! ...I ate the trumpets. Sound the kazoo!"),
            n("Where the stain was, a torn page lies in the clean grass."),
          ] },
        { t: "page", n: 1 },
        { t: "cg", img: "cg_memory_1", lines: [
          "The page shows a blanket fort, drawn in crayon.",
          "Fairy lights. A flashlight. Two kids on their bellies, drawing one world into one sketchbook.",
          "You remember. It was raining that night. Ren invented Sir Biscuit and gave him YOUR laugh.",
          "\"When we're old,\" Ren said, \"like, twenty? We'll still do this.\"",
          "You pinky-swore. The fort held all night.",
        ] },
        mira("gloomy", "...I remember this. Why does remembering the GOOD one hurt?"),
        say("biscuit", "Because it's heavy, m'lady. Good memories are the heaviest things there are.\nThat's how you know they're real gold."),
        n("The world tilts. Morning is pulling on the edges of the dream..."),
        { t: "fade", ms: 1500 }, { t: "stopbgm" },
        { t: "flag", key: "interlude1", value: true },
        { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
        { t: "bgm", name: "bgm_real" },
        { t: "unfade", ms: 1500 },
        n("Wednesday. Or Thursday.\nBut for the first time in weeks, you look at the photos in the hall on purpose."),
        { t: "save" },
      ], else: [
        say("biscuit", "Steady! We charge AFTER tea is ready. Teacup, cookie plate, sun crayon - then we show this blot what it's dealing with."),
      ] },
    ] },
  ],

  // ================================================================ WOODS
  s_woods_to_blank: [
    { t: "fade", ms: 600 }, { t: "tp", map: "blank_page", x: 10, y: 2, facing: "down" }, { t: "unfade", ms: 600 },
  ],
  s_woods_to_woods2: [
    { t: "if", flag: "woods_candle_lit", is: true, then: [
      { t: "fade", ms: 600 }, { t: "tp", map: "woods_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
    ], else: [
      { t: "if", flag: "woods2_seen", is: true, then: [
        { t: "fade", ms: 600 }, { t: "tp", map: "woods_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
      ], else: [
        n("Past the trees the paper turns pitch dark - the deep woods.\nSomething big fell in there. The fireflies won't go near it."),
        { t: "flag", key: "woods2_seen", value: true },
        { t: "fade", ms: 600 }, { t: "tp", map: "woods_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
      ] },
    ] },
  ],
  s_creek: [ n("A creek of folded blue paper, going glug-glug in careful handwriting.\nThe stepping stones are flat and trustworthy.") ],
  s_fireflies: [
    { t: "if", flag: "swan_peace", is: true, then: [
      n("Paper fireflies spiral upward in loose figure-eights,\nfollowing a white shape that circles above the trees."),
      say("Fireflies", "she sings... she sings again... it comes out crooked now...\nit's better crooked..."),
    ], else: [
      n("Paper fireflies cluster in the dark like nervous punctuation."),
      say("Fireflies", "she won't sing... the swan won't sing... she folded her song away..."),
    ] },
  ],
  s_fight_fine: [ { t: "battle", troop: "t_fine", flagWin: "dunes_en1" } ],
  s_fight_dunes_pair: [ { t: "battle", troop: "t_dunes_pair", flagWin: "dunes_en2" } ],
  s_fight_ticktick: [ { t: "battle", troop: "t_ticktick", flagWin: "works_en1" } ],
  s_fight_works_pair: [ { t: "battle", troop: "t_works_pair", flagWin: "works_en2" } ],
  s_fight_thornbud: [ { t: "battle", troop: "t_thornbud", flagWin: "woods_en1" } ],
  s_fight_woods_pair: [ { t: "battle", troop: "t_woods_pair", flagWin: "woods_en2" } ],
  s_woods2_to_woods: [
    { t: "fade", ms: 600 }, { t: "tp", map: "woods_1", x: 9, y: 1, facing: "down" }, { t: "unfade", ms: 600 },
  ],
  s_crane: [
    n("The Paper Swan. The Queen of the Woods herself, lying on her side\nin the dark, creased where she fell. She's breathing. Slowly.\nQueens shouldn't have to breathe."),
  ],
  s_find_match: [
    { t: "sfx", name: "sfx_confirm" },
    n("Half-buried in paper leaves: the BRAVE MATCH.\nRen drew exactly one, 'for an emergency so big we'll know it when we see it.'"),
    { t: "give", item: "match" }, { t: "flag", key: "got_match", value: true },
  ],
  s_meet_wisp: [
    n("Tucked in behind the shrine's corner, something small is trying\nvery hard not to exist."),
    say("???", "eep. no. i'm not here. i'm a... a lamp. an off lamp."),
    mira("neutral", "Wisp. It's me."),
    say("wisp", "M-Mira?? Oh no. Oh good. Oh no. You can SEE me, that means the dark didn't eat the whole - I mean. Hello. Welcome to the woods. Everything is terrible."),
    say("wisp", "The big candle went out. I was SUPPOSED to keep it lit, it's the one thing I'm FOR, and the Smudge-wind came through and - and I hid. I hid, Mira."),
    mira("neutral", "Then we light it again. Together. That's allowed, you know - doing the scary thing WITH someone."),
    say("wisp", "...together counts? together counts. okay. okay!! I have exactly one flame and it's yours."),
    { t: "sfx", name: "sfx_victory" },
    { t: "flag", key: "wisp_joined", value: true }, // hide the NPC before the follower appears
    { t: "join", member: "wisp" },
    n("WISP joined the party!"),
    say("wisp", "the big candle needs a real fire to start - my flame's too small alone. there's a match somewhere by the fallen queen - the big swan. she fell when the candle went out and she hasn't moved since. Ren drew the match. for emergencies."),
  ],
  s_shrine: [
    { t: "if", flag: "woods_boss_done", is: true, then: [
      n("The great candle burns steady. The tea-lights lean toward it like children\nat story time."),
    ], else: [
      { t: "if", flag: "wisp_joined", is: false, then: [
        n("A great white candle stands unlit in its paper alcove.\nSix tiny tea-lights flicker around it, barely holding on.\nSomething whimpers in front of the shrine."),
      ], else: [
        { t: "if", flag: "got_match", is: true, then: [
          say("wisp", "o-okay. the Brave Match. you strike it, I'll carry the flame up. together, right?"),
          { t: "choice", options: [
            { label: "Light the candle", then: [
              { t: "take", item: "match" },
              { t: "sfx", name: "sfx_emotion" },
              n("Scritch. The match flares. Wisp cups the flame like it's a baby bird,\nfloats up... and the great candle CATCHES."),
              { t: "flag", key: "woods_candle_lit", value: true },
              n("Light rolls through the woods like a warm tide. And out in the dark,\npaper RUSTLES - the fallen queen stirs, unfolds joint by creased joint,\nand RISES into the clearing."),
              n("The Paper Swan. Queen of the Woods. She looks at the lit candle...\nand her creased eyes fill with something unbearable."),
              say("The Paper Swan", "WHO LIT IT? WHO DARES MAKE IT BRIGHT ENOUGH TO SEE WHAT I'VE BECOME?"),
              { t: "battle", troop: "t_boss_swan", boss: true, flagWin: "woods_boss_done",
                onPeace: [
                  { t: "flag", key: "swan_peace", value: true }, // she circles the woods now (map flyer)
                  say("wisp", "she's... flying. crooked-flying. that's still flying!!"),
                  n("A torn page flutters down from her wing as she rises."),
                ],
                onWin: [
                  say("wisp", "oh... oh, she's paper again. just paper. did we... was that saving her?"),
                  n("Among the drifting sheets, one torn page lands at your feet."),
                ] },
              { t: "page", n: 2 },
              { t: "cg", img: "cg_memory_2", lines: [
                "The page shows a playground, drawn in crayon.",
                "Two kids on swings, way too high, the chains almost slack at the top.",
                "Ren is STANDING on the seat, pointing at a cloud shaped exactly like a swan.",
                "\"THAT ONE'S GOING IN THE BOOK!\" - and it went in the book, that same day,",
                "as the Queen of the Woods. You drew the crown. Ren drew the wings.",
              ] },
              mira("gloomy", "She was ours. We made her brave and I... forgot her. I forgot the GOOD ones, Wisp."),
              say("wisp", "then... we're re-lighting those too. that's what remembering is. it's just re-lighting."),
              n("The woods blur. Morning is reaching in through the leaves..."),
              { t: "fade", ms: 1500 }, { t: "stopbgm" },
              { t: "flag", key: "interlude2", value: true },
              { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
              { t: "bgm", name: "bgm_real" },
              { t: "unfade", ms: 1500 },
              n("Thursday. Mom left a note under plastic wrap.\nYou read it twice, and put the second reading somewhere safe inside you."),
              { t: "save" },
            ] },
            { label: "Not yet", then: [ say("wisp", "o-okay. no rush. the dark's not going anywhere. that came out wrong.") ] },
          ] },
        ], else: [
          say("wisp", "the match! it's near the fallen queen, in the leaves. one match, one chance, zero pressure. AAAH."),
        ] },
      ] },
    ] },
  ],


  // ================================================================ ERASER DUNES
  s_dunes_to_blank: [
    { t: "fade", ms: 600 }, { t: "tp", map: "blank_page", x: 3, y: 3, facing: "down" }, { t: "unfade", ms: 600 },
  ],
  s_dunes_to_dunes2: [
    { t: "fade", ms: 600 }, { t: "tp", map: "dunes_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_dunes2_to_dunes: [
    { t: "fade", ms: 600 }, { t: "tp", map: "dunes_1", x: 10, y: 1, facing: "down" }, { t: "unfade", ms: 600 },
  ],
  s_dunes_tree: [
    n("Half a tree. The green half rustles like any self-respecting tree.\nThe other half is pale pencil ghost-lines, going quieter every day."),
    { t: "if", flag: "stub_joined", is: true, then: [
      say("stub", "I TRIED, OKAY. one crayon against a whole desert of un-drawing.\nbut trying counts. write that down."),
    ], else: [] },
  ],
  s_dunes_bench: [
    { t: "if", flag: "bench_memory_done", is: true, then: [
      n("The bench is still half-erased. But somebody sat here anyway,\nand benches remember that sort of thing."),
    ], else: [
      { t: "if", flag: "stub_joined", is: false, then: [
        n("A bench, fading from the left. Sitting on it feels like sitting\nnext to someone who's about to leave."),
      ], else: [
        n("A bench, fading from the left. There's room for everyone, barely."),
        { t: "choice", options: [
          { label: "Sit for a while", then: [
            n("You all squeeze on. Sir Biscuit takes the ghost half and reports it\n'perfectly load-bearing'. Wisp perches on the armrest. Stub lies flat\nand calls it 'crayon yoga'."),
            say("stub", "you know what benches are FOR? being between places.\nyou don't have to be anywhere yet. that's the whole invention."),
            n("For one long minute, nobody is anywhere yet. It's the best minute in days."),
            n("Under the armrest, something small is taped: a WARM RIBBON.\nRed as a certain hair-ribbon. Somebody left it for exactly this bench."),
            { t: "sfx", name: "sfx_victory" },
            { t: "give", item: "charm_ribbon" },
            n("(Got the WARM RIBBON! A charm - open POCKETS and choose it\nto give it to a friend to wear.)"),
            { t: "flag", key: "bench_memory_done", value: true },
          ] },
          { label: "Not right now", then: [ say("stub", "the bench will wait. benches are PATIENT. it's their one move.") ] },
        ] },
      ] },
    ] },
  ],
  s_dunes_sign: [
    n("A big friendly sign, freshly repainted: nothing written on it at all.\nIt used to say something. You can tell by how hard it isn't saying it now."),
  ],
  s_dunes_picnic: [
    n("A picnic in progress, permanently. The tea is poured, the flowers fresh,\nthe blanket crumbless. Nobody is here. Nobody has been here in a while.\nIt's a lovely day, insists the picnic. It's ALWAYS a lovely day."),
  ],
  s_meet_stub: [
    n("Somebody small is hurling itself at the ghost half of the tree,\nleaving little yellow streaks that fade as fast as they land."),
    say("???", "STAY. COLORED. IN. - oh great, witnesses."),
    mira("neutral", "...you're Ren's sun crayon. From our pocket! You've been GONE for-"),
    say("stub", "BUSY. i've been BUSY. somebody's un-drawing this whole page and the\nmanagement is a giant eraser with a customer-service smile, and I -"),
    say("stub", "- i'm the only yellow left out here, okay? suns don't quit.\nthey set. TEMPORARILY."),
    mira("neutral", "We're going to the Smoothing Flat to talk to the management.\nCome with us. One crayon alone can't fix a desert... but together counts."),
    say("stub", "...together, huh. wisp taught you that one? fine. FINE. but i draw\nthe suns. that's non-negotiable. everybody gets a sun."),
    { t: "sfx", name: "sfx_victory" },
    { t: "flag", key: "stub_joined", value: true },
    { t: "join", member: "stub" },
    n("STUB joined the party!"),
    say("biscuit", "Welcome, Sir Stub! You may guard my left flank. It is the crumbliest."),
  ],
  s_monolith: [
    { t: "if", flag: "dunes_boss_done", is: true, then: [
      n("The great eraser stands where it stood. But things stay drawn near it now.\nRetired, not gone. There's a difference, it turns out."),
    ], else: [
      n("A monument of pale rubber, worn round by work.\nThe air here tastes like paper dust and nothing-happened."),
    ] },
  ],
  s_dunes_boss: [
    n("The pale flat opens around you. Ghost-outlines everywhere - a dog,\na kite, a little house - all rubbed to almost-nothing, all still trying."),
    { t: "if", flag: "stub_joined", is: false, then: [
      n("Something small and yellow comes skidding down the dune behind you,\nyelling the whole way."),
      say("???", "WAIT. WAIT WAIT WAIT. you do NOT walk up to the management\nwithout YELLOW."),
      mira("neutral", "...you're Ren's sun crayon. From our pocket! You've been out HERE?"),
      say("stub", "holding the line. one sun at a time. and losing, okay, FINE -\nbut that ends now. i'm coming with you. i draw the suns. NON-negotiable."),
      { t: "sfx", name: "sfx_victory" },
      { t: "flag", key: "stub_joined", value: true },
      { t: "join", member: "stub" },
      n("STUB joined the party!"),
      say("biscuit", "Welcome, Sir Stub! You may guard my left flank. It is the crumbliest."),
    ], else: [] },
    say("stub", "there. THERE. that's the management. smile's already on. brace."),
    n("Something vast and soft unfolds from behind the monolith, beaming."),
    { t: "battle", troop: "t_boss_smoother", boss: true, flagWin: "dunes_boss_done",
      onPeace: [
        say("stub", "...it kept them. it kept every single one it ever erased.\nthat's the saddest filing system i've ever seen."),
        n("Where the Smoother stood, the ghost-outlines glow faintly warmer.\nA torn page drifts down from the top of the monolith."),
      ],
      onWin: [
        say("stub", "...the crumbs. even the crumbs are trying to un-erase.\nlet's just... let's take the page and be gentle a while."),
        n("A torn page drifts down from the top of the monolith."),
      ] },
    { t: "page", n: 3 },
    { t: "cg", img: "cg_memory_5", lines: [
      "The page shows a treehouse at golden hour, drawn in crayon.",
      "Two kids, two hooked pinkies, one open sketchbook between them.",
      "\"Before summer ends,\" Ren said, \"we finish the WHOLE book. Swear.\"",
      "You swore. The sun went down like it was in on it.",
      "It is still summer. Technically. That page has been counting.",
    ] },
    mira("gloomy", "We swore on the SUN, Stub. And then I stopped drawing."),
    say("stub", "then it's a good thing the sun came back, isn't it. i'm RIGHT HERE.\nwe finish the book. that's what the promise is FOR."),
    n("The dunes blur. Morning is reaching in through the pink..."),
    { t: "fade", ms: 1500 }, { t: "stopbgm" },
    { t: "flag", key: "interlude_dunes", value: true },
    { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
    { t: "bgm", name: "bgm_real" },
    { t: "unfade", ms: 1500 },
    n("Saturday. Mom's voice through the wall, low, on the phone:\n\"...last night? But he's stable NOW? Okay. Okay. Thank you. Okay.\"\nThree okays. That's one more than fine and one less than crying."),
    n("You hold very still until her door clicks shut.\nSome mornings the bravest thing in the apartment is the kettle."),
    { t: "save" },
  ],
  s_ghost_dog: [
    { t: "if", flag: "dog_redrawn", is: true, then: [
      n("PATCH gleams in fresh crayon, one ear yellow because Stub insisted.\nHe chases his tail in a circle, exactly where he was erased."),
    ], else: [
      { t: "if", flag: "stub_joined", is: true, then: [
        n("A dog-shaped almost-nothing. A spot over one eye, if you squint\nwith your whole heart."),
        say("stub", "i remember this guy!! PATCH! page thirty-one! ren wrote his bark\nin the speech bubble as 'BORK!' - wrong on purpose - and you LIKED it\nwrong! come on - you trace, i'll color. TEAMWORK."),
        { t: "choice", options: [
          { label: "Redraw the dog together", then: [
            n("You trace. Stub colors. The lines wobble, which is correct -\nthey always wobbled. A tail happens. The tail WAGS. PATCH is back."),
            { t: "sfx", name: "sfx_victory" },
            n("The little dog shakes itself from ears to tail, sneezes a puff of\ncrayon dust, and drops something at your feet: a RAINY-DAY STAMP."),
            { t: "give", item: "charm_stamp" },
            n("(Got the RAINY-DAY STAMP! A charm - choose it in POCKETS\nto give it to a friend to wear.)"),
            { t: "flag", key: "dog_redrawn", value: true },
          ] },
          { label: "Later", then: [ say("stub", "he's waited this long. dogs are professionals at waiting.") ] },
        ] },
      ], else: [
        n("A dog-shaped almost-nothing, rubbed down to a wish.\nSomething yellow could fix this. Somebody yellow."),
      ] },
    ] },
  ],
  s_ghost_kite: [
    n("A kite, mostly erased. Its string is the last solid line,\nstill tied to a rock so it can't blow away. Somebody loved it enough\nto tie it down and not enough to finish it. Or the other way around."),
  ],
  s_ghost_house: [
    n("A little house, down to pencil bones. The door was drawn OPEN.\nWhoever lived here believed in visitors."),
  ],

  // ================================================================ IF-THEN WORKS
  s_works_to_blank: [
    { t: "fade", ms: 600 }, { t: "tp", map: "blank_page", x: 16, y: 3, facing: "down" }, { t: "unfade", ms: 600 },
  ],
  s_works_to_works2: [
    { t: "fade", ms: 600 }, { t: "tp", map: "works_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_works2_to_works: [
    { t: "fade", ms: 600 }, { t: "tp", map: "works_1", x: 2, y: 12, facing: "right" }, { t: "unfade", ms: 600 },
  ],
  s_cubbyholes: [
    n("Cubbyholes stuffed with rolled-up yesterdays, sorted by regret.\nEach scroll is one moment, rewound tight and filed where nobody\nhas to read it. The shelf is completely full."),
  ],
  s_gears: [
    n("Great cardboard gears, painted with clouds and stars, all turning\neach other. None of them turns anything else. That's the whole machine:\neffort, beautifully connected to more effort."),
  ],
  s_conveyor: [
    { t: "if", flag: "parcel_freed", is: true, then: [
      n("The conveyor still loops, but there's a gap in the parade now,\nwhere one parcel got to stop being carried."),
    ], else: [
      { t: "if", flag: "got_winder", is: true, then: [
        n("The parcels go around and around. One of them, small and dented,\nrattles like it wants OUT. The belt's release crank is missing its winder."),
        { t: "choice", options: [
          { label: "Fit the little winder", then: [
            n("Click. One gentle quarter-turn. The belt sighs, slows,\nand lets the small dented parcel roll off into your hands."),
            n("Inside: a CRUMB LOCKET, and a note in handwriting you don't know:\n'was saving this for the right moment. there was no right moment.\nthere was only saving.'"),
            { t: "sfx", name: "sfx_victory" },
            { t: "give", item: "charm_locket" },
            n("(Got the CRUMB LOCKET! A charm - choose it in POCKETS\nto give it to a friend to wear.)"),
            { t: "flag", key: "parcel_freed", value: true },
          ] },
          { label: "Leave it be", then: [ n("The parcel goes around again. And again. It's very good at it by now.") ] },
        ] },
      ], else: [
        n("A conveyor of parcels, going in a perfect loop. Nothing is delivered.\nNothing is lost. Nothing is opened. The system works flawlessly."),
      ] },
    ] },
  ],
  s_find_winder: [
    { t: "sfx", name: "sfx_confirm" },
    n("Between two gear teeth: a tiny brass WINDER, the kind that fits\nsomething small and stuck. Somebody dropped it mid-errand, years ago."),
    { t: "give", item: "winder" }, { t: "flag", key: "got_winder", value: true },
  ],
  s_works_boss: [
    n("The cushions face the stage. The stage faces one moment.\nThe moment is a street corner, and two small paper figures, mid-step."),
    say("wisp", "oh. oh no. mira, the play. the play is-"),
    mira("gloomy", "I know what the play is."),
    n("In the booth beside the stage, a key begins to turn, all by itself."),
    { t: "battle", troop: "t_boss_oracle", boss: true, flagWin: "works_boss_done",
      onPeace: [
        n("The curtains close, gently, like tucking someone in.\nOn the empty stage, a torn page flutters down through the spotlight."),
        say("stub", "...it just wanted somebody to say no. all this brass and it never\nonce got a NO. imagine."),
      ],
      onWin: [
        n("The theatre is very quiet. The two paper figures finish their step\nat last, walk off the stage, and are gone.\nA torn page settles in the spotlight where they stood."),
      ] },
    { t: "page", n: 5 },
    { t: "cg", img: "cg_memory_6", lines: [
      "The page shows a windowsill in the rain, drawn in crayon.",
      "A walkie-talkie with its little light off. A drawing stopped mid-line.",
      "The week after the fight, the channel stayed silent seven days.",
      "You both checked it every night. You found that out later, and it broke",
      "the thing in you that had been calling the silence 'proof'.",
    ] },
    mira("gloomy", "We wasted a whole WEEK being RIGHT at each other. Not mad. RIGHT.\nAnd then there wasn't a week left to waste."),
    n("The theatre lights dim, kindly. Morning is coming through the curtains..."),
    { t: "fade", ms: 1500 }, { t: "stopbgm" },
    { t: "flag", key: "interlude_works", value: true },
    { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
    { t: "bgm", name: "bgm_real" },
    { t: "unfade", ms: 1500 },
    n("Wednesday. Your shoes are by the door. They've been by the door all week.\nToday they look almost possible."),
    { t: "flag", key: "failed_walk_active", value: true },
    { t: "save" },
  ],
  s_lever: [
    n("A lever the size of your whole arm, labeled with an arrow curving\nbackward. It's been pulled so many times the handle is worn glass-smooth.\nIt doesn't budge for you. Maybe it knows you don't really want it to."),
  ],
  s_clockwall: [
    n("A wall of clocks, every face a different almost-time.\nNone of them tick forward. All of them tick."),
  ],
  s_tickets: [
    n("Drifts of used tickets, hip-deep. Every one is stamped ADMIT ONE\nin feeling rather than letters, and every one was used more than once.\nRewatching costs extra. It always costs extra."),
  ],
  s_stage: [
    { t: "if", flag: "works_boss_done", is: true, then: [
      n("The curtains are drawn, soft and final. From behind them, very faint,\nthe sound of a street where everyone got home fine."),
    ], else: [
      n("The stage replays one moment: two paper figures on a corner, mid-step.\nIt rewinds. Mid-step. Rewinds. Mid-step. The spotlight never blinks."),
    ] },
  ],
  // ================================================================ BAY
  s_bay_to_blank: [
    { t: "fade", ms: 600 }, { t: "tp", map: "blank_page", x: 17, y: 7, facing: "left" }, { t: "unfade", ms: 600 },
  ],
  s_bay_to_bay2: [
    { t: "fade", ms: 600 }, { t: "tp", map: "bay_2", x: 9, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_bay2_to_bay: [
    { t: "fade", ms: 600 }, { t: "tp", map: "bay_1", x: 18, y: 9, facing: "left" }, { t: "unfade", ms: 600 },
  ],
  s_pier: [
    n("A little paper boat is tied to the pier, bobbing on the felt.\nIts name is painted on the side in nail polish: S.S. FRIEND SHIP.\nRen thought that was the funniest thing either of you had ever said."),
  ],
  s_stall: [
    say("Shell Stall", "shells! spools! sea-buttons! everything must go, on account of the sea being SCARED!"),
    n("The stall-keeper is a hermit crab in a knitted vest. It explains, in one\nlong sentence, that the lighthouse went dark, the Keeper went strange,\nand the waves have been whispering since."),
    { t: "if", flag: "bay_bulb_found", is: false, then: [
      say("Shell Stall", "the SPARE BULB? sold it! to the barrel! I mean it FELL in the barrel. the knitting barrel. by the bench. don't tell the needles."),
    ], else: [] },
  ],
  s_barrel: [
    { t: "if", flag: "bay_bulb_found", is: true, then: [
      n("The knitting needles rattle smugly. They have no further bulbs to declare."),
    ], else: [
      n("You reach carefully past the knitting needles..."),
      { t: "sfx", name: "sfx_confirm" },
      n("Got it! The BRIGHT BULB - big as your head, warm as a fresh bun."),
      { t: "give", item: "bulb" }, { t: "flag", key: "bay_bulb_found", value: true },
    ] },
  ],
  s_bench: [ n("The bench faces the sea. Two names are scratched under the armrest.\nYou don't need to look to know whose.") ],
  s_fight_crab: [ { t: "battle", troop: "t_crab", flagWin: "bay_en1" } ],
  s_fight_bay_pair: [ { t: "battle", troop: "t_bay_pair", flagWin: "bay_en2" } ],
  s_fight_bay_pair2: [ { t: "battle", troop: "t_bay_pair", flagWin: "bay_en3" } ],
  s_keeper_cottage: [
    n("A small round cottage with a felt roof, tucked in beside the lighthouse.\nSocks on the line. Firewood stacked in a painfully straight pile."),
    n("The little blue door is shut, but not locked.\nIt has the look of a door that is never locked, just in case."),
    mira("neutral", "...Somebody lives here. Or waits here. I can't tell which."),
  ],
  s_enter_keeper_home: [
    { t: "sfx", name: "sfx_door" },
    { t: "fade", ms: 600 },
    { t: "tp", map: "keeper_home", x: 9, y: 12, facing: "up" },
    { t: "unfade", ms: 700 },
  ],
  s_keeper_exit: [
    { t: "sfx", name: "sfx_door" },
    { t: "fade", ms: 600 },
    { t: "tp", map: "bay_2", x: 15, y: 9, facing: "down" },
    { t: "unfade", ms: 700 },
  ],
  s_keeper_home_enter: [
    { t: "if", flag: "keeper_home_seen", is: true, then: [], else: [
      n("Inside, everything is put away.\nNot tidy the way a home is tidy - tidy the way a room is tidy\nwhen someone has been cleaning it instead of sleeping."),
      { t: "flag", key: "keeper_home_seen", value: true },
    ] },
  ],
  s_keeper_stove: [
    n("A little iron stove, swept out and laid with fresh kindling,\nready to light. The kettle is filled. Everything is ready."),
    n("Nothing has been lit in a long, long time."),
  ],
  s_keeper_window: [
    n("A round window of button-glass. Through it: the lighthouse,\nand past the lighthouse, the whole grey sea."),
    n("Whoever sat here sat facing the water. Waiting for something to come back."),
  ],
  s_keeper_table: [
    n("On the table, laid out in a perfect row: a tin of polish,\nand a soft cloth folded into a neat little square."),
    n("The cloth is worn thin in one spot, about the size of a small bell."),
    { t: "if", flag: "bay_boss_done", is: true, then: [
      mira("gloomy", "He polished it every single day. Like if he kept it bright enough,\nthe sound would stop meaning what it means."),
    ], else: [
      mira("neutral", "Somebody polishes something here. Every day, by the look of it."),
    ] },
  ],
  s_keeper_photo: [
    n("A small framed photograph: the lighthouse, lit, on a blue afternoon.\nIt has been dusted so often the frame's corners have gone pale."),
    n("There's writing on the back, pressed against the glass, backwards\nand barely readable: 'IT WASN'T YOUR FAULT.'"),
    n("Written in someone else's handwriting. Kept where he'd have to turn it over\nto read it."),
    { t: "if", flag: "bay_boss_done", is: true, then: [
      mira("gloomy", "...somebody told him. He just never turned it over."),
      say("wisp", "s-some things you have to hear from inside, not outside."),
      mira("gloomy", "Yeah. ...Yeah, I know."),
    ], else: [] },
  ],
  s_keeper_chair: [
    n("One chair, pulled out just slightly, as if its owner meant to sit back down."),
  ],
  s_keeper_bed: [
    n("A narrow bed, made so tightly you could bounce a button off it.\nThe pillow has no dent in it at all."),
    { t: "if", flag: "bay_boss_done", is: true, then: [
      say("biscuit", "...He hasn't slept, m'lady. Not once. Not since."),
    ], else: [] },
  ],
  s_keeper_boots: [
    n("A pair of boots by the door, set side by side, toes pointing out.\nPointing at the door. Ready to go out."),
    n("They haven't moved in years."),
  ],
  s_telescope: [
    n("Through the telescope: felt waves to the horizon.\nAnd stitched into the horizon in tiny thread, almost invisible: 'come back'."),
  ],
  s_lighthouse: [
    { t: "if", flag: "bay_boss_done", is: true, then: [
      n("The lighthouse beam sweeps the felt sea, steady as a heartbeat.\nThe buttons below bob in it like they're dancing."),
    ], else: [
      { t: "if", flag: "bay_bulb_found", is: true, then: [
        // Set the state before the first line of narration so the lantern is
        // visibly lit while the player reads that it blazes.
        { t: "take", item: "bulb" },
        { t: "flag", key: "bay_lighthouse_lit", value: true },
        n("You climb the spiral of thread to the lantern room and screw in\nthe Bright Bulb. It hums... and BLAZES."),
        { t: "sfx", name: "sfx_emotion" }, { t: "shake", ms: 500 },
        n("Light sweeps the bay - and catches, at the cliff's edge, a stiff figure\nin a navy coat, holding something small and silver."),
        say("???", "...ring... ring..."),
        n("The Bell Keeper turns. Its cracked porcelain face is wet."),
        say("The Bell Keeper", "I RANG IT. I RANG AND RANG AND NOBODY STOPPED. IF THE LIGHT COMES BACK, EVERYONE WILL SEE THAT IT WAS ME."),
        { t: "battle", troop: "t_boss_keeper", boss: true, flagWin: "bay_boss_done",
          onPeace: [
            n("The Keeper stands in the sweeping light, holding the bell OUT instead of UP,\nlike returning something borrowed too long."),
          ],
          onWin: [
            n("The light sweeps over white sand where the Keeper stood.\nThe little bell sits on top, finally quiet."),
          ] },
        n("On the lighthouse steps, pinned under the bell: a torn page."),
        { t: "page", n: 4 },
        { t: "cg", img: "cg_memory_3", lines: [
          "The page is ripped down the middle and taped back wrong, so the two kids",
          "face away from each other forever.",
          "You remember the fight. It was about NOTHING - a move across town,",
          "a canceled sleepover, a stupid Tuesday.",
          "You remember exactly what you said, because you aimed it:",
          "\"I wish it was YOU who was leaving.\"",
          "Ren grabbed the sketchbook and ran. Out the door. Down the stairs.",
          "Toward the crosswalk.",
          "Ren made it across that day. Home safe, sketchbook and all.",
          "You told yourself you'd take it back TOMORROW.",
          "Tomorrow took a week to come.",
        ] },
        mira("gloomy", "...it was me. The last thing Ren heard from me was THAT."),
        say("biscuit", "M'lady..."),
        mira("gloomy", "Don't. Please. Just... morning's coming. I can feel it."),
        { t: "fade", ms: 1800 }, { t: "stopbgm" },
        { t: "flag", key: "interlude3", value: true },
        { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
        { t: "bgm", name: "bgm_real" },
        { t: "unfade", ms: 1800 },
        n("Friday. There's a letter by the front door, read soft at the folds.\nMom is asleep on the sofa in her coat."),
        { t: "save" },
      ], else: [
        n("The lantern room is dark. The socket is empty - somebody took the bulb,\nor hid it. The whole bay squints without it."),
      ] },
    ] },
  ],

  // ================================================================ DEPTHS
  s_depths_to_blank: [
    { t: "fade", ms: 600 }, { t: "tp", map: "blank_page", x: 10, y: 12, facing: "up" }, { t: "unfade", ms: 600 },
  ],
  s_depths_to_depths2: [
    { t: "fade", ms: 900 }, { t: "sfx", name: "sfx_heartbeat" },
    { t: "tp", map: "depths_2", x: 10, y: 12, facing: "up" }, { t: "unfade", ms: 1200 },
  ],
  s_sunken_doodles: [
    n("Half-sunk in the ink: flowers, houses, a dog with three tails.\nEverything you two ever drew and forgot. It's all HERE, drowning quietly."),
    say("wisp", "...it keeps what we stop looking at. that's what the Smudge IS, maybe.\neverything left unfinished, all pooled up."),
  ],
  s_fight_inklet: [ { t: "battle", troop: "t_inklet", flagWin: "depths_en1" } ],
  s_fight_inklet_pair: [ { t: "battle", troop: "t_inklet_pair", flagWin: "depths_en2" } ],
  s_depths2_enter: [
    // iflt pages<4: the whole arrival beat (and its page grant) plays exactly
    // once — retreating to a lantern and coming back must not replay the CG
    { t: "if", flag: "smudge_done", is: true, then: [], else: [
      { t: "iflt", key: "pages", value: 6, then: [
      { t: "stopbgm" },
      n("The ink here is perfectly still.\nUnder its surface, enormous and faint, someone half-drawn is waiting."),
      { t: "sfx", name: "sfx_heartbeat" },
      n("On the clean island in the center, one torn page lies alone.\nThe last one. You know it before you touch it."),
      { t: "page", n: 6 },
      { t: "cg", img: "cg_memory_4", lines: [
        "Rain. Seven days after the fight. The crosswalk.",
        "The sketchbook open on the wet asphalt,",
        "its colors bleeding out like the day itself.",
        "A week of silence. Then, through the rain: Ren at the far corner,",
        "sketchbook under one arm. Still keeping it. You finally ran.",
        "You were half a block behind, yelling \"WAIT - I DIDN'T MEAN IT -\"",
        "Ren turned around in the middle of the road to yell something back.",
        "You never got to hear it.",
        "The bell. The brakes. The quiet after.",
        "The doctors say Ren is sleeping. That sleeping people sometimes hear us.",
        "You haven't gone. You haven't said anything for them to hear.",
      ] },
      mira("gloomy", "..."),
      say("biscuit", "Mira. Whatever rises out of that ink... we're standing with you. Both sides of you."),
      say("wisp", "l-lighting the way. together counts. together ALWAYS counts."),
      { t: "bgm", name: "bgm_depths" },
      ], else: [] },
    ] },
  ],
  s_smudge_confront: [
    { t: "if", flag: "smudge_done", is: true, then: [
      { t: "if", flag: "mending", is: true, then: [
        n("The Last Page waits, patient as paper. The gray pencil figure looks up."),
        say("ren", "hey. good walk? ...yeah. it shows. okay - one page left. OUR book."),
        say("ren", "So. How does the story end?"),
        { t: "choice", options: [
          { label: "Finish the story. Then go say it for real.", then: [
            say("ren", "...yeah. YEAH. Okay. You draw, I'll talk. Like always."),
            n("You draw until your hand aches. Sir Biscuit gets a statue. Wisp gets\na constellation. Stub gets the sun, obviously. The Swan gets the whole sky."),
            n("And on the very last line, you write the ending you choose:\n'AND THEY FIXED WHAT THEY COULD, AND CARRIED WHAT THEY COULDN'T,\nAND THEY WERE FRIENDS FOREVER ANYWAY.'"),
            say("ren", "Go on, then. He's waiting. Tell him about the swan cloud - the real one\nnever heard that part."),
            say("biscuit", "Our lady of Two Names... it was the honor of my crust."),
            say("wisp", "we'll keep the lights on. for whenever you visit. dreams stay, you know."),
            say("stub", "hey. HEY. no crying on the crayon. ...okay, a little on the crayon."),
            mira("gloomy", "I'll visit. Both of you. All of you. I promise."),
            { t: "flag", key: "chose_true", value: true },
            { t: "fade", ms: 2500 },
            { t: "ending", which: "true" },
          ] },
          { label: "Stay here. Where it never happened.", then: [
            say("ren", "...you sure? It's nice here. It's ALWAYS nice here. That's kind of the problem."),
            mira("neutral", "Just for a while. Just until it stops hurting."),
            say("ren", "Mira. It stops hurting BY going. That's the trick nobody likes.\n...but okay. A while. I'll put the kettle on."),
            { t: "flag", key: "chose_page", value: true },
            { t: "fade", ms: 2500 },
            { t: "ending", which: "page" },
          ] },
          { label: "Keep walking a little longer.", then: [
            say("ren", "the kettle's on standby. no rush. THAT part I mean completely."),
          ] },
        ] },
      ], else: [
        n("The ink is drying into paper. The page is almost ready."),
      ] },
    ], else: [
      n("You step onto the clean island. The ink rises around it, slow as a held sob,\ninto a wave that does not crash."),
      { t: "sfx", name: "sfx_static" }, { t: "shake", ms: 900 },
      { t: "battle", troop: "t_boss_smudge", boss: true, final: true, flagWin: "smudge_done",
        onPeace: [] },
      { t: "stopbgm" },
      n("The ink settles. Where the wave stood, the world is a single page:\nthe LAST PAGE, blank, with room for exactly one ending."),
      n("And on the page's far edge, drawn in gray pencil, unfinished,\nsomeone is sitting. Waiting. Like they've waited all along."),
      say("ren", "...hey, doofus. Took you long enough."),
      mira("gloomy", "REN?! You're - are you-"),
      say("ren", "I'm the you-half of Ren. The half you carry. The real one's doing the\nhard part somewhere brighter. Hospitals, beeping, gross jello. You know."),
      say("ren", "I heard it, by the way. The thing you yelled after me in the rain.\nThe 'I didn't mean it.' I was turning around to say I KNOW, YOU POTATO."),
      mira("gloomy", "...you turned around because of me. If I hadn't-"),
      say("ren", "If-hadn'ts drown pages, Mira. Look around. This whole sea is if-hadn'ts."),
      say("ren", "One page left. OUR book. So - how does the story end?"),
      { t: "if", flag: "mending", is: true, then: [], else: [
        say("ren", "...or, hey. No rush. The book's not going anywhere anymore.\nWalk it once more if you want. Say your goodbyes properly.\nI'll keep the page warm."),
      ] },
      { t: "choice", options: [
        { label: "Finish the story. Then go say it for real.", then: [
          say("ren", "...yeah. YEAH. Okay. You draw, I'll talk. Like always."),
          n("You draw until your hand aches. Sir Biscuit gets a statue. Wisp gets\na constellation. The Swan gets the whole sky."),
          n("And on the very last line, you write the ending you choose:\n'AND THEY FIXED WHAT THEY COULD, AND CARRIED WHAT THEY COULDN'T,\nAND THEY WERE FRIENDS FOREVER ANYWAY.'"),
          say("ren", "Go on, then. He's waiting. Tell him about the swan cloud - the real one\nnever heard that part."),
          say("biscuit", "Our lady of Two Names... it was the honor of my crust."),
          say("wisp", "we'll keep the lights on. for whenever you visit. dreams stay, you know."),
          mira("gloomy", "I'll visit. Both of you. All of you. I promise."),
          { t: "flag", key: "chose_true", value: true },
          { t: "fade", ms: 2500 },
          { t: "ending", which: "true" },
        ] },
        { label: "Not yet - walk our book once more.", then: [
          say("ren", "take your time. seriously. we have LOADS of it now.\nooh - and if you find something unfinished out there... be brave about it."),
          { t: "flag", key: "mending", value: true },
          n("The worlds beyond the depths feel different already - like a held breath\nfinally let out. (The doors on the Blank Page are all open. Come back to\nthe Last Page whenever you're ready to choose the ending.)"),
          { t: "fade", ms: 800 },
          { t: "tp", map: "blank_page", x: 10, y: 6, facing: "down" },
          { t: "unfade", ms: 800 },
        ] },
        { label: "Stay here. Where it never happened.", then: [
          say("ren", "...you sure? It's nice here. It's ALWAYS nice here. That's kind of the problem."),
          mira("neutral", "Just for a while. Just until it stops hurting."),
          say("ren", "Mira. It stops hurting BY going. That's the trick nobody likes.\n...but okay. A while. I'll put the kettle on."),
          { t: "flag", key: "chose_page", value: true },
          { t: "fade", ms: 2500 },
          { t: "ending", which: "page" },
        ] },
      ] },
    ] },
  ],

  s_ember: [
    n("A loose sheet flutters on the page, all by itself: a drawing you started\nlong before Ren. Half magnificent. Half scaffolding. Never named."),
    { t: "ifjournal", then: [
      mira("neutral", "...I remember you. I got scared of how big you were getting.\nI'm not scared of big feelings anymore. Mostly."),
      n("The sheet unfolds. And unfolds. And UNFOLDS."),
      { t: "battle", troop: "t_boss_unfinished", boss: true, flagWin: "ember_done",
        onPeace: [
          n("Ember curls around the Blank Page's lamp like a cat the size of a myth.\nIt isn't finished. It's UNDERWAY. It gives you something it was hoarding:\na line drawn all the way to the end."),
          { t: "give", item: "charm_sunbadge" },
          n("(Got the FINISHED LINE! A charm - choose it in POCKETS\nto give it to a friend to wear.)"),
        ],
        onWin: [
          n("The page settles, empty. Some stories end by ending.\nYou sit with that a while."),
        ] },
    ], else: [
      n("The sheet shivers and stays shut. Something enormous inside is listening\nfor whether you're the kind of person who finishes what they start."),
      mira("neutral", "...I think it wants to see every doodle in this book smiling first.\nEvery. Single. One. (The guide book would call that a full FRIEND JOURNAL.)"),
    ] },
  ],

  // ================================================================ ENDINGS
  s_ending_true: [
    { t: "bgm", name: "bgm_ending" },
    { t: "flag", key: "true_ending_walk", value: true },
    { t: "flag", key: "failed_walk_active", value: false }, // the walk that counts
    { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
    { t: "unfade", ms: 2000 },
    n("Saturday. Actual, confirmed Saturday - you checked.\nThe sketchbook is in your backpack. Your shoes are by the door."),
    n("(Walk to the front door.)"),
  ],
  s_enter_hospital: [
    { t: "if", flag: "true_ending_walk", is: false, then: [
      n("The hospital doors are right there, glowing warm.\nNot yet. Your feet are very clear about the order of things."),
    ], else: [
    { t: "fade", ms: 1000 },
    { t: "tp", map: "hospital_room", x: 10, y: 12, facing: "up" },
    { t: "unfade", ms: 1400 },
    n("Room 314. Paper cranes on the table - Mom's been folding them here,\nall these weeks, saying nothing."),
    n("(Go to the bed.)"),
    ] },
  ],
  s_busstop: [ n("The bench where you both waited a thousand mornings.\nYou sit for exactly one breath, for old times' sake, then keep going.") ],
  s_traffic_light: [ n("The light blinks to green and back.\nIt's just a light. It was always just a light. You cross with it anyway,\nlooking both ways twice, the way you'll look both ways forever now.") ],
  s_crossing: [
    { t: "if", flag: "failed_walk_active", is: true, then: [
      n("The crosswalk. The light is green. It's JUST a light.\nYour feet stop anyway, all by themselves, six tiles of painted white away."),
      mira("gloomy", "Move. MOVE. It's just a road. He's just past it. Move."),
      n("The light blinks to red, patient as anything. Your feet turn you around\nwithout asking, and you're halfway home before you notice you're crying."),
      { t: "fade", ms: 1200 },
      { t: "tp", map: "real_bedroom", x: 6, y: 6, facing: "down" },
      { t: "unfade", ms: 1200 },
      n("The sketchbook is where you left it. The dream is where you left it.\nYou're not ready. That's not the same as never."),
      { t: "flag", key: "failed_walk_active", value: false },
      { t: "flag", key: "failed_walk_done", value: true },
      { t: "save" },
    ], else: [
      n("The crosswalk. Your heart does one hard knock, like a bell...\nand then it passes. You keep walking."),
    ] },
  ],
  s_flowers: [ n("Fresh flowers and thirty-one paper cranes. Mom's been counting days\nthe only way she knows how.") ],
  s_chair: [ n("The visitor chair, pulled close to the bed already.\nLike it's been waiting for you specifically.") ],
  s_ren_bed: [
    n("Ren is smaller than you remember, in all this white.\nEyelids flickering with some dream. Glasses folded on the table, one lens cracked."),
    mira("gloomy", "...hey, doofus. Took me long enough. I know."),
    n("You pull the sketchbook out of your backpack, open it to the first page,\nand start reading out loud. The fort. The swings. The swan."),
    n("You read the last page slowest - the ending you chose,\nthe apology you wrote in it, every word."),
    n("And when you finish -"),
    { t: "sfx", name: "sfx_heartbeat" },
    n("- a hand, resting outside the blanket, curls very slightly toward yours."),
    { t: "cg", img: "cg_ending_true", lines: [
      "The doctors said sleeping people sometimes hear us.",
      "You come back the next day, and the day after, and read it all again.",
      "Some endings take more than one telling. That's okay.",
      "You have time. You have SO much time.",
      "THE LAST PAGE - true ending",
      "Thank you for playing.",
    ] },
    { t: "ending", which: "credits" },
  ],
  s_ending_page: [
    // the choice above faded to black — without this unfade the whole CG and
    // the credits would play invisibly under the fade overlay
    { t: "bgm", name: "bgm_ending" },
    { t: "unfade", ms: 1800 },
    { t: "cg", img: "cg_ending_page", lines: [
      "The tea is always warm. The sun never sets unless you want stars.",
      "Sir Biscuit tells the same joke every day, and it lands every time.",
      "Ren is here. Ren is always here. Ren says the thing you need,",
      "always, exactly, because the you-half of Ren knows exactly what you need.",
      "Somewhere very far away, morning keeps arriving at an empty bed.",
      "The edges of the picture are a little softer every day.",
      "It doesn't hurt. It doesn't anything.",
      "THE LAST PAGE - dream ending",
      "...the real Ren is still waiting. Perhaps another night, another choice.",
    ] },
    { t: "ending", which: "credits" },
  ],
};
