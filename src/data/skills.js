// skills.js — battle skills. target: enemy | ally | allies | self
export const SKILLS = {
  doodle_dash: {
    name: "Doodle Dash", ink: 3, target: "enemy",
    desc: "Scribble past an enemy at full speed. 130% damage.",
    kind: "attack", mult: 1.3,
  },
  cheer: {
    name: "Cheer", ink: 4, target: "ally",
    desc: "A goofy face and a thumbs up. Ally becomes GIGGLY.",
    kind: "emotion", emotion: "giggly",
  },
  grump_face: {
    name: "Grump Face", ink: 4, target: "enemy",
    desc: "So annoying it works. Enemy becomes GRUMPY.",
    kind: "emotion", emotion: "grumpy",
  },
  silly_story: {
    name: "Silly Story", ink: 5, target: "enemy",
    desc: "The one about the trumpets. Enemy becomes GIGGLY - it listens double, but giggly doodles dodge and swing wild.",
    kind: "emotion", emotion: "giggly",
  },
  quiet_word: {
    name: "Quiet Word", ink: 4, target: "enemy",
    desc: "The small true thing, said softly. Breaks an enemy's storm - it stops to LISTEN.",
    kind: "emotion", emotion: "neutral",
  },
  valiant_chomp: {
    name: "Valiant Chomp", ink: 4, target: "enemy",
    desc: "A knight bites back. 160% damage, but Sir Biscuit gets GRUMPY.",
    kind: "attack", mult: 1.6, selfEmotion: "grumpy",
  },
  crumb_wall: {
    name: "Crumb Wall", ink: 3, target: "allies",
    desc: "Stand behind me! Party takes half damage this turn.",
    kind: "wall",
  },
  emergency_biscuit: {
    name: "Emergency Biscuit", ink: 5, target: "ally",
    desc: "A knight is always provisioned. Heals an ally 20 HP.",
    kind: "heal", amount: 20,
  },
  warm_glow: {
    name: "Warm Glow", ink: 5, target: "ally",
    desc: "A gentle warmth. Heals an ally 25 HP.",
    kind: "heal", amount: 25,
  },
  candlelight: {
    name: "Candlelight", ink: 9, target: "allies",
    desc: "Everyone gathers close. Heals the party 15 HP.",
    kind: "heal", amount: 15,
  },
  soft_song: {
    name: "Soft Song", ink: 4, target: "enemy",
    desc: "A lullaby hummed off-key. Enemy becomes GLOOMY.",
    kind: "emotion", emotion: "gloomy",
  },
  dim_the_lights: {
    name: "Dim the Lights", ink: 6, target: "self",
    desc: "Wisp turns itself low. The whole party goes GLOOMY - takes less damage, and Ink drips back each round.",
    kind: "emotion_party", emotion: "gloomy",
  },
  // ---- Stub
  sun_stroke: {
    name: "Sun Stroke", ink: 3, target: "enemy",
    desc: "One proud stroke of warm yellow. 120% damage, and Stub gets GIGGLY drawing it.",
    kind: "attack", mult: 1.2, selfEmotion: "giggly",
  },
  sunrise_sketch: {
    name: "Sunrise Sketch", ink: 8, target: "self",
    desc: "Stub draws a sun so warm the whole party turns GIGGLY.",
    kind: "emotion_party", emotion: "giggly",
  },
  bright_idea: {
    name: "Bright Idea", ink: 0, target: "ally",
    desc: "Stub shares its wax. Gives an ally 6 of Stub's Ink.",
    kind: "inkgift", amount: 6,
  },
  tiny_sun: {
    name: "Tiny Sun", ink: 5, target: "enemy",
    desc: "A sun so small and proud the enemy can't help it. Enemy becomes GIGGLY - it takes two hearts a round, even the same one twice.",
    kind: "emotion", emotion: "giggly",
  },
};
