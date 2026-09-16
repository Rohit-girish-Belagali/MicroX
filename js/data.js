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

// ---------------------------------------------------------- Marine species --
// Unlocked by rescuing animals mid-run; browsable any time from the Codex.
// `status` uses IUCN Red List wording and must match a STATUS_RANK key below.

const MARINE_SPECIES = [
  {
    id: "green-sea-turtle",
    emoji: "🐢",
    name: "Green Sea Turtle",
    scientificName: "Chelonia mydas",
    group: "Reptile",
    habitat: "Warm coastal waters, seagrass meadows and coral reefs worldwide",
    diet: "Seagrass and algae — the only sea turtle that is mostly vegetarian as an adult",
    size: "Up to 1.5 m shell length, 190 kg",
    status: "Endangered",
    facts: [
      "It is named for the greenish colour of the fat under its shell, not for the shell itself.",
      "Females return to the very beach where they hatched to lay their own eggs, sometimes crossing an entire ocean to get there."
    ],
    help: "Keep beaches dark and clear at night — hatchlings navigate by moonlight on the water, and bright lights or litter send them the wrong way.",
    quiz: {
      question: "What makes the adult green sea turtle unusual among sea turtles?",
      options: [
        "It is mostly vegetarian, grazing on seagrass",
        "It lives entirely in fresh water",
        "It never leaves the deep ocean",
        "It has no shell"
      ],
      correctAnswer: 0,
      explanation: "Adult green turtles graze seagrass meadows, which keeps the grass healthy and growing — they are the ocean's lawnmowers."
    }
  },
  {
    id: "hawksbill-turtle",
    emoji: "🐢",
    name: "Hawksbill Turtle",
    scientificName: "Eretmochelys imbricata",
    group: "Reptile",
    habitat: "Tropical coral reefs and rocky shallows",
    diet: "Sea sponges, jellyfish and anemones",
    size: "Up to 1 m shell length, 80 kg",
    status: "Critically Endangered",
    facts: [
      "Its narrow, pointed beak reaches into reef crevices for sponges that almost nothing else can eat.",
      "By clearing sponges off the reef it makes room for coral to grow, so a reef without hawksbills slowly gets overgrown."
    ],
    help: "Never buy 'tortoiseshell' jewellery or ornaments — the trade in their patterned shells is the main reason this species became critically endangered.",
    quiz: {
      question: "How does the hawksbill turtle help a coral reef stay healthy?",
      options: [
        "It scares away all the fish",
        "It eats sponges that would otherwise crowd out the coral",
        "It builds the coral itself",
        "It blocks sunlight from the reef"
      ],
      correctAnswer: 1,
      explanation: "Grazing sponges off the reef frees up space for slow-growing coral, so hawksbills act as reef gardeners."
    }
  },
  {
    id: "bottlenose-dolphin",
    emoji: "🐬",
    name: "Bottlenose Dolphin",
    scientificName: "Tursiops truncatus",
    group: "Mammal",
    habitat: "Temperate and tropical seas worldwide, often close to shore",
    diet: "Fish, squid and shrimp",
    size: "2–4 m long, up to 650 kg",
    status: "Least Concern",
    facts: [
      "It 'sees' with sound: rapid clicks bounce off objects and the returning echoes reveal shape, distance and even what is hidden under sand.",
      "Dolphins sleep with one half of the brain at a time, so one eye stays open and they never stop surfacing to breathe."
    ],
    help: "Cut loops and lines before binning them, and never feed wild dolphins — fed dolphins lose their fear of boats and get badly injured by propellers.",
    quiz: {
      question: "How does a bottlenose dolphin find food in dark or murky water?",
      options: [
        "By smelling it from far away",
        "By waiting for it to glow",
        "By echolocation — sending out clicks and reading the echoes",
        "It only hunts in bright sunlight"
      ],
      correctAnswer: 2,
      explanation: "Echolocation clicks return as echoes that tell the dolphin an object's shape, distance and texture — even buried prey."
    }
  },
  {
    id: "giant-manta-ray",
    emoji: "🪽",
    name: "Giant Manta Ray",
    scientificName: "Mobula birostris",
    group: "Fish (cartilaginous)",
    habitat: "Open ocean and offshore reefs in tropical and subtropical seas",
    diet: "Zooplankton, filtered from the water while swimming",
    size: "Up to 7 m wingspan, 2,000 kg",
    status: "Endangered",
    facts: [
      "Every manta has a unique pattern of spots on its belly, so researchers identify individuals the way police use fingerprints.",
      "Despite its size it is completely harmless — it has no sting and no teeth worth the name, and simply filters tiny plankton from the water."
    ],
    help: "Choose reef-safe sunscreen and support marine protected areas; mantas are slow to reproduce, raising a single pup every few years.",
    quiz: {
      question: "How do scientists tell individual manta rays apart?",
      options: [
        "By the unique pattern of spots on the belly",
        "By counting their teeth",
        "By the colour of their eyes",
        "All mantas look identical"
      ],
      correctAnswer: 0,
      explanation: "Belly spot patterns are unique and permanent, so a single photograph can identify a manta for life."
    }
  },
  {
    id: "sea-otter",
    emoji: "🦦",
    name: "Southern Sea Otter",
    scientificName: "Enhydra lutris nereis",
    group: "Mammal",
    habitat: "Cold coastal kelp forests of the North Pacific",
    diet: "Sea urchins, crabs, clams and abalone",
    size: "1–1.5 m long, up to 45 kg",
    status: "Endangered",
    facts: [
      "It has the densest fur of any animal — up to a million hairs per square inch — because unlike seals it has no blubber to keep warm.",
      "It uses stones as tools to crack shells open, often keeping one favourite rock tucked in a pouch of loose skin under its arm."
    ],
    help: "Protect kelp forests: otters eat the urchins that would otherwise mow the kelp down, so fewer otters means less kelp and less carbon stored.",
    quiz: {
      question: "Why is a sea otter's fur so extraordinarily dense?",
      options: [
        "To help it float higher",
        "It has no blubber, so fur is its only insulation",
        "To make it invisible to sharks",
        "To store food in"
      ],
      correctAnswer: 1,
      explanation: "With no fat layer, the sea otter relies on trapping a blanket of air in its fur — which is why oil spills are so deadly to them."
    }
  },
  {
    id: "whale-shark",
    emoji: "🦈",
    name: "Whale Shark",
    scientificName: "Rhincodon typus",
    group: "Fish (cartilaginous)",
    habitat: "Warm open oceans, often near the surface",
    diet: "Plankton, krill and small fish, filtered from the water",
    size: "Up to 18 m long, 20,000 kg",
    status: "Endangered",
    facts: [
      "It is the largest fish on Earth, yet it feeds by filtering some of the smallest life in the sea.",
      "Its checkerboard of pale spots is unique to each individual, and one whale shark may travel thousands of kilometres in a single year."
    ],
    help: "Microplastics are a direct threat to filter feeders — cutting single-use plastic and washing synthetic clothes less often keeps fragments out of the water they strain.",
    quiz: {
      question: "What does the world's largest fish actually eat?",
      options: [
        "Seals and dolphins",
        "Coral",
        "Tiny plankton and krill it filters from the water",
        "Seabirds"
      ],
      correctAnswer: 2,
      explanation: "The whale shark is a filter feeder — which is also why it swallows so many microplastics floating at the surface."
    }
  },
  {
    id: "clownfish",
    emoji: "🐠",
    name: "Clownfish",
    scientificName: "Amphiprion ocellaris",
    group: "Fish (bony)",
    habitat: "Sheltered coral reefs of the Indian and Pacific Oceans",
    diet: "Algae, plankton and small crustaceans",
    size: "8–11 cm long",
    status: "Least Concern",
    facts: [
      "It lives inside a stinging sea anemone, protected by a mucus coating that stops the anemone from firing at it.",
      "Every clownfish is born male. The largest fish in a group becomes female, and if she dies the next-largest male changes sex to replace her."
    ],
    help: "Buy only captive-bred reef fish for aquariums, and protect anemones — a clownfish cannot survive long without its host.",
    quiz: {
      question: "How does a clownfish live safely inside a stinging anemone?",
      options: [
        "It is too fast to be stung",
        "A mucus coating stops the anemone from firing at it",
        "It removes the anemone's stingers",
        "The anemone has no stingers"
      ],
      correctAnswer: 1,
      explanation: "A special mucus layer makes the anemone treat the clownfish as part of itself, giving it a fortress no predator will enter."
    }
  },
  {
    id: "seahorse",
    emoji: "🌊",
    name: "Seahorse",
    scientificName: "Hippocampus",
    group: "Fish (bony)",
    habitat: "Seagrass beds, mangroves and shallow reefs",
    diet: "Tiny shrimp and plankton, sucked up through its snout",
    size: "1.5–35 cm depending on species",
    status: "Vulnerable",
    facts: [
      "It is the only animal on Earth where the male becomes pregnant — the female deposits eggs into his pouch and he carries and births the young.",
      "It is a poor swimmer, so it anchors its tail around seagrass and waits for food to drift past, eating almost constantly because it has no stomach."
    ],
    help: "Protect seagrass meadows and mangroves from anchoring, trampling and pollution — without something to hold onto, a seahorse is swept away.",
    quiz: {
      question: "What is unique about seahorse reproduction?",
      options: [
        "The male carries the pregnancy and gives birth",
        "They lay eggs on the beach",
        "The young hatch from shells",
        "They do not reproduce at all"
      ],
      correctAnswer: 0,
      explanation: "The female transfers eggs to the male's brood pouch, where he fertilises, carries and eventually births them — the only such case known."
    }
  },
  {
    id: "staghorn-coral",
    emoji: "🪸",
    name: "Staghorn Coral",
    scientificName: "Acropora cervicornis",
    group: "Invertebrate (colony)",
    habitat: "Shallow, clear tropical reefs",
    diet: "Sugars from algae living in its tissue, plus captured plankton",
    size: "Branches up to 2 m across",
    status: "Critically Endangered",
    facts: [
      "Coral is an animal, not a rock or a plant — each branch is a colony of thousands of tiny polyps sharing one skeleton.",
      "It grows faster than almost any other coral, up to 20 cm a year, which is why it builds so much of the reef that fish depend on."
    ],
    help: "Coral bleaches and dies when the sea gets too warm, so reducing energy use matters — and never touch or stand on coral while swimming.",
    quiz: {
      question: "What kind of living thing is coral?",
      options: [
        "A rock formed by waves",
        "A type of seaweed",
        "An animal — a colony of tiny polyps",
        "A kind of shellfish"
      ],
      correctAnswer: 2,
      explanation: "Each coral head is a colony of animals called polyps, which build the hard skeleton that becomes the reef."
    }
  },
  {
    id: "giant-kelp",
    emoji: "🌿",
    name: "Giant Kelp",
    scientificName: "Macrocystis pyrifera",
    group: "Algae",
    habitat: "Cool, nutrient-rich coastal waters",
    diet: "Makes its own food by photosynthesis",
    size: "Up to 45 m tall, growing 50 cm a day",
    status: "Least Concern",
    facts: [
      "It is one of the fastest-growing organisms on Earth, adding up to half a metre a day in good conditions.",
      "It is not a plant but a giant alga, held up by gas-filled floats and anchored by a root-like holdfast that grips rock rather than drawing food."
    ],
    help: "Kelp forests shelter hundreds of species and lock away carbon — supporting otter recovery and cutting coastal runoff both help them survive.",
    quiz: {
      question: "What holds a giant kelp upright in the water?",
      options: [
        "Gas-filled floats along its fronds",
        "A wooden trunk",
        "It is rigid like bone",
        "Nothing — it lies flat on the seabed"
      ],
      correctAnswer: 0,
      explanation: "Small gas bladders lift the fronds towards the light while the holdfast grips the rock below, forming an underwater forest."
    }
  },
  {
    id: "moon-jelly",
    emoji: "🎐",
    name: "Moon Jellyfish",
    scientificName: "Aurelia aurita",
    group: "Invertebrate",
    habitat: "Coastal waters worldwide, from the tropics to the poles",
    diet: "Plankton and fish eggs, caught on sticky tentacles",
    size: "25–40 cm across the bell",
    status: "Least Concern",
    facts: [
      "It has no brain, no heart and no bones, and is about 95% water — drifting rather than truly swimming.",
      "The four pale rings visible through the bell are its stomach pouches, and it senses light and gravity through simple organs around the rim."
    ],
    help: "This is the animal a floating plastic bag imitates — every bag kept out of the sea is one fewer fatal mistake for a turtle hunting jellies.",
    quiz: {
      question: "Which piece of litter is most often mistaken for a jellyfish by sea turtles?",
      options: [
        "A glass bottle",
        "A floating plastic bag",
        "An aluminium can",
        "A wooden crate"
      ],
      correctAnswer: 1,
      explanation: "A drifting plastic bag has almost exactly the shape and translucency of a jellyfish, which is why turtles swallow them."
    }
  },
  {
    id: "common-octopus",
    emoji: "🐙",
    name: "Common Octopus",
    scientificName: "Octopus vulgaris",
    group: "Invertebrate (mollusc)",
    habitat: "Rocky reefs, crevices and seagrass in temperate and tropical seas",
    diet: "Crabs, clams and small fish",
    size: "Up to 1 m including arms, 10 kg",
    status: "Least Concern",
    facts: [
      "It changes colour and even skin texture in under a second, using millions of pigment cells to vanish against rock, sand or weed.",
      "Two-thirds of its neurons are in its arms rather than its brain, so each arm can taste, feel and solve problems semi-independently."
    ],
    help: "Octopuses shelter in shells and crevices — and increasingly in discarded cans and jars, which can trap them. Take your litter home from the shore.",
    quiz: {
      question: "Where are most of an octopus's neurons?",
      options: [
        "In its eyes",
        "In its arms, not its brain",
        "In its skin only",
        "It has no neurons"
      ],
      correctAnswer: 1,
      explanation: "About two-thirds sit in the arms, letting each one explore and react on its own while the central brain handles the bigger picture."
    }
  }
];

const SPECIES_BY_ID = {};
MARINE_SPECIES.forEach(s => { SPECIES_BY_ID[s.id] = s; });

// Drives the colour of the conservation-status chip in the Codex.
const STATUS_RANK = {
  "Least Concern": 0,
  "Near Threatened": 1,
  "Vulnerable": 2,
  "Endangered": 3,
  "Critically Endangered": 4
};
