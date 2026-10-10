const sqliteDb = require("../config/sqlite_db");

const VERIFIED_TAMIL_VIDEOS = {
  1: [ // AUTHENTIC CHETTINAD CHICKEN PEPPER MASALA
    {
      id: "dq3__hTaSLk",
      title: "செட்டிநாடு மிளகு சிக்கன் மசாலா | Chettinad Pepper Chicken Masala In Tamil",
      channel: "HomeCooking Tamil",
      url: "https://www.youtube.com/watch?v=dq3__hTaSLk",
      thumbnail: "https://img.youtube.com/vi/dq3__hTaSLk/hqdefault.jpg"
    },
    {
      id: "Uiw4Cl86NMw",
      title: "Chettinad Pepper Chicken | Chicken Fry in Tamil | Studio First Recipe",
      channel: "Chef Deena’s Kitchen",
      url: "https://www.youtube.com/watch?v=Uiw4Cl86NMw",
      thumbnail: "https://img.youtube.com/vi/Uiw4Cl86NMw/hqdefault.jpg"
    },
    {
      id: "5T7PUj7jQfg",
      title: "Pepper Chicken Recipe in Tamil / Chicken Milagu Varuval",
      channel: "Madras Samayal",
      url: "https://www.youtube.com/watch?v=5T7PUj7jQfg",
      thumbnail: "https://img.youtube.com/vi/5T7PUj7jQfg/hqdefault.jpg"
    },
    {
      id: "kcbOO-e2NF8",
      title: "கல்யாண விருந்து சிக்கன் மிளகு வறுவல் | Madurai Wedding Style Pepper Chicken",
      channel: "Chef Deena’s Kitchen",
      url: "https://www.youtube.com/watch?v=kcbOO-e2NF8",
      thumbnail: "https://img.youtube.com/vi/kcbOO-e2NF8/hqdefault.jpg"
    },
    {
      id: "VgMxyu4Xigw",
      title: "Pepper Chicken in Tamil Easy Method | Easy Chicken Recipe",
      channel: "Chef YKU",
      url: "https://www.youtube.com/watch?v=VgMxyu4Xigw",
      thumbnail: "https://img.youtube.com/vi/VgMxyu4Xigw/hqdefault.jpg"
    }
  ],
  2: [ // CRISPY GHEE PODI MASALA DOSA
    {
      id: "pp8QFH1veuM",
      title: "நெய் பொடி தோசை | Restaurant Style Ghee Podi Dosa | Spicy Ghee Podi Roast",
      channel: "MALA SAMAYAL",
      url: "https://www.youtube.com/watch?v=pp8QFH1veuM",
      thumbnail: "https://img.youtube.com/vi/pp8QFH1veuM/hqdefault.jpg"
    },
    {
      id: "kILA-FsjcVA",
      title: "அட! இதுவல்லவா தோசை! கும்பகோணம் தேங்காய் பொடி தோசை A to Z செய்முறை!",
      channel: "Chef Deena’s Kitchen",
      url: "https://www.youtube.com/watch?v=kILA-FsjcVA",
      thumbnail: "https://img.youtube.com/vi/kILA-FsjcVA/hqdefault.jpg"
    },
    {
      id: "s-sqVGqRysY",
      title: "பொடி தோசை | Podi Dosa in Tamil | How to Make Podi Dosai | Breakfast Recipe",
      channel: "Tamilmozhi Samayal",
      url: "https://www.youtube.com/watch?v=s-sqVGqRysY",
      thumbnail: "https://img.youtube.com/vi/s-sqVGqRysY/hqdefault.jpg"
    },
    {
      id: "LsdYcE_02Bc",
      title: "Hotel Style Ghee Podi Dosa | Breakfast Recipe | Dosa Recipes in Tamil",
      channel: "Atifa's Recipes",
      url: "https://www.youtube.com/watch?v=LsdYcE_02Bc",
      thumbnail: "https://img.youtube.com/vi/LsdYcE_02Bc/hqdefault.jpg"
    },
    {
      id: "kcYQAk-o3z0",
      title: "Famous Ghee PODI ONION DOSA | பொடி தோசை | Onion Podi Dosa in Tamil",
      channel: "Ranjana's View",
      url: "https://www.youtube.com/watch?v=kcYQAk-o3z0",
      thumbnail: "https://img.youtube.com/vi/kcYQAk-o3z0/hqdefault.jpg"
    }
  ],
  3: [ // ROYAL AMBUR MUTTON DUM BIRYANI
    {
      id: "5VpZd64NRo8",
      title: "Ambur Mutton Biryani Recipe in Tamil | ஆம்பூர் பிரியாணி | CDK #421",
      channel: "Chef Deena’s Kitchen",
      url: "https://www.youtube.com/watch?v=5VpZd64NRo8",
      thumbnail: "https://img.youtube.com/vi/5VpZd64NRo8/hqdefault.jpg"
    },
    {
      id: "rCv2JSvXGek",
      title: "Ambur Mutton Biryani Recipe | How to Make Dum Biryani | CDC 35",
      channel: "Chef Deena's Reel Recipes",
      url: "https://www.youtube.com/watch?v=rCv2JSvXGek",
      thumbnail: "https://img.youtube.com/vi/rCv2JSvXGek/hqdefault.jpg"
    },
    {
      id: "8MUf486RqKE",
      title: "Ambur Mutton Biryani | ஆம்பூர் மட்டன் பிரியாணி | Mutton Biryani Recipe in Tamil",
      channel: "Chef YKU",
      url: "https://www.youtube.com/watch?v=8MUf486RqKE",
      thumbnail: "https://img.youtube.com/vi/8MUf486RqKE/hqdefault.jpg"
    },
    {
      id: "IFAf2PzhDcE",
      title: "Ambur Mutton Biryani Recipe | Mutton Biryani in Pressure Cooker",
      channel: "Dindigul Food Court",
      url: "https://www.youtube.com/watch?v=IFAf2PzhDcE",
      thumbnail: "https://img.youtube.com/vi/IFAf2PzhDcE/hqdefault.jpg"
    },
    {
      id: "Ymg6iVOfqIw",
      title: "Mutton Biryani in Pressure Cooker | Easy Mutton Biryani Recipe in Tamil",
      channel: "Piyas Kitchen",
      url: "https://www.youtube.com/watch?v=Ymg6iVOfqIw",
      thumbnail: "https://img.youtube.com/vi/Ymg6iVOfqIw/hqdefault.jpg"
    }
  ],
  4: [ // CREAMY SHAHI PANEER BUTTER MASALA
    {
      id: "QPMaHm5ta6U",
      title: "ஷாஹி பன்னீர் | Shahi Paneer Recipe with English Subtitles | Shahi Paneer in Tamil",
      channel: "Recipes Desk",
      url: "https://www.youtube.com/watch?v=QPMaHm5ta6U",
      thumbnail: "https://img.youtube.com/vi/QPMaHm5ta6U/hqdefault.jpg"
    },
    {
      id: "CU634mw6yVQ",
      title: "Shahi Paneer Recipe Restaurant Style in Tamil | Creamy Shahi Paneer Gravy",
      channel: "Afra's Food Channel",
      url: "https://www.youtube.com/watch?v=CU634mw6yVQ",
      thumbnail: "https://img.youtube.com/vi/CU634mw6yVQ/hqdefault.jpg"
    },
    {
      id: "Yr2BprrJ3Bk",
      title: "ஷாஹி பன்னீர் | Shahi Paneer Recipe in Tamil",
      channel: "Ramesh Arumugam",
      url: "https://www.youtube.com/watch?v=Yr2BprrJ3Bk",
      thumbnail: "https://img.youtube.com/vi/Yr2BprrJ3Bk/hqdefault.jpg"
    },
    {
      id: "GQRWgAPQ97E",
      title: "How to Make Shahi Paneer | Paneer Recipes in Tamil | Hotel Style Paneer Masala",
      channel: "SudhaSureshDiaries",
      url: "https://www.youtube.com/watch?v=GQRWgAPQ97E",
      thumbnail: "https://img.youtube.com/vi/GQRWgAPQ97E/hqdefault.jpg"
    },
    {
      id: "sVNQIbuv_Mc",
      title: "Paneer Butter Masala Recipe in Tamil | Restaurant Style Paneer Gravy",
      channel: "Madras Samayal",
      url: "https://www.youtube.com/watch?v=sVNQIbuv_Mc",
      thumbnail: "https://img.youtube.com/vi/sVNQIbuv_Mc/hqdefault.jpg"
    }
  ],
  5: [ // VILLAGE DRUMSTICK & SHALLOT SAMBAR
    {
      id: "zwvj8--Blpw",
      title: "முருங்கைகாய் சாம்பார் சுவையாக செய்வது எப்படி / Murungakkai Sambar Recipe In Tamil",
      channel: "Jenny Cooks",
      url: "https://www.youtube.com/watch?v=zwvj8--Blpw",
      thumbnail: "https://img.youtube.com/vi/zwvj8--Blpw/hqdefault.jpg"
    },
    {
      id: "MRA_xDmllzk",
      title: "சுவையான முருங்கைக்காய் சாம்பார் செய்வது எப்படி | Sambar Recipe in Tamil",
      channel: "SELVI AMMA SAMAYAL",
      url: "https://www.youtube.com/watch?v=MRA_xDmllzk",
      thumbnail: "https://img.youtube.com/vi/MRA_xDmllzk/hqdefault.jpg"
    },
    {
      id: "WPj2Y7053W0",
      title: "Drumstick Sambar Recipe - Easy Murungakkai Sambar in Tamil",
      channel: "Padhuskitchen",
      url: "https://www.youtube.com/watch?v=WPj2Y7053W0",
      thumbnail: "https://img.youtube.com/vi/WPj2Y7053W0/hqdefault.jpg"
    },
    {
      id: "hlo5u0whiuQ",
      title: "மிக சுவையான முருங்கைக்காய் சாம்பார் செய்யலாம் வாங்க / Easy Drumstick Sambar",
      channel: "Niki's Kitchen",
      url: "https://www.youtube.com/watch?v=hlo5u0whiuQ",
      thumbnail: "https://img.youtube.com/vi/hlo5u0whiuQ/hqdefault.jpg"
    },
    {
      id: "T3VjljWggqY",
      title: "முருங்கைக்காய் சாம்பார் செய்வது எப்படி | Murungakkai Sambar Seivathu Eppadi",
      channel: "Malar Amma Samayal",
      url: "https://www.youtube.com/watch?v=T3VjljWggqY",
      thumbnail: "https://img.youtube.com/vi/T3VjljWggqY/hqdefault.jpg"
    }
  ],
  6: [ // TRADITIONAL KAMBU KOOZH
    {
      id: "srM2iVzSDMA",
      title: "Kambu Koozh Recipe (கம்பு கூழ் ) | How to Make Kambu Koozh at Home",
      channel: "Piyas Kitchen",
      url: "https://www.youtube.com/watch?v=srM2iVzSDMA",
      thumbnail: "https://img.youtube.com/vi/srM2iVzSDMA/hqdefault.jpg"
    },
    {
      id: "pjJ6vXp-7Zw",
      title: "பாரம்பரிய கம்பு கூழ் இப்படி பக்குவமா செய்யுங்க சுவையும் சத்தும் அருமை / Kambu Kool",
      channel: "Kavitha Samayalarai கவிதா சமையலறை",
      url: "https://www.youtube.com/watch?v=pjJ6vXp-7Zw",
      thumbnail: "https://img.youtube.com/vi/pjJ6vXp-7Zw/hqdefault.jpg"
    },
    {
      id: "Pf3aDUdEooE",
      title: "Kambu Koozh Recipe / Kambu Kool / Bajra Koozh by Revathy Shanmugam",
      channel: "Revathy Shanmugam",
      url: "https://www.youtube.com/watch?v=Pf3aDUdEooE",
      thumbnail: "https://img.youtube.com/vi/Pf3aDUdEooE/hqdefault.jpg"
    },
    {
      id: "_LmIitjY5b4",
      title: "உடல் சூட்டை குறைக்க, எடை குறைய கம்பு கூழ் / Kambu Koozh Recipe / Pearl Millet Recipe",
      channel: "Healthy Food Kitchen",
      url: "https://www.youtube.com/watch?v=_LmIitjY5b4",
      thumbnail: "https://img.youtube.com/vi/_LmIitjY5b4/hqdefault.jpg"
    },
    {
      id: "l-DoxP_-qOk",
      title: "அதிக சத்து நிறைந்த சுவையான கம்பு கூழ் / Kambu Kool Recipe in Tamil / Healthy Breakfast",
      channel: "Healthy Amma Samayal",
      url: "https://www.youtube.com/watch?v=l-DoxP_-qOk",
      thumbnail: "https://img.youtube.com/vi/l-DoxP_-qOk/hqdefault.jpg"
    }
  ]
};

async function run() {
  const db = await sqliteDb.initSqliteDb();

  // Create recipe_videos table with video_id and channel_name
  db.run(`DROP TABLE IF EXISTS recipe_videos;`);
  db.run(`
    CREATE TABLE recipe_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      video_url TEXT NOT NULL,
      video_id TEXT NOT NULL,
      channel_name TEXT NOT NULL,
      thumbnail_url TEXT,
      display_order INTEGER DEFAULT 1
    );
  `);

  for (const [recipeId, videos] of Object.entries(VERIFIED_TAMIL_VIDEOS)) {
    const rId = Number(recipeId);
    // Update primary video_url on recipe
    const primaryUrl = videos[0].url;
    db.run("UPDATE recipes SET video_url = ? WHERE id = ?", [primaryUrl, rId]);

    // Insert 5 videos
    videos.forEach((v, idx) => {
      db.run(
        "INSERT INTO recipe_videos (recipe_id, title, video_url, video_id, channel_name, thumbnail_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [rId, v.title, v.url, v.id, v.channel, v.thumbnail, idx + 1]
      );
    });
  }

  sqliteDb.persistDb();
  console.log("Successfully synced all 30 verified Tamil YouTube videos into recipe_videos!");
}

run().catch(console.error);
