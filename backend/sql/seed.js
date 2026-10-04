require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cookshare",
    waitForConnections: true,
    connectionLimit: 10
  });

  console.log("Connecting to database and populating valid data...");

  // Clear existing data safely
  await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
  await pool.query("TRUNCATE TABLE reviews;");
  await pool.query("TRUNCATE TABLE favorites;");
  await pool.query("TRUNCATE TABLE recently_accessed;");
  await pool.query("TRUNCATE TABLE shopping_items;");
  await pool.query("TRUNCATE TABLE meal_plans;");
  await pool.query("TRUNCATE TABLE ingredients;");
  await pool.query("TRUNCATE TABLE recipe_steps;");
  await pool.query("TRUNCATE TABLE recipes;");
  await pool.query("TRUNCATE TABLE users;");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1;");

  const defaultPassword = await bcrypt.hash("Password@123", 12);

  // 1. Insert 6 verified users (1 Admin + 5 Regular Users)
  const usersData = [
    {
      name: "Gowri Admin",
      email: "admin@cookshare.com",
      role: "ADMIN",
      bio: "Head Administrator & Culinary Director at CookShare. Overseeing community recipes and quality standards.",
      profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Chef Maya Raman",
      email: "maya.raman@cookshare.com",
      role: "USER",
      bio: "Heritage South Indian & Chettinad culinary specialist with 12+ years of professional kitchen experience.",
      profile_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Dr. Rajesh Varma",
      email: "rajesh.nutrition@cookshare.com",
      role: "USER",
      bio: "Clinical Nutritionist developing diabetic-friendly and high-protein wholesome Indian recipes.",
      profile_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Priya Sundaram",
      email: "priya.sundaram@cookshare.com",
      role: "USER",
      bio: "Passionate home baker and traditional Tamil organic tiffin artisan from Madurai.",
      profile_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Chef Arvind Swaminathan",
      email: "arvind.swaminathan@cookshare.com",
      role: "USER",
      bio: "Executive chef focusing on royal Mughlai curries, biryani dum techniques, and fusion street food.",
      profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Kavitha Ananth",
      email: "kavitha.cooks@cookshare.com",
      role: "USER",
      bio: "Organic farm advocate & native millet recipe preservationist, sharing grandmother's forgotten dishes.",
      profile_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
    }
  ];

  const userIds = {};
  for (const u of usersData) {
    const [res] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, bio, profile_image) VALUES (?, ?, ?, ?, ?, ?)`,
      [u.name, u.email, defaultPassword, u.role, u.bio, u.profile_image]
    );
    userIds[u.email] = res.insertId;
  }
  console.log("Inserted users:", Object.keys(userIds));

  // 2. Insert 6 authentic, valid recipes with full details
  const recipesData = [
    {
      user_email: "maya.raman@cookshare.com",
      title: "Authentic Chettinad Chicken Pepper Masala",
      title_ta: "பாரம்பரிய செட்டிநாடு கோழி மிளகு வறுவல்",
      description: "An authentic spicy Tamil dry curry infused with freshly dry-roasted black peppercorns, fennel seeds, coriander, and curry leaves.",
      description_ta: "புதிதாக வறுத்த கருப்பு மிளகு, சோம்பு, மல்லி விதைகள் மற்றும் கறிவேப்பிலை மணத்துடன் கூடிய உண்மையான காரசாரமான செட்டிநாடு சிக்கன் மசாலா.",
      cuisine: "Chettinad",
      meal_type: "Dinner",
      difficulty: "Medium",
      prep_minutes: 20,
      cook_minutes: 35,
      servings: 4,
      image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
      video_url: "https://www.youtube.com/watch?v=dq3__hTaSLk",
      subtitle_url: "/subtitles/chettinad_en_ta.vtt",
      dietary_tags: "Non-Veg, High-Protein, Gluten-Free",
      status: "PUBLISHED",
      ingredients: [
        { name: "Country Chicken / Tender Chicken", name_ta: "நாட்டுக்கோழி / கோழிக்கறி", quantity: "750", unit: "grams", unit_ta: "கிராம்" },
        { name: "Black Peppercorns", name_ta: "கருப்பு மிளகு", quantity: "2", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Fennel Seeds (Saunf)", name_ta: "சோம்பு", quantity: "1.5", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Coriander Seeds", name_ta: "கொத்தமல்லி விதை", quantity: "2", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Dry Red Guntur Chilies", name_ta: "காய்ந்த மிளகாய்", quantity: "6", unit: "pieces", unit_ta: "எண்ணிக்கை" },
        { name: "Small Shallots (Chinna Vengayam)", name_ta: "சின்ன வெங்காயம்", quantity: "200", unit: "grams", unit_ta: "கிராம்" },
        { name: "Ginger Garlic Paste", name_ta: "இஞ்சி பூண்டு விழுது", quantity: "2", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Gingelly / Sesame Oil", name_ta: "நல்லெண்ணெய்", quantity: "3", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Fresh Curry Leaves", name_ta: "கறிவேப்பிலை", quantity: "2", unit: "sprigs", unit_ta: "கொத்து" }
      ],
      steps: [
        {
          step_no: 1,
          instruction: "Dry roast black peppercorns, fennel seeds, coriander seeds, and dry red chilies on medium heat until fragrant. Cool and grind to a coarse Chettinad masala powder.",
          instruction_ta: "மிளகு, சோம்பு, தனியா மற்றும் காய்ந்த மிளகாயை வாணலியில் பொன்னிறமாக வறுத்து ஆறிய பின் கொரகொரப்பாக அரைத்து கொள்ளவும்."
        },
        {
          step_no: 2,
          instruction: "Heat gingelly oil in a heavy-bottomed pan, add curry leaves and chopped small onions. Sauté until translucent and golden brown.",
          instruction_ta: "வாணலியில் நல்லெண்ணெய் ஊற்றி கறிவேப்பிலை, நறுக்கிய சின்ன வெங்காயம் சேர்த்து பொன்னிறமாக வதக்கவும்."
        },
        {
          step_no: 3,
          instruction: "Add ginger-garlic paste and sauté for 2 minutes until raw smell dissipates. Add chicken pieces and turmeric powder, searing for 5 minutes.",
          instruction_ta: "இஞ்சி பூண்டு விழுது சேர்த்து பச்சை வாசனை போகும் வரை வதக்கி, கோழிக்கறி மற்றும் மஞ்சள் தூள் சேர்த்து 5 நிமிடங்கள் வதக்கவும்."
        },
        {
          step_no: 4,
          instruction: "Add the freshly ground Chettinad spice powder and salt. Cook covered on low flame for 20 minutes until chicken is tender and coated with aromatic thick gravy.",
          instruction_ta: "அரைத்த மசாலா பொடி மற்றும் உப்பு சேர்த்து மிதமான தீயில் மூடி வைத்து 20 நிமிடங்கள் வேகவைத்து எண்ணெய் பிரிந்து வரும் வரை கிளறி இறக்கவும்."
        }
      ]
    },
    {
      user_email: "priya.sundaram@cookshare.com",
      title: "Crispy Ghee Podi Masala Dosa",
      title_ta: "மொறுமொறு நெய் பொடி மசாலா தோசை",
      description: "Golden and lacy fermented crepe smeared with aromatic spicy gun powder (idli podi), stuffed with mildly spiced potato-onion masala.",
      description_ta: "மணமணக்கும் நெய் மற்றும் இட்லி பொடி தடவி, உருளைக்கிழங்கு மசாலா உள்ளே வைத்து சுடப்படும் மொறுமொறுப்பான பாரம்பரிய தோசை.",
      cuisine: "South Indian",
      meal_type: "Breakfast",
      difficulty: "Medium",
      prep_minutes: 15,
      cook_minutes: 15,
      servings: 2,
      image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80",
      video_url: "https://www.youtube.com/results?search_query=Crispy+Ghee+Podi+Masala+Dosa+Recipe",
      subtitle_url: "/subtitles/dosa_en_ta.vtt",
      dietary_tags: "Vegetarian, Probiotic, Classic",
      status: "PUBLISHED",
      ingredients: [
        { name: "Fermented Dosa Batter", name_ta: "தோசை மாவு", quantity: "3", unit: "cups", unit_ta: "கப்" },
        { name: "Pure Desi Cow Ghee", name_ta: "நாட்டுப்பசு நெய்", quantity: "4", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Traditional Idli Milagai Podi", name_ta: "இட்லி மிளகாய் பொடி", quantity: "3", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Boiled Potatoes", name_ta: "வேகவைத்த உருளைக்கிழங்கு", quantity: "3", unit: "medium", unit_ta: "எண்ணிக்கை" },
        { name: "Sliced Onions", name_ta: "நறுக்கிய வெங்காயம்", quantity: "1", unit: "large", unit_ta: "எண்ணிக்கை" },
        { name: "Green Chilies & Ginger", name_ta: "பச்சை மிளகாய் & இஞ்சி", quantity: "2", unit: "finely chopped", unit_ta: "நறுக்கியது" }
      ],
      steps: [
        {
          step_no: 1,
          instruction: "Prepare potato masala by tempering mustard seeds, curry leaves, green chilies, onions, turmeric, and smashed boiled potatoes with salt.",
          instruction_ta: "வாணலியில் கடுகு, கறிவேப்பிலை, பச்சை மிளகாய், வெங்காயம் தாளித்து, மசித்த உருளைக்கிழங்கு, மஞ்சள் தூள் சேர்த்து மசாலா தயார் செய்யவும்."
        },
        {
          step_no: 2,
          instruction: "Heat a heavy cast-iron tawa. Pour a ladle of fermented batter and spread outward in concentric circles to form a thin crepe.",
          instruction_ta: "சூடான இரும்பு தோசைக்கல்லில் ஒரு கரண்டி மாவை ஊற்றி மெல்லிய வட்டமாக தேய்க்கவும்."
        },
        {
          step_no: 3,
          instruction: "Drizzle golden ghee generously around edges and across the surface. Sprinkle 1 tbsp spicy idli podi evenly over the top.",
          instruction_ta: "சுற்றிலும் நெய் விட்டு, தோசையின் மீது காரசாரமான இட்லி பொடியை தூவவும்."
        },
        {
          step_no: 4,
          instruction: "Place a scoop of potato masala in the center. Once underside is golden brown and crisp, fold in half and serve hot with coconut chutney.",
          instruction_ta: "நடுவில் உருளைக்கிழங்கு மசாலா வைத்து தோசை பொன்னிறமாக மொறுமொறுப்பானதும் மடித்து தேங்காய் சட்னியுடன் பரிமாறவும்."
        }
      ]
    },
    {
      user_email: "arvind.swaminathan@cookshare.com",
      title: "Royal Ambur Mutton Dum Biryani",
      title_ta: "பாரம்பரிய ஆம்பூர் மட்டன் தம் பிரியாணி",
      description: "Legendary Arcoti-style biryani prepared with fragrant Seeraga Samba short grain rice, tender marinated mutton, curd, and natural whole spices.",
      description_ta: "மணமணக்கும் சீரக சம்பா அரிசி, மென்மையான ஆட்டுக்கறி, தயிர் மற்றும் மசாலாக்கள் கலந்து பக்குவமாக தம் முறையில் சமைக்கப்படும் ஆம்பூர் பிரியாணி.",
      cuisine: "Mughlai / Tamil",
      meal_type: "Lunch",
      difficulty: "Hard",
      prep_minutes: 30,
      cook_minutes: 45,
      servings: 5,
      image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      video_url: "https://www.youtube.com/results?search_query=Royal+Ambur+Mutton+Dum+Biryani+Recipe",
      subtitle_url: "/subtitles/biryani_en_ta.vtt",
      dietary_tags: "Non-Veg, Halal, Festive Feast",
      status: "PUBLISHED",
      ingredients: [
        { name: "Seeraga Samba Rice", name_ta: "சீரக சம்பா அரிசி", quantity: "500", unit: "grams", unit_ta: "கிராம்" },
        { name: "Tender Mutton (Bone-in)", name_ta: "இள ஆட்டுக்கறி", quantity: "750", unit: "grams", unit_ta: "கிராம்" },
        { name: "Fresh Thick Curd", name_ta: "கெட்டித் தயிர்", quantity: "150", unit: "ml", unit_ta: "மில்லி" },
        { name: "Fresh Mint & Coriander", name_ta: "புதினா & கொத்தமல்லி", quantity: "1", unit: "bunch each", unit_ta: "கட்டு" },
        { name: "Garlic and Ginger paste", name_ta: "பூண்டு & இஞ்சி விழுது", quantity: "3", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Ghee & Refined Oil", name_ta: "நெய் மற்றும் எண்ணெய்", quantity: "100", unit: "ml", unit_ta: "மில்லி" },
        { name: "Whole Cardamom, Cloves, Cinnamon", name_ta: "பட்டை, கிராம்பு, ஏலக்காய்", quantity: "4", unit: "each", unit_ta: "எண்ணிக்கை" }
      ],
      steps: [
        {
          step_no: 1,
          instruction: "Marinate mutton pieces with curd, ginger-garlic paste, red chili powder, turmeric, and sea salt for 45 minutes.",
          instruction_ta: "ஆட்டுக்கறியை தயிர், இஞ்சி பூண்டு விழுது, மிளகாய் தூள், மஞ்சள் தூள் மற்றும் உப்பு சேர்த்து 45 நிமிடங்கள் ஊறவைக்கவும்."
        },
        {
          step_no: 2,
          instruction: "Cook whole spices, onions, and marinated mutton in a heavy copper degh until meat releases its juices and is 80% tender.",
          instruction_ta: "அடி கனமான பாத்திரத்தில் பட்டை லவங்கம் தாளித்து வெங்காயம் மற்றும் ஊறிய கறியை சேர்த்து 80% வேகும் வரை வதக்கவும்."
        },
        {
          step_no: 3,
          instruction: "Parboil soaked Seeraga Samba rice in salted boiling water until 70% done, then strain thoroughly.",
          instruction_ta: "சீரக சம்பா அரிசியை கொதிக்கும் நீரில் 70% வேகவைத்து வடித்து தனியே எடுத்து வைக்கவும்."
        },
        {
          step_no: 4,
          instruction: "Layer rice over mutton, top with fresh mint, ghee, seal tightly with dough, and dum cook on very gentle heat for 25 minutes.",
          instruction_ta: "கறியின் மேல் அரிசி, புதினா, நெய் சேர்த்து பாத்திரத்தை மூடி காற்று போகாமல் மாவு வைத்து 25 நிமிடங்கள் மிதமான தணலில் தம் போடவும்."
        }
      ]
    },
    {
      user_email: "rajesh.nutrition@cookshare.com",
      title: "Creamy Shahi Paneer Butter Masala",
      title_ta: "சுவையான பன்னீர் பட்டர் மசாலா",
      description: "Silky, restaurant-style rich gravy made with ripe red vine tomatoes, soaked cashews, aromatic kasuri methi, and soft cottage cheese cubes.",
      description_ta: "பழுத்த தக்காளி, முந்திரி விழுது, வெண்ணெய் மற்றும் நறுமண கசூரி மேத்தி மணத்துடன் செய்யப்படும் மென்மையான பன்னீர் கிரேவி.",
      cuisine: "North Indian",
      meal_type: "Dinner",
      difficulty: "Medium",
      prep_minutes: 15,
      cook_minutes: 25,
      servings: 4,
      image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80",
      video_url: "https://www.youtube.com/results?search_query=Creamy+Shahi+Paneer+Butter+Masala+Recipe",
      subtitle_url: "/subtitles/paneer_en_ta.vtt",
      dietary_tags: "Vegetarian, High-Protein, Rich",
      status: "PUBLISHED",
      ingredients: [
        { name: "Fresh Malai Paneer Cubes", name_ta: "பன்னீர் துண்டுகள்", quantity: "300", unit: "grams", unit_ta: "கிராம்" },
        { name: "Ripe Red Tomatoes", name_ta: "பழுத்த தக்காளி", quantity: "4", unit: "large", unit_ta: "எண்ணிக்கை" },
        { name: "Cashews (soaked in warm water)", name_ta: "முந்திரிப் பருப்பு", quantity: "15", unit: "pieces", unit_ta: "எண்ணிக்கை" },
        { name: "Unsalted Butter", name_ta: "வெண்ணெய்", quantity: "3", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Fresh Dairy Cream", name_ta: "பிரெஷ் கிரீம்", quantity: "3", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Kasuri Methi (Dried Fenugreek)", name_ta: "கசூரி மேத்தி", quantity: "1", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Kashmiri Degi Mirch Powder", name_ta: "காஷ்மீரி மிளகாய் தூள்", quantity: "1.5", unit: "tsp", unit_ta: "தேக்கரண்டி" }
      ],
      steps: [
        {
          step_no: 1,
          instruction: "Blanch tomatoes and blend together with soaked cashews into a velvety smooth puree without straining.",
          instruction_ta: "தக்காளி மற்றும் ஊறவைத்த முந்திரியை மிக்ஸியில் சேர்த்து மென்மையான விழுதாக அரைத்து கொள்ளவும்."
        },
        {
          step_no: 2,
          instruction: "Melt butter in a pan with a splash of oil, add whole spices and ginger paste, then stir in Kashmiri chili for natural vibrant red color.",
          instruction_ta: "வாணலியில் வெண்ணெய் உருக்கி இஞ்சி விழுது மற்றும் காஷ்மீரி மிளகாய் தூள் சேர்த்து வதக்கவும்."
        },
        {
          step_no: 3,
          instruction: "Pour the tomato-cashew puree and simmer on low heat for 12 minutes until oil droplets surface.",
          instruction_ta: "அரைத்த விழுதை ஊற்றி மிதமான தீயில் 12 நிமிடங்கள் எண்ணெய் பிரிந்து வரும் வரை கொதிக்க விடவும்."
        },
        {
          step_no: 4,
          instruction: "Gently fold in fresh paneer cubes, crushed kasuri methi, and fresh cream. Cook for 2 more minutes and serve with naan or jeera rice.",
          instruction_ta: "பன்னீர் துண்டுகள், கசூரி மேத்தி மற்றும் பிரெஷ் கிரீம் சேர்த்து 2 நிமிடங்கள் கொதிக்க வைத்து சூடான நான் அல்லது சாதத்துடன் பரிமாறவும்."
        }
      ]
    },
    {
      user_email: "kavitha.cooks@cookshare.com",
      title: "Village Drumstick & Shallot Sambar",
      title_ta: "முருங்கைக்காய் சின்ன வெங்காய சாம்பார்",
      description: "Hearty traditional Tamil Nadu style lentil stew brewed with fresh drumsticks, peeled pearl shallots, tangy tamarind, and fragrant roasted spices.",
      description_ta: "துவரம் பருப்பு, புதிய முருங்கைக்காய், சின்ன வெங்காயம் மற்றும் மணமணக்கும் வறுத்து அரைத்த மசாலாவுடன் தயாரிக்கப்படும் பாரம்பரிய சாம்பார்.",
      cuisine: "Tamil Traditional",
      meal_type: "Lunch",
      difficulty: "Easy",
      prep_minutes: 15,
      cook_minutes: 20,
      servings: 4,
      image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
      video_url: "https://www.youtube.com/results?search_query=Village+Drumstick+Shallot+Sambar+Recipe",
      subtitle_url: "/subtitles/sambar_en_ta.vtt",
      dietary_tags: "Vegetarian, Vegan, High-Fiber, Comfort Food",
      status: "PUBLISHED",
      ingredients: [
        { name: "Toor Dal (Pigeon Peas)", name_ta: "துவரம் பருப்பு", quantity: "1", unit: "cup", unit_ta: "கப்" },
        { name: "Fresh Green Drumsticks", name_ta: "முருங்கைக்காய்", quantity: "2", unit: "cut in pieces", unit_ta: "எண்ணிக்கை" },
        { name: "Peeled Pearl Shallots", name_ta: "உரித்த சின்ன வெங்காயம்", quantity: "150", unit: "grams", unit_ta: "கிராம்" },
        { name: "Tamarind Pulp Extract", name_ta: "புளிக்கரைசல்", quantity: "0.5", unit: "cup", unit_ta: "கப்" },
        { name: "Homemade Sambar Powder", name_ta: "சாம்பார் பொடி", quantity: "2", unit: "tbsp", unit_ta: "மேஜைக்கரண்டி" },
        { name: "Mustard Seeds & Asafoetida (Hing)", name_ta: "கடுகு & பெருங்காயத்தூள்", quantity: "1", unit: "tsp", unit_ta: "தேக்கரண்டி" },
        { name: "Country Tomatoes", name_ta: "நாட்டுத் தக்காளி", quantity: "2", unit: "chopped", unit_ta: "எண்ணிக்கை" }
      ],
      steps: [
        {
          step_no: 1,
          instruction: "Pressure cook toor dal with turmeric and a drop of castor oil for 4 whistles until soft and mushy. Whisk thoroughly.",
          instruction_ta: "துவரம் பருப்பை மஞ்சள் தூள் சேர்த்து குக்கரில் 4 விசில் விட்டு நன்றாக மசித்து கொள்ளவும்."
        },
        {
          step_no: 2,
          instruction: "In a clay pot or saucepan, boil drumsticks and shallots in tamarind extract, sambar powder, tomatoes, and crystal salt for 10 minutes.",
          instruction_ta: "பாத்திரத்தில் புளிக்கரைசல், சாம்பார் பொடி, உப்பு, தக்காளி சேர்த்து முருங்கைக்காய் மற்றும் வெங்காயத்தை 10 நிமிடங்கள் வேக வைக்கவும்."
        },
        {
          step_no: 3,
          instruction: "Pour the mashed cooked dal into the vegetable broth and bring to an aromatic rolling boil.",
          instruction_ta: "காய்கறிகள் வெந்ததும் மசித்த பருப்பை சேர்த்து நன்றாக கொதிக்க விடவும்."
        },
        {
          step_no: 4,
          instruction: "Temper mustard seeds, fenugreek, dried red chilies, asafoetida, and fresh curry leaves in ghee and pour over boiling sambar.",
          instruction_ta: "நெய்யில் கடுகு, வெந்தயம், வரமிளகாய், பெருங்காயம், கறிவேப்பிலை தாளித்து சாம்பாரில் கொட்டி இறக்கவும்."
        }
      ]
    },
    {
      user_email: "kavitha.cooks@cookshare.com",
      title: "Traditional Kambu Koozh (Pearl Millet Porridge)",
      title_ta: "பாரம்பரிய கம்பு கூழ்",
      description: "Nutritious ancient Tamil summer elixir made by fermenting roasted pearl millet flour with homemade probiotic buttermilk and baby onions.",
      description_ta: "உடலுக்கு குளிர்ச்சியூட்டும் சத்தான இயற்கை புரோபயாடிக் கம்பு கூழ், மோர் மற்றும் சின்ன வெங்காயம் சேர்த்து பருகப்படும் ஆரோக்கிய உணவு.",
      cuisine: "Tamil Rural",
      meal_type: "Breakfast",
      difficulty: "Easy",
      prep_minutes: 10,
      cook_minutes: 25,
      servings: 3,
      image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
      video_url: "https://www.youtube.com/watch?v=srM2iVzSDMA",
      subtitle_url: "/subtitles/koozh_en_ta.vtt",
      dietary_tags: "Vegetarian, Gluten-Free, Millet, Probiotic",
      status: "PUBLISHED",
      ingredients: [
        { name: "Pearl Millet Flour (Kambu Mavu)", name_ta: "கம்பு மாவு", quantity: "1", unit: "cup", unit_ta: "கப்" },
        { name: "Fresh Churned Buttermilk", name_ta: "கடைந்த புளித்த மோர்", quantity: "2", unit: "cups", unit_ta: "கப்" },
        { name: "Crushed Baby Shallots", name_ta: "நசுக்கிய சின்ன வெங்காயம்", quantity: "10", unit: "pieces", unit_ta: "எண்ணிக்கை" },
        { name: "Green Chilies (chopped)", name_ta: "பச்சை மிளகாய்", quantity: "1", unit: "piece", unit_ta: "எண்ணிக்கை" },
        { name: "Coriander Leaves & Rock Salt", name_ta: "கொத்தமல்லி தழை & கல் உப்பு", quantity: "1", unit: "to taste", unit_ta: "தேவைக்கு" }
      ],
      steps: [
        {
          step_no: 1,
          instruction: "Dissolve pearl millet flour in 3 cups of water without lumps. Cook on low flame stirring continuously until thick and glossy.",
          instruction_ta: "கம்பு மாவை தண்ணீரில் கட்டியில்லாமல் கரைத்து, மிதமான தீயில் விடாமல் கிளறி பளபளப்பாக வேக வைக்கவும்."
        },
        {
          step_no: 2,
          instruction: "Shape into soft dumplings or keep in clay pot covered overnight to undergo wholesome lactic fermentation.",
          instruction_ta: "வெந்த களியை மண் பாத்திரத்தில் நீர் ஊற்றி இரவு முழுவதும் நொதிக்க விடவும்."
        },
        {
          step_no: 3,
          instruction: "Next morning, dissolve the fermented millet in homemade churned buttermilk using clean fingers or whisk.",
          instruction_ta: "மறுநாள் காலையில் ஊறிய களியை சிலிர்த்த மோரில் கட்டியில்லாமல் நன்கு கரைக்கவும்."
        },
        {
          step_no: 4,
          instruction: "Mix in crushed shallots, chopped green chili, rock salt, and chopped coriander. Serve chilled with raw onions or spicy mango pickle.",
          instruction_ta: "நசுக்கிய சின்ன வெங்காயம், பச்சை மிளகாய், உப்பு, கொத்தமல்லி சேர்த்து கலக்கி மாங்காய் ஊறுகாயுடன் பரிமாறவும்."
        }
      ]
    }
  ];

  const recipeIds = [];
  for (const r of recipesData) {
    const userId = userIds[r.user_email];
    const [res] = await pool.query(
      `INSERT INTO recipes
       (user_id, title, title_ta, description, description_ta, cuisine, meal_type, difficulty, prep_minutes, cook_minutes, servings, image_url, video_url, subtitle_url, dietary_tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, r.title, r.title_ta, r.description, r.description_ta, r.cuisine, r.meal_type, r.difficulty, r.prep_minutes, r.cook_minutes, r.servings, r.image_url, r.video_url, r.subtitle_url, r.dietary_tags, r.status]
    );
    const recId = res.insertId;
    recipeIds.push({ id: recId, title: r.title, userId });

    for (const ing of r.ingredients) {
      await pool.query(
        `INSERT INTO ingredients (recipe_id, name, name_ta, quantity, unit, unit_ta) VALUES (?, ?, ?, ?, ?, ?)`,
        [recId, ing.name, ing.name_ta, ing.quantity, ing.unit, ing.unit_ta]
      );
    }

    for (const st of r.steps) {
      await pool.query(
        `INSERT INTO recipe_steps (recipe_id, step_no, instruction, instruction_ta) VALUES (?, ?, ?, ?)`,
        [recId, st.step_no, st.instruction, st.instruction_ta]
      );
    }
  }
  console.log(`Inserted ${recipesData.length} authentic recipes.`);

  // 3. Insert real reviews with authentic feedback
  const reviewsData = [
    { recipeIndex: 0, userEmail: "rajesh.nutrition@cookshare.com", rating: 5, comment: "Incredible Chettinad pepper flavor! The fresh whole spices give an unbeatable aroma." },
    { recipeIndex: 0, userEmail: "priya.sundaram@cookshare.com", rating: 5, comment: "Tastes just like my grandmother's Sunday lunch in Karaikudi. Perfect heat level." },
    { recipeIndex: 1, userEmail: "maya.raman@cookshare.com", rating: 5, comment: "The podi and ghee ratio is spot on! Crispy exterior and tender potato filling." },
    { recipeIndex: 1, userEmail: "arvind.swaminathan@cookshare.com", rating: 4, comment: "Excellent texture. Using a cast-iron tawa makes all the difference." },
    { recipeIndex: 2, userEmail: "maya.raman@cookshare.com", rating: 5, comment: "Authentic Ambur dum technique. The Seeraga Samba grain fragrance is divine." },
    { recipeIndex: 3, userEmail: "priya.sundaram@cookshare.com", rating: 5, comment: "Rich and creamy without feeling heavy. Great balance of tang and kasuri methi." },
    { recipeIndex: 4, userEmail: "rajesh.nutrition@cookshare.com", rating: 5, comment: "Classic village sambar recipe. The shallots and drumsticks create magic." },
    { recipeIndex: 5, userEmail: "arvind.swaminathan@cookshare.com", rating: 5, comment: "Pure comfort and gut health elixir. Excellent traditional proportion." }
  ];

  for (const rv of reviewsData) {
    const recId = recipeIds[rv.recipeIndex].id;
    const uId = userIds[rv.userEmail];
    await pool.query(
      `INSERT INTO reviews (recipe_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [recId, uId, rv.rating, rv.comment]
    );
  }
  console.log("Inserted realistic reviews.");

  // 4. Insert favorites, recently_accessed, and shopping list items
  for (let i = 0; i < recipeIds.length; i++) {
    const recId = recipeIds[i].id;
    // user 2, 3, 4 favorited some
    await pool.query("INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)", [userIds["maya.raman@cookshare.com"], recId]);
    if (i < 4) {
      await pool.query("INSERT IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)", [userIds["priya.sundaram@cookshare.com"], recId]);
    }
    // Recently accessed
    await pool.query("INSERT IGNORE INTO recently_accessed (user_id, recipe_id, accessed_at) VALUES (?, ?, NOW() - INTERVAL ? HOUR)", [
      userIds["admin@cookshare.com"], recId, i * 3
    ]);
    await pool.query("INSERT IGNORE INTO recently_accessed (user_id, recipe_id, accessed_at) VALUES (?, ?, NOW() - INTERVAL ? HOUR)", [
      userIds["maya.raman@cookshare.com"], recId, (i + 1) * 2
    ]);
  }

  // Shopping items
  const shoppingSeed = [
    { userEmail: "maya.raman@cookshare.com", name: "Black Peppercorns", quantity: "200", unit: "grams", category: "Spices" },
    { userEmail: "maya.raman@cookshare.com", name: "Shallots (Small Onions)", quantity: "1", unit: "kg", category: "Produce" },
    { userEmail: "priya.sundaram@cookshare.com", name: "Pure Cow Ghee", quantity: "500", unit: "ml", category: "Dairy" },
    { userEmail: "priya.sundaram@cookshare.com", name: "Country Potatoes", quantity: "2", unit: "kg", category: "Produce" },
    { userEmail: "admin@cookshare.com", name: "Fresh Malai Paneer", quantity: "500", unit: "grams", category: "Dairy" },
    { userEmail: "admin@cookshare.com", name: "Seeraga Samba Rice", quantity: "5", unit: "kg", category: "Grains" }
  ];

  for (const s of shoppingSeed) {
    await pool.query(
      `INSERT INTO shopping_items (user_id, name, quantity, unit, category, purchased) VALUES (?, ?, ?, ?, ?, false)`,
      [userIds[s.userEmail], s.name, s.quantity, s.unit, s.category]
    );
  }

  console.log("Seeding completed successfully!");
  await pool.end();
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
