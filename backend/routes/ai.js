const router = require("express").Router();
const db = require("../config/db");

// Common culinary substitutions database
const SUBSTITUTIONS = {
  egg: [
    { replacement: "Mashed ripe banana (1/4 cup per egg)", bestFor: "Baking, pancakes, muffins", note: "Adds mild sweetness" },
    { replacement: "Flaxseed meal + warm water (1 tbsp + 3 tbsp)", bestFor: "Brownies, whole wheat breads", note: "Excellent binding & fiber" },
    { replacement: "Plain yogurt / Curd (1/4 cup per egg)", bestFor: "Cakes, quick breads", note: "Adds tenderness and moisture" },
    { replacement: "Aquafaba / Chickpea water (3 tbsp per egg)", bestFor: "Macarons, meringues, light cakes", note: "Whips like egg whites" }
  ],
  ghee: [
    { replacement: "Clarified butter or Olive oil + pinch of salt", bestFor: "Tempering, sautéing", note: "Lighter cholesterol profile" },
    { replacement: "Cold-pressed coconut oil", bestFor: "South Indian gravies, rice dishes", note: "Distinct pleasant aroma" },
    { replacement: "Sesame / Gingelly oil (நல்லெண்ணெய்)", bestFor: "Tamil curries, podi mixing, tempering", note: "Traditional, authentic taste" }
  ],
  paneer: [
    { replacement: "Firm Tofu (pressed and cubed)", bestFor: "Tikka, butter masala, wraps", note: "100% plant-based / vegan" },
    { replacement: "Halloumi or Paneer-style Ricotta", bestFor: "Grilling, curry", note: "Mild savory profile" },
    { replacement: "Soaked Soya Chunks (Mealmaker)", bestFor: "Curries, biryani, stir fry", note: "Economical high protein substitute" }
  ],
  cream: [
    { replacement: "Soaked cashew paste + water (1:1)", bestFor: "Mughlai gravies, soups", note: "Natural nutty rich texture" },
    { replacement: "Thick coconut milk", bestFor: "Curries, gravies, payasam", note: "Lactose-free, rich aromatic flavor" },
    { replacement: "Blended silken tofu or milk + butter", bestFor: "Pasta sauces, soups", note: "Smooth emulsion" }
  ],
  sugar: [
    { replacement: "Pure organic jaggery / Naattu Sakkarai (நாட்டுச் சர்க்கரை)", bestFor: "Tamil sweets, payasam, chai", note: "Unrefined with rich iron minerals" },
    { replacement: "Pure Honey or Maple syrup", bestFor: "Dressings, pancakes, baking", note: "Use 25% less quantity" },
    { replacement: "Dates syrup or mashed Medjool dates", bestFor: "Kheer, energy bars, smoothies", note: "High fiber and micronutrients" }
  ],
  buttermilk: [
    { replacement: "Milk + 1 tbsp lemon juice or vinegar (let sit 5 mins)", bestFor: "Baking, marinades", note: "Instant homemade buttermilk" },
    { replacement: "Whisked curd with equal parts water", bestFor: "South Indian meals, koozh, mor kozhambu", note: "Natural probiotic refresher" }
  ],
  tamarind: [
    { replacement: "Fresh lemon / lime juice", bestFor: "Rasam, fish curry, salads", note: "Add at the end of cooking" },
    { replacement: "Amchur (dry mango powder) or Kokum", bestFor: "North Indian curries, sambar, dal", note: "Tangy without darkening color" }
  ]
};

