// Complete Culinary AI Knowledge Engine & Recipe Synthesizer
// Covers authentic Tamil, South Indian, North Indian, Indo-Chinese, Italian, Continental, Baking & Global Cuisines

const RECIPE_CATALOG = [
  {
    keywords: ["mutton sukka", "sukka", "சுக்கா", "மட்டன் சுக்கா", "mutton fry", "mutton chukka"],
    title_en: "Authentic Madurai Mutton Sukka Varuval (மட்டன் சுக்கா)",
    title_ta: "மதுரை ஸ்பெஷல் பாரம்பரிய மட்டன் சுக்கா வறுவல்",
    prep: "15 mins", cook: "35 mins", servings: "4", difficulty: "Medium",
    cuisine: "Tamil Heritage / Madurai",
    ingredients_en: [
      "Tender Mutton (boneless or small bone-in) – 500g",
      "Small Shallots (Chinna Vengayam) – 200g (finely sliced)",
      "Ginger-Garlic Paste – 1.5 tbsp",
      "Crushed Black Peppercorns – 1.5 tbsp",
      "Fennel Seeds (Saunf) – 1 tbsp",
      "Cumin Seeds – 1 tsp",
      "Dry Red Guntur Chilies – 4 pieces",
      "Cold-Pressed Gingelly (Sesame) Oil – 3 tbsp",
      "Fresh Curry Leaves – 3 sprigs",
      "Turmeric Powder – 1/2 tsp",
      "Garam Masala / Mutton Masala – 1 tsp",
      "Rock Salt – to taste"
    ],
    ingredients_ta: [
      "இள ஆட்டுக்கறி (மட்டன்) – 500 கிராம்",
      "சின்ன வெங்காயம் – 200 கிராம் (நறுக்கியது)",
      "இஞ்சி பூண்டு விழுது – 1.5 மேஜைக்கரண்டி",
      "இடித்த கருப்பு மிளகு – 1.5 மேஜைக்கரண்டி",
      "சோம்பு – 1 மேஜைக்கரண்டி",
      "சீரகம் – 1 தேக்கரண்டி",
      "காய்ந்த வரமிளகாய் – 4",
      "மரச்செக்கு நல்லெண்ணெய் – 3 மேஜைக்கரண்டி",
      "கறிவேப்பிலை – 3 கொத்து",
      "மஞ்சள் தூள் – 1/2 தேக்கரண்டி",
      "கரம் மசாலா – 1 தேக்கரண்டி",
      "கல் உப்பு – தேவைக்கு"
    ],
    steps_en: [
      "Pressure cook cleaned mutton with 1/2 cup water, turmeric, ginger-garlic paste, and 1/2 tsp salt for 4-5 whistles until 90% tender. Reserve any mutton broth.",
      "In a heavy iron kadai, heat gingelly oil. Add fennel seeds, cumin seeds, dry red chilies, and lots of fresh curry leaves. Allow to splutter.",
      "Add sliced shallots and sauté on medium heat until golden caramelized brown.",
      "Add the cooked mutton pieces along with 3-4 tbsp of the mutton broth and garam masala. Sauté vigorously on high flame.",
      "Cook uncovered stirring continuously until the water fully evaporates. Sprinkle freshly crushed black pepper and roast on low flame until mutton turns dark, glistening, and coated in rich dry spices. Garnish with curry leaves!"
    ],
    steps_ta: [
      "கழுவிய மட்டனுடன் மஞ்சள் தூள், இஞ்சி பூண்டு விழுது, உப்பு, 1/2 கப் தண்ணீர் சேர்த்து குக்கரில் 4-5 விசில் விட்டு 90% வேக வைக்கவும்.",
      "அடி கனமான இரும்பு வாணலியில் நல்லெண்ணெய் ஊற்றி சோம்பு, சீரகம், வரமிளகாய், கறிவேப்பிலை தாளிக்கவும்.",
      "நறுக்கிய சின்ன வெங்காயம் சேர்த்து பொன்னிறமாக வதக்கவும்.",
      "வேகவைத்த மட்டன் துண்டுகள், சிறிது மட்டன் சூப் மற்றும் மசாலா தூள் சேர்த்து அதிக தீயில் நன்கு வதக்கவும்.",
      "தண்ணீர் முழுமையாக வற்றியதும், இடித்த மிளகுத்தூள் தூவி மிதமான தீயில் எண்ணெய் பிரிந்து கருப்பாக மொறுமொறுப்பாக மாறும் வரை சுருள வதக்கி இறக்கவும்!"
    ],
    tips_en: "Cooking in a cast-iron skillet gives the iconic dark Madurai sukka glaze. Don't skip shallots—they provide natural sweetness to balance fiery pepper!",
    tips_ta: "இரும்பு வாணலியில் வதக்கும் போது மட்டன் கருகாமல் சுவை கூடும். சின்ன வெங்காயம் மட்டுமே சேர்க்க வேண்டும், அதுவே சுக்காவிற்கு தனி சுவை தரும்!",
    served_with_en: "Best served with Steamed Rice & Rasam, Parotta, Dosa, or as a royal party appetizer.",
    served_with_ta: "சூடான சாதம், மிளகு ரசம், பரோட்டா, அல்லது நெய் தோசையுடன் சாப்பிட அருமையாக இருக்கும்."
  },
  {
    keywords: ["meen kuzhambu", "fish curry", "மீன் குழம்பு", "fish gravy", "chettinad fish curry", "meen kulambu"],
    title_en: "Village Clay-Pot Fish Curry (கிராமத்து மண் சட்டி மீன் குழம்பு)",
    title_ta: "பாரம்பரிய கிராமத்து மண் சட்டி மீன் குழம்பு",
    prep: "20 mins", cook: "25 mins", servings: "4", difficulty: "Medium",
    cuisine: "Tamil Coastal Heritage",
    ingredients_en: [
      "Fresh Fish (Seer/Vanjaram, Sankara, or Rohu) – 500g",
      "Tamarind Extract (from lemon-sized tamarind) – 1 cup",
      "Shallots (Chinna Vengayam) – 150g",
      "Garlic Cloves (with skin bruised) – 15 cloves",
      "Country Tomatoes – 2 (mashed)",
      "Fenugreek Seeds (Vendhayam) – 1 tsp",
      "Mustard Seeds – 1 tsp",
      "Gingelly / Sesame Oil – 4 tbsp",
      "Curry Leaves – 2 sprigs",
      "Kulambu Milagai Thool / Sambar Powder – 2.5 tbsp",
      "Turmeric Powder – 1/2 tsp",
      "Rock Salt – to taste"
    ],
    ingredients_ta: [
      "புதிய மீன் (வஞ்சிரம், சங்கரா அல்லது கட்லா) – 500 கிராம்",
      "புளிக்கரைசல் – 1 பெரிய எலுமிச்சை அளவு",
      "சின்ன வெங்காயம் – 150 கிராம்",
      "பூண்டு பற்கள் – 15",
      "நாட்டு தக்காளி – 2 (மசித்தது)",
      "வெந்தயம் – 1 தேக்கரண்டி",
      "கடுகு – 1 தேக்கரண்டி",
      "நல்லெண்ணெய் – 4 மேஜைக்கரண்டி",
      "கறிவேப்பிலை – 2 கொத்து",
      "குழம்பு மிளகாய் தூள் – 2.5 மேஜைக்கரண்டி",
      "மஞ்சள் தூள் – 1/2 தேக்கரண்டி",
      "கல் உப்பு – தேவைக்கு"
    ],
    steps_en: [
      "In a traditional earthen clay pot (manchatti), heat pure gingelly oil. Add mustard seeds and fenugreek seeds (vendhayam) on low heat—do not burn fenugreek!",
      "Add bruised garlic cloves, curry leaves, and sliced shallots. Sauté until golden and sweet-smelling.",
      "Add mashed tomatoes, turmeric, and kuzhambu chili powder. Sauté for 3 minutes until oil separates from the masala.",
      "Pour the tamarind extract and 1.5 cups of water with rock salt. Bring to a vigorous rolling boil on medium heat for 12-15 minutes until raw tamarind smell vanishes and gravy thickens.",
      "Gently slide in the fresh fish slices. Cook on medium-low for exactly 6-7 minutes. Turn off the flame, cover with lid, and let it rest. It tastes 10x better after resting for 4 hours!"
    ],
    steps_ta: [
      "மண் சட்டியில் நல்லெண்ணெய் ஊற்றி கடுகு மற்றும் வெந்தயம் தாளிக்கவும் (வெந்தயம் கருகக் கூடாது).",
      "பூண்டு, கறிவேப்பிலை, சின்ன வெங்காயம் சேர்த்து பொன்னிறமாக வதக்கவும்.",
      "தக்காளி, மஞ்சள் தூள், குழம்பு மிளகாய் தூள் சேர்த்து எண்ணெய் பிரியும் வரை வதக்கவும்.",
      "புளிக்கரைசல், உப்பு மற்றும் 1.5 கப் தண்ணீர் ஊற்றி 12-15 நிமிடங்கள் குழம்பு கெட்டியாகும் வரை கொதிக்க விடவும்.",
      "சுத்தம் செய்த மீன் துண்டுகளை மெதுவாக சேர்த்து 6-7 நிமிடங்கள் மிதமான தீயில் வேகவைத்து அடுப்பை அணைக்கவும். 4 மணி நேரம் கழித்து சாப்பிட்டால் சுவை அமிர்தமாக இருக்கும்!"
    ],
    tips_en: "Always cook in an earthen pot with sesame oil. Never stir aggressively after adding fish—swirl the pot gently by the handles.",
    tips_ta: "மீன் போட்ட பிறகு கரண்டியால் கிளறக் கூடாது; மண் சட்டியை லேசாக குலுக்கி விட வேண்டும். அடுத்த நாள் சாப்பிட்டால் இன்னும் சுவை கூடும்!",
    served_with_en: "Steamed White Rice, Idli, or Dosai.",
    served_with_ta: "சுடச்சுட சாதம், பழைய சோறு, இட்லி அல்லது தோசையுடன் அருமையான இணை!"
  },
  {
    keywords: ["chicken 65", "சிக்கன் 65", "chilli chicken dry", "chicken fry"],
    title_en: "Crispy Restaurant-Style Chicken 65 (சிக்கன் 65)",
    title_ta: "ஹோட்டல் ஸ்டைல் மொறுமொறு சிக்கன் 65",
    prep: "20 mins", cook: "15 mins", servings: "4", difficulty: "Easy",
    cuisine: "Chennai / South Indian Street Food",
    ingredients_en: [
      "Boneless Chicken (bite-sized cubes) – 500g",
      "Thick Hung Curd / Yogurt – 2 tbsp",
      "Ginger-Garlic Paste – 1.5 tbsp",
      "Kashmiri Red Chili Powder – 1.5 tbsp",
      "Cornflour (Cornstarch) – 2.5 tbsp",
      "Rice Flour (for crunch) – 1.5 tbsp",
      "Black Pepper Powder – 1 tsp",
      "Egg – 1 white (or 2 tbsp lemon juice)",
      "Garam Masala – 1/2 tsp",
      "Curry Leaves – 2 sprigs (for tempering)",
      "Green Chilies – 3 slit",
      "Oil – for deep frying"
    ],
    ingredients_ta: [
      "எலும்பில்லாத கோழிக்கறி – 500 கிராம்",
      "கெட்டித் தயிர் – 2 மேஜைக்கரண்டி",
      "இஞ்சி பூண்டு விழுது – 1.5 மேஜைக்கரண்டி",
      "காஷ்மீரி மிளகாய் தூள் – 1.5 மேஜைக்கரண்டி",
      "சோள மாவு (கார்ன்ஃப்ளவர்) – 2.5 மேஜைக்கரண்டி",
      "அரிசி மாவு (மொறுமொறுப்பிற்கு) – 1.5 மேஜைக்கரண்டி",
      "மிளகு தூள் – 1 தேக்கரண்டி",
      "முட்டை வெள்ளைக்கரு – 1",
      "கரம் மசாலா – 1/2 தேக்கரண்டி",
      "கறிவேப்பிலை, பச்சை மிளகாய் – தாளிக்க",
      "எண்ணெய் – பொரிக்க"
    ],
    steps_en: [
      "Marinate chicken cubes with curd, ginger-garlic paste, chili powder, pepper, garam masala, salt, and egg white for 30 minutes.",
      "Just before frying, dust cornflour and rice flour over the chicken. Mix gently so a thin batter evenly coats each piece without becoming watery.",
      "Heat oil in a deep kadai to 180°C (medium-high). Drop chicken pieces one by one without overcrowding.",
      "Fry on medium heat for 5-6 minutes until deep red, crispy on the outside, and juicy inside. Drain on kitchen paper.",
      "In a small pan, flash-fry curry leaves and slit green chilies in 1 tsp hot oil for 10 seconds. Toss over the fried chicken with a squeeze of fresh lemon juice!"
    ],
    steps_ta: [
      "சிக்கன் துண்டுகளுடன் தயிர், இஞ்சி பூண்டு, மிளகாய் தூள், மிளகு, கரம் மசாலா, உப்பு மற்றும் முட்டை சேர்த்து 30 நிமிடம் ஊற வைக்கவும்.",
      "பொரிப்பதற்கு முன் சோள மாவு மற்றும் அரிசி மாவு சேர்த்து கலக்கவும்.",
      "சூடான எண்ணெயில் சிக்கன் துண்டுகளை ஒவ்வொன்றாக போட்டு 5-6 நிமிடங்கள் பொன்னிறமாக பொரிக்கவும்.",
      "மற்றொரு வாணலியில் கறிவேப்பிலை மற்றும் பச்சை மிளகாயை 10 விநாடிகள் வதக்கி பொரித்த சிக்கன் மீது கொட்டவும். எலுமிச்சை சாறு பிழிந்து பரிமாறவும்!"
    ],
    tips_en: "Adding rice flour guarantees that signature crunchy shell that stays crisp even after 30 minutes!",
    tips_ta: "அரிசி மாவு சேர்ப்பதால் சிக்கன் நீண்ட நேரம் மொறுமொறுப்பாக இருக்கும்!",
    served_with_en: "Sliced onions, lemon wedges, and mint chutney.",
    served_with_ta: "வெங்காய வளையங்கள் மற்றும் எலுமிச்சையுடன் பரிமாறவும்."
  },
  {
    keywords: ["butter chicken", "murgh makhani", "பட்டர் சிக்கன்"],
    title_en: "Royal Creamy Butter Chicken / Murgh Makhani (பட்டர் சிக்கன்)",
    title_ta: "சுவையான பட்டர் சிக்கன் / முர்க் மக்கானி",
    prep: "25 mins", cook: "25 mins", servings: "4", difficulty: "Medium",
    cuisine: "North Indian / Mughlai",
    ingredients_en: [
      "Boneless Chicken Thighs (cubed) – 500g",
      "Butter – 4 tbsp",
      "Ripe Red Tomatoes – 5 (chopped)",
      "Cashew Nuts (soaked in warm water) – 15 pieces",
      "Ginger-Garlic Paste – 2 tbsp",
      "Kashmiri Red Chili Powder – 2 tbsp (for vibrant natural color)",
      "Fresh Dairy Cream – 3 tbsp",
      "Kasuri Methi (Dried Fenugreek) – 1 tbsp (crushed)",
      "Honey or Sugar – 1 tsp (to balance acidity)",
      "Garam Masala – 1 tsp",
      "Yogurt (for marinade) – 3 tbsp"
    ],
    ingredients_ta: [
      "சிக்கன் துண்டுகள் – 500 கிராம்",
      "வெண்ணெய் – 4 மேஜைக்கரண்டி",
      "பழுத்த தக்காளி – 5",
      "முந்திரி – 15",
      "இஞ்சி பூண்டு விழுது – 2 மேஜைக்கரண்டி",
      "காஷ்மீரி மிளகாய் தூள் – 2 மேஜைக்கரண்டி",
      "பிரெஷ் கிரீம் – 3 மேஜைக்கரண்டி",
      "கசூரி மேத்தி – 1 மேஜைக்கரண்டி",
      "தேன் அல்லது சர்க்கரை – 1 தேக்கரண்டி",
      "கரம் மசாலா – 1 தேக்கரண்டி",
      "தயிர் – 3 மேஜைக்கரண்டி"
    ],
    steps_en: [
      "Marinate chicken with yogurt, 1 tbsp ginger-garlic paste, 1 tbsp chili powder, and salt for 30 mins. Pan-sear in 1 tbsp butter on high heat until charred spots appear (8 mins). Set aside.",
      "In a pot, boil chopped tomatoes, cashews, 1 cup water, ginger, garlic, cloves, and cardamom for 12 mins until mushy. Cool and blend into a silk-smooth puree. Strain through a fine sieve.",
      "Melt 3 tbsp butter in a pan, add remaining Kashmiri chili powder, then pour in the strained silky tomato-cashew puree.",
      "Simmer gravy on low heat for 10 minutes until oil glimmers. Add seared chicken pieces, honey, and garam masala. Cook for 5 minutes.",
      "Rub Kasuri Methi between palms and sprinkle on top. Swirl in heavy fresh cream, turn off heat, and serve!"
    ],
    steps_ta: [
      "சிக்கனை தயிர், இஞ்சி பூண்டு, மிளகாய் தூள் சேர்த்து ஊறவைத்து வெண்ணெயில் பொன்னிறமாக வதக்கி தனியே வைக்கவும்.",
      "தக்காளி, முந்திரி, இஞ்சி, பூண்டு ஆகியவற்றை வேகவைத்து மிக்ஸியில் அரைத்து வடிகட்டவும்.",
      "வாணலியில் வெண்ணெய் உருக்கி, காஷ்மீரி மிளகாய் தூள் மற்றும் அரைத்த தக்காளி விழுதை சேர்த்து 10 நிமிடம் கொதிக்க விடவும்.",
      "வதக்கிய சிக்கன், சிறிது தேன், கரம் மசாலா சேர்த்து 5 நிமிடங்கள் வேக வைக்கவும்.",
      "கசூரி மேத்தி மற்றும் பிரெஷ் கிரீம் சேர்த்து கிளறி இறக்கவும்!"
    ],
    tips_en: "Straining the tomato-cashew puree is the true restaurant secret for that velvety, lump-free royal texture.",
    tips_ta: "தக்காளி முந்திரி விழுதை வடிகட்டி சேர்த்தால் ஹோட்டல் போன்ற மென்மையான கிரேவி கிடைக்கும்.",
    served_with_en: "Butter Garlic Naan, Tandoori Roti, or Jeera Rice.",
    served_with_ta: "பட்டர் நான், ரொட்டி அல்லது ஜீரா ரைஸுடன் மிகச்சிறந்த சுவை தரும்."
  },
  {
    keywords: ["fried rice", "chicken fried rice", "veg fried rice", "ஃப்ரைட் ரைஸ்"],
    title_en: "Restaurant-Style Indo-Chinese Fried Rice (சிக்கன் / வெஜ் ஃப்ரைட் ரைஸ்)",
    title_ta: "ஹோட்டல் ஸ்டைல் சிக்கன் & காய்கறி ஃப்ரைட் ரைஸ்",
    prep: "15 mins", cook: "10 mins", servings: "3", difficulty: "Easy",
    cuisine: "Indo-Chinese",
    ingredients_en: [
      "Cooked & Chilled Basmati or Jasmine Rice – 3 cups (grains separate)",
      "Finely Chopped Garlic – 2 tbsp",
      "Eggs – 2 (beaten) OR Diced Paneer/Tofu for Veg",
      "Cooked Shredded Chicken or Veggies (Carrots, Beans, Cabbage) – 1.5 cups",
      "Spring Onions (Scallions) – 1/2 cup (whites & greens separated)",
      "Dark Soy Sauce – 1.5 tbsp",
      "Green Chili Sauce or Vinegar – 1 tsp",
      "Crushed White / Black Pepper – 1 tsp",
      "Toasted Sesame Oil – 2 tbsp"
    ],
    ingredients_ta: [
      "வேகவைத்து ஆறவைத்த பாசுமதி சாதம் – 3 கப்",
      "பொடியாக நறுக்கிய பூண்டு – 2 மேஜைக்கரண்டி",
      "முட்டை – 2 (அல்லது பன்னீர்/காய்கறிகள்)",
      "சிக்கன் அல்லது நறுக்கிய கேரட், பீன்ஸ், முட்டைகோஸ் – 1.5 கப்",
      "வெங்காயத்தாள் (ஸ்பிரிங் ஆனியன்) – 1/2 கப்",
      "சோயா சாஸ் – 1.5 மேஜைக்கரண்டி",
      "வினிகர் / சில்லி சாஸ் – 1 தேக்கரண்டி",
      "மிளகு தூள் – 1 தேக்கரண்டி",
      "எண்ணெய் – 2 மேஜைக்கரண்டி"
    ],
    steps_en: [
      "The golden rule: Rice must be completely cold (preferably day-old refrigerated) so grains don't turn mushy.",
      "Heat a large wok or skillet on blazing high heat until smoking hot. Add sesame oil.",
      "Add minced garlic and spring onion whites. Sauté for 30 seconds until aromatic without burning.",
      "Push veggies to side, scramble eggs directly in wok (or add chicken/veggies). Stir-fry on highest flame for 2 minutes.",
      "Add chilled rice, dark soy sauce, vinegar, black pepper, and salt. Toss vigorously for 2-3 minutes so grains get smoky wok-hei flavor. Top with spring onion greens!"
    ],
    steps_ta: [
      "சாதம் உதிரியாக ஆறி இருக்க வேண்டும் (குளிர்சாதன பெட்டியில் வைத்த சாதம் சிறந்தது).",
      "அடி கனமான வாணலியை அதிக தீயில் சூடாக்கி எண்ணெய் ஊற்றவும்.",
      "பூண்டு, வெங்காயத்தாள் சேர்த்து 30 விநாடிகள் வதக்கவும்.",
      "முட்டை அல்லது சிக்கன் மற்றும் காய்கறிகளை சேர்த்து அதிக தீயில் 2 நிமிடங்கள் வதக்கவும்.",
      "சாதம், சோயா சாஸ், வினிகர், மிளகுத்தூள், உப்பு சேர்த்து வேகமாக கிளறி வெங்காயத்தாள் தூவி இறக்கவும்!"
    ],
    tips_en: "Cook on high heat continuously. The smoke from the hot wok gives that signature street-food aroma (Wok Hei).",
    tips_ta: "அடுப்பை எப்போதும் அதிக தீயில் வைத்து வதக்க வேண்டும்; அதுவே ஹோட்டல் வாசனையை தரும்.",
    served_with_en: "Chilli Chicken, Gobi Manchurian, or spicy Schezwan sauce.",
    served_with_ta: "சில்லி சிக்கன் அல்லது கோபி மஞ்சூரியனுடன் அருமையான காம்போ."
  },
  {
    keywords: ["pasta", "white sauce pasta", "alfredo", "பாஸ்தா", "red sauce pasta"],
    title_en: "Creamy Garlic White Sauce Alfredo Pasta (வெள்ளை சாஸ் பாஸ்தா)",
    title_ta: "கிரீமியான வெள்ளை சாஸ் பாஸ்தா (White Sauce Pasta)",
    prep: "10 mins", cook: "20 mins", servings: "3", difficulty: "Easy",
    cuisine: "Italian",
    ingredients_en: [
      "Penne or Fusilli Pasta – 250g",
      "Butter – 2 tbsp",
      "All-Purpose Flour (Maida) – 2 tbsp",
      "Whole Milk (warm) – 2 cups (500ml)",
      "Garlic (finely minced) – 1.5 tbsp",
      "Mixed Veggies (Sweet Corn, Bell Peppers, Broccoli) – 1 cup",
      "Processed Cheese or Mozzarella – 1/2 cup",
      "Dried Oregano & Chili Flakes – 1 tsp each",
      "Black Pepper Powder & Salt – to taste"
    ],
    ingredients_ta: [
      "பாஸ்தா (பென்னே அல்லது பியூசில்லி) – 250 கிராம்",
      "வெண்ணெய் – 2 மேஜைக்கரண்டி",
      "மைதா மாவு – 2 மேஜைக்கரண்டி",
      "பால் – 2 கப் (500 மிலி)",
      "பூண்டு – 1.5 மேஜைக்கரண்டி",
      "காய்கறிகள் (குடைமிளகாய், கார்ன், பிரக்கோலி) – 1 கப்",
      "சீஸ் (துருவியது) – 1/2 கப்",
      "ஆரிகானோ, சில்லி ஃப்ளேக்ஸ் – 1 தேக்கரண்டி",
      "மிளகு தூள், உப்பு – தேவைக்கு"
    ],
    steps_en: [
      "Boil 6 cups water with 1 tsp salt. Add pasta and cook al dente (about 8-9 mins, firm to the bite). Reserve 1/2 cup pasta water and strain pasta.",
      "In a pan, melt 1/2 tbsp butter, sauté minced garlic and crunchy bell peppers/corn for 2 mins. Set aside.",
      "For the White Sauce (Roux): In same pan, melt 2 tbsp butter. Add 2 tbsp flour and whisk continuously on low heat for 1 minute until bubbly without browning.",
      "Gradually pour warm milk in a slow stream while whisking vigorously to avoid any lumps. Simmer for 3 mins until the sauce coats the back of a spoon.",
      "Stir in cheese, oregano, chili flakes, black pepper, and salt. Fold in boiled pasta and sautéed veggies. If too thick, splash reserved pasta water. Serve piping hot!"
    ],
    steps_ta: [
      "கொதிக்கும் நீரில் உப்பு சேர்த்து பாஸ்தாவை 8-9 நிமிடங்கள் வேகவைத்து வடிக்கவும் (சிறிது பாஸ்தா தண்ணீரை எடுத்து வைக்கவும்).",
      "சிறிது வெண்ணெயில் பூண்டு மற்றும் குடைமிளகாய், சோளத்தை வதக்கி தனியே வைக்கவும்.",
      "வெள்ளை சாஸ்: வாணலியில் வெண்ணெய் உருக்கி மைதா சேர்த்து 1 நிமிடம் வதக்கவும்.",
      "கட்டியில்லாமல் பாலை சிறிது சிறிதாக ஊற்றி கைவிடாமல் கிளறி சாஸ் கெட்டியாகும் வரை கொதிக்க விடவும்.",
      "சீஸ், ஆரிகானோ, மிளகுத்தூள், உப்பு சேர்த்து, வெந்த பாஸ்தா மற்றும் காய்கறிகளை கலந்து சூடாக பரிமாறவும்!"
    ],
    tips_en: "Always add warm milk slowly while whisking to guarantee zero lumps. Starchy pasta water makes the sauce glossy and cling to pasta.",
    tips_ta: "பால் வெதுவெதுப்பாக இருக்க வேண்டும், அப்போதுதான் சாஸில் கட்டி தட்டாது.",
    served_with_en: "Toasted Garlic Bread with butter.",
    served_with_ta: "கார்லிக் பிரெட் (Garlic Bread) உடன் சாப்பிட அருமை."
  },
  {
    keywords: ["pizza", "பீட்சா", "homemade pizza", "cheese pizza"],
    title_en: "Crispy Crust Homemade Veggie & Cheese Pizza (வீட்டு முறை பீட்சா)",
    title_ta: "சுவையான ஹோம்மேட் சீஸ் பீட்சா (Pizza)",
    prep: "30 mins", cook: "15 mins", servings: "2 Pizzas", difficulty: "Medium",
    cuisine: "Italian / Bakery",
    ingredients_en: [
      "All-Purpose Flour / Maida – 2 cups (250g)",
      "Instant Active Yeast – 1 tsp (or 1/2 tsp baking powder + 1/4 tsp soda for yeast-free)",
      "Warm Water – 3/4 cup",
      "Sugar – 1 tsp",
      "Olive Oil – 2 tbsp",
      "Pizza Sauce / Marinara – 1/2 cup",
      "Mozzarella Cheese (shredded) – 1.5 cups",
      "Toppings: Sliced Onions, Bell Peppers, Olives, Paneer, Sweet Corn",
      "Oregano & Red Chili Flakes – 1 tsp"
    ],
    ingredients_ta: [
      "மைதா மாவு – 2 கப்",
      "ஈஸ்ட் (Yeast) – 1 தேக்கரண்டி",
      "வெதுவெதுப்பான தண்ணீர் – 3/4 கப்",
      "சர்க்கரை – 1 தேக்கரண்டி",
      "ஆலிவ் எண்ணெய் – 2 மேஜைக்கரண்டி",
      "பீட்சா சாஸ் – 1/2 கப்",
      "மொசரெல்லா சீஸ் – 1.5 கப்",
      "டாப்பிங்ஸ்: வெங்காயம், குடைமிளகாய், சோளம், பன்னீர்",
      "ஆரிகானோ, மிளகாய் தூவல் – தேவைக்கு"
    ],
    steps_en: [
      "In warm water, dissolve sugar and yeast. Let sit for 7 minutes until frothy.",
      "Knead flour, yeast mixture, olive oil, and salt into a soft, elastic dough (8 mins). Brush oil, cover, and let rise in a warm spot for 1 hour until doubled.",
      "Punch down dough, divide into 2 balls. Roll or stretch by hand into a 10-inch circle with slightly thicker borders.",
      "Prick dough lightly with a fork to prevent puffing. Spread pizza sauce generously, cover with mozzarella cheese, and arrange vegetable/paneer toppings.",
      "Bake in a preheated oven at 220°C (425°F) for 12-14 minutes until crust is golden and cheese is bubbly and melted! (Or cook covered in a heavy flat pan/tawa on low heat for 15 mins)."
    ],
    steps_ta: [
      "வெதுவெதுப்பான நீரில் சர்க்கரை மற்றும் ஈஸ்ட் கலந்து 7 நிமிடங்கள் பொங்க விடவும்.",
      "மாவை மிருதுவாக பிசைந்து 1 மணி நேரம் மூடி வைக்கவும் (மாவு இரட்டிப்பாகும்).",
      "மாவை வட்டமாக தட்டி, நடுவில் ஃபோர்க் ஸ்பூனால் துளைகள் போடவும்.",
      "பீட்சா சாஸ் தடவி, சீஸ் தூவி, காய்கறி டாப்பிங்ஸ்களை அடுக்கவும்.",
      "220°C அவனில் 12-14 நிமிடங்கள் பேக் செய்யவும் (அல்லது தோசைக்கல்லில் மூடி வைத்து 15 நிமிடம் வேக வைக்கவும்)!"
    ],
    tips_en: "Baking at the highest oven temperature gives a bubbly blistered crust just like a pizzeria!",
    tips_ta: "அவனை அதிக சூட்டில் முன்கூட்டியே சூடாக்கினால் பீட்சா மொறுமொறுப்பாக வரும்.",
    served_with_en: "Chili flakes, oregano, and chilled beverages.",
    served_with_ta: "ஆரிகானோ மற்றும் குளிர்பானங்களுடன் பரிமாறவும்."
  },
  {
    keywords: ["gulab jamun", "குலாப் ஜாமூன்", "jamun", "sweet jamun"],
    title_en: "Melt-in-Mouth Soft Gulab Jamun (குலாப் ஜாமூன்)",
    title_ta: "வாயில் கரையும் பஞ்சு போன்ற குலாப் ஜாமூன்",
    prep: "15 mins", cook: "20 mins", servings: "20 Jamuns", difficulty: "Easy",
    cuisine: "Indian Sweet / Royal Heritage",
    ingredients_en: [
      "Mawa (Khoya) or Gulab Jamun Mix / Milk Powder – 1 cup",
      "All-Purpose Flour (Maida) – 3 tbsp",
      "Milk or Warm Water – 3-4 tbsp (to bind)",
      "Ghee / Oil – for deep frying on gentle heat",
      "Sugar – 1.5 cups (300g)",
      "Water – 1.5 cups",
      "Green Cardamom Pods (crushed) – 4",
      "Rose Water – 1 tsp",
      "Saffron Strands (Kesar) – a pinch"
    ],
    ingredients_ta: [
      "ஜாமூன் மிக்ஸ் அல்லது பால் பவுடர் / கோவா – 1 கப்",
      "மைதா மாவு – 3 மேஜைக்கரண்டி",
      "பால் அல்லது தண்ணீர் – பிசைய",
      "நெய் / எண்ணெய் – பொரிக்க",
      "சர்க்கரை – 1.5 கப்",
      "தண்ணீர் – 1.5 கப்",
      "ஏலக்காய் தூள் – 1/2 தேக்கரண்டி",
      "ரோஸ் வாட்டர் – 1 தேக்கரண்டி",
      "குங்குமப்பூ – ஒரு சிட்டிகை"
    ],
    steps_en: [
      "Sugar Syrup: Boil sugar and water with crushed cardamom and saffron for 6-8 minutes until sticky (half-string consistency). Stir in rose water and keep warm.",
      "Dough: Gently mix jamun powder/khoya with milk without kneading heavily. It should be soft and pliable. Let rest 5 minutes.",
      "Shaping: Smear ghee on palms and roll into small, crack-free, completely smooth balls (cracks cause jamuns to split while frying).",
      "Frying: Heat ghee/oil on LOW flame. Drop balls gently. Swirl the oil with a ladle without touching the jamuns directly. Fry patiently on low heat until uniform dark golden brown.",
      "Soaking: Drop hot fried jamuns directly into warm sugar syrup. Let them soak and swell for at least 1-2 hours before serving!"
    ],
    steps_ta: [
      "சர்க்கரை பாகு: சர்க்கரை, தண்ணீர், ஏலக்காய், குங்குமப்பூ சேர்த்து பிசுக்கு பதம் வரும் வரை கொதிக்க வைத்து ரோஸ் வாட்டர் சேர்க்கவும்.",
      "மாவு: மாவை அதிக அழுத்தம் கொடுக்காமல் மிருதுவாக பிசையவும்.",
      "உருண்டை: கைகளில் நெய் தடவி விரிசல் இல்லாமல் மென்மையான சிறு உருண்டைகளாக உருட்டவும்.",
      "பொரித்தல்: குறைந்த தீயில் நெய்யில் போட்டு, கரண்டியால் எண்ணெயை மட்டும் சுழற்றி பொன்னிறமாக பொரிக்கவும்.",
      "ஊறவைத்தல்: சூடான ஜாமூன்களை வெதுவெதுப்பான சர்க்கரை பாகில் போட்டு 1-2 மணி நேரம் ஊறவைத்து பரிமாறவும்!"
    ],
    tips_en: "Oil must be on low heat; if oil is too hot, the outside browns immediately while the center remains raw and hard!",
    tips_ta: "எண்ணெய் மிதமான சூட்டில் மட்டுமே இருக்க வேண்டும்; அதிக சூடானால் உள்ளே வேகாது!",
    served_with_en: "Vanilla ice cream or warm as is.",
    served_with_ta: "வெண்ணிலா ஐஸ்கிரீமுடன் சேர்த்து சாப்பிட்டால் அதிரடி சுவை!"
  },
  {
    keywords: ["brownie", "chocolate brownie", "பிரவுனி", "cake", "chocolate cake"],
    title_en: "Fudgy Chocolate Brownie with Crinkly Top (சாக்லேட் பிரவுனி)",
    title_ta: "சுவையான சாக்லேட் ஃபட்ஜி பிரவுனி",
    prep: "15 mins", cook: "25 mins", servings: "9 Squares", difficulty: "Easy",
    cuisine: "Bakery / Dessert",
    ingredients_en: [
      "Dark Chocolate / Cocoa Powder – 1/2 cup (100g melted)",
      "Unsalted Butter – 1/2 cup (100g)",
      "Sugar – 3/4 cup (caster or brown sugar)",
      "Eggs – 2 (or 1/2 cup curd/condensed milk for eggless)",
      "All-Purpose Flour – 1/2 cup (60g)",
      "Vanilla Extract – 1 tsp",
      "Pinch of Salt (enhances chocolate flavor)",
      "Chocolate Chips / Walnuts – 1/4 cup"
    ],
    ingredients_ta: [
      "டார்க் சாக்லேட் அல்லது கொக்கோ பவுடர் – 1/2 கப்",
      "வெண்ணெய் – 1/2 கப்",
      "சர்க்கரை – 3/4 கப்",
      "முட்டை – 2 (முட்டை இல்லையெனில் 1/2 கப் தயிர்)",
      "மைதா மாவு – 1/2 கப்",
      "வெண்ணிலா எசன்ஸ் – 1 தேக்கரண்டி",
      "உப்பு – ஒரு சிட்டிகை",
      "வால்நட் அல்லது சாக்லேட் சிப்ஸ் – தேவைக்கு"
    ],
    steps_en: [
      "Melt dark chocolate and butter together in a microwave or double boiler until glossy and smooth.",
      "Whisk eggs and sugar vigorously with an electric or hand whisk for 3-4 minutes until pale and frothy (this creates that shiny crackly top crust!).",
      "Fold the melted chocolate mixture and vanilla into the egg mixture.",
      "Gently sift in flour, cocoa powder, and salt. Fold using a spatula just until combined—do not overmix.",
      "Pour into an 8x8 parchment-lined baking tin. Top with walnuts. Bake at 175°C (350°F) for 22-25 mins until toothpick in center comes out with moist fudgy crumbs (not wet batter)."
    ],
    steps_ta: [
      "சாக்லேட் மற்றும் வெண்ணெயை உருக்கி கலக்கவும்.",
      "முட்டை மற்றும் சர்க்கரையை கிரீம் போல நுரைத்து வரும் வரை நன்கு அடிக்கவும்.",
      "உருக்கிய சாக்லேட் கலவையை இதில் சேர்க்கவும்.",
      "மைதா, உப்பு சேர்த்து மெதுவாக கலக்கவும் (அதிகமாக பிசையக் கூடாது).",
      "175°C அவனில் 22-25 நிமிடங்கள் பேக் செய்து ஆறவைத்து துண்டுகளாக்கவும்!"
    ],
    tips_en: "Do not overbake brownies! They continue to firm up as they cool down.",
    tips_ta: "அதிக நேரம் பேக் செய்யக் கூடாது; ஆறிய பின்பே சரியான ஃபட்ஜி பதம் வரும்.",
    served_with_en: "Hot with a scoop of vanilla ice cream and warm chocolate sauce.",
    served_with_ta: "சூடான பிரவுனியுடன் வெண்ணிலா ஐஸ்கிரீம் வைத்து சுவைக்கவும்."
  },
  {
    keywords: ["chole", "bhature", "chana masala", "சென்னா", "சோலே பட்டூரா"],
    title_en: "Punjabi Amritsari Chole Bhature (சோலே பட்டூரா)",
    title_ta: "பஞ்சாபி சுவையான சோலே பட்டூரா",
    prep: "8 hrs soak + 20 mins", cook: "30 mins", servings: "4", difficulty: "Medium",
    cuisine: "North Indian / Punjabi",
    ingredients_en: [
      "Kabuli Chana (Chickpeas) – 1.5 cups (soaked overnight)",
      "Tea Bag – 1 (boiled with chana for that authentic dark color)",
      "Onions – 2 (finely pureed)",
      "Tomatoes – 3 (pureed)",
      "Ginger-Garlic-Chili Paste – 2 tbsp",
      "Chole Masala Powder – 2 tbsp",
      "Dry Mango Powder (Amchur) or Anardana – 1 tsp (for tang)",
      "Bhatura Dough: Maida (2 cups), Sooji/Rava (2 tbsp), Curd (1/4 cup), Baking Soda (1/4 tsp), Oil",
      "Ghee – 2 tbsp for tempering"
    ],
    ingredients_ta: [
      "கொண்டைக்கடலை – 1.5 கப் (இரவு முழுவதும் ஊறியது)",
      "டீ பேக் – 1 (கருப்பு நிறத்திற்கு)",
      "வெங்காயம் – 2 (அரைத்தது)",
      "தக்காளி – 3 (அரைத்தது)",
      "இஞ்சி பூண்டு விழுது – 2 மேஜைக்கரண்டி",
      "சோலே மசாலா – 2 மேஜைக்கரண்டி",
      "ஆம்சூர் பொடி – 1 தேக்கரண்டி",
      "பட்டூரா மாவு: மைதா (2 கப்), ரவை (2 ஸ்பூன்), தயிர் (1/4 கப்), பேக்கிங் சோடா",
      "எண்ணெய் – பொரிக்க"
    ],
    steps_en: [
      "Pressure cook soaked chickpeas with tea bag, bay leaf, cinnamon, and salt for 6 whistles until melt-in-mouth soft. Discard tea bag.",
      "Heat oil in a kadai. Sauté onion paste until deep golden brown. Add ginger-garlic paste and sauté.",
      "Add tomato puree, chole masala, red chili, and amchur. Cook until oil leaves the sides of masala.",
      "Add boiled chickpeas with cooking water. Mash a few chickpeas to thicken gravy naturally. Simmer on low for 15 mins.",
      "Bhature: Knead maida, rava, curd, baking soda, and warm water into soft dough; rest 2 hours. Roll into ovals and deep fry in smoking hot oil until puffed like balloons!"
    ],
    steps_ta: [
      "கொண்டைக்கடலையை டீ பேக் மற்றும் உப்பு சேர்த்து 6 விசில் விட்டு மசிய வேக வைக்கவும்.",
      "வாணலியில் வெங்காய விழுது, இஞ்சி பூண்டு வதக்கி தக்காளி விழுது மற்றும் சோலே மசாலா சேர்க்கவும்.",
      "மசாலா எண்ணெய் பிரியும் வரை வதக்கி, வெந்த கொண்டைக்கடலையை சேர்த்து 15 நிமிடம் கொதிக்க விடவும்.",
      "பட்டூரா மாவை பிசைந்து 2 மணி நேரம் ஊறவைத்து, சூடான எண்ணெயில் பலூன் போல உப்பி வரும் வரை பொரிக்கவும்!"
    ],
    tips_en: "Boiling with a tea bag gives the authentic dark restaurant color, while amchur provides the essential sour punch.",
    tips_ta: "டீ பேக் சேர்த்து வேக வைத்தால் கடைகளில் கிடைக்கும் கருப்பு நிற சோலே கிடைக்கும்.",
    served_with_en: "Pickled onions, green chilies, and fried aloo.",
    served_with_ta: "ஊறுகாய் வெங்காயம் மற்றும் எலுமிச்சையுடன் சாப்பிட அருமை."
  }
];

