// items.js — usable items and key items.
export const ITEMS = {
  cookie: {
    name: "Sugar Cookie", desc: "Ren's favorite. Heals 20 HP.",
    battle: true, field: true, effect: { hp: 20 },
  },
  juice: {
    name: "Juice Box", desc: "Sunshine in a carton. Restores 10 Ink.",
    battle: true, field: true, effect: { ink: 10 },
  },
  sandwich: {
    name: "Jam Sandwich", desc: "Cut into triangles, obviously. Heals 45 HP.",
    battle: true, field: true, effect: { hp: 45 },
  },
  glitter: {
    name: "Glitter Vial", desc: "Emergency sparkles. Revives a torn friend with 20 HP.",
    battle: true, field: false, effect: { revive: 20 },
  },
  // key items
  // script: selecting it in the pocket menu closes the menu and runs the script
  guidebook: { name: "How to Talk to Sad Doodles", desc: "You and Ren's battle guide. Choose it to read.", key: true, script: "s_guide" },
  teacup: { name: "Chipped Teacup", desc: "A tiny teacup drawn with great care.", key: true },
  cookieplate: { name: "Plate of Cookies", desc: "Crayon cookies. Zero calories.", key: true },
  suncrayon: { name: "Sun-Yellow Crayon", desc: "Worn down to a stub from drawing suns.", key: true },
  match: { name: "Brave Match", desc: "One match, saved for something important.", key: true },
  winder: { name: "Little Winder", desc: "A tiny brass key for something small and stuck.", key: true },
  bulb: { name: "Bright Bulb", desc: "A lighthouse bulb, warm even when off.", key: true },
  page1: { name: "Torn Page: The Fort", desc: "A drawing of a blanket fort.", key: true },
  page2: { name: "Torn Page: The Swings", desc: "A drawing of two kids flying.", key: true },
  page3: { name: "Torn Page: The Promise", desc: "A drawing of two hooked pinky fingers.", key: true },
  page4: { name: "Torn Page: The Fight", desc: "A drawing torn down the middle.", key: true },
  page5: { name: "Torn Page: The Quiet Week", desc: "A drawing of a walkie-talkie, light off.", key: true },
  page6: { name: "Torn Page: The Rain", desc: "A drawing that hurts to hold.", key: true },
  // charms — equip one per friend from POCKETS; effects apply in battle
  charm_ribbon: {
    name: "Warm Ribbon", key: true, charm: true,
    desc: "CHARM: battles begin with every doodle already LISTENING. Choose it to give it to a friend.",
  },
  charm_locket: {
    name: "Crumb Locket", key: true, charm: true,
    desc: "CHARM: Steady and Crumb Wall protect the wearer much harder. Choose it to give it to a friend.",
  },
  charm_stamp: {
    name: "Rainy-Day Stamp", key: true, charm: true,
    desc: "CHARM: the wearer can land a SECOND heart each round. Choose it to give it to a friend.",
  },
  charm_sunbadge: {
    name: "Finished Line", key: true, charm: true,
    desc: "CHARM: +3 attack, +2 speed. A line drawn all the way to the end. Choose it to give it to a friend.",
  },
};
