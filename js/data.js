// ===================== data.js =====================
// Educational content + obstacle/collectible type configuration.
// Kept as a clean, editable data structure per the design spec.

const LEARNING_MODULES = [
  {
    id: "plastic-bottle",
    obstacleType: "bottle",
    icon: "🍼",
    factTitle: "Plastic Bottle Discovered",
    fact: "Plastic bottles can remain in the environment for hundreds of years. They do not simply disappear; they can break down into tiny particles called microplastics.",
    awarenessTitle: "Why Does Plastic Pollution Matter?",
    awarenessParagraphs: [
      "Plastic waste can travel through streets, drains, and rivers before eventually reaching the ocean. Once it enters the marine environment, it becomes extremely difficult to remove.",
      "Marine animals may eat plastic because they mistake it for food, and larger objects can gradually break into microplastics that enter marine food chains.",
      "We can help by reducing single-use plastic, carrying reusable bottles, and disposing of waste responsibly."
    ],
    quiz: [
      {
        question: "Why are plastic bottles harmful to the ocean?",
        options: [
          "They make the ocean salty",
          "They can remain for a very long time and break into microplastics",
          "They create oxygen for fish",
          "They make coral grow faster"
        ],
        correctAnswer: 1,
        explanation: "Plastic can persist for centuries and fragment into microplastics that enter the food chain."
      },
      {
        question: "Which action can help reduce plastic bottle pollution?",
        options: [
          "Throwing bottles into rivers",
          "Burning bottles near the beach",
          "Reusing bottles and recycling them responsibly",
          "Leaving bottles on the sand"
        ],
        correctAnswer: 2,
        explanation: "Reusing and responsibly recycling bottles keeps plastic out of the ocean."
      }
    ]
  },
  {
    id: "plastic-bag",
    obstacleType: "bag",
    icon: "🛍️",
    factTitle: "Plastic Bag Discovered",
    fact: "Marine animals can mistake plastic bags for food. Turtles, fish, and seabirds may suffer serious injuries or death after swallowing plastic.",
    awarenessTitle: "How Do Plastic Bags Harm Marine Life?",
    awarenessParagraphs: [
      "Floating in the water, a plastic bag can look just like a jellyfish — a favorite meal for sea turtles.",
      "Once swallowed, plastic can block an animal's digestive system, leaving it unable to eat real food.",
      "Choosing reusable bags and disposing of plastic bags properly keeps them out of waterways and oceans."
    ],
    quiz: [
      {
        question: "Why do sea turtles sometimes eat plastic bags?",
        options: [
          "Bags taste like seaweed",
          "Bags can look like jellyfish, a common food source",
          "Turtles cannot see plastic",
          "Bags float near their nests"
        ],
        correctAnswer: 1,
        explanation: "Floating plastic bags resemble jellyfish, which sea turtles regularly eat."
      },
      {
        question: "What is a simple way to reduce plastic bag pollution?",
        options: [
          "Use reusable bags instead of single-use plastic",
          "Bury bags on the beach",
          "Throw bags into storm drains",
          "Leave bags floating in the water"
        ],
        correctAnswer: 0,
        explanation: "Reusable bags cut down on the number of single-use plastic bags that can reach the ocean."
      }
    ]
  },
  {
    id: "fishing-net",
    obstacleType: "net",
    icon: "🕸️",
    factTitle: "Lost Fishing Gear Discovered",
    fact: "Abandoned fishing nets can continue trapping and injuring marine animals for years. This is known as ghost fishing.",
    awarenessTitle: "What Is Ghost Fishing?",
    awarenessParagraphs: [
      "When fishing nets are lost or abandoned at sea, they don't stop working — they keep drifting and trapping animals long after fishers are gone.",
      "Turtles, dolphins, seals, and fish can become entangled, making it hard for them to swim, breathe, or feed.",
      "Proper gear disposal and net-recovery programs help remove ghost nets from the ocean before they cause more harm."
    ],
    quiz: [
      {
        question: "What is 'ghost fishing'?",
        options: [
          "Fishing only at night",
          "Abandoned nets continuing to trap animals",
          "A myth about sea monsters",
          "Fishing without a license"
        ],
        correctAnswer: 1,
        explanation: "Ghost fishing happens when lost nets keep trapping marine animals long after they're abandoned."
      },
      {
        question: "How can ghost nets be kept from harming marine life?",
        options: [
          "Leaving them wherever they drift",
          "Cutting them into smaller pieces and leaving them at sea",
          "Proper gear disposal and net-recovery programs",
          "Ignoring the problem"
        ],
        correctAnswer: 2,
        explanation: "Responsible disposal and dedicated recovery programs actively remove ghost nets from the ocean."
      }
    ]
  },
  {
    id: "plastic-straw",
    obstacleType: "straw",
    icon: "🥤",
    factTitle: "Plastic Straw Discovered",
    fact: "Plastic straws are too lightweight to be recycled easily, and they often wash into the ocean where they can injure marine animals like sea turtles.",
    awarenessTitle: "Why Do Small Items Matter?",
    awarenessParagraphs: [
      "A single straw seems tiny, but billions are used and discarded every single day around the world.",
      "Straws can lodge in the nostrils or throats of marine animals, causing pain and injury.",
      "Choosing reusable straws, or skipping them altogether, is a small habit that adds up to a big difference."
    ],
    quiz: [
      {
        question: "Why are plastic straws especially problematic for recycling?",
        options: [
          "They are too heavy for machines",
          "They are too lightweight and small to be recycled easily",
          "They are made of glass",
          "They dissolve instantly"
        ],
        correctAnswer: 1,
        explanation: "Their light weight and small size make straws slip through recycling sorting systems."
      },
      {
        question: "What is one simple way to cut down on straw waste?",
        options: [
          "Use a reusable straw or skip one entirely",
          "Use ten straws at once",
          "Throw straws into the ocean",
          "Burn straws on the beach"
        ],
        correctAnswer: 0,
        explanation: "Reusable straws — or simply going without — prevent plastic straws from ever reaching the ocean."
      }
    ]
  },
  {
    id: "food-wrapper",
    obstacleType: "wrapper",
    icon: "🍬",
    factTitle: "Food Wrapper Discovered",
    fact: "Food wrappers are among the most common items found during beach cleanups. Their thin, flexible plastic breaks apart easily into microplastics.",
    awarenessTitle: "Why Are Wrappers So Common in the Ocean?",
    awarenessParagraphs: [
      "Wrappers are lightweight, so wind and rain can easily carry them from streets and picnics into drains and rivers.",
      "Because they break apart quickly, wrappers create huge amounts of microplastic that are almost impossible to clean up.",
      "Disposing of wrappers responsibly, and supporting less packaging overall, helps reduce this fast-growing source of pollution."
    ],
    quiz: [
      {
        question: "Why do food wrappers break down into microplastics so quickly?",
        options: [
          "They are made of metal",
          "Their thin, flexible plastic breaks apart easily",
          "They are biodegradable",
          "They sink immediately"
        ],
        correctAnswer: 1,
        explanation: "Thin, flexible wrapper plastic fragments easily, creating large amounts of microplastic."
      },
      {
        question: "What commonly carries wrappers from land into the ocean?",
        options: [
          "Wind and rain washing them into drains and rivers",
          "Wrappers can fly on their own",
          "They are delivered directly by ships",
          "They grow in the ocean naturally"
        ],
        correctAnswer: 0,
        explanation: "Litter is often swept by wind and rain into drains and rivers that lead to the sea."
      }
    ]
  },
  {
    id: "disposable-cup",
    obstacleType: "cup",
    icon: "🥤",
    factTitle: "Disposable Cup Discovered",
    fact: "Many disposable cups are lined with a thin plastic coating, which means they can't be easily recycled and often end up polluting waterways and oceans.",
    awarenessTitle: "The Hidden Plastic in 'Paper' Cups",
    awarenessParagraphs: [
      "Many disposable cups look like paper but are lined with plastic to hold liquid, making them very hard to recycle.",
      "When littered, these cups break down slowly and can be mistaken for food by fish and seabirds.",
      "Bringing a reusable cup or bottle is one of the easiest everyday swaps to cut down on ocean plastic."
    ],
    quiz: [
      {
        question: "Why can't most disposable cups be easily recycled?",
        options: [
          "They are lined with a thin plastic coating",
          "They are too big",
          "They are made of glass",
          "They are too colorful"
        ],
        correctAnswer: 0,
        explanation: "The plastic lining that keeps liquid from leaking also makes these cups difficult to recycle."
      },
      {
        question: "What's an easy everyday swap to reduce cup waste?",
        options: [
          "Using a new disposable cup every time",
          "Bringing a reusable cup or bottle",
          "Throwing cups into rivers",
          "Stacking cups on the beach"
        ],
        correctAnswer: 1,
        explanation: "A reusable cup or bottle avoids the need for a new disposable cup each time."
      }
    ]
  }
];

const MODULE_BY_OBSTACLE_TYPE = {};
LEARNING_MODULES.forEach(m => { MODULE_BY_OBSTACLE_TYPE[m.obstacleType] = m; });

const OBSTACLE_TYPES = ["bottle", "bag", "net", "straw", "wrapper", "cup"];

const COLLECTIBLE_TYPES = {
  fish: { points: 10, kind: "food" },
  seaweed: { points: 10, kind: "food" },
  shell: { points: 10, kind: "food" },
  goldenShell: { points: 50, kind: "bonus" },
  shieldBubble: { points: 0, kind: "shield" },
  cleanupToken: { points: 100, kind: "token" }
};