// Dynamic Procedural Recipe Synthesizer for ANY dish in the world
function synthesizeDynamicRecipe(query, isTamil) {
  // Clean query to extract dish name
  let dish = query
    .replace(/(how to make|recipe for|can you tell me|recipe of|give me|how to cook|i want to make|tell me recipe of)/gi, "")
    .replace(/(செய்முறை|எப்படி செய்வது|செய்யும் முறை|குறிப்பு)/gi, "")
    .replace(/[?!.,]/g, "")
    .trim();

  if (!dish || dish.length < 2) dish = "Special Gourmet Dish";
  const dishTitle = dish.charAt(0).toUpperCase() + dish.slice(1);

  const lower = dish.toLowerCase();

  // 1. Detect Category
  let category = "curry";
  if (lower.includes("biryani") || lower.includes("rice") || lower.includes("pulao") || lower.includes("khichdi") || lower.includes("சாதம்")) {
    category = "rice";
  } else if (lower.includes("fry") || lower.includes("roast") || lower.includes("sukka") || lower.includes("tikka") || lower.includes("kebab") || lower.includes("வறுவல்")) {
    category = "fry";
  } else if (lower.includes("soup") || lower.includes("broth") || lower.includes("ரசம்") || lower.includes("சூப்")) {
    category = "soup";
  } else if (lower.includes("cake") || lower.includes("cookie") || lower.includes("bread") || lower.includes("muffin") || lower.includes("pizza") || lower.includes("pie") || lower.includes("bake")) {
    category = "bake";
  } else if (lower.includes("sweet") || lower.includes("halwa") || lower.includes("payasam") || lower.includes("pudding") || lower.includes("kheer") || lower.includes("இனிப்பு")) {
    category = "sweet";
  } else if (lower.includes("dosa") || lower.includes("idli") || lower.includes("poori") || lower.includes("roti") || lower.includes("paratha") || lower.includes("tiffin")) {
    category = "tiffin";
  } else if (lower.includes("salad") || lower.includes("healthy") || lower.includes("diet")) {
    category = "salad";
  } else if (lower.includes("tea") || lower.includes("coffee") || lower.includes("juice") || lower.includes("shake") || lower.includes("drink")) {
    category = "drink";
  }

  // 2. Detect Main Hero Ingredient
  let hero = "Fresh Seasonal Vegetables / Protein";
  let hero_ta = "புதிய காய்கறிகள் அல்லது மாமிசம்";
  if (lower.includes("chicken") || lower.includes("கோழி")) { hero = "Tender Chicken (500g)"; hero_ta = "கோழிக்கறி (500 கிராம்)"; }
  else if (lower.includes("mutton") || lower.includes("ஆடு")) { hero = "Tender Mutton (500g)"; hero_ta = "ஆட்டுக்கறி (500 கிராம்)"; }
  else if (lower.includes("fish") || lower.includes("மீன்")) { hero = "Fresh Fish Fillets (500g)"; hero_ta = "புதிய மீன் (500 கிராம்)"; }
  else if (lower.includes("prawn") || lower.includes("shrimp") || lower.includes("இறால்")) { hero = "Cleaned Prawns (400g)"; hero_ta = "சுத்தம் செய்த இறால் (400 கிராம்)"; }
  else if (lower.includes("paneer") || lower.includes("பன்னீர்")) { hero = "Fresh Malai Paneer (250g cubed)"; hero_ta = "பன்னீர் (250 கிராம்)"; }
  else if (lower.includes("egg") || lower.includes("முட்டை")) { hero = "Boiled or Farm Fresh Eggs (4-6 nos)"; hero_ta = "முட்டை (4-6)"; }
  else if (lower.includes("mushroom") || lower.includes("காளான்")) { hero = "Fresh Button Mushrooms (250g sliced)"; hero_ta = "காளான் (250 கிராம்)"; }
  else if (lower.includes("potato") || lower.includes("aloo") || lower.includes("உருளை")) { hero = "Boiled Potatoes (3 large diced)"; hero_ta = "உருளைக்கிழங்கு (3)"; }

  if (isTamil) {
    return `🍽 **${dishTitle} செய்யும் முறை (Master Recipe):**

⏱ **தயாரிப்பு நேரம்:** 15 நிமிடங்கள் | **சமையல் நேரம்:** 25 நிமிடங்கள் | **நபர்கள்:** 3-4

🛒 **தேவையான பொருட்கள்:**
• **முக்கிய பொருள்:** ${hero_ta}
• **வெங்காயம்:** 2 நடுத்தர வெங்காயம் அல்லது 150 கிராம் சின்ன வெங்காயம் (நறுக்கியது)
• **தக்காளி:** 2 பழுத்த தக்காளி (பொடியாக நறுக்கியது அல்லது விழுது)
• **இஞ்சி பூண்டு விழுது:** 1.5 மேஜைக்கரண்டி
• **மசாலா பொருட்கள்:** மஞ்சள் தூள் (1/2 தேக்கரண்டி), மிளகாய் தூள் (1.5 தேக்கரண்டி), மல்லி தூள் (1 தேக்கரண்டி), கரம் மசாலா (1/2 தேக்கரண்டி)
• **தாளிக்க:** கடுகு, சீரகம், சோம்பு மற்றும் புதிய கறிவேப்பிலை
• **எண்ணெய் / நெய்:** 3 மேஜைக்கரண்டி
• **கல் உப்பு:** தேவைக்கு ஏற்ப

🍳 **செய்முறை படிகள்:**
1. **தயாரிப்பு:** தேவையான பொருட்களை சுத்தம் செய்து நறுக்கி வைக்கவும்.
2. **தாளிப்பு:** வாணலியில் எண்ணெய் ஊற்றி சூடானதும் கடுகு, சோம்பு மற்றும் கறிவேப்பிலை தாளிக்கவும்.
3. **வதக்குதல்:** நறுக்கிய வெங்காயம் சேர்த்து பொன்னிறமாக வதக்கவும். பின் இஞ்சி பூண்டு விழுது சேர்த்து பச்சை வாசனை போகும் வரை 2 நிமிடங்கள் வதக்கவும்.
4. **மசாலா கலவை:** தக்காளி, மஞ்சள் தூள், மிளகாய் தூள் மற்றும் மசாலா பொடிகள் சேர்த்து எண்ணெய் பிரியும் வரை நன்கு கிளறவும்.
5. **சமைத்தல்:** ${hero_ta} சேர்த்து மசாலாவுடன் நன்றாக பிரட்டவும். தேவையான அளவு தண்ணீர் மற்றும் உப்பு சேர்த்து மிதமான தீயில் மூடி வைத்து 15-20 நிமிடங்கள் வேக வைக்கவும்.
6. **முத்தாய்ப்பு:** எண்ணெய் பிரிந்து நறுமணம் வந்ததும், கொத்தமல்லி தழை தூவி சூடாக பரிமாறவும்!

💡 **செஃப் ரகசியம் (Pro Tip):** மசாலாக்களை குறைந்த தீயில் எண்ணெய் பிரியும் வரை வதக்கினால் தான் உணவக சுவை மற்றும் நிறம் கிடைக்கும்!`;
  }

  return `🍽 **Master Recipe: How to Make Authentic ${dishTitle}**

⏱ **Prep Time:** 15 mins | **Cook Time:** 25 mins | **Servings:** 3-4 | **Difficulty:** Medium

🛒 **Key Ingredients:**
• **Main Base:** ${hero}
• **Aromatics:** 2 medium onions (finely chopped) & 1.5 tbsp ginger-garlic paste
• **Tomatoes:** 2 ripe vine tomatoes (pureed or finely diced)
• **Spices:** 1/2 tsp turmeric, 1.5 tbsp red chili powder, 1 tbsp coriander powder, 1/2 tsp garam masala
• **Tempering:** 1 tsp mustard seeds, 1 tsp cumin/fennel, and fresh curry leaves / herbs
• **Cooking Medium:** 3 tbsp cold-pressed oil or pure ghee
• **Seasoning:** Sea salt to taste, freshly ground black pepper
• **Garnish:** Freshly chopped cilantro (coriander leaves) and lemon wedge

🍳 **Step-by-Step Cooking Method:**
1. **Preparation:** Clean and prep the ingredients. If using protein/veggies, marinate with a pinch of turmeric and salt.
2. **Tempering:** Heat oil or ghee in a heavy-bottomed pan. Add whole spices and curry leaves/herbs until fragrant.
3. **Sauté Aromatics:** Add chopped onions and sauté on medium heat until golden brown. Add ginger-garlic paste and stir for 2 mins until raw aroma dissipates.
4. **Build the Sauce/Base:** Fold in the tomatoes and dry spices. Sauté patiently until the oil naturally glimmers around the perimeter of the pan.
5. **Simmer & Cook:** Add ${hero} and toss to coat in the rich spice blend. Add 1/2 to 1 cup warm water (or broth), cover with lid, and simmer on gentle heat for 15-20 mins until tender and fully cooked.
6. **Finishing Touch:** Remove lid, adjust salt, sprinkle a pinch of garam masala and fresh coriander. Serve piping hot!

💡 **Pro Chef Tip:** Cooking the onion-tomato masala base on low flame until the oil separates is the #1 secret to achieving authentic restaurant-grade depth and flavor!`;
}

