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
  },
  {
    id: "sixpack-ring",
    obstacleType: "sixpack",
    icon: "\U0001f37a",
    factTitle: "Six-Pack Ring Discovered",
    fact: "The plastic rings that hold drink cans together form perfect loops. Seabirds, seals and turtles can push their heads or flippers through them and never get free.",
    awarenessTitle: "Why Are Loops So Dangerous?",
    awarenessParagraphs: [
      "A young animal that swims through a plastic ring keeps growing, but the ring does not. Over months the loop cuts deeper and deeper into its body.",
      "Rings are almost invisible in water, so animals rarely see them until they are already caught. Unlike a net, a single ring is too small to spot from a boat and be removed.",
      "Cutting every loop before you bin it takes two seconds, and many drink makers now use cardboard or compostable rings instead."
    ],
    quiz: [
      {
        question: "Why is a plastic ring especially dangerous to a young animal?",
        options: [
          "It changes the colour of the water",
          "The animal keeps growing but the ring does not, so it cuts in deeper",
          "It makes the animal swim faster",
          "It dissolves into salt"
        ],
        correctAnswer: 1,
        explanation: "The loop stays the same size while the animal grows, so an entanglement that starts loose slowly becomes a deep wound."
      },
      {
        question: "What should you do with a six-pack ring before binning it?",
        options: [
          "Cut every loop open first",
          "Fold it in half",
          "Rinse it in the sea",
          "Tie it into a knot"
        ],
        correctAnswer: 0,
        explanation: "Snipping each loop means that even if the ring escapes into the ocean it can no longer trap an animal."
      }
    ]
  },
  {
    id: "released-balloon",
    obstacleType: "balloon",
    icon: "\U0001f388",
    factTitle: "Released Balloon Discovered",
    fact: "Balloons released into the sky do not vanish. They drift for hundreds of kilometres, burst, and fall back down \u2014 and a huge share of them land in the ocean.",
    awarenessTitle: "Where Do Released Balloons Actually Go?",
    awarenessParagraphs: [
      "A balloon let go at a party can travel for days on the wind before it bursts. Researchers have tracked balloons landing more than a thousand kilometres from where they were released.",
      "A burst balloon lands on the water as a soft, translucent ribbon of rubber \u2014 almost indistinguishable from a jellyfish or squid to a turtle or an albatross. Studies of seabirds have found that soft plastics like balloons are far more likely to be fatal when swallowed than hard plastic fragments.",
      "The attached string is a second hazard, tangling around wings, beaks and flippers. Bubbles, kites, or planted flowers make great balloon-free celebrations."
    ],
    quiz: [
      {
        question: "What happens to a balloon released into the sky?",
        options: [
          "It leaves the atmosphere",
          "It dissolves harmlessly in the clouds",
          "It drifts, bursts, and falls back down \u2014 often into the ocean",
          "It turns into rain"
        ],
        correctAnswer: 2,
        explanation: "What goes up comes down. Released balloons have been tracked falling into the sea over a thousand kilometres away."
      },
      {
        question: "Why is a burst balloon so dangerous for a sea turtle?",
        options: [
          "It is sharp like glass",
          "Soft, floating rubber looks just like a jellyfish",
          "It is radioactive",
          "It makes a loud noise"
        ],
        correctAnswer: 1,
        explanation: "Soft plastics resemble the turtle's natural prey, and are far more likely to be swallowed and block the gut than hard fragments."
      }
    ]
  },
  {
    id: "microplastics",
    obstacleType: "microbeads",
    icon: "\u2728",
    factTitle: "Microplastic Cloud Discovered",
    fact: "Microplastics are plastic pieces smaller than five millimetres. They are now found everywhere scientists have looked \u2014 from Arctic sea ice to the deepest ocean trench.",
    awarenessTitle: "The Pollution You Cannot See",
    awarenessParagraphs: [
      "Some microplastics arrive already tiny \u2014 beads from cosmetics, or the synthetic fibres that shed from fleece and polyester every time it is washed. A single wash load can release hundreds of thousands of fibres that slip straight through water-treatment filters.",
      "The rest are secondary microplastics: bottles, bags and wrappers ground down by sun and waves into fragments too small to ever collect again.",
      "Plankton eat them, small fish eat the plankton, and bigger fish eat those \u2014 so the plastic climbs the food chain. Choosing natural fibres, using a washing-machine filter bag and avoiding products with plastic beads all cut the flow at its source."
    ],
    quiz: [
      {
        question: "How small does a plastic piece have to be to count as a microplastic?",
        options: [
          "Smaller than five millimetres",
          "Smaller than a football",
          "Smaller than one metre",
          "Smaller than a car"
        ],
        correctAnswer: 0,
        explanation: "Five millimetres \u2014 about the width of a pencil eraser \u2014 is the standard cut-off for a microplastic."
      },
      {
        question: "Where do many ocean microfibres come from?",
        options: [
          "Rain clouds",
          "Volcanoes on the sea floor",
          "Washing synthetic clothes like fleece and polyester",
          "Fish scales"
        ],
        correctAnswer: 2,
        explanation: "Each wash sheds hundreds of thousands of plastic fibres, most of which pass straight through treatment plants into rivers and the sea."
      }
    ]
  }
];

const MODULE_BY_OBSTACLE_TYPE = {};
LEARNING_MODULES.forEach(m => { MODULE_BY_OBSTACLE_TYPE[m.obstacleType] = m; });

const OBSTACLE_TYPES = ["bottle", "bag", "net", "straw", "wrapper", "cup", "sixpack", "balloon", "microbeads"];

const COLLECTIBLE_TYPES = {
  fish: { points: 10, kind: "food" },
  seaweed: { points: 10, kind: "food" },
  shell: { points: 10, kind: "food" },
  goldenShell: { points: 50, kind: "bonus" },
  shieldBubble: { points: 0, kind: "shield" },
  cleanupToken: { points: 100, kind: "token" },
  rescuePod: { points: 75, kind: "species" }
};
