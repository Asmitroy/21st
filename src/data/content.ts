import { Quality, Memory, SilencePoem, Lantern } from "../types";

export const qualities: Quality[] = [
  {
    id: "honest",
    title: "Honest",
    description:
      "Your honesty isn't blunt; it's the mirror that keeps me true.",
  },
  {
    id: "hardworking",
    title: "Hardworking",
    description:
      "You pour yourself into everything, and it shows in the quiet strength of who you are.",
  },
  {
    id: "relentless",
    title: "Relentless",
    description: "You don't give up. You bend, you adapt, but you never break.",
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
      "Even in darkness, you find a sliver of light and hold it like it's the whole sky.",
  },
  {
    id: "kind",
    title: "Kind",
    description:
      "Your kindness isn't loud or performative—it's in the small things that matter most.",
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
    description: "That night we said nothing, but understood everything.",
    position: { x: 70, y: 40 },
  },
  {
    id: "random-night",
    title: "Random Night",
    description:
      "Just another evening that became extraordinary simply because you were there.",
    position: { x: 40, y: 70 },
  },
  {
    id: "promise",
    title: "The Promise",
    description: "When words became commitments, and commitments became us.",
    position: { x: 60, y: 60 },
  },
  {
    id: "challenge",
    title: "Through Challenges",
    description:
      "We faced storms together and came out stronger on the other side.",
    position: { x: 30, y: 50 },
  },
];

export const letterContent = `My Dearest,

There are moments in life when words feel inadequate, when language itself seems too small to hold the weight of what we feel. This is one of those moments.

I've tried a thousand times to tell you what you mean to me, but every attempt falls short. How do I describe the way your presence calms the chaos in my mind? How do I explain that your laughter has become my favorite sound, or that your smile is the first thing I think of when I wake?

You are not just someone I love—you are the reason I understand what love truly is.

You've shown me that strength isn't about never falling; it's about getting back up every single time. You've taught me that honesty isn't harsh—it's the foundation of everything real. And you've proven that optimism isn't naivety; it's the bravest choice we can make.

In every small moment we've shared—the quiet evenings, the random conversations, the comfortable silences—you've woven yourself into the fabric of who I am. I am better because of you. I am whole because of you.

This isn't just a letter. It's a promise. A promise that no matter where life takes us, no matter what challenges we face, I will always see you. The real you. The you that exists beyond what the world sees.

You are my constant. My light. My home.

Forever, in every small thing.

Yours always.`;

export const promises = [
  "I promise to see you when the world looks away.",
  "I promise to hold your light when you forget how bright you shine.",
  "I promise to build a thousand little worlds with you.",
  "I promise to choose you, every single day.",
  "I promise that this—us—is forever.",
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
      "Silence is not emptiness—it's where hearts speak loudest.\nYou heard.",
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
  "some things bloom in memory alone",
  "in the hush between words, I find you",
  "we learned to speak in the space of a breath",
  "softly, the world rearranged itself around us",
  "there's a map etched in your quiet",
  "I keep the small things you left behind",
];

export const lanterns: Lantern[] = [
  {
    id: "lantern-memory-1",
    type: "standard",
    title: "This Lantern Remembers",
    content:
      "This lantern remembers the night I realized you were no longer just someone I loved—you became the person I couldn't imagine a life without.",
  },
  {
    id: "lantern-promise-1",
    type: "standard",
    title: "A Promise Whispered",
    content:
      "In this lantern, I place the promise that no matter what storms come, I will always find my way back to you.",
  },
  {
    id: "lantern-fear-1",
    type: "standard",
    title: "Fear Overcome",
    content:
      "This lantern holds the fear I faced and the courage you gave me to overcome it. Your belief in me became my strength.",
  },
  {
    id: "lantern-wish-1",
    type: "standard",
    title: "A Wish for You",
    content:
      "I wish you could see yourself the way I see you—not as you are, but as the infinite possibility you've always been.",
  },
  {
    id: "lantern-letter-fragment",
    type: "standard",
    title: "Letter Fragment",
    content:
      "A piece of a letter I wrote but never sent: 'The world is smaller when you're in it, and I mean that as the highest compliment.'",
  },
  {
    id: "lantern-turning-point",
    type: "standard",
    title: "A Turning Point",
    content:
      "This lantern marks the moment everything shifted. The moment I stopped questioning and started knowing—knowing that this, us, is real.",
  },
  {
    id: "lantern-whisper-echo",
    type: "standard",
    title: "Echo of a Whisper",
    content:
      "An echo from earlier in our journey: 'You stayed. Thank you for listening to the quiet.' You always listened.",
  },
  {
    id: "lantern-silent-glow",
    type: "standard",
    title: "Silent Lantern",
    content:
      "This one holds no words. Only light. Only the feeling of peace when you're beside me, when nothing needs to be said.",
  },
];