// Culinary Knowledge Base for rich conversational responses
const CULINARY_TOPICS = [
  {
    keywords: ["dosa", "தோசை", "dosai", "crisp", "batter"],
    en: `🥞 **Secrets to Perfect Restaurant-Style Crispy Dosa:**
1. **Batter Ratio:** Use 4 parts Idli/Parboiled Rice to 1 part whole Urad Dal + 1 tbsp Chana Dal (for golden color) and 1 tsp Fenugreek seeds (methi for crispness & fermentation).
2. **Fermentation:** Ferment in a warm place for 8-12 hours until aerated and slightly bubbly.
3. **Tawa Temperature:** Splash water on your cast-iron tawa; it should sizzle and evaporate immediately. Wipe with an onion slice.
4. **Cooking:** Spread batter thinly from center outward. Drizzle pure Desi Ghee or gingelly oil around the perimeter. Cook on medium-high until edges lift naturally!`,
    ta: `🥞 **ஹோட்டல் ஸ்டைல் மொறுமொறு தோசைக்கான ரகசியங்கள்:**
1. **அளவு விகிதம்:** 4 பங்கு இட்லி அரிசிக்கு 1 பங்கு உளுந்து, 1 ஸ்பூன் கடலைப்பருப்பு (பொன்னிறத்திற்கு) மற்றும் 1 ஸ்பூன் வெந்தயம் (மொறுமொறுப்பிற்கு) சேர்த்து ஊறவைத்து அரைக்கவும்.
2. **புளிக்க வைத்தல்:** மாவை 8 முதல் 12 மணி நேரம் வெதுவெதுப்பான இடத்தில் புளிக்க வைக்கவும்.
3. **கல் பக்குவம்:** இரும்பு தோசைக்கல்லில் தண்ணீர் தெளித்தால் உடனே உறிஞ்சி அடங்க வேண்டும். வெங்காயத் துண்டால் தடவி மாவை ஊற்றவும்.
4. **சுடும் முறை:** நடுவிலிருந்து மெல்லிய வட்டமாக தேய்த்து, சுற்றிலும் நாட்டு நெய் அல்லது நல்லெண்ணெய் விட்டு பொன்னிறமாக மொறுமொறுப்பானதும் எடுக்கவும்!`
  },
  {
    keywords: ["idli", "இட்லி", "soft idli", "fluffy", "மல்லிகைப்பூ"],
    en: `🌸 **How to Make Malligai Poo Soft & Spongy Idlis:**
1. **Quality Dal:** Use high-grade unpolished whole white Urad Dal (Gundu Urad).
2. **Grinding Technique:** Grind urad dal with ice-cold water in a wet grinder until it becomes super fluffy, light, and doubles in volume like whipped cream.
3. **Mixing:** Mix rice and dal batter with clean hands—natural body warmth triggers wholesome fermentation.
4. **Steaming:** Steam on medium-high flame for exactly 10 minutes. Let rest for 2 minutes before demolding with a wet spoon.`,
    ta: `🌸 **மல்லிகைப் பூ போன்ற பஞ்சு இட்லி செய்வதற்கான குறிப்புகள்:**
1. **உளுந்து தரம்:** உயர்தர முழு வெள்ளை குண்டு உளுந்து பயன்படுத்தவும்.
2. **அரைக்கும் முறை:** உளுந்தை ஐஸ் தண்ணீர் விட்டு கிரைண்டரில் வெண்ணெய் போல பஞ்சாக பொங்கி வரும் வரை அரைக்கவும்.
3. **கலக்கும் ரகசியம்:** கை விரல்களால் மாவை கலக்க வேண்டும்; கையின் இயற்கையான வெப்பம் மாவை பக்குவமாக புளிக்க வைக்கும்.
4. **வேகவைக்கும் நேரம்:** இட்லி பாத்திரத்தில் சரியாக 10 நிமிடங்கள் மிதமான தீயில் வேகவைத்து, 2 நிமிடம் கழித்து ஈரமான ஸ்பூனால் எடுக்கவும்.`
  },
  {
    keywords: ["biryani", "பிரியாணி", "briyani", "dum", "mutton biryani", "chicken biryani"],
    en: `👑 **Mastering Authentic Dum Biryani:**
1. **Rice Selection:** For Tamil heritage style (Ambur/Dindigul), use fragrant Seeraga Samba short grain rice. For Mughlai/Hyderabadi, choose aged long-grain Basmati.
2. **Rice Parboiling:** Parboil rice with whole spices (cardamom, clove, bay leaf) to exactly 70% (grain breaks into 3 pieces when pressed).
3. **Layering:** Layer tender marinated meat at bottom, hot drained rice on top, drizzled with saffron milk, ghee, mint, and fried onions (barista).
4. **Dum Cooking:** Seal lid airtight with wheat dough or foil. Cook on high for 5 mins, then place on a flat tawa on lowest flame for 20-25 minutes!`,
    ta: `👑 **மணமணக்கும் சுவையான தம் பிரியாணி ரகசியம்:**
1. **அரிசி தேர்வு:** தமிழ் பாரம்பரிய ஆம்பூர்/திண்டுக்கல் பிரியாணிக்கு சீரக சம்பா அரிசியும், முகலாய் பிரியாணிக்கு பாசுமதி அரிசியும் சிறந்தது.
2. **அரிசி பக்குவம்:** கொதிக்கும் நீரில் பட்டை, கிராம்பு சேர்த்து அரிசியை 70% மட்டுமே வேகவைத்து வடிக்க வேண்டும் (அரிசியை அழுத்தினால் 3 துண்டாக உடைய வேண்டும்).
3. **அடுக்கு முறை:** பாத்திரத்தில் கறி மசாலாவை அடியில் வைத்து, மேலே வடித்த சூடான சாதம், புதினா, நெய், குங்குமப்பூ பால் சேர்க்கவும்.
4. **தம் போடுதல்:** காற்று போகாமல் பாத்திரத்தை மூடி, தோசைக்கல்லின் மேல் வைத்து மிதமான தணலில் 20-25 நிமிடங்கள் தம் போடவும்!`
  },
  {
    keywords: ["sambar", "சாம்பார்", "sambhar", "drumstick", "shallot", "murungakkai"],
    en: `🍲 **Traditional Tamil Nadu Sambar Masterclass:**
1. **Lentil Base:** Cook toor dal with a pinch of turmeric, castor oil, and 2 garlic cloves until creamy and completely soft.
2. **Vegetables & Shallots:** Sauté small pearl shallots (Chinna Vengayam) in sesame oil first before adding drumsticks and tomatoes.
3. **Tamarind & Spice:** Boil veggies in tamarind extract and freshly roasted sambar powder (coriander, chana dal, cumin, fenugreek, red chilies).
4. **Tempering (Tadka):** In hot ghee, splutter mustard seeds, a generous pinch of asafoetida (hing), fenugreek, and fresh curry leaves—pour while sizzling!`,
    ta: `🍲 **மணமணக்கும் கிராமத்து பாரம்பரிய சாம்பார்:**
1. **பருப்பு பக்குவம்:** துவரம் பருப்பை மஞ்சள் தூள், சிறிதளவு விளக்கெண்ணெய் மற்றும் பூண்டு சேர்த்து குக்கரில் 4 விசில் விட்டு மசிய வேக வைக்கவும்.
2. **சின்ன வெங்காயம்:** சின்ன வெங்காயத்தை நல்லெண்ணெயில் வதக்கி சேர்த்தால் சாம்பாரின் சுவை பல மடங்கு கூடும்.
3. **கொதிக்கும் முறை:** புளிக்கரைசலில் முருங்கைக்காய், வெங்காயம், தக்காளி மற்றும் சாம்பார் பொடி சேர்த்து காய்கள் வெந்து பச்சை வாசனை போகும் வரை கொதிக்க விடவும்.
4. **தாளிப்பு:** நெய்யில் கடுகு, வெந்தயம், காய்ந்த மிளகாய், பெருங்காயம், கறிவேப்பிலை தாளித்து கொதிக்கும் சாம்பாரில் ஊற்றினால் ஊரே மணக்கும்!`
  },
  {
    keywords: ["rasam", "ரசம்", "pepper rasam", "jeera", "poodu"],
    en: `🥣 **Immunity-Boosting Village Pepper Garlic Rasam:**
1. **Fresh Spice Crush:** Coarsely crush black peppercorns, cumin seeds, 8 garlic cloves with skin, and green chilies in a stone mortar.
2. **Tomato-Tamarind Broth:** Mash ripe tomatoes by hand in diluted tamarind water with turmeric, rock salt, and chopped coriander stems.
3. **Simmer, Never Boil:** Cook on gentle flame. The exact moment frothy foam rises to the brim (nuraitthu varum podhu), turn off the stove immediately!
4. **Final Tempering:** Splutter mustard, curry leaves, and generous asafoetida in ghee.`,
    ta: `🥣 **நோய் எதிர்ப்பு சக்தி தரும் கிராமத்து மிளகு பூண்டு ரசம்:**
1. **இடிக்கும் மசாலா:** மிளகு, சீரகம், தோலுடன் கூடிய பூண்டு மற்றும் வரமிளகாயை அம்மியில் அல்லது உரலில் கொரகொரப்பாக இடிக்கவும்.
2. **கரைசல்:** நாட்டுத் தக்காளி, புளித் தண்ணீர், மஞ்சள் தூள், கல் உப்பு மற்றும் கொத்தமல்லி தண்டு சேர்த்து கையால் பிசைந்து கொள்ளவும்.
3. **பக்குவம்:** ரசத்தை ஒருபோதும் கொதிக்க விடக்கூடாது; நுரைத்து வரும் போது உடனே அடுப்பை அணைக்க வேண்டும்!
4. **தாளிப்பு:** நெய்யில் கடுகு, பெருங்காயம், கறிவேப்பிலை தாளித்து ஊற்றி மூடி வைக்கவும்.`
  },
  {
    keywords: ["paneer", "பன்னீர்", "butter masala", "shahi"],
    en: `🧀 **Restaurant-Secret Paneer Butter Masala:**
1. **Soft Paneer Trick:** Soak paneer cubes in warm salted water for 10 minutes before adding. Never overcook paneer (2-3 mins max) or it turns rubbery.
2. **Silky Makhani Gravy:** Boil tomatoes, soaked cashews, garlic, ginger, and whole spices, then puree until velvety smooth.
3. **Rich Flavor Profile:** Cook puree in butter, season with Kashmiri chili and garam masala.
4. **Finishing Touch:** Crush fragrant Kasuri Methi (dried fenugreek) between your palms, add a spoon of fresh cream and a tiny pinch of sugar to balance acidity.`,
    ta: `🧀 **ஹோட்டல் சுவையில் பன்னீர் பட்டர் மசாலா:**
1. **மென்மையான பன்னீர்:** பன்னீர் துண்டுகளை வெதுவெதுப்பான உப்பு நீரில் 10 நிமிடம் ஊறவைத்து சேர்க்கவும். பன்னீரை அதிக நேரம் சமைக்கக் கூடாது (2 நிமிடம் போதும்).
2. **கிரேவி பக்குவம்:** தக்காளி, ஊறவைத்த முந்திரி, இஞ்சி, பூண்டு ஆகியவற்றை வேகவைத்து மிக்ஸியில் வெண்ணெய் போல மென்மையாக அரைக்கவும்.
3. **வெண்ணெய் வதக்கல்:** வெண்ணெயில் காஷ்மீரி மிளகாய் தூள் சேர்த்து அரைத்த விழுதை எண்ணெய் பிரியும் வரை வதக்கவும்.
4. **முத்தாய்ப்பு:** கசூரி மேத்தியை கைகளில் நசுக்கி தூவி, பிரெஷ் கிரீம் மற்றும் ஒரு சிட்டிகை சர்க்கரை சேர்த்து இறக்கினால் அருமையான சுவை கிடைக்கும்!`
  },
  {
    keywords: ["chicken", "கோழி", "சிக்கன்", "pepper chicken", "chettinad chicken"],
    en: `🍗 **Authentic Chettinad Pepper Chicken:**
1. **Fresh Roast Spice:** Dry roast black peppercorns, fennel seeds, coriander seeds, cumin, and dried red chilies until intensely aromatic. Grind coarsely.
2. **Oil & Onions:** Use cold-pressed sesame (gingelly) oil. Sauté plenty of small shallots and fresh curry leaves.
3. **Sear the Meat:** Add chicken with turmeric and ginger-garlic paste, searing on high heat for 5 minutes to lock in natural juices.
4. **Simmer:** Add spice mix, cover on low flame, and let it cook in its own juices until tender, dark, and glistening with rich pepper coat.`,
    ta: `🍗 **காரசாரமான பாரம்பரிய செட்டிநாடு சிக்கன் வறுவல்:**
1. **வறுத்த மசாலா:** மிளகு, சோம்பு, மல்லி, சீரகம் மற்றும் காய்ந்த மிளகாயை வாசனை வரும் வரை வறுத்து கொரகொரப்பாக அரைத்துக் கொள்ளவும்.
2. **நல்லெண்ணெய் & வெங்காயம்:** நல்லெண்ணெயில் அதிக அளவு சின்ன வெங்காயம் மற்றும் கறிவேப்பிலை சேர்த்து வதக்கவும்.
3. **வதக்கும் முறை:** சிக்கன், இஞ்சி பூண்டு விழுது, மஞ்சள் தூள் சேர்த்து 5 நிமிடங்கள் அதிக தீயில் வதக்கி சாறை உள்ளடக்கவும்.
4. **பக்குவம்:** அரைத்த மசாலா சேர்த்து மூடி வைத்து குறைந்த தீயில் வேக வைக்கவும். எண்ணெய் பிரிந்து கருப்பு நிறத்தில் மொறுமொறுப்பாக வரும் போது இறக்கவும்!`
  },
  {
    keywords: ["weight loss", "diet", "உடல் எடை", "calorie", "healthy", "fit"],
    en: `🥗 **Wholesome Healthy Indian Diet Blueprint:**
1. **Replace Refined Grains:** Switch white rice to native millets like Kambu (Pearl Millet), Thinai (Foxtail), or Ragi (Finger Millet).
2. **Increase Protein:** Incorporate sprouted green gram (moong), paneer/tofu, boiled eggs, country chicken, and dal in every meal.
3. **Fiber & Gut Health:** Drink traditional fermented Kambu Koozh or buttermilk (neer mor) with shallots and curry leaves.
4. **Cooking Method:** Reduce deep frying; use steamed tiffins (idli, idiyappam, kozhukattai) and roasted dry curries.`,
    ta: `🥗 **ஆரோக்கியமான உடல் எடை குறைப்பு சமையல் குறிப்புகள்:**
1. **சிறு தானியங்கள்:** வெள்ளை அரிசிக்கு பதிலாக கம்பு, தினை, சாமை அல்லது கேழ்வரகு உணவுகளை எடுத்துக் கொள்ளுங்கள்.
2. **புரதச்சத்து:** பாசிப்பயறு சுண்டல், பன்னீர், முட்டை, பருப்பு வகைகள் போன்றவற்றை தினமும் உணவில் சேர்க்கவும்.
3. **குடல் ஆரோக்கியம்:** கம்பு கூழ், மோர் மற்றும் சின்ன வெங்காயம் உடலில் உள்ள நச்சுக்களை வெளியேற்றி செரிமானத்தை சீராக்கும்.
4. **சமைக்கும் முறை:** எண்ணெயில் பொரித்த உணவுகளை தவிர்த்து இட்லி, இடியாப்பம் போன்ற ஆவியில் வெந்த உணவுகளை உண்ணவும்.`
  },
  {
    keywords: ["sweet", "பாயாசம்", "dessert", "kesari", "payasam", "halwa", "இனிப்பு"],
    en: `🍯 **Pro Tips for Heavenly Indian Sweets:**
1. **Semiya/Elaneer Payasam:** Roast vermicelli or nuts in pure ghee until aromatic golden brown. For tender coconut (Elaneer) payasam, add coconut pulp and water only after milk has fully cooled down to prevent curdling!
2. **Rava Kesari:** Roast rava in ghee. Use 3 parts boiling water to 1 part rava, cook lump-free, and add sugar ONLY after rava is 100% cooked through.
3. **Flavoring:** Always finish with freshly crushed green cardamom and a pinch of edible camphor (pachai karpooram) for temple flavor.`,
    ta: `🍯 **சுவையான பாரம்பரிய இனிப்புகள் செய்யும் ரகசியம்:**
1. **பாயாசம்:** முந்திரி, திராட்சை மற்றும் சேமியாவை நாட்டு நெய்யில் பொன்னிறமாக வறுத்து சேர்க்கவும். இளநீர் பாயாசத்திற்கு பால் ஆறிய பிறகே இளநீர் வழுக்கையை சேர்க்க வேண்டும்.
2. **ரவா கேசரி:** ரவையை நெய்யில் வறுத்து, கொதிக்கும் நீரில் கட்டியில்லாமல் வேக வைத்து, ரவை நன்றாக வெந்த பிறகே சர்க்கரை சேர்க்க வேண்டும்.
3. **நறுமணம்:** ஏலக்காய் தூள் மற்றும் ஒரு துளி பச்சை கற்பூரம் சேர்த்தால் கோவில் பிரசாத மணம் கிடைக்கும்.`
  },
  {
    keywords: ["salt", "உப்பு", "too salty", "fix curry", "saline"],
    en: `🧂 **How to Fix a Dish That is Too Salty:**
1. **Raw Potato Trick:** Peel and drop 2 raw potato halves into the simmering curry for 10 minutes—it absorbs excess salt like a sponge! Remove before serving.
2. **Dairy / Cream:** Stir in 2-3 tbsp of curd, fresh cream, or coconut milk to mellow down sharpness.
3. **Dough Balls:** Drop small kneaded wheat flour dough balls into the boiling gravy and discard later.
4. **Acid Balance:** Add a splash of fresh lemon juice or a pinch of jaggery to rebalance flavor profile.`,
    ta: `🧂 **உணவில் உப்பு அதிகமாகிவிட்டால் சரிசெய்யும் வழிகள்:**
1. **உருளைக்கிழங்கு:** பச்சையான உருளைக்கிழங்கை நறுக்கி குழம்பில் 10 நிமிடம் போட்டு கொதிக்க வைத்தால் அதிகப்படியான உப்பை உறிஞ்சிவிடும்.
2. **தயிர் / தேங்காய்ப்பால்:** 2 ஸ்பூன் தயிர் அல்லது கெட்டி தேங்காய்ப்பால் சேர்த்தால் உப்பின் காரம் தணியும்.
3. **கோதுமை மாவு உருண்டை:** சிறு கோதுமை மாவு உருண்டைகளை குழம்பில் போட்டு சிறிது நேரம் கழித்து எடுத்துவிடலாம்.
4. **எலுமிச்சை சாறு:** சிறிதளவு எலுமிச்சை சாறு அல்லது நாட்டுச் சர்க்கரை சேர்த்து சமநிலைப்படுத்தலாம்.`
  },
  {
    keywords: ["breakfast", "காலை உணவு", "morning", "tiffin"],
    en: `🌅 **Top South Indian Wholesome Breakfast Ideas:**
1. **Steamed Soft Idli with Vegetable Sambar & Coconut Chutney** - Light, fermented, gut-friendly.
2. **Crispy Ghee Podi Dosa** - Energizing carbs with protein-rich lentils.
3. **Traditional Kambu Koozh / Ragi Kali** - Ancient millets that keep you cool and full of stamina.
4. **Millet Pongal with Sambar** - Comforting savory rice-lentil porridge with black pepper and cumin.`,
    ta: `🌅 **ஆரோக்கியமான காலை உணவு யோசனைகள்:**
1. **பஞ்சு போன்ற இட்லி & காய்கறி சாம்பார்** - எளிதில் செரிமானமாகும் ஆவியில் வெந்த சத்தான உணவு.
2. **மொறுமொறு நெய் பொடி தோசை & தேங்காய் சட்னி** - நாள் முழுவதும் புத்துணர்ச்சி தரும் காலை உணவு.
3. **பாரம்பரிய கம்பு கூழ்** - உடலை குளிர்ச்சியாகவும் சுறுசுறுப்பாகவும் வைக்கும் இயற்கை உணவு.
4. **திணை அல்லது சாமை வெண் பொங்கல்** - மிளகு, சீரகம், நெய் மணத்துடன் கூடிய சத்தான காலை உணவு.`
  },
  {
    keywords: ["dinner", "இரவு உணவு", "night meal", "light dinner"],
    en: `🌙 **Wholesome & Light Indian Dinner Options:**
1. **Phulka / Roti with Creamy Shahi Paneer Butter Masala** - Nutritious protein dinner.
2. **Idiyappam (String Hoppers) with Veg Kurma or Coconut Milk** - Super light on stomach for sound sleep.
3. **Oats / Millets Upma loaded with carrots, beans, and peas** - High fiber, low glycemic index.
4. **Warm Lentil & Vegetable Soup with whole grain toast** - Easy to digest before bed.`,
    ta: `🌙 **இரவுக்கான லேசான மற்றும் சத்தான உணவுகள்:**
1. **சுடச்சுட சப்பாத்தி & பன்னீர் கிரேவி** - புரதச்சத்து நிறைந்த ஆரோக்கியமான இரவு உணவு.
2. **இடியாப்பம் & காய்கறி குருமா அல்லது தேங்காய்ப்பால்** - எளிதில் செரிமானமாகி ஆழ்ந்த தூக்கத்திற்கு உதவும்.
3. **காய்கறிகள் நிறைந்த சிறுதானிய கிச்சடி அல்லது உப்புமா** - நார்சத்து மிகுந்த சிறந்த உணவு.
4. **பருப்பு & கீரை சூப்** - வயிற்றுக்கு இதமான இலகுவான இரவு உணவு.`
  }
];

