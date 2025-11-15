import { Quality, Memory, SilencePoem, Lantern } from "../types";

export const qualities: Quality[] = [
  {
    id: "honest",
    title: "Relentless",
    description:
      "You come back no matter what, hitting every brick wall until it crumbles.",
  },
  {
    id: "hardworking",
    title: "Curious",
    description: "Your thirst for knowledge makes you a Swiss Army knife.",
  },
  {
    id: "relentless",
    title: "Resilient",
    description:
      "You don't give up no matter what life throws. You bend, you adapt, but you never break.",
  },
  {
    id: "dependable",
    title: "Dependable",
    description:
      "When the world feels uncertain, you are the one constant I can always trust.",
  },
  {
    id: "optimistic",
    title: "Optimistic",
    description:
      "Even in darkness, you find a sliver lining in the sky and burn brighter than stars.",
  },
  {
    id: "kind",
    title: "Devoted",
    description:
      "I have seen you grow into the person you are and never once complain about what I wanted you to be.",
  },
];

export const memories: Memory[] = [
  {
    id: "first-meeting",
    title: "First Meeting",
    date: "The Beginning",
    description: "The moment our worlds collided, and everything changed.",
    position: { x: 20, y: 30 },
  },
  {
    id: "shared-silence",
    title: "Shared Silence",
    description:
      "From an impulsive decision to sharing contacts to just listening to songs in silence, we understood each other from the start.",
    position: { x: 70, y: 40 },
  },
  {
    id: "random-night",
    title: "Flaws and Less",
    description:
      "Somewhere in the journey, we understood each other as humans, burdened with flaws and expected less of ourselves, allowing us to live.",
    position: { x: 40, y: 70 },
  },
  {
    id: "promise",
    title: "Promises Made",
    description:
      "When words became commitments, and commitments shaped us, the journey became the destination.",
    position: { x: 60, y: 60 },
  },
  {
    id: "challenge",
    title: "Growth",
    description:
      "We grew to complement each other, to understand each other, and to be the best version of ourselves.",
    position: { x: 30, y: 50 },
  },
];

export const letterContent = `Dearest Harshitha,

There are moments in life when words feel inadequate, when language itself seems too small to hold the weight of what we feel. This is one of those moments.

Today, you turn 21. A milestone, a marker of time, but more than that, a celebration of you, the incredible person you are and the journey you've taken to become her.

You are not just someone I love—you are the reason I understand what love truly is.

You've shown me that strength isn't about never falling; it's about getting back up every single time. You've shown me that the eagerness that lessons should be learnt with, the kindness that people should be loved with, and how to priotize what's most important. You've proven its possible to be a person who doesn't give up, who doesn't give up, who doesn't give up.

In every small moment we've shared: the quiet nights, the random conversations, the comfortable silences, you've woven yourself into the fabric of who I am. I am better because of you. I am whole because of you.

This isn't just a letter. It's a promise. A promise that no matter where life takes us, no matter what challenges we face, I will always see you. The real you. The you that exists beyond what the world sees.

You are my constant and it has been a privilege and a pleasure to watch you grow into the remarkable woman you are today.

Happy 21st birthday, dear. Here's to you, and only you, and to the countless promises to be fulfilled to yourself.

Forever, in every small thing.

Yours always.

Asmit.`;

export const promises = [
  "I promise to see you when the world looks away.",
  "I promise to hold remind you of the sparkle in your eyes when the days are dim.",
  "I promise to make sure you are always on the road to become the best girl you can be.",
  "I promise to help you see through the fogs of life and be a beacon of hope.",
  "I promise that I will help you dream.",
];

export const silencePoems: SilencePoem[] = [
  {
    id: "silence-1",
    content: "You stayed.\nThank you for listening to the quiet.",
  },
  {
    id: "silence-2",
    content: "In stillness, we find what words cannot hold.\nYou were here.",
  },
  {
    id: "silence-3",
    content:
      "Silence is not emptiness, it's where hearts speak loudest.\nYou heard.",
  },
  {
    id: "silence-4",
    content:
      "Every breath you breathe is a promise.\nI feel it, even in the quiet.",
  },
  {
    id: "silence-5",
    content: "The world fades, but you remain.\nAlways.",
  },
  {
    id: "silence-6",
    content: "In these quiet moments, I see forever.\nWith you.",
  },
];

export const whispers: string[] = [
  "you were light, even when I forgot the sun",
  "time folds where love lingers",
  "the silence kept your shape",
  "letters breathe when no one reads them",
  "people bloom around you because you cherish them",
  "in the hush between words, breath dear",
  "we learned to speak in the winks of eyes",
  "softly, the world rearranged itself around us",
  "there's a map etched in your quiet, waiting to be understood",
  "I keep the small things you left behind",
];