export const lockedLanterns: Lantern[] = [
  {
    id: "lantern-locked-1",
    type: "locked",
    title: "Not Yet...",
    content:
      "This lantern waits. It holds something deeper, something meant for later in your journey. Keep walking.",
    unlockThreshold: 3,
  },
  {
    id: "lantern-locked-2",
    type: "locked",
    title: "The Next Step",
    content:
      "When you're ready, this lantern will reveal what you need to know. Trust the timing. Trust yourself.",
    unlockThreshold: 3,
  },
  {
    id: "lantern-locked-3",
    type: "locked",
    title: "The Final Promise",
    content:
      "This lantern holds the final promise—the one that will reframe everything you've seen before. Unlock it when the time is right.",
    unlockThreshold: 3,
  },
];

export const goldenLanterns: Lantern[] = [
  {
    id: "lantern-golden-1",
    type: "golden",
    title: "The Golden Thread",
    content:
      "Every moment with you is a thread woven into something sacred. This lantern glows because it carries all of them—every laugh, every silence, every breath we've shared. This is the fabric of forever.",
    unlockThreshold: 3,
  },
  {
    id: "lantern-golden-2",
    type: "golden",
    title: "Forever in a Moment",
    content:
      "In one single moment with you, I found forever. Not the kind measured in time, but the kind that exists outside of it. This lantern burns because it holds the truth: some people aren't moments in your life—they ARE your life.",
    unlockThreshold: 3,
  },
];

export const hiddenLanterns: Lantern[] = [
  {
    id: "lantern-hidden-1",
    type: "hidden",
    title: "The Forgotten Moment",
    content:
      "Sometimes the most important moments are the ones we almost missed. This is the story of a night I almost didn't reach out, and how that hesitation almost cost me everything. But I chose you. I always choose you.",
    unlockTrigger: 3,
  },
  {
    id: "lantern-hidden-2",
    type: "hidden",
    title: "In the Quiet Hours",
    content:
      "At 3 AM, when the world sleeps, I think of you. These are the hours when truth is loudest, when pretense fades, and all that remains is the simple, absolute fact: you are my home.",
    unlockTrigger: 3,
  },
  {
    id: "lantern-hidden-3",
    type: "hidden",
    title: "The Fear I Carry",
    content:
      "I'm afraid of losing you. Not because I don't trust us, but because I know what it means to have everything and then have it vanish. But this fear is proof of something beautiful: I have never wanted anything more.",
    unlockTrigger: 3,
  },
];

export const revelationLanterns: Lantern[] = [
  {
    id: "lantern-revelation-1",
    type: "revelation",
    title: "The Truth Unspoken",
    content:
      "In all the layers before this, I've shown you pieces of my heart. But here, in this moment, I need to tell you the complete truth: You are not just my greatest love. You are my greatest achievement. You are proof that I was worth knowing, worth choosing, worth keeping. This is the revelation that changes everything.",
    unlockTrigger: 5,
    revealEffect: "atmosphere-shift",
    revealMessage: "A profound truth has been revealed. The road has changed.",
  },
  {
    id: "lantern-revelation-2",
    type: "revelation",
    title: "The Path Forward",
    content:
      "We have walked through layers of memory, promise, and light. We have opened lanterns and discovered truths about ourselves and each other. Now, standing here at this revelation point, I want to ask you something: Are you ready to see what comes next? Are you ready for the silence to transform into something new? This is where your journey becomes our future.",
    unlockTrigger: 5,
    revealEffect: "skip-layer",
    revealMessage: "You have unlocked a hidden path. The choice is yours.",
  },
];