// Main Recipe Lookup & Resolution Engine
function getCulinaryReply(query, language) {
  const isTamil = /[\u0B80-\u0BFF]/.test(query) || language === "ta";
  const q = query.toLowerCase().trim();

  // 1. Check exact match in RECIPE_CATALOG
  for (const item of RECIPE_CATALOG) {
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) {
        const title = isTamil ? item.title_ta : item.title_en;
        const ings = isTamil ? item.ingredients_ta : item.ingredients_en;
        const steps = isTamil ? item.steps_ta : item.steps_en;
        const tips = isTamil ? item.tips_ta : item.tips_en;
        const served = isTamil ? item.served_with_ta : item.served_with_en;

        const ingsList = ings.map(i => `• ${i}`).join("\n");
        const stepsList = steps.map((s, idx) => `**${idx + 1}.** ${s}`).join("\n\n");

        if (isTamil) {
          return `👨‍🍳 **${title}**

⏱ **தயாரிப்பு:** ${item.prep} | **சமையல்:** ${item.cook} | **நபர்கள்:** ${item.servings} | **சிரமம்:** ${item.difficulty}

🛒 **தேவையான பொருட்கள்:**
${ingsList}

🍳 **செய்முறை:**
${stepsList}

💡 **செஃப் ரகசியம்:** ${tips}

🍽 **பரிமாறும் முறை:** ${served}`;
        } else {
          return `👨‍🍳 **${title}**

⏱ **Prep:** ${item.prep} | **Cook:** ${item.cook} | **Servings:** ${item.servings} | **Difficulty:** ${item.difficulty}

🛒 **Ingredients:**
${ingsList}

🍳 **Step-by-Step Instructions:**
${stepsList}

💡 **Pro Chef Secret:** ${tips}

🍽 **Best Served With:** ${served}`;
        }
      }
    }
  }

  // 2. Synthesize dynamic recipe for ANY other dish
  return synthesizeDynamicRecipe(query, isTamil);
}

module.exports = {
  RECIPE_CATALOG,
  getCulinaryReply,
  synthesizeDynamicRecipe
};