export const lanterns: Lantern[] = [
  {
    id: "lantern-memory-1",
    type: "standard",
    title: "This Lantern Remembers",
    content:
      "This lantern remembers the hardships you went through to still be with everyone.",
  },
  {
    id: "lantern-promise-1",
    type: "standard",
    title: "A Promise Whispered",
    content:
      "In this lantern, the promises we made to each other reaches the stars.",
  },
  {
    id: "lantern-fear-1",
    type: "standard",
    title: "Fear Overcome",
    content:
      "This lantern holds the fear we faced and the courage we drew to overcome it. Belief is always the strength.",
  },
  {
    id: "lantern-wish-1",
    type: "standard",
    title: "A Wish for You",
    content:
      "This lantern holds a wish for you, a wish for the future, and a wish for the present, that is you.",
  },
  {
    id: "lantern-letter-fragment",
    type: "standard",
    title: "Letter Fragment",
    content:
      "A piece of a letter I wrote but never sent: 'The world seem smaller when you're in it, but deeper than it ever was.'",
  },
  {
    id: "lantern-turning-point",
    type: "standard",
    title: "A Turning Point",
    content:
      "This lantern marks the moment everything shifted. The moment you stopped questioning and started believing.",
  },
  {
    id: "lantern-whisper-echo",
    type: "standard",
    title: "Echo of a Whisper",
    content:
      "This lantern is an echo from earlier in our journey: 'I cherish you.' This means everything.",
  },
  {
    id: "lantern-silent-glow",
    type: "standard",
    title: "Silent Lantern",
    content:
      "This one holds no words. Only light. Only the feeling of peace when we are with each other, when nothing needs to be said.",
  },
];

export const lockedLanterns: Lantern[] = [
  {
    id: "lantern-locked-1",
    type: "locked",
    title: "Not Yet...",
    content:
      "Secret kept in quiet: This is to remind you that you are on your own journey. You'll find missing pieces when the time is right.",
    timeUnlockMs: 90000,
  },
  {
    id: "lantern-locked-2",
    type: "locked",
    title: "The Next Step",
    content:
      "Secret of the road ahead: Journey will be long, but you'll find your way. Journey will be harsh, but I'll make sure you can endure. Trust the steps.",
    timeUnlockMs: 90000,
  },
  {
    id: "lantern-locked-3",
    type: "locked",
    title: "The Final Promise",
    content:
      "Final secret: If you stayed long enough to open this, let it be a promise to yourself to never give up on yourself.",
    timeUnlockMs: 90000,
  },
];

export const goldenLanterns: Lantern[] = [
  {
    id: "lantern-golden-1",
    type: "golden",
    title: "The Golden Thread",
    content:
      "Every moment with you is a thread woven into something more. This Golden Lantern glows because it carries all of them—every laugh, every silence, every breath we've shared. This is the fabric of forever.",
    unlockThreshold: 3,
  },
  {
    id: "lantern-golden-2",
    type: "golden",
    title: "Forever in a Moment",
    content:
      "What is forever if not just a moment? This Golden Lantern glows forever because the moments spent together fuels its shine.",
    unlockThreshold: 3,
  },
];

export const hiddenLanterns: Lantern[] = [
  {
    id: "lantern-hidden-1",
    type: "hidden",
    title: "The Forgotten Moment",
    content:
      "Sometimes the most important moments are the ones we almost missed. This lantern signifies your bold move to reach out with a letter, weaving our future years together.",
    unlockTrigger: 3,
  },
  {
    id: "lantern-hidden-2",
    type: "hidden",
    title: "In the Quiet Hours",
    content:
      "At 3 AM, when the world sleeps, we think of each other. This lantern shares our longingness hidden beneath.",
    unlockTrigger: 3,
  },
  {
    id: "lantern-hidden-3",
    type: "hidden",
    title: "The Fear Within",
    content:
      "Your fear of being not enough was real. This lantern glows because you faced that fear and chose to overcome it by always improving yourself.",
    unlockTrigger: 3,
  },
];

export const revelationLanterns: Lantern[] = [
  {
    id: "lantern-revelation-1",
    type: "revelation",
    title: "The Truth Unspoken",
    content:
      "In all the layers before this, I've portrayed you from my eyes. But here, in this moment, I need to tell you the complete truth: You are proof that I was worth knowing, and that gave me a sense of purpose to fulfil my potential. Thank you for being my mirror.",
    unlockTrigger: 5,
    revealEffect: "atmosphere-shift",
    revealMessage: "A profound truth has been revealed. The road has changed.",
  },
  {
    id: "lantern-revelation-2",
    type: "revelation",
    title: "The Path Forward",
    content:
      "You have walked through layers of memory, promise, and light. You have opened lanterns and discovered truths about yourself and us. Now, standing here at this revelation point, I want to tell you something: You found this path of your life because you were brave enough to decide to love yourself to the fullest and put yourself first. Never forget you chose yourself and that made all the difference.",
    unlockTrigger: 5,
    revealEffect: "skip-layer",
    revealMessage: "Hidden pathways unfold before your grace.",
  },
];