// Helper to query Gemini API if GEMINI_API_KEY is configured
async function callGeminiIfAvailable(prompt) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `You are ChefBot, an expert bilingual culinary AI chef specializing in authentic Tamil Nadu, South Indian, North Indian, and global cuisines. Provide an engaging, highly detailed response with ingredients, steps, and pro cooking tips. Format with bold titles and emojis. If the user asks in Tamil or asks for Tamil, respond in Tamil. Query: ${prompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generated) return generated;
    }
  } catch (err) {
    console.warn("Gemini API call failed, falling back to local engine:", err.message);
  }
  return null;
}

const recipeKnowledge = require("../services/recipeKnowledge");

// 1. ChefBot AI Culinary Chatbot
router.post("/chat", async (req, res) => {
  try {
    const { message, language = "en" } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const q = message.toLowerCase().trim();
    const isTamilQuery = /[\u0B80-\u0BFF]/.test(message) || language === "ta";

    // 1. Check for live Gemini API response if key present
    const geminiResponse = await callGeminiIfAvailable(message);
    if (geminiResponse) {
      // Find matching recipes from DB to accompany Gemini response
      let matched = [];
      try {
        const [rows] = await db.query(
          `SELECT r.id, r.title, r.title_ta, r.cuisine, r.difficulty, r.prep_minutes, r.cook_minutes, r.image_url, r.video_url,
           COALESCE((SELECT AVG(rating) FROM reviews WHERE recipe_id=r.id), 5) AS rating
           FROM recipes r
           WHERE r.status = 'PUBLISHED'
           AND (r.title LIKE ? OR r.title_ta LIKE ? OR r.cuisine LIKE ?)
           LIMIT 2`,
          [`%${q}%`, `%${q}%`, `%${q}%`]
        );
        matched = rows || [];
      } catch (e) {}

      return res.json({
        reply: geminiResponse,
        reply_en: geminiResponse,
        reply_ta: geminiResponse,
        suggestedRecipes: matched,
        source: "gemini_ai"
      });
    }

    // 2. Search matching recipes in database for suggested cards
    let suggestedRecipes = [];
    try {
      const [matched] = await db.query(
        `SELECT r.id, r.title, r.title_ta, r.cuisine, r.difficulty, r.prep_minutes, r.cook_minutes, r.image_url, r.video_url,
         COALESCE((SELECT AVG(rating) FROM reviews WHERE recipe_id=r.id), 5) AS rating
         FROM recipes r
         WHERE r.status = 'PUBLISHED'
         AND (r.title LIKE ? OR r.title_ta LIKE ? OR r.description LIKE ? OR r.cuisine LIKE ?
              OR EXISTS (SELECT 1 FROM ingredients i WHERE i.recipe_id=r.id AND (i.name LIKE ? OR i.name_ta LIKE ?)))
         LIMIT 3`,
        [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
      );
      if (matched && matched.length > 0) {
        suggestedRecipes = matched;
      }
    } catch (e) {}

    // 3. Check for greeting intent
    const isGreeting = /^(hi|hello|hey|vanakkam|வணக்கம்|ola|greetings|who are you|help)(\s*!*)?$/i.test(q);
    if (isGreeting) {
      const reply_en = `👋 **Hello Chef! I am ChefBot, your Master AI Culinary Assistant.**\n\nI can tell you the recipe for **ANY dish in the world** — heritage Tamil, South Indian, North Indian, Indo-Chinese, Italian, baking, or street food!\n\n💡 **Try asking me:**\n• *"How to make Mutton Sukka?"*\n• *"Chicken Fried Rice recipe"*\n• *"பீட்சா செய்வது எப்படி?"*\n• *"How to make Gulab Jamun?"*\n• *"White Sauce Pasta recipe"*\n• *"மீன் குழம்பு செய்முறை"*\n• Or any custom dish name!`;
      const reply_ta = `👋 **வணக்கம்! நான் உங்கள் சமையல் வழிகாட்டி செஃப்போட் (ChefBot).**\n\nநீங்கள் கேட்கும் **எந்த ஒரு உணவின் செய்முறையையும்** (தமிழ் பாரம்பரியம், அசைவம், சைவம், பிரியாணி, ஸ்வீட்ஸ், பாஸ்தா, பீட்சா அல்லது வெளிநாட்டு உணவுகள்) முழுமையாக நான் உங்களுக்கு வழங்குவேன்!\n\n💡 **உதாரணத்திற்கு என்னிடம் கேளுங்கள்:**\n• *"மட்டன் சுக்கா செய்வது எப்படி?"*\n• *"சிக்கன் 65 செய்முறை"*\n• *"குலாப் ஜாமூன் செய்வது எப்படி?"*\n• *"மீன் குழம்பு வைப்பது எப்படி?"*\n• *"Chicken Fried Rice / Pasta recipe"*\n• அல்லது நீங்கள் விரும்பும் எந்த உணவின் பெயரையும் கேளுங்கள்!`;

      return res.json({
        reply: isTamilQuery ? reply_ta : reply_en,
        reply_en,
        reply_ta,
        suggestedRecipes,
        source: "chefbot_local"
      });
    }

    // 4. Check for ingredient substitution intent
    if (q.includes("substitute") || q.includes("replace") || q.includes("மாற்று")) {
      let matchedSub = null;
      for (const [key, options] of Object.entries(SUBSTITUTIONS)) {
        if (q.includes(key)) {
          matchedSub = { key, options };
          break;
        }
      }

      if (matchedSub) {
        const optList = matchedSub.options.map(o => `• **${o.replacement}** (Best for: ${o.bestFor} — *${o.note}*)`).join("\n");
        const reply_en = `🔄 **Substitutes for ${matchedSub.key.toUpperCase()}:**\n${optList}`;
        const reply_ta = `🔄 **${matchedSub.key.toUpperCase()}க்கு மாற்றுப் பொருட்கள்:**\n${optList}`;
        return res.json({
          reply: isTamilQuery ? reply_ta : reply_en,
          reply_en,
          reply_ta,
          suggestedRecipes,
          source: "chefbot_substitutions"
        });
      }
    }

    // 5. Check if query matches our extensive knowledge base or synthesize ANY dish!
    const replyText = recipeKnowledge.getCulinaryReply(message, language);

    res.json({
      reply: replyText,
      reply_en: replyText,
      reply_ta: replyText,
      suggestedRecipes,
      source: "chefbot_recipe_engine"
    });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Pantry-to-Recipe Matcher (Reverse Search Algorithm)
router.post("/pantry-match", async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: "List of ingredients is required" });
    }

    const normalizedInputs = ingredients.map(i => i.toLowerCase().trim()).filter(Boolean);

    // Fetch all published recipes with their ingredients
    const [recipes] = await db.query(`
      SELECT r.id, r.title, r.title_ta, r.cuisine, r.difficulty, r.prep_minutes, r.cook_minutes, r.image_url, r.video_url,
      COALESCE((SELECT AVG(rating) FROM reviews WHERE recipe_id=r.id), 5) AS rating
      FROM recipes r
      WHERE r.status = 'PUBLISHED'
    `);

    const [allIngs] = await db.query(`
      SELECT recipe_id, name, name_ta, quantity, unit FROM ingredients
    `);

    const ingsByRecipe = {};
    for (const item of allIngs) {
      if (!ingsByRecipe[item.recipe_id]) ingsByRecipe[item.recipe_id] = [];
      ingsByRecipe[item.recipe_id].push(item);
    }

    const results = recipes.map(r => {
      const recIngs = ingsByRecipe[r.id] || [];
      const totalRequired = recIngs.length;
      if (totalRequired === 0) return null;

      const matchedIngs = [];
      const missingIngs = [];

      for (const reqIng of recIngs) {
        const nameLower = (reqIng.name || "").toLowerCase();
        const nameTaLower = (reqIng.name_ta || "").toLowerCase();

        const isMatched = normalizedInputs.some(input =>
          nameLower.includes(input) || input.includes(nameLower) ||
          (nameTaLower && nameTaLower.includes(input))
        );

        if (isMatched) {
          matchedIngs.push(reqIng.name);
        } else {
          missingIngs.push(reqIng.name);
        }
      }

      const matchPercentage = Math.round((matchedIngs.length / totalRequired) * 100);

      return {
        ...r,
        matchPercentage,
        totalRequired,
        matchedCount: matchedIngs.length,
        missingCount: missingIngs.length,
        matchedIngredients: matchedIngs,
        missingIngredients: missingIngs
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      totalAnalyzed: recipes.length,
      pantryItems: normalizedInputs,
      matches: results
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Ingredient Substitutions Engine
router.get("/substitutions", (req, res) => {
  res.json(SUBSTITUTIONS);
});

router.get("/substitutions/:item", (req, res) => {
  const item = req.params.item.toLowerCase().trim();
  const foundKey = Object.keys(SUBSTITUTIONS).find(k => item.includes(k) || k.includes(item));
  if (foundKey) {
    res.json({ item: foundKey, options: SUBSTITUTIONS[foundKey] });
  } else {
    res.status(404).json({
      message: `No predefined substitution found for "${item}". Ask ChefBot directly!`,
      availableCategories: Object.keys(SUBSTITUTIONS)
    });
  }
});

module.exports = router;
