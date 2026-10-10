const I18N = {
  en: {
    home: "Home", explore: "Explore", share: "Share Recipe", planner: "Meal Planner",
    shopping: "Shopping List", community: "Community", glossary: "Glossary", login: "Login", logout: "Logout",
    search: "Search", language: "தமிழ்", light: "Light", dark: "Dark", english: "English",
    tamil: "தமிழ்", recipes: "Recipes", featured: "Featured Recipes", recent: "Recently Viewed",
    cook: "Cook Now", video: "Recipe Video", subtitles: "Subtitles", ingredients: "Ingredients",
    instructions: "Instructions", save: "Save Recipe", print: "Print / PDF", review: "Reviews",
    easy: "Easy", medium: "Medium", hard: "Hard", noRecipes: "No matching recipes found.",
    admin: "Admin Dashboard", addGlossary: "+ Add Culinary Term", watchVideo: "▶ Watch Video",
    aiAssistant: "ChefBot AI", askChefBot: "Ask ChefBot AI",
    pantryMatcher: "Pantry Matcher", matchRecipes: "⚡ Match Recipes",
    servings: "Servings", prepTime: "Prep", cookTime: "Cook", minutes: "min",
    whatsappShare: "Share via WhatsApp", sendToWhatsApp: "Send to WhatsApp",
    copyMessage: "Copy Message", allItems: "All Items", pendingOnly: "To Buy (Pending Only)",
    phoneNumber: "WhatsApp Phone Number (Optional)"
  },
  ta: {
    home: "முகப்பு", explore: "சமையல் தேடல்", share: "சமையல் பகிர்", planner: "வார திட்டம்",
    shopping: "ஷாப்பிங் பட்டியல்", community: "சமூகம்", glossary: "கலைச்சொற்கள்", login: "உள்நுழை", logout: "வெளியேறு",
    search: "தேடு", language: "English", light: "ஒளி", dark: "இருள்", english: "English",
    tamil: "தமிழ்", recipes: "சமையல் குறிப்புகள்", featured: "சிறப்பு சமையல் குறிப்புகள்",
    recent: "சமீபத்தில் பார்த்தவை", cook: "சமைக்க தொடங்கு", video: "செய்முறை வீடியோ",
    subtitles: "வசன வரிகள்", ingredients: "தேவையான பொருட்கள்", instructions: "செய்முறை",
    save: "சேமி", print: "அச்சிடு / PDF", review: "மதிப்புரைகள்", easy: "எளிது",
    medium: "நடுத்தரம்", hard: "கடினம்", noRecipes: "பொருத்தமான சமையல் குறிப்பு இல்லை.",
    admin: "நிர்வாகக் குழு", addGlossary: "+ சொல் சேர்க்க", watchVideo: "▶ வீடியோ பார்க்க",
    aiAssistant: "செஃப்போட் AI", askChefBot: "செஃப்போட்டிடம் கேட்க",
    pantryMatcher: "பொருட்கள் ஒப்பீட்டாளர்", matchRecipes: "⚡ சமையல் பொருத்துக",
    servings: "நபர்கள்", prepTime: "தயாரிப்பு", cookTime: "சமையல்", minutes: "நிமிடம்",
    whatsappShare: "WhatsApp-ல் பகிர்க", sendToWhatsApp: "WhatsApp-ல் அனுப்ப",
    copyMessage: "மெசேஜ் காப்பி செய்க", allItems: "அனைத்து பொருட்கள்", pendingOnly: "வாங்க வேண்டியவை மட்டும்",
    phoneNumber: "வாட்ஸ்அப் எண் (விருப்பத்தேர்வு)"
  }
};

function lang() {
  return localStorage.getItem("cookshare_lang") || "en";
}

function tr(k) {
  return (I18N[lang()] || I18N.en)[k] || k;
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function getYtVideoId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1).split("?")[0];
      if (id && id.length >= 8 && !id.includes("results")) return id;
    }
    const id = u.searchParams.get("v");
    if (id && id.length >= 8) return id;
  } catch (e) {}
  return null;
}

function ytEmbed(url) {
  const vid = getYtVideoId(url);
  return vid ? `https://www.youtube.com/embed/${vid}` : null;
}

function applyTheme() {
  const currentTheme = localStorage.getItem("cookshare_theme") || "light";
  const currentColor = localStorage.getItem("cookshare_color") || "orange";
  document.documentElement.dataset.theme = currentTheme;
  document.documentElement.dataset.color = currentColor;

  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    const isDark = currentTheme === "dark" || currentTheme === "oled";
    btn.innerHTML = isDark ? "☀️" : "🌙";
    btn.title = isDark
      ? (lang() === "ta" ? "ஒளி முறைக்கு மாற்றுக (Light Mode)" : "Switch to Light Mode")
      : (lang() === "ta" ? "இருள் முறைக்கு மாற்றுக (Dark Mode)" : "Switch to Dark Mode");
  }
}

function applyLang() {
  document.documentElement.lang = lang() === "ta" ? "ta" : "en";
  document.querySelectorAll("[data-i18n]").forEach(e => {
    e.textContent = tr(e.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(e => {
    e.placeholder = tr(e.dataset.i18nPlaceholder);
  });
}

function toggleLang() {
  const nextLang = lang() === "en" ? "ta" : "en";
  localStorage.setItem("cookshare_lang", nextLang);
  location.reload();
}

function toggleTheme() {
  const current = localStorage.getItem("cookshare_theme") || "light";
  const next = (current === "light" || current === "sepia") ? "dark" : "light";
  localStorage.setItem("cookshare_theme", next);
  applyTheme();
  updateThemeModalUI();
}

function openThemeModal() {
  let modal = document.getElementById("themeCustomizerModal");
  if (!modal) {
    mountThemeModal();
    modal = document.getElementById("themeCustomizerModal");
  }
  if (modal) {
    modal.classList.remove("modal-hidden");
    modal.style.display = "flex";
  }
  updateThemeModalUI();
}

function closeThemeModal() {
  const modal = document.getElementById("themeCustomizerModal");
  if (modal) {
    modal.classList.add("modal-hidden");
    modal.style.display = "none";
  }
}

function setThemeMode(mode) {
  localStorage.setItem("cookshare_theme", mode);
  applyTheme();
  updateThemeModalUI();
}

function setThemeColor(color) {
  localStorage.setItem("cookshare_color", color);
  applyTheme();
  updateThemeModalUI();
}

function updateThemeModalUI() {
  const curTheme = localStorage.getItem("cookshare_theme") || "light";
  const curColor = localStorage.getItem("cookshare_color") || "orange";

  document.querySelectorAll(".theme-mode-card").forEach(el => {
    el.classList.toggle("active", el.dataset.mode === curTheme);
  });
  document.querySelectorAll(".palette-btn").forEach(el => {
    el.classList.toggle("active", el.dataset.color === curColor);
  });
}

function mountThemeModal() {
  if (document.getElementById("themeCustomizerModal")) return;
  const isTa = lang() === "ta";
  const div = document.createElement("div");
  div.id = "themeCustomizerModal";
  div.className = "modal-overlay modal-hidden";
  div.style.display = "none";
  div.innerHTML = `
    <div class="modal-content" style="max-width:480px">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:24px">🎨</span>
          <div>
            <h2 style="font-size:1.25rem">${isTa ? 'வண்ணங்கள் & தோற்றம்' : 'Themes & Color Palettes'}</h2>
            <small class="muted">${isTa ? 'உங்களுக்குப் பிடித்த வண்ணத்தை தேர்வு செய்யவும்' : 'Personalize your cooking experience'}</small>
          </div>
        </div>
        <button class="icon-btn" onclick="closeThemeModal()" style="border:none;font-size:20px;padding:4px 8px">✕</button>
      </div>

      <!-- Color Palettes -->
      <label style="font-weight:700;margin-bottom:6px;display:block">
        ${isTa ? 'வண்ணத் தேர்வு (Accent Color)' : 'Accent Color Palette'}
      </label>
      <div class="palette-grid">
        <button class="palette-btn" data-color="orange" onclick="setThemeColor('orange')">
          <div class="palette-circle" style="background:#ea580c"></div>
          <span>Spice</span>
        </button>
        <button class="palette-btn" data-color="emerald" onclick="setThemeColor('emerald')">
          <div class="palette-circle" style="background:#059669"></div>
          <span>Mint</span>
        </button>
        <button class="palette-btn" data-color="sapphire" onclick="setThemeColor('sapphire')">
          <div class="palette-circle" style="background:#2563eb"></div>
          <span>Sapphire</span>
        </button>
        <button class="palette-btn" data-color="violet" onclick="setThemeColor('violet')">
          <div class="palette-circle" style="background:#8b5cf6"></div>
          <span>Violet</span>
        </button>
        <button class="palette-btn" data-color="ruby" onclick="setThemeColor('ruby')">
          <div class="palette-circle" style="background:#ef4444"></div>
          <span>Ruby</span>
        </button>
        <button class="palette-btn" data-color="turmeric" onclick="setThemeColor('turmeric')">
          <div class="palette-circle" style="background:#d97706"></div>
          <span>Turmeric</span>
        </button>
        <button class="palette-btn" data-color="rose" onclick="setThemeColor('rose')">
          <div class="palette-circle" style="background:#ec4899"></div>
          <span>Rose</span>
        </button>
      </div>

      <!-- Background Modes -->
      <label style="font-weight:700;margin-bottom:6px;display:block">
        ${isTa ? 'பின்னணி முறை (Background Mode)' : 'Display Background Mode'}
      </label>
      <div class="theme-mode-grid">
        <div class="theme-mode-card" data-mode="light" onclick="setThemeMode('light')">
          <span style="font-size:22px">☀️</span>
          <div>
            <strong>Light Mode</strong>
            <small style="display:block;color:var(--muted)">Crisp & Bright</small>
          </div>
        </div>
        <div class="theme-mode-card" data-mode="dark" onclick="setThemeMode('dark')">
          <span style="font-size:22px">🌙</span>
          <div>
            <strong>Midnight Dark</strong>
            <small style="display:block;color:var(--muted)">Sleek & Deep</small>
          </div>
        </div>
        <div class="theme-mode-card" data-mode="oled" onclick="setThemeMode('oled')">
          <span style="font-size:22px">🌑</span>
          <div>
            <strong>OLED Black</strong>
            <small style="display:block;color:var(--muted)">Pure Black Contrast</small>
          </div>
        </div>
        <div class="theme-mode-card" data-mode="sepia" onclick="setThemeMode('sepia')">
          <span style="font-size:22px">📜</span>
          <div>
            <strong>Warm Sepia</strong>
            <small style="display:block;color:var(--muted)">Heritage Paper</small>
          </div>
        </div>
      </div>

      <button class="btn" style="width:100%;margin-top:10px" onclick="closeThemeModal()">✓ Done</button>
    </div>
  `;
  document.body.appendChild(div);
  div.onclick = e => { if (e.target === div) closeThemeModal(); };
}

function openUserProfileModal() {
  let modal = document.getElementById("userProfileModal");
  if (!modal) {
    mountUserProfileModal();
    modal = document.getElementById("userProfileModal");
  }
  const u = getUser();
  if (u) {
    document.getElementById("profileUserName").textContent = u.name || "CookShare Chef";
    document.getElementById("profileUserEmail").textContent = u.email || "chef@cookshare.com";
    document.getElementById("profileUserRole").textContent = (u.role || "USER").toUpperCase();
    document.getElementById("profileAvatarText").textContent = (u.name || "C").charAt(0).toUpperCase();
  }
  if (modal) {
    modal.classList.remove("modal-hidden");
    modal.style.display = "flex";
  }
}

function closeUserProfileModal() {
  const modal = document.getElementById("userProfileModal");
  if (modal) {
    modal.classList.add("modal-hidden");
    modal.style.display = "none";
  }
}

function mountUserProfileModal() {
  if (document.getElementById("userProfileModal")) return;
  const isTa = lang() === "ta";
  const div = document.createElement("div");
  div.id = "userProfileModal";
  div.className = "modal-overlay modal-hidden";
  div.style.display = "none";
  div.innerHTML = `
    <div class="modal-content" style="max-width:440px">
      <div class="modal-header">
        <h2 style="font-size:1.2rem">👤 ${isTa ? 'பயனர் கணக்கு' : 'User Account'}</h2>
        <button class="icon-btn" onclick="closeUserProfileModal()" style="border:none;font-size:20px;padding:4px 8px">✕</button>
      </div>

      <div class="profile-modal-box">
        <div id="profileAvatarText" class="profile-avatar-large">C</div>
        <h3 id="profileUserName" style="margin-bottom:2px">CookShare Chef</h3>
        <p id="profileUserEmail" class="muted" style="font-size:0.88rem;margin-bottom:6px">chef@cookshare.com</p>
        <span id="profileUserRole" class="pill" style="font-size:11px;font-weight:700">USER</span>
      </div>

      <div style="margin:20px 0 10px">
        <a class="profile-action-btn" href="planner.html">
          <span>📅</span> <strong>${isTa ? 'வார உணவு திட்டம் (Meal Planner)' : 'Weekly Meal Planner'}</strong>
        </a>
        <a class="profile-action-btn" href="shopping.html">
          <span>🛒</span> <strong>${isTa ? 'ஷாப்பிங் பட்டியல் (Shopping List)' : 'My Shopping List'}</strong>
        </a>
        <a class="profile-action-btn" href="upload.html">
          <span>🍳</span> <strong>${isTa ? 'சமையல் குறிப்பு பகிர்க (Share Recipe)' : 'Share a New Recipe'}</strong>
        </a>
        <button class="profile-action-btn" style="color:var(--danger)" onclick="logout()">
          <span>🚪</span> <strong>${isTa ? 'வெளியேறு (Logout)' : 'Sign Out of Account'}</strong>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(div);
  div.onclick = e => { if (e.target === div) closeUserProfileModal(); };
}

async function quickGoogleLogin() {
  try {
    const res = await api("/auth/google-demo", { method: "POST" });
    saveAuth(res);
    alert(`✅ Signed in as Google Verified User: ${res.user.name}`);
    location.reload();
  } catch (err) {
    location.href = "/api/auth/google";
  }
}

function mountHeader() {
  const h = document.querySelector("header");
  if (!h) return;

  const user = getUser();
  const token = getToken();

  let userSection = `
    <button class="btn small alt" onclick="quickGoogleLogin()" title="Instant Google OAuth Login" style="display:flex;align-items:center;gap:4px">
      <svg width="14" height="14" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>
      Google
    </button>
    <a class="btn small" href="login.html" data-i18n="login">${tr("login")}</a>
  `;

  if (token && user) {
    const adminLink = user.role === "ADMIN" ? `<a class="btn small" style="background:#ef4444;color:#fff" href="admin.html">⚙ Admin</a>` : "";
    const shortName = (user.name || "Chef").split(" ")[0];
    userSection = `
      ${adminLink}
      <button class="user-pill" onclick="openUserProfileModal()" title="View Account Profile (${esc(user.name)})" style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:var(--panel-alt);border:1px solid var(--primary);border-radius:12px;color:var(--text);font-weight:700;font-size:13px;cursor:pointer">
        <span>👤</span> <span>${esc(shortName)}</span>
      </button>
      <button class="btn small alt" onclick="logout()">${tr("logout")}</button>
    `;
  }

  const currentPath = location.pathname.split("/").pop() || "index.html";

  h.innerHTML = `
    <a class="logo" href="/">🍳 CookShare</a>
    <nav>
      <a href="/" class="${currentPath === "index.html" || currentPath === "" ? "active" : ""}" data-i18n="home">${tr("home")}</a>
      <a href="explore.html" class="${currentPath === "explore.html" ? "active" : ""}" data-i18n="explore">${tr("explore")}</a>
      <a href="glossary.html" class="${currentPath === "glossary.html" ? "active" : ""}" data-i18n="glossary">${tr("glossary")}</a>
      <a href="upload.html" class="${currentPath === "upload.html" ? "active" : ""}" data-i18n="share">${tr("share")}</a>
      <a href="planner.html" class="${currentPath === "planner.html" ? "active" : ""}" data-i18n="planner">${tr("planner")}</a>
      <a href="shopping.html" class="${currentPath === "shopping.html" ? "active" : ""}" data-i18n="shopping">
        ${tr("shopping")} <span id="navShoppingCount" class="nav-count-badge" style="display:none">0</span>
      </a>
      <a href="community.html" class="${currentPath === "community.html" ? "active" : ""}" data-i18n="community">${tr("community")}</a>
    </nav>
    <div class="header-actions">
      <button id="themeToggleBtn" class="icon-btn" onclick="toggleTheme()" title="${(localStorage.getItem('cookshare_theme') === 'dark' || localStorage.getItem('cookshare_theme') === 'oled') ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
        ${(localStorage.getItem('cookshare_theme') === 'dark' || localStorage.getItem('cookshare_theme') === 'oled') ? '☀️' : '🌙'}
      </button>
      <button class="icon-btn" onclick="openThemeModal()" title="Customize Themes & Colors">
        🎨 <span class="theme-label">${lang() === "ta" ? "வண்ணங்கள்" : "Themes"}</span>
      </button>
      <button class="icon-btn" onclick="toggleLang()" title="Toggle Language (English / தமிழ்)">
        🌐 <span class="lang-label">${lang() === "en" ? "தமிழ்" : "English"}</span>
      </button>
      ${userSection}
    </div>
  `;
}

// Format bot Markdown into clean HTML with Section Headers and Shopping List Integration
function formatBotReply(text) {
  if (!text) return "";
  let clean = esc(text);

  // Bold **text**
  clean = clean.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic *text*
  clean = clean.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Section titles like "📋 INGREDIENTS:" or "தேவையான பொருட்கள்:"
  clean = clean.replace(/(?:^|<br>)(?:###\s*|\b)([A-Z\u0B80-\u0BFF\s\(\)\/]{3,}:)/g, '<br><strong style="color:var(--primary);display:block;margin-top:10px;font-size:1.02rem">$1</strong>');

  // Bullet points
  clean = clean.replace(/(?:^|<br>)[•\-]\s+(.*?)(?=<br>|$)/g, '<br>&nbsp;&nbsp;• <span>$1</span>');

  // Linebreaks
  clean = clean.replace(/\n/g, "<br>");

  // Extract ingredients to provide 1-click "Add to Shopping List" with Dish Name
  try {
    const ingSectionMatch = text.match(/(?:INGREDIENTS|தேவையான பொருட்கள்)[\s\S]*?(?=(?:INSTRUCTIONS|செய்முறை|DIRECTIONS|TIPS|குறிப்புகள்|SERVED WITH|$))/i);
    if (ingSectionMatch) {
      const rawLines = ingSectionMatch[0]
        .split("\n")
        .map(l => l.replace(/^[\s*•\-#\d.]+/, "").trim())
        .filter(l => l.length > 2 && !l.toLowerCase().includes("ingredient") && !l.includes("தேவையான"));

      if (rawLines.length > 0) {
        // Extract dish title from top line
        let dishName = "ChefBot Recipe";
        const titleMatch = text.match(/(?:👨‍🍳|🍽|🍳)?\s*\*\*(.*?)\*\*/);
        if (titleMatch && titleMatch[1]) {
          dishName = titleMatch[1].replace(/[👨‍🍳🍽🍳]/g, "").trim();
        }

        const payload = encodeURIComponent(JSON.stringify(rawLines));
        const encodedDish = encodeURIComponent(dishName);
        clean += `<br><button type="button" class="bot-add-shopping-btn" data-dish="${encodedDish}" data-ings="${payload}" onclick="addBotRecipeToShopping(this)">🛒 ${lang() === 'ta' ? `"${dishName}" செய்முறை பொருட்களை சேர்க்க` : `Add "${dishName}" Ingredients to Shopping List`}</button>`;
      }
    }
  } catch (e) {}

  return clean;
}

// ChefBot inline shopping list button handler with Dish Name
async function addBotRecipeToShopping(btn) {
  try {
    const rawIngs = JSON.parse(decodeURIComponent(btn.dataset.ings || "[]"));
    const dishName = decodeURIComponent(btn.dataset.dish || "ChefBot Recipe");
    if (!rawIngs.length) return;

    const items = rawIngs.map(line => {
      // Split "Shallots – 200g" or "Mutton – 500g"
      const parts = line.split(/[–\-:]/);
      const name = (parts[0] || line).trim();
      const qty = (parts[1] || "").trim();
      return {
        name,
        quantity: qty,
        unit: "",
        category: dishName,
        dish_name: dishName
      };
    });

    btn.disabled = true;
    btn.textContent = lang() === "ta" ? "⏳ சேர்க்கப்படுகிறது..." : "⏳ Adding...";

    await addItemsToShoppingList(items, dishName);

    btn.textContent = lang() === "ta" ? `✅ ${items.length} பொருட்கள் சேர்க்கப்பட்டன!` : `✅ ${items.length} Items Added!`;
    btn.style.background = "var(--success)";

    showToast(
      lang() === "ta" ? `🛒 "${dishName}" பொருட்கள் உங்கள் ஷாப்பிங் பட்டியலில் சேர்க்கப்பட்டன!` : `🛒 Added "${dishName}" ingredients to your Shopping List!`,
      "success",
      { text: lang() === "ta" ? `"${dishName}" மெனு பார்க்க ➔` : `View "${dishName}" Menu ➔`, url: `shopping.html?dish=${encodeURIComponent(dishName)}` }
    );
  } catch (err) {
    btn.disabled = false;
    btn.textContent = "❌ Error adding";
    showToast(err.message, "error");
  }
}

// ----------------------------------------------------
// CHEFBOT AI ASSISTANT & REVERSE PANTRY MATCHER
// ----------------------------------------------------
function mountChefBot() {
  if (document.getElementById("chefbot-container")) return;

  const isTa = lang() === "ta";
  const container = document.createElement("div");
  container.id = "chefbot-container";
  container.innerHTML = `
    <div id="chefbot-fab" onclick="toggleChefBot()" title="ChefBot AI Culinary Assistant">
      🤖 <span style="font-size:14px;font-weight:800">ChefBot AI</span>
    </div>
    <div id="chefbot-modal" class="chefbot-hidden">
      <div class="chefbot-header">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:24px">🍳</span>
          <div>
            <strong style="color:var(--text)">ChefBot AI Assistant</strong>
            <small style="display:block;color:var(--muted);font-size:11px">Bilingual Culinary Intelligence (English / தமிழ்)</small>
          </div>
        </div>
        <button onclick="toggleChefBot()" class="icon-btn" style="border:none;font-size:18px;color:var(--text);padding:4px 8px">✕</button>
      </div>
      <div class="chefbot-tabs">
        <button id="tabChat" class="chefbot-tab active" onclick="switchChefTab('chat')">💬 Culinary Chat</button>
        <button id="tabPantry" class="chefbot-tab" onclick="switchChefTab('pantry')">🥗 Pantry Matcher</button>
      </div>

      <!-- CHAT VIEW -->
      <div id="chefbotChatView" class="chefbot-body">
        <div id="chefbotMessages" class="chefbot-messages">
          <div class="bot-msg">
            <b>ChefBot:</b> ${isTa ? "வணக்கம்! நான் உங்கள் சமையல் வழிகாட்டி செஃப்போட். சமையல் குறிப்புகள், தேவையான மாற்றுப் பொருட்கள், சமையல் ரகசியங்கள் பற்றி தமிழில் அல்லது ஆங்கிலத்தில் கேளுங்கள்!" : "Hello Chef! I am your AI culinary assistant. Ask me anything about recipes, cooking secrets, or ingredient substitutions in English or தமிழ்!"}
          </div>
        </div>
        <div class="chefbot-quick-prompts">
          <span class="prompt-chip" onclick="askPrompt('How to make crispy dosa without sticking?')">Dosa Tip</span>
          <span class="prompt-chip" onclick="askPrompt('Curry has too much salt what should I do?')">Fix Salty Curry</span>
          <span class="prompt-chip" onclick="askPrompt('Substitute for eggs in baking')">Egg Substitutes</span>
          <span class="prompt-chip" onclick="askPrompt('சாம்பார் மணமணக்க ரகசியம் என்ன?')">சாம்பார் ரகசியம்</span>
          <span class="prompt-chip" onclick="askPrompt('Healthy high protein dinner')">High Protein</span>
        </div>
        <form id="chefbotForm" onsubmit="sendChefMessage(event)">
          <input id="chefInput" placeholder="${isTa ? 'செஃப்போட்டிடம் கேளுங்கள் (English / தமிழ்)...' : 'Ask ChefBot (English / தமிழ்)...'}" autocomplete="off" required>
          <button type="submit" class="btn small">Send</button>
        </form>
      </div>

      <!-- PANTRY MATCHER VIEW -->
      <div id="chefbotPantryView" class="chefbot-body" style="display:none">
        <p style="font-size:12px;color:var(--muted);margin-bottom:8px">
          <strong>Reverse Search:</strong> Select items available in your kitchen, and ChefBot calculates the best recipe matches!
        </p>
        <div class="pantry-chips">
          <label><input type="checkbox" value="chicken" onchange="togglePantryChip(this)"> Chicken</label>
          <label><input type="checkbox" value="shallots" onchange="togglePantryChip(this)"> Shallots</label>
          <label><input type="checkbox" value="pepper" onchange="togglePantryChip(this)"> Pepper</label>
          <label><input type="checkbox" value="ghee" onchange="togglePantryChip(this)"> Ghee</label>
          <label><input type="checkbox" value="potato" onchange="togglePantryChip(this)"> Potato</label>
          <label><input type="checkbox" value="paneer" onchange="togglePantryChip(this)"> Paneer</label>
          <label><input type="checkbox" value="rice" onchange="togglePantryChip(this)"> Rice</label>
          <label><input type="checkbox" value="drumstick" onchange="togglePantryChip(this)"> Drumstick</label>
        </div>
        <div style="display:flex;gap:6px;margin:8px 0">
          <input id="customPantryInput" placeholder="Add custom item (e.g. mutton, tomato)..." style="flex:1;padding:7px 10px;font-size:13px">
          <button type="button" class="btn small" onclick="addCustomPantry()">Add</button>
        </div>
        <button type="button" class="btn" style="width:100%;margin-top:4px" onclick="runPantryMatch()">⚡ Match Recipes</button>
        <div id="pantryResults" style="margin-top:12px;max-height:220px;overflow-y:auto"></div>
      </div>
    </div>
  `;

  // Inject styles with full dark/light theme integration
  const style = document.createElement("style");
  style.textContent = `
    #chefbot-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: #ffffff;
      padding: 13px 22px;
      border-radius: 999px;
      box-shadow: 0 10px 28px rgba(234, 88, 12, 0.45);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      z-index: 9999;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    #chefbot-fab:hover {
      transform: scale(1.05);
      box-shadow: 0 14px 34px rgba(234, 88, 12, 0.6);
    }
    #chefbot-modal {
      position: fixed;
      bottom: 88px;
      right: 24px;
      width: 420px;
      max-width: calc(100vw - 32px);
      height: 560px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      color: var(--text);
    }
    #chefbot-modal.chefbot-hidden {
      display: none;
    }
    .chefbot-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: var(--panel-alt);
      border-bottom: 1px solid var(--line);
    }
    .chefbot-tabs {
      display: flex;
      border-bottom: 1px solid var(--line);
      background: var(--panel-alt);
    }
    .chefbot-tab {
      flex: 1;
      padding: 10px;
      border: none;
      background: transparent;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      color: var(--muted);
      transition: all 0.2s ease;
    }
    .chefbot-tab.active {
      background: var(--panel);
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
    }
    .chefbot-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 14px;
      overflow-y: auto;
    }
    .chefbot-messages {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .bot-msg {
      background: var(--panel-alt);
      border: 1px solid var(--line);
      padding: 12px 14px;
      border-radius: 14px 14px 14px 2px;
      color: var(--text);
      line-height: 1.5;
    }
    .user-msg {
      background: var(--primary-soft);
      border: 1px solid var(--line);
      padding: 12px 14px;
      border-radius: 14px 14px 2px 14px;
      color: var(--primary-deep);
      align-self: flex-end;
      line-height: 1.5;
      font-weight: 600;
    }
    .chefbot-quick-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .prompt-chip {
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--panel-alt);
      border: 1px solid var(--line);
      color: var(--muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .prompt-chip:hover {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }
    #chefbotForm {
      display: flex;
      gap: 8px;
    }
    #chefbotForm input {
      flex: 1;
      padding: 9px 12px;
      border: 1px solid var(--line);
      background: var(--input-bg);
      color: var(--text);
      border-radius: 10px;
      font-size: 13px;
    }
    .pantry-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .pantry-chips label {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--panel-alt);
      border: 1px solid var(--line);
      padding: 5px 9px;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text);
    }
    .pantry-match-card {
      background: var(--panel-alt);
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .match-bar-bg {
      height: 6px;
      background: var(--line);
      border-radius: 3px;
      overflow: hidden;
      margin: 6px 0;
    }
    .match-bar-fill {
      height: 100%;
      background: var(--success);
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(container);
}

function toggleChefBot() {
  const m = document.getElementById("chefbot-modal");
  if (m) m.classList.toggle("chefbot-hidden");
}

function switchChefTab(tab) {
  document.getElementById("tabChat").classList.toggle("active", tab === "chat");
  document.getElementById("tabPantry").classList.toggle("active", tab === "pantry");
  document.getElementById("chefbotChatView").style.display = tab === "chat" ? "flex" : "none";
  document.getElementById("chefbotPantryView").style.display = tab === "pantry" ? "flex" : "none";
}

async function sendChefMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("chefInput");
  const msg = input.value.trim();
  if (!msg) return;

  const msgsBox = document.getElementById("chefbotMessages");
  msgsBox.innerHTML += `<div class="user-msg"><b>You:</b> ${esc(msg)}</div>`;
  input.value = "";
  msgsBox.scrollTop = msgsBox.scrollHeight;

  const loadingId = "load-" + Date.now();
  msgsBox.innerHTML += `<div id="${loadingId}" class="bot-msg"><i>ChefBot is analyzing culinary wisdom...</i></div>`;
  msgsBox.scrollTop = msgsBox.scrollHeight;

  try {
    const res = await api("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message: msg, language: lang() })
    });

    const loadElem = document.getElementById(loadingId);
    let recipeSnippet = "";
    if (res.suggestedRecipes && res.suggestedRecipes.length > 0) {
      const top = res.suggestedRecipes[0];
      const title = lang() === "ta" ? (top.title_ta || top.title) : top.title;
      const videoTag = top.video_url ? `<span class="video-badge" style="margin-left:6px;font-size:10px">▶ Video</span>` : "";

      recipeSnippet = `
        <div style="margin-top:10px;padding:8px 10px;background:var(--panel);border:1px solid var(--line);border-radius:10px">
          <small style="color:var(--muted);font-weight:700;display:block">Recommended Recipe:</small>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
            <a href="recipe.html?id=${top.id}" style="font-weight:800;color:var(--primary)">🍽 ${esc(title)}</a>
            ${videoTag}
          </div>
          <small style="color:var(--muted)">${top.cuisine} · ⭐ ${Number(top.rating || 5).toFixed(1)}</small>
        </div>
      `;
    }

    if (loadElem) {
      loadElem.innerHTML = `<b>ChefBot:</b><br>${formatBotReply(res.reply)} ${recipeSnippet}`;
    }
  } catch (err) {
    const loadElem = document.getElementById(loadingId);
    if (loadElem) loadElem.textContent = "Error: " + err.message;
  }
  msgsBox.scrollTop = msgsBox.scrollHeight;
}

function askPrompt(p) {
  const inp = document.getElementById("chefInput");
  if (inp) {
    inp.value = p;
    sendChefMessage();
  }
}

let selectedPantry = ["chicken", "shallots", "pepper"];

function togglePantryChip(cb) {
  if (cb.checked) {
    if (!selectedPantry.includes(cb.value)) selectedPantry.push(cb.value);
  } else {
    selectedPantry = selectedPantry.filter(x => x !== cb.value);
  }
}

function addCustomPantry() {
  const inp = document.getElementById("customPantryInput");
  const val = inp.value.trim().toLowerCase();
  if (!val) return;
  if (!selectedPantry.includes(val)) selectedPantry.push(val);
  inp.value = "";
  runPantryMatch();
}

async function runPantryMatch() {
  const resBox = document.getElementById("pantryResults");
  resBox.innerHTML = "<i>Analyzing recipe matching percentage...</i>";

  try {
    const data = await api("/ai/pantry-match", {
      method: "POST",
      body: JSON.stringify({ ingredients: selectedPantry })
    });

    if (!data.matches || data.matches.length === 0) {
      resBox.innerHTML = "<p>No matches found with selected ingredients.</p>";
      return;
    }

    resBox.innerHTML = data.matches.map(m => `
      <div class="pantry-match-card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <a href="recipe.html?id=${m.id}" style="font-weight:700;color:var(--text)">${esc(lang() === "ta" ? (m.title_ta || m.title) : m.title)}</a>
          <span style="font-weight:800;color:${m.matchPercentage > 50 ? 'var(--success)' : 'var(--primary)'}">${m.matchPercentage}% Match</span>
        </div>
        <div class="match-bar-bg">
          <div class="match-bar-fill" style="width:${m.matchPercentage}%"></div>
        </div>
        <div style="color:var(--muted);font-size:11px">
          Matched: ${esc(m.matchedIngredients.join(", ") || "None")}
        </div>
      </div>
    `).join("");
  } catch (err) {
    resBox.innerHTML = `<p style="color:var(--danger)">${esc(err.message)}</p>`;
  }
}

// ----------------------------------------------------
// MODERN TOAST NOTIFICATIONS
// ----------------------------------------------------
function showToast(message, type = "success", action = null) {
  let container = document.getElementById("cookshare-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "cookshare-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `cookshare-toast ${type}`;

  const icon = type === "success" ? "✅" : (type === "error" ? "❌" : "💡");
  let actionHtml = "";
  if (action && action.text && action.url) {
    actionHtml = `<a href="${esc(action.url)}" class="cookshare-toast-action">${esc(action.text)}</a>`;
  }

  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px">
      <span>${icon}</span>
      <span>${esc(message)}</span>
    </div>
    ${actionHtml}
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px) scale(0.95)";
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

// ----------------------------------------------------
// UNIFIED SHOPPING LIST ENGINE (OFFLINE & CLOUD SYNC)
// ----------------------------------------------------
function getGuestShoppingList() {
  try {
    const list1 = JSON.parse(localStorage.getItem("cookshare_local_shopping") || "[]");
    const list2 = JSON.parse(localStorage.getItem("cookshare_guest_shopping") || "[]");

    const merged = [];
    const seen = new Set();

    for (const item of [...list1, ...list2]) {
      if (!item || !item.name) continue;
      const dName = String(item.dish_name || item.category || "General").trim();
      const key = (String(item.name).trim().toLowerCase()) + "||" + dName.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push({
          id: item.id || Date.now() + Math.floor(Math.random() * 1000),
          name: String(item.name).trim(),
          quantity: String(item.quantity || "").trim(),
          unit: String(item.unit || "").trim(),
          category: String(item.category || dName || "Grocery").trim(),
          dish_name: dName,
          purchased: Boolean(item.purchased)
        });
      }
    }
    return merged;
  } catch (e) {
    return [];
  }
}

function saveGuestShoppingList(list) {
  try {
    const serialized = JSON.stringify(list || []);
    localStorage.setItem("cookshare_local_shopping", serialized);
    localStorage.setItem("cookshare_guest_shopping", serialized);
    updateNavShoppingBadge();
  } catch (e) {
    console.error("Failed to save guest shopping list:", e);
  }
}

async function addItemsToShoppingList(items, dishName = "") {
  if (!items) return { success: false, count: 0 };
  const list = Array.isArray(items) ? items : [items];
  const dName = String(dishName || "").trim();

  const validItems = list
    .filter(i => i && i.name && String(i.name).trim().length > 0)
    .map(i => {
      const itemDish = String(i.dish_name || dName || i.category || "General").trim();
      return {
        name: String(i.name).trim(),
        quantity: String(i.quantity || "").trim(),
        unit: String(i.unit || "").trim(),
        category: String(i.category || itemDish || "Grocery").trim(),
        dish_name: itemDish
      };
    });

  if (!validItems.length) return { success: false, count: 0 };

  if (getToken()) {
    try {
      await api("/users/me/shopping-list/batch", {
        method: "POST",
        body: JSON.stringify({ items: validItems, dish_name: dName })
      });
      updateNavShoppingBadge();
      return { success: true, count: validItems.length };
    } catch (e) {
      console.warn("API batch failed, falling back to local storage:", e);
    }
  }

  // Local Guest Storage with Dish-aware Deduplication
  const current = getGuestShoppingList();
  for (const newItem of validItems) {
    const existing = current.find(x =>
      x.name.toLowerCase() === newItem.name.toLowerCase() &&
      (x.dish_name || x.category || "").toLowerCase() === (newItem.dish_name || newItem.category || "").toLowerCase()
    );

    if (existing) {
      if (newItem.quantity && (!existing.quantity || existing.quantity === "1")) {
        existing.quantity = newItem.quantity;
      }
      if (newItem.unit && !existing.unit) {
        existing.unit = newItem.unit;
      }
    } else {
      current.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: newItem.name,
        quantity: newItem.quantity,
        unit: newItem.unit,
        category: newItem.category,
        dish_name: newItem.dish_name,
        purchased: false
      });
    }
  }
  saveGuestShoppingList(current);
  return { success: true, count: validItems.length };
}

async function updateNavShoppingBadge() {
  const badge = document.getElementById("navShoppingCount");
  if (!badge) return;

  if (getToken()) {
    try {
      const rows = await api("/users/me/shopping-list");
      const unbought = rows.filter(r => !r.purchased).length;
      if (unbought > 0) {
        badge.textContent = unbought;
        badge.style.display = "inline-flex";
      } else {
        badge.style.display = "none";
      }
      return;
    } catch (e) {}
  }

  const guest = getGuestShoppingList();
  const unbought = guest.filter(r => !r.purchased).length;
  if (unbought > 0) {
    badge.textContent = unbought;
    badge.style.display = "inline-flex";
  } else {
    badge.style.display = "none";
  }
}

async function syncGuestShoppingToCloud() {
  if (!getToken()) return;
  const guestItems = getGuestShoppingList();
  if (!guestItems.length) return;

  try {
    await api("/users/me/shopping-list/batch", {
      method: "POST",
      body: JSON.stringify({ items: guestItems })
    });
    // Clear local guest keys
    localStorage.removeItem("cookshare_local_shopping");
    localStorage.removeItem("cookshare_guest_shopping");
    updateNavShoppingBadge();
    showToast(
      lang() === "ta" ? "உங்கள் ஆஃப்லைன் பொருட்கள் கணக்குடன் இணைக்கப்பட்டன!" : "Offline shopping list synced to your account!",
      "info",
      { text: lang() === "ta" ? "பட்டியல் பார்க்க ➔" : "View List ➔", url: "shopping.html" }
    );
  } catch (e) {
    console.error("Cloud shopping sync failed:", e);
  }
}

// ----------------------------------------------------
// UNIVERSAL WHATSAPP ITEM LIST SHARING ENGINE
// ----------------------------------------------------
function formatShoppingListForWhatsApp({ items = [], title = "", dishFilter = "all", onlyPending = false }) {
  const isTa = lang() === "ta";
  let filtered = (items || []).slice();

  // Filter dish if specified
  if (dishFilter && dishFilter !== "all" && dishFilter !== "All Dishes") {
    filtered = filtered.filter(i => {
      const d = String(i.dish_name || i.category || "").trim().toLowerCase();
      return d === dishFilter.trim().toLowerCase();
    });
  }

  // Filter pending only
  if (onlyPending) {
    filtered = filtered.filter(i => !i.purchased);
  }

  if (!filtered.length) {
    return isTa
      ? "🛒 *குக்ஷேர் - பொருட்கள் பட்டியல்*\n\nபட்டியலில் பொருட்கள் எதுவும் இல்லை!"
      : "🛒 *CookShare - Shopping List*\n\nNo items to buy in this list!";
  }

  const today = new Date().toLocaleDateString(isTa ? "ta-IN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  let mainTitle = title;
  if (!mainTitle) {
    if (dishFilter && dishFilter !== "all" && dishFilter !== "All Dishes") {
      mainTitle = isTa ? `🛒 *குக்ஷேர் - \"${dishFilter}\" தேவையான பொருட்கள்*` : `🛒 *CookShare - Ingredients for \"${dishFilter}\"*`;
    } else {
      mainTitle = isTa ? `🛒 *குக்ஷேர் - மளிகை & பொருட்கள் பட்டியல்*` : `🛒 *CookShare - Grocery & Shopping List*`;
    }
  }

  let text = `${mainTitle}\n📅 ${isTa ? 'தேதி' : 'Date'}: ${today}\n`;
  if (onlyPending) {
    text += `📌 ${isTa ? 'வாங்க வேண்டிய பொருட்கள் மட்டும்' : 'Pending items to buy only'}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Group items by dish or category
  const groups = {};
  for (const item of filtered) {
    const g = String(item.dish_name || item.category || (isTa ? "இதர பொருட்கள்" : "General Groceries")).trim();
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  }

  const groupKeys = Object.keys(groups);
  const singleGroup = groupKeys.length === 1 && (dishFilter !== "all" || groupKeys[0].toLowerCase().includes("ingredient") || groupKeys[0].toLowerCase().includes("recipe"));

  groupKeys.forEach((gName) => {
    const list = groups[gName];
    if (!singleGroup) {
      text += `🍽 *${gName}* (${list.length})\n`;
    }
    list.forEach(i => {
      const check = i.purchased ? "☑" : "◻";
      const name = i.name || "";
      const qty = (i.quantity ? String(i.quantity).trim() : "");
      const unit = (i.unit ? String(i.unit).trim() : "");
      let qtyStr = "";
      if (qty && unit) qtyStr = ` - ${qty} ${unit}`;
      else if (qty) qtyStr = ` - ${qty}`;
      else if (unit) qtyStr = ` - ${unit}`;

      text += `  ${check} ${name}${qtyStr}\n`;
    });
    text += `\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📊 *${isTa ? 'மொத்த பொருட்கள்' : 'Total Items'}:* ${filtered.length}\n`;
  text += `✨ _${isTa ? 'CookShare சமையல் தளம் வழியாக பகிரப்பட்டது' : 'Shared via CookShare Culinary Platform'}_\n`;
  text += `🌐 ${window.location.origin}/shopping.html`;

  return text;
}

function openWhatsAppModal({
  title = "",
  items = [],
  dishes = [],
  defaultDish = "all",
  showPendingToggle = true
}) {
  const isTa = lang() === "ta";
  let activeDish = defaultDish || "all";
  let onlyPending = false;

  // Remove any existing modal
  const existing = document.getElementById("cookshare-whatsapp-modal");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "cookshare-whatsapp-modal";
  backdrop.className = "whatsapp-modal-backdrop";

  // Build dish options
  const dishOptions = (dishes && dishes.length > 0) ? `
    <div style="margin-bottom:12px">
      <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
        🍽 ${isTa ? 'டிஷ் / மெனு வாரியாக தேர்வு' : 'Filter by Dish / Menu'}:
      </label>
      <select id="waDishSelect" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
        <option value="all">${isTa ? '🍽 அனைத்து உணவுகள் (All Dishes)' : '🍽 All Dishes'}</option>
        ${dishes.map(d => `<option value="${esc(d)}" ${d.toLowerCase() === activeDish.toLowerCase() ? 'selected' : ''}>${esc(d)}</option>`).join("")}
      </select>
    </div>
  ` : "";

  backdrop.innerHTML = `
    <div class="whatsapp-modal" role="dialog" aria-modal="true" aria-labelledby="waModalTitle">
      <div class="whatsapp-modal-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:38px;height:38px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.25);flex-shrink:0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 16.59c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.04 8.04 0 01-1.23-4.28c0-4.46 3.63-8.09 8.09-8.09 2.16 0 4.19.84 5.72 2.37 1.53 1.53 2.37 3.56 2.37 5.72 0 4.46-3.63 8.14-8.16 8.14zm4.44-6.09c-.24-.12-1.44-.71-1.66-.79-.22-.09-.39-.12-.55.12-.17.24-.64.79-.79.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.14.17-.24.25-.4.08-.17.04-.31-.02-.43-.07-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.24-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
            </svg>
          </div>
          <div>
            <h3 id="waModalTitle" style="margin:0;font-size:1.15rem;font-weight:700;color:#ffffff">
              ${isTa ? 'WhatsApp-ல் அனுப்ப (Share via WhatsApp)' : 'Share via WhatsApp'}
            </h3>
            <small style="color:rgba(255,255,255,0.88);font-size:12px;display:block">
              ${isTa ? 'பொருட்கள் பட்டியல் WhatsApp மெசேஜ் வடிவத்தில் உடனடியாக வரும்' : 'Items list formatted ready as a WhatsApp message'}
            </small>
          </div>
        </div>
        <button id="waCloseBtn" type="button" aria-label="Close" style="background:rgba(255,255,255,0.15);border:none;color:#ffffff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s">✕</button>
      </div>

      <div style="padding:18px 20px;overflow-y:auto;flex:1">
        ${dishOptions}

        ${showPendingToggle ? `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;padding:10px 14px;background:var(--panel-alt);border:1px solid var(--line);border-radius:10px">
            <div>
              <strong style="font-size:13px;display:block;color:var(--text)">
                ✓ ${isTa ? 'வாங்க வேண்டிய பொருட்கள் மட்டும்' : 'Pending / Unchecked Items Only'}
              </strong>
              <small class="muted" style="font-size:11.5px">
                ${isTa ? 'ஏற்கனவே வாங்கிய பொருட்களை பட்டியலில் இருந்து தவிர்க்கும்' : 'Filters out already checked/completed items'}
              </small>
            </div>
            <input type="checkbox" id="waPendingToggle" style="width:20px;height:20px;cursor:pointer">
          </div>
        ` : ''}

        <!-- Optional Phone Number Field -->
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            📱 ${isTa ? 'வாட்ஸ்அப் மொபைல் எண் (விருப்பத்தேர்வு - கடை / நபர்):' : 'WhatsApp Phone Number (Optional - Direct Chat):'}
          </label>
          <div style="display:flex;gap:8px">
            <select id="waCountryCode" style="width:95px;padding:9px 8px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:700">
              <option value="91" selected>🇮🇳 +91</option>
              <option value="1">🇺🇸 +1</option>
              <option value="44">🇬🇧 +44</option>
              <option value="65">🇸🇬 +65</option>
              <option value="60">🇲🇾 +60</option>
              <option value="971">🇦🇪 +971</option>
              <option value="94">🇱🇰 +94</option>
              <option value="61">🇦🇺 +61</option>
            </select>
            <input id="waPhoneInput" type="tel" value="${esc(localStorage.getItem('cookshare_wa_phone') || '')}" placeholder="${isTa ? '10 இலக்க எண் (எ.கா. 9876543210)' : '10-digit mobile number (e.g. 9876543210)'}" style="flex:1;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px">
          </div>
          <small style="color:var(--muted);font-size:11px;display:block;margin-top:4px">
            💡 ${isTa ? 'குறிப்பிட்ட கடைக்காரர் அல்லது நபருக்கு அனுப்ப எண் உள்ளிடவும். எண் விடப்பட்டால் வாட்ஸ்அப் திறந்து எவருக்கும் பகிரலாம்.' : 'Enter phone to chat directly with vendor/person. If blank, WhatsApp contact/group picker opens.'}
          </small>
        </div>

        <!-- WhatsApp Chat Bubble Preview -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="font-size:12.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px">
              <span>💬</span> ${isTa ? 'வாட்ஸ்அப் மெசேஜ் முன்னோட்டம் (Live Preview):' : 'WhatsApp Message Preview:'}
            </label>
            <span id="waItemCountBadge" class="pill" style="font-size:11px;padding:2px 8px">0 items</span>
          </div>
          <div class="whatsapp-chat-preview">
            <div id="waPreviewBubble" class="whatsapp-bubble"></div>
          </div>
        </div>
      </div>

      <div style="padding:14px 20px;background:var(--panel-alt);border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end">
        <button id="waCopyBtn" type="button" class="btn alt" style="font-weight:700;display:inline-flex;align-items:center;gap:6px">
          📋 ${isTa ? 'மெசேஜ் காப்பி செய்க' : 'Copy Message'}
        </button>
        <button id="waSendBtn" type="button" class="btn" style="background:#25D366;color:#ffffff;border:none;font-weight:700;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(37,211,102,0.4)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 16.59c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.04 8.04 0 01-1.23-4.28c0-4.46 3.63-8.09 8.09-8.09 2.16 0 4.19.84 5.72 2.37 1.53 1.53 2.37 3.56 2.37 5.72 0 4.46-3.63 8.14-8.16 8.14zm4.44-6.09c-.24-.12-1.44-.71-1.66-.79-.22-.09-.39-.12-.55.12-.17.24-.64.79-.79.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.14.17-.24.25-.4.08-.17.04-.31-.02-.43-.07-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.24-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
          </svg>
          ${isTa ? 'WhatsApp-ல் அனுப்புக ➔' : 'Send to WhatsApp ➔'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  // Helper to re-render preview
  function updatePreview() {
    const text = formatShoppingListForWhatsApp({
      items,
      title,
      dishFilter: activeDish,
      onlyPending
    });
    const bubble = document.getElementById("waPreviewBubble");
    if (bubble) bubble.textContent = text;

    // Count items matching
    let matching = (items || []).slice();
    if (activeDish && activeDish !== "all" && activeDish !== "All Dishes") {
      matching = matching.filter(i => String(i.dish_name || i.category || "").trim().toLowerCase() === activeDish.trim().toLowerCase());
    }
    if (onlyPending) matching = matching.filter(i => !i.purchased);

    const badge = document.getElementById("waItemCountBadge");
    if (badge) badge.textContent = `${matching.length} items`;
    return text;
  }

  updatePreview();

  // Event handlers
  const closeBtn = document.getElementById("waCloseBtn");
  const dishSelect = document.getElementById("waDishSelect");
  const pendingToggle = document.getElementById("waPendingToggle");
  const copyBtn = document.getElementById("waCopyBtn");
  const sendBtn = document.getElementById("waSendBtn");
  const phoneInput = document.getElementById("waPhoneInput");
  const countryCodeSelect = document.getElementById("waCountryCode");

  const closeModal = () => backdrop.remove();
  if (closeBtn) closeBtn.onclick = closeModal;
  backdrop.onclick = e => { if (e.target === backdrop) closeModal(); };

  if (dishSelect) {
    dishSelect.onchange = () => {
      activeDish = dishSelect.value;
      updatePreview();
    };
  }

  if (pendingToggle) {
    pendingToggle.onchange = () => {
      onlyPending = pendingToggle.checked;
      updatePreview();
    };
  }

  if (phoneInput) {
    phoneInput.oninput = () => {
      const clean = phoneInput.value.replace(/[^0-9]/g, "");
      localStorage.setItem("cookshare_wa_phone", clean);
    };
  }

  if (copyBtn) {
    copyBtn.onclick = async () => {
      const text = updatePreview();
      try {
        await navigator.clipboard.writeText(text);
        showToast(isTa ? "✅ வாட்ஸ்அப் மெசேஜ் காப்பி செய்யப்பட்டது!" : "✅ WhatsApp message copied to clipboard!", "success");
      } catch {
        prompt(isTa ? "மெசேஜை காப்பி செய்யவும்:" : "Copy text below:", text);
      }
    };
  }

  if (sendBtn) {
    sendBtn.onclick = () => {
      const text = updatePreview();
      let phone = phoneInput ? phoneInput.value.replace(/[^0-9]/g, "") : "";
      let cc = countryCodeSelect ? countryCodeSelect.value.replace(/[^0-9]/g, "") : "91";

      if (phone) {
        localStorage.setItem("cookshare_wa_phone", phone);
      }

      let waUrl = "";
      if (phone) {
        let fullPhone = phone;
        if (phone.length === 10) {
          fullPhone = cc + phone;
        }
        waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(fullPhone)}&text=${encodeURIComponent(text)}`;
      } else {
        waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      }

      showToast(isTa ? "🚀 WhatsApp திறக்கப்படுகிறது..." : "🚀 Opening WhatsApp...", "info");
      window.open(waUrl, "_blank");
    };
  }
}

// ----------------------------------------------------
// UNIVERSAL WHATSAPP MEAL PLAN SHARING ENGINE
// ----------------------------------------------------
function formatMealPlanForWhatsApp({
  weeklyPlan = {},
  allRecipes = [],
  days = [],
  mealTypes = [],
  dayFilter = "all",
  includeGroceries = false,
  excludedIngredients = [],
  customItems = []
}) {
  const isTa = lang() === "ta";

  const defaultDays = [
    { key: "Monday", en: "Monday", ta: "திங்கள்" },
    { key: "Tuesday", en: "Tuesday", ta: "செவ்வாய்" },
    { key: "Wednesday", en: "Wednesday", ta: "புதன்" },
    { key: "Thursday", en: "Thursday", ta: "வியாழன்" },
    { key: "Friday", en: "Friday", ta: "வெள்ளி" },
    { key: "Saturday", en: "Saturday", ta: "சனி" },
    { key: "Sunday", en: "Sunday", ta: "ஞாயிறு" }
  ];

  const defaultMealTypes = [
    { key: "Breakfast", en: "Breakfast", ta: "காலை உணவு", icon: "🌅" },
    { key: "Lunch", en: "Lunch", ta: "மதிய உணவு", icon: "☀️" },
    { key: "Dinner", en: "Dinner", ta: "இரவு உணவு", icon: "🌙" },
    { key: "Snack", en: "Snack", ta: "சிற்றுண்டி", icon: "☕" }
  ];

  const useDays = (days && days.length) ? days : defaultDays;
  const useMealTypes = (mealTypes && mealTypes.length) ? mealTypes : defaultMealTypes;

  let activeDays = useDays;
  let titleScope = "";

  if (dayFilter === "today") {
    const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayKey = dayMap[new Date().getDay()];
    activeDays = useDays.filter(d => d.key.toLowerCase() === todayKey.toLowerCase());
    const matched = activeDays[0] || { key: todayKey, en: todayKey, ta: todayKey };
    titleScope = isTa ? `(${matched.ta} - இன்றைய உணவு)` : `(${matched.en} - Today's Meals)`;
  } else if (dayFilter && dayFilter !== "all") {
    activeDays = useDays.filter(d => d.key.toLowerCase() === dayFilter.toLowerCase());
    const matched = activeDays[0];
    if (matched) {
      titleScope = isTa ? `(${matched.ta} உணவு அட்டவணை)` : `(${matched.en} Meal Plan)`;
    }
  }

  const todayStr = new Date().toLocaleDateString(isTa ? "ta-IN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  let text = isTa
    ? `🍽️ *குக்ஷேர் - வாராந்திர உணவு அட்டவணை* ${titleScope}\n📅 தேதி: ${todayStr}\n━━━━━━━━━━━━━━━━━━━━\n\n`
    : `🍽️ *CookShare - Weekly Meal Plan* ${titleScope}\n📅 Date: ${todayStr}\n━━━━━━━━━━━━━━━━━━━━\n\n`;

  let totalMealsCount = 0;
  const recipesToIncludeInGroceries = [];

  activeDays.forEach(day => {
    const dayLabel = isTa
      ? `🗓️ *${day.ta} / ${day.en.toUpperCase()}*`
      : `🗓️ *${day.en.toUpperCase()}*`;

    let dayContent = `${dayLabel}\n`;
    let dayMealCount = 0;

    useMealTypes.forEach(meal => {
      const slotKey = `${day.key}_${meal.key}`;
      const recipeId = weeklyPlan[slotKey];
      if (recipeId) {
        const r = allRecipes.find(x => x.id === recipeId);
        if (r) {
          dayMealCount++;
          totalMealsCount++;
          recipesToIncludeInGroceries.push(r);
          const mealTitle = isTa ? (r.title_ta || r.title) : r.title;
          const mealName = isTa ? meal.ta : meal.en;
          const totalTime = (r.prep_minutes || 0) + (r.cook_minutes || 0);
          const timeBadge = totalTime > 0 ? ` _(${totalTime}m)_` : "";
          dayContent += `  ${meal.icon} *${mealName}*: ${mealTitle}${timeBadge}\n`;
        }
      }
    });

    if (dayMealCount === 0) {
      dayContent += `  _${isTa ? 'உணவு திட்டமிடப்படவில்லை' : 'No meals scheduled'}_\n`;
    }

    text += `${dayContent}\n`;
  });

  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📊 *${isTa ? 'திட்டமிடப்பட்ட மொத்த உணவுகள்' : 'Total Planned Meals'}:* ${totalMealsCount} ${isTa ? 'உணவுகள்' : 'meals'}\n`;

  // Optional Groceries
  if (includeGroceries && recipesToIncludeInGroceries.length > 0) {
    text += `\n🛒 *${isTa ? 'தேவையான மளிகைப் பொருட்கள் (Grocery Items to Buy)' : 'Grocery Items to Buy'}:*\n`;
    const excludedNorm = (excludedIngredients || []).map(e => String(e).toLowerCase().trim());
    const ingsMap = {};

    recipesToIncludeInGroceries.forEach(r => {
      if (r.ingredients && Array.isArray(r.ingredients)) {
        r.ingredients.forEach(ing => {
          const norm = (ing.name || "").trim().toLowerCase();
          if (!norm || excludedNorm.includes(norm)) return;
          const displayName = isTa ? (ing.name_ta || ing.name) : ing.name;
          const unitStr = (isTa ? ing.unit_ta : ing.unit) || ing.unit || "";
          if (!ingsMap[norm]) {
            ingsMap[norm] = {
              name: displayName,
              quantity: ing.quantity || "",
              unit: unitStr
            };
          } else {
            const num1 = parseFloat(ingsMap[norm].quantity);
            const num2 = parseFloat(ing.quantity);
            if (!isNaN(num1) && !isNaN(num2)) {
              ingsMap[norm].quantity = (num1 + num2).toString();
            }
          }
        });
      }
    });

    (customItems || []).forEach(c => {
      const norm = (c.name || "").trim().toLowerCase();
      if (!norm || excludedNorm.includes(norm)) return;
      if (!ingsMap[norm]) {
        ingsMap[norm] = {
          name: c.name,
          quantity: c.quantity || "",
          unit: c.unit || ""
        };
      }
    });

    const items = Object.values(ingsMap);
    if (items.length > 0) {
      items.forEach(it => {
        const qtyStr = it.quantity ? ` - ${it.quantity} ${it.unit || ''}`.trim() : "";
        text += `  ◻ ${it.name}${qtyStr}\n`;
      });
      text += `\n`;
    }
  }

  text += `✨ _${isTa ? 'CookShare சமையல் தளம் வழியாக திட்டமிடப்பட்டது' : 'Planned via CookShare Culinary Platform'}_\n`;
  text += `🌐 ${window.location.origin}/planner.html`;

  return { text, totalMealsCount };
}

function openWhatsAppMealPlanModal({
  weeklyPlan = {},
  allRecipes = [],
  days = [],
  mealTypes = [],
  defaultDay = "all",
  excludedIngredients = [],
  customItems = []
}) {
  const isTa = lang() === "ta";
  let activeDay = defaultDay || "all";
  let includeGroceries = false;
  const savedPhone = localStorage.getItem("cookshare_wa_phone") || "";

  // Remove any existing modal
  const existing = document.getElementById("cookshare-whatsapp-modal");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "cookshare-whatsapp-modal";
  backdrop.className = "whatsapp-modal-backdrop";

  const defaultDays = [
    { key: "Monday", en: "Monday", ta: "திங்கள்" },
    { key: "Tuesday", en: "Tuesday", ta: "செவ்வாய்" },
    { key: "Wednesday", en: "Wednesday", ta: "புதன்" },
    { key: "Thursday", en: "Thursday", ta: "வியாழன்" },
    { key: "Friday", en: "Friday", ta: "வெள்ளி" },
    { key: "Saturday", en: "Saturday", ta: "சனி" },
    { key: "Sunday", en: "Sunday", ta: "ஞாயிறு" }
  ];
  const useDays = (days && days.length) ? days : defaultDays;

  backdrop.innerHTML = `
    <div class="whatsapp-modal" role="dialog" aria-modal="true" aria-labelledby="waModalTitle">
      <div class="whatsapp-modal-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:38px;height:38px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.25);flex-shrink:0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 16.59c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.04 8.04 0 01-1.23-4.28c0-4.46 3.63-8.09 8.09-8.09 2.16 0 4.19.84 5.72 2.37 1.53 1.53 2.37 3.56 2.37 5.72 0 4.46-3.63 8.14-8.16 8.14zm4.44-6.09c-.24-.12-1.44-.71-1.66-.79-.22-.09-.39-.12-.55.12-.17.24-.64.79-.79.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.14.17-.24.25-.4.08-.17.04-.31-.02-.43-.07-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.24-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
            </svg>
          </div>
          <div>
            <h3 id="waModalTitle" style="margin:0;font-size:1.15rem;font-weight:700;color:#ffffff">
              ${isTa ? '📲 உணவு அட்டவணை WhatsApp-ல் அனுப்ப' : '📲 Send Meal Plan to WhatsApp'}
            </h3>
            <small style="color:rgba(255,255,255,0.88);font-size:12px;display:block">
              ${isTa ? 'திங்கள் என்ன உணவு, செவ்வாய் என்ன உணவு என மெசேஜ் வடிவில் வரும்' : 'Day-by-day food timetable formatted ready for WhatsApp'}
            </small>
          </div>
        </div>
        <button id="waCloseBtn" type="button" aria-label="Close" style="background:rgba(255,255,255,0.15);border:none;color:#ffffff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s">✕</button>
      </div>

      <div style="padding:18px 20px;overflow-y:auto;flex:1">
        <!-- Scope / Day Selector -->
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            🗓️ ${isTa ? 'எந்த நாளின் உணவு திட்டம் அனுப்ப வேண்டும்?' : 'Select Plan Scope / Day'}:
          </label>
          <select id="waDaySelect" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
            <option value="all" ${activeDay === 'all' ? 'selected' : ''}>🌟 ${isTa ? 'முழு வார உணவு திட்டம் (திங்கள் – ஞாயிறு)' : 'Full Week Plan (Monday – Sunday)'}</option>
            <option value="today" ${activeDay === 'today' ? 'selected' : ''}>⚡ ${isTa ? 'இன்றைய உணவு திட்டம் மட்டும் (Today Only)' : 'Today\'s Meals Only'}</option>
            ${useDays.map(d => `<option value="${esc(d.key)}" ${d.key.toLowerCase() === activeDay.toLowerCase() ? 'selected' : ''}>🗓️ ${isTa ? d.ta + ' (' + d.en + ')' : d.en}</option>`).join("")}
          </select>
        </div>

        <!-- Include Groceries Toggle -->
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;padding:10px 14px;background:var(--panel-alt);border:1px solid var(--line);border-radius:10px">
          <div>
            <strong style="font-size:13px;display:block;color:var(--text)">
              🛒 ${isTa ? 'தேவையான மளிகைப் பொருட்களையும் இணைக்க' : 'Also Include Grocery Items to Buy'}
            </strong>
            <small class="muted" style="font-size:11.5px">
              ${isTa ? 'உணவு அட்டவணையின் கீழே வாங்க வேண்டிய பொருட்களின் பட்டியலும் வரும்' : 'Appends required ingredients list at bottom of message'}
            </small>
          </div>
          <input type="checkbox" id="waGroceriesToggle" style="width:20px;height:20px;cursor:pointer">
        </div>

        <!-- Phone Number Field -->
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            📱 ${isTa ? 'வாட்ஸ்அப் மொபைல் எண் (விருப்பத்தேர்வு - உங்களுக்கு அல்லது குடும்பத்திற்கு):' : 'WhatsApp Phone Number (Optional - Direct Chat):'}
          </label>
          <div style="display:flex;gap:8px">
            <select id="waCountryCode" style="width:95px;padding:9px 8px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:700">
              <option value="91" selected>🇮🇳 +91</option>
              <option value="1">🇺🇸 +1</option>
              <option value="44">🇬🇧 +44</option>
              <option value="65">🇸🇬 +65</option>
              <option value="60">🇲🇾 +60</option>
              <option value="971">🇦🇪 +971</option>
              <option value="94">🇱🇰 +94</option>
              <option value="61">🇦🇺 +61</option>
            </select>
            <input id="waPhoneInput" type="tel" value="${esc(savedPhone)}" placeholder="${isTa ? '10 இலக்க எண் (எ.கா. 9876543210)' : '10-digit mobile number (e.g. 9876543210)'}" style="flex:1;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px">
          </div>
          <small style="color:var(--muted);font-size:11px;display:block;margin-top:4px">
            💡 ${isTa ? 'உங்கள் எண்ணை உள்ளிட்டால் உடனடியாக உங்களுக்கு வாட்ஸ்அப் மெசேஜ் வரும். எண் விடப்பட்டால் வாட்ஸ்அப் திறந்து எவருக்கும் பகிரலாம்.' : 'Enter phone to message yourself or family directly. If blank, WhatsApp contact/group picker opens.'}
          </small>
        </div>

        <!-- WhatsApp Chat Bubble Preview -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="font-size:12.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px">
              <span>💬</span> ${isTa ? 'வாட்ஸ்அப் மெசேஜ் முன்னோட்டம் (Live Preview):' : 'WhatsApp Message Preview:'}
            </label>
            <span id="waItemCountBadge" class="pill" style="font-size:11px;padding:2px 8px">0 meals</span>
          </div>
          <div class="whatsapp-chat-preview">
            <div id="waPreviewBubble" class="whatsapp-bubble"></div>
          </div>
        </div>
      </div>

      <div style="padding:14px 20px;background:var(--panel-alt);border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end">
        <button id="waCopyBtn" type="button" class="btn alt" style="font-weight:700;display:inline-flex;align-items:center;gap:6px">
          📋 ${isTa ? 'மெசேஜ் காப்பி செய்க' : 'Copy Message'}
        </button>
        <button id="waSendBtn" type="button" class="btn" style="background:#25D366;color:#ffffff;border:none;font-weight:700;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(37,211,102,0.4)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 16.59c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.04 8.04 0 01-1.23-4.28c0-4.46 3.63-8.09 8.09-8.09 2.16 0 4.19.84 5.72 2.37 1.53 1.53 2.37 3.56 2.37 5.72 0 4.46-3.63 8.14-8.16 8.14zm4.44-6.09c-.24-.12-1.44-.71-1.66-.79-.22-.09-.39-.12-.55.12-.17.24-.64.79-.79.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.14.17-.24.25-.4.08-.17.04-.31-.02-.43-.07-.12-.55-1.33-.76-1.82-.2-.48-.41-.41-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.24-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
          </svg>
          ${isTa ? 'WhatsApp-ல் அனுப்புக ➔' : 'Send to WhatsApp ➔'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  function updatePreview() {
    const res = formatMealPlanForWhatsApp({
      weeklyPlan,
      allRecipes,
      days: useDays,
      mealTypes,
      dayFilter: activeDay,
      includeGroceries,
      excludedIngredients,
      customItems
    });
    const bubble = document.getElementById("waPreviewBubble");
    if (bubble) bubble.textContent = res.text;

    const badge = document.getElementById("waItemCountBadge");
    if (badge) badge.textContent = `${res.totalMealsCount} meals`;
    return res.text;
  }

  updatePreview();

  const closeBtn = document.getElementById("waCloseBtn");
  const daySelect = document.getElementById("waDaySelect");
  const groceriesToggle = document.getElementById("waGroceriesToggle");
  const copyBtn = document.getElementById("waCopyBtn");
  const sendBtn = document.getElementById("waSendBtn");
  const phoneInput = document.getElementById("waPhoneInput");
  const countryCodeSelect = document.getElementById("waCountryCode");

  const closeModal = () => backdrop.remove();
  if (closeBtn) closeBtn.onclick = closeModal;
  backdrop.onclick = e => { if (e.target === backdrop) closeModal(); };

  if (daySelect) {
    daySelect.onchange = () => {
      activeDay = daySelect.value;
      updatePreview();
    };
  }

  if (groceriesToggle) {
    groceriesToggle.onchange = () => {
      includeGroceries = groceriesToggle.checked;
      updatePreview();
    };
  }

  if (phoneInput) {
    phoneInput.oninput = () => {
      const clean = phoneInput.value.replace(/[^0-9]/g, "");
      localStorage.setItem("cookshare_wa_phone", clean);
    };
  }

  if (copyBtn) {
    copyBtn.onclick = async () => {
      const text = updatePreview();
      try {
        await navigator.clipboard.writeText(text);
        showToast(isTa ? "✅ வாட்ஸ்அப் மெசேஜ் காப்பி செய்யப்பட்டது!" : "✅ WhatsApp message copied to clipboard!", "success");
      } catch {
        prompt(isTa ? "மெசேஜை காப்பி செய்யவும்:" : "Copy text below:", text);
      }
    };
  }

  if (sendBtn) {
    sendBtn.onclick = () => {
      const text = updatePreview();
      let phone = phoneInput ? phoneInput.value.replace(/[^0-9]/g, "") : "";
      let cc = countryCodeSelect ? countryCodeSelect.value.replace(/[^0-9]/g, "") : "91";

      if (phone) {
        localStorage.setItem("cookshare_wa_phone", phone);
      }

      let waUrl = "";
      if (phone) {
        let fullPhone = phone;
        if (phone.length === 10) {
          fullPhone = cc + phone;
        }
        waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(fullPhone)}&text=${encodeURIComponent(text)}`;
      } else {
        waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      }

      showToast(isTa ? "🚀 WhatsApp திறக்கப்படுகிறது..." : "🚀 Opening WhatsApp...", "info");
      window.open(waUrl, "_blank");
    };
  }
}

// ----------------------------------------------------
// UNIVERSAL EMAIL MEAL PLAN & GROCERY SHARING ENGINE
// ----------------------------------------------------

function formatMealPlanForEmail({
  weeklyPlan = {},
  allRecipes = [],
  days = [],
  mealTypes = [],
  dayFilter = "all",
  includeGroceries = false,
  excludedIngredients = [],
  customItems = []
}) {
  const isTa = lang() === "ta";

  const defaultDays = [
    { key: "Monday", en: "Monday", ta: "திங்கள்" },
    { key: "Tuesday", en: "Tuesday", ta: "செவ்வாய்" },
    { key: "Wednesday", en: "Wednesday", ta: "புதன்" },
    { key: "Thursday", en: "Thursday", ta: "வியாழன்" },
    { key: "Friday", en: "Friday", ta: "வெள்ளி" },
    { key: "Saturday", en: "Saturday", ta: "சனி" },
    { key: "Sunday", en: "Sunday", ta: "ஞாயிறு" }
  ];

  const defaultMealTypes = [
    { key: "Breakfast", en: "Breakfast", ta: "காலை உணவு", icon: "🌅" },
    { key: "Lunch", en: "Lunch", ta: "மதிய உணவு", icon: "☀️" },
    { key: "Dinner", en: "Dinner", ta: "இரவு உணவு", icon: "🌙" },
    { key: "Snack", en: "Snack", ta: "சிற்றுண்டி", icon: "☕" }
  ];

  const useDays = (days && days.length) ? days : defaultDays;
  const useMealTypes = (mealTypes && mealTypes.length) ? mealTypes : defaultMealTypes;

  let activeDays = useDays;
  let scopeLabel = isTa ? "முழு வார உணவு" : "Weekly Meal Plan";

  if (dayFilter === "today") {
    const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayKey = dayMap[new Date().getDay()];
    activeDays = useDays.filter(d => d.key.toLowerCase() === todayKey.toLowerCase());
    const matched = activeDays[0] || { key: todayKey, en: todayKey, ta: todayKey };
    scopeLabel = isTa ? `${matched.ta} (இன்றைய உணவு)` : `${matched.en} (Today's Meals)`;
  } else if (dayFilter && dayFilter !== "all") {
    activeDays = useDays.filter(d => d.key.toLowerCase() === dayFilter.toLowerCase());
    const matched = activeDays[0];
    if (matched) {
      scopeLabel = isTa ? `${matched.ta} உணவு அட்டவணை` : `${matched.en} Meal Plan`;
    }
  }

  const todayStr = new Date().toLocaleDateString(isTa ? "ta-IN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const subject = `🍽️ CookShare: ${scopeLabel} (${todayStr})`;

  let body = isTa
    ? `🍽️ குக்ஷேர் - ${scopeLabel}\n📅 தேதி: ${todayStr}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    : `🍽️ CookShare - ${scopeLabel}\n📅 Date: ${todayStr}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  let totalMealsCount = 0;
  const recipesToIncludeInGroceries = [];

  activeDays.forEach(day => {
    const dayLabel = isTa
      ? `🗓️ ${day.ta.toUpperCase()} / ${day.en.toUpperCase()}`
      : `🗓️ ${day.en.toUpperCase()}`;

    let dayContent = `${dayLabel}\n`;
    let dayMealCount = 0;

    useMealTypes.forEach(meal => {
      const slotKey = `${day.key}_${meal.key}`;
      const recipeId = weeklyPlan[slotKey];
      if (recipeId) {
        const r = allRecipes.find(x => x.id === recipeId);
        if (r) {
          dayMealCount++;
          totalMealsCount++;
          recipesToIncludeInGroceries.push(r);
          const mealTitle = isTa ? (r.title_ta || r.title) : r.title;
          const mealName = isTa ? meal.ta : meal.en;
          const totalTime = (r.prep_minutes || 0) + (r.cook_minutes || 0);
          const timeBadge = totalTime > 0 ? ` (${totalTime} mins)` : "";
          dayContent += `  ${meal.icon} ${mealName}: ${mealTitle}${timeBadge}\n`;
        }
      }
    });

    if (dayMealCount === 0) {
      dayContent += `  ${isTa ? '(உணவு திட்டமிடப்படவில்லை)' : '(No meals scheduled)'}\n`;
    }

    body += `${dayContent}\n`;
  });

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `📊 ${isTa ? 'திட்டமிடப்பட்ட மொத்த உணவுகள்' : 'Total Planned Meals'}: ${totalMealsCount}\n`;

  // Optional Groceries
  if (includeGroceries && recipesToIncludeInGroceries.length > 0) {
    body += `\n🛒 ${isTa ? 'தேவையான மளிகைப் பொருட்கள் (Grocery Checklist to Buy)' : 'Grocery Checklist to Buy'}:\n`;
    const excludedNorm = (excludedIngredients || []).map(e => String(e).toLowerCase().trim());
    const ingsMap = {};

    recipesToIncludeInGroceries.forEach(r => {
      if (r.ingredients && Array.isArray(r.ingredients)) {
        r.ingredients.forEach(ing => {
          const norm = (ing.name || "").trim().toLowerCase();
          if (!norm || excludedNorm.includes(norm)) return;
          const displayName = isTa ? (ing.name_ta || ing.name) : ing.name;
          const unitStr = (isTa ? ing.unit_ta : ing.unit) || ing.unit || "";
          if (!ingsMap[norm]) {
            ingsMap[norm] = {
              name: displayName,
              quantity: ing.quantity || "",
              unit: unitStr
            };
          } else {
            const num1 = parseFloat(ingsMap[norm].quantity);
            const num2 = parseFloat(ing.quantity);
            if (!isNaN(num1) && !isNaN(num2)) {
              ingsMap[norm].quantity = (num1 + num2).toString();
            }
          }
        });
      }
    });

    (customItems || []).forEach(c => {
      const norm = (c.name || "").trim().toLowerCase();
      if (!norm || excludedNorm.includes(norm)) return;
      if (!ingsMap[norm]) {
        ingsMap[norm] = {
          name: c.name,
          quantity: c.quantity || "",
          unit: c.unit || ""
        };
      }
    });

    const items = Object.values(ingsMap);
    if (items.length > 0) {
      items.forEach(it => {
        const qtyStr = it.quantity ? ` - ${it.quantity} ${it.unit || ''}`.trim() : "";
        body += `  ◻ ${it.name}${qtyStr}\n`;
      });
      body += `\n`;
    }
  }

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `✨ ${isTa ? 'CookShare சமையல் தளம் வழியாக திட்டமிடப்பட்டது' : 'Planned via CookShare Bilingual Culinary Platform'}\n`;
  body += `🌐 ${window.location.origin}/planner.html\n`;

  return { subject, body, totalMealsCount };
}

function openEmailMealPlanModal({
  weeklyPlan = {},
  allRecipes = [],
  days = [],
  mealTypes = [],
  defaultDay = "all",
  excludedIngredients = [],
  customItems = []
}) {
  const isTa = lang() === "ta";
  let activeDay = defaultDay || "all";
  let includeGroceries = false;
  const savedEmail = localStorage.getItem("cookshare_email_to") || (typeof getUser === "function" && getUser() ? getUser().email : "") || "";

  // Remove any existing modal
  const existing = document.getElementById("cookshare-email-modal");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "cookshare-email-modal";
  backdrop.className = "whatsapp-modal-backdrop";

  const defaultDays = [
    { key: "Monday", en: "Monday", ta: "திங்கள்" },
    { key: "Tuesday", en: "Tuesday", ta: "செவ்வாய்" },
    { key: "Wednesday", en: "Wednesday", ta: "புதன்" },
    { key: "Thursday", en: "Thursday", ta: "வியாழன்" },
    { key: "Friday", en: "Friday", ta: "வெள்ளி" },
    { key: "Saturday", en: "Saturday", ta: "சனி" },
    { key: "Sunday", en: "Sunday", ta: "ஞாயிறு" }
  ];
  const useDays = (days && days.length) ? days : defaultDays;

  backdrop.innerHTML = `
    <div class="whatsapp-modal" role="dialog" aria-modal="true" aria-labelledby="emailModalTitle">
      <div class="email-modal-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.2);flex-shrink:0;font-size:20px">
            📧
          </div>
          <div>
            <h3 id="emailModalTitle" style="margin:0;font-size:1.15rem;font-weight:700;color:#ffffff">
              ${isTa ? "📧 உணவு அட்டவணை Email-ல் அனுப்ப" : "📧 Send Meal Plan via Email"}
            </h3>
            <small style="color:rgba(255,255,255,0.88);font-size:12px;display:block">
              ${isTa ? "Gmail, Outlook அல்லது உங்கள் மெயில் இன்பாக்சிற்கு நேரடியாக அனுப்பலாம்" : "Send day-by-day timetable to Gmail, Outlook, or any email inbox"}
            </small>
          </div>
        </div>
        <button id="emailCloseBtn" type="button" aria-label="Close" style="background:rgba(255,255,255,0.2);border:none;color:#ffffff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s">✕</button>
      </div>

      <div style="padding:18px 20px;overflow-y:auto;flex:1">
        <!-- Recipient Email -->
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            ✉️ ${isTa ? "பெறுநர் ஈமெயில் முகவரி (To Email Address):" : "Recipient Email (To):"}
          </label>
          <input id="emailToInput" type="email" value="${esc(savedEmail)}" placeholder="${isTa ? 'எ.கா. myemail@gmail.com' : 'e.g. name@example.com'}" style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
          <small style="color:var(--muted);font-size:11px;display:block;margin-top:3px">
            💡 ${isTa ? "உங்கள் சொந்த ஈமெயில் அல்லது குடும்பத்தினர் ஈமெயிலை உள்ளிடலாம்." : "Enter your email or family email. Leave blank to choose recipient in your mail app."}
          </small>
        </div>

        <!-- Subject Field -->
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            🏷️ ${isTa ? "மின்னஞ்சல் தலைப்பு (Subject):" : "Email Subject:"}
          </label>
          <input id="emailSubjectInput" type="text" style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
        </div>

        <!-- Scope / Day Selector -->
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            🗓️ ${isTa ? "எந்த நாளின் உணவு திட்டம் அனுப்ப வேண்டும்?" : "Select Plan Scope / Day"}:
          </label>
          <select id="emailDaySelect" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
            <option value="all" ${activeDay === 'all' ? 'selected' : ''}>🌟 ${isTa ? 'முழு வார உணவு திட்டம் (திங்கள் – ஞாயிறு)' : 'Full Week Plan (Monday – Sunday)'}</option>
            <option value="today" ${activeDay === 'today' ? 'selected' : ''}>⚡ ${isTa ? 'இன்றைய உணவு திட்டம் மட்டும் (Today Only)' : 'Today\'s Meals Only'}</option>
            ${useDays.map(d => `<option value="${esc(d.key)}" ${d.key.toLowerCase() === activeDay.toLowerCase() ? 'selected' : ''}>🗓️ ${isTa ? d.ta + ' (' + d.en + ')' : d.en}</option>`).join("")}
          </select>
        </div>

        <!-- Include Groceries Toggle -->
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;padding:10px 14px;background:var(--panel-alt);border:1px solid var(--line);border-radius:10px">
          <div>
            <strong style="font-size:13px;display:block;color:var(--text)">
              🛒 ${isTa ? "தேவையான மளிகைப் பொருட்களையும் இணைக்க" : "Also Include Grocery Items to Buy"}
            </strong>
            <small class="muted" style="font-size:11.5px">
              ${isTa ? "ஈமெயிலின் கீழே வாங்க வேண்டிய மளிகைப் பொருட்களின் பட்டியலும் வரும்" : "Appends required ingredients list at bottom of email"}
            </small>
          </div>
          <input type="checkbox" id="emailGroceriesToggle" style="width:20px;height:20px;cursor:pointer">
        </div>

        <!-- Email Live Preview -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="font-size:12.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px">
              <span>📄</span> ${isTa ? "ஈமெயில் முன்னோட்டம் (Live Email Preview):" : "Email Message Preview:"}
            </label>
            <span id="emailItemCountBadge" class="pill" style="font-size:11px;padding:2px 8px">0 meals</span>
          </div>
          <div id="emailPreviewBox" class="email-preview-box"></div>
        </div>
      </div>

      <div style="padding:14px 20px;background:var(--panel-alt);border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end">
        <button id="emailCopyBtn" type="button" class="btn alt" style="font-weight:700;display:inline-flex;align-items:center;gap:6px">
          📋 ${isTa ? "மெயில் காப்பி செய்" : "Copy Email"}
        </button>
        <button id="emailMailtoBtn" type="button" class="btn alt" style="font-weight:700;display:inline-flex;align-items:center;gap:6px" title="Open with your default mail app (Outlook, Apple Mail, etc.)">
          📬 ${isTa ? "Default Mail App" : "Mail App"}
        </button>
        <button id="emailGmailBtn" type="button" class="btn email-btn" style="display:inline-flex;align-items:center;gap:8px" title="Directly compose and send in Gmail web">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          ${isTa ? "Gmail-ல் திறக்க ➔" : "Send via Gmail ➔"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  function updatePreview() {
    const res = formatMealPlanForEmail({
      weeklyPlan,
      allRecipes,
      days: useDays,
      mealTypes,
      dayFilter: activeDay,
      includeGroceries,
      excludedIngredients,
      customItems
    });

    const subInput = document.getElementById("emailSubjectInput");
    if (subInput && (!subInput.dataset.userEdited || subInput.value === "")) {
      subInput.value = res.subject;
    }

    const preview = document.getElementById("emailPreviewBox");
    if (preview) preview.textContent = res.body;

    const badge = document.getElementById("emailItemCountBadge");
    if (badge) badge.textContent = `${res.totalMealsCount} meals`;

    return { subject: subInput ? subInput.value : res.subject, body: res.body };
  }

  updatePreview();

  const closeBtn = document.getElementById("emailCloseBtn");
  const daySelect = document.getElementById("emailDaySelect");
  const groceriesToggle = document.getElementById("emailGroceriesToggle");
  const copyBtn = document.getElementById("emailCopyBtn");
  const mailtoBtn = document.getElementById("emailMailtoBtn");
  const gmailBtn = document.getElementById("emailGmailBtn");
  const toInput = document.getElementById("emailToInput");
  const subInput = document.getElementById("emailSubjectInput");

  const closeModal = () => backdrop.remove();
  if (closeBtn) closeBtn.onclick = closeModal;
  backdrop.onclick = e => { if (e.target === backdrop) closeModal(); };

  if (toInput) {
    toInput.oninput = () => {
      localStorage.setItem("cookshare_email_to", toInput.value.trim());
    };
  }

  if (subInput) {
    subInput.oninput = () => {
      subInput.dataset.userEdited = "true";
    };
  }

  if (daySelect) {
    daySelect.onchange = () => {
      activeDay = daySelect.value;
      if (subInput) delete subInput.dataset.userEdited;
      updatePreview();
    };
  }

  if (groceriesToggle) {
    groceriesToggle.onchange = () => {
      includeGroceries = groceriesToggle.checked;
      updatePreview();
    };
  }

  if (copyBtn) {
    copyBtn.onclick = async () => {
      const { subject, body } = updatePreview();
      const fullText = `Subject: ${subject}\n\n${body}`;
      try {
        await navigator.clipboard.writeText(fullText);
        showToast(isTa ? "✅ ஈமெயில் செய்தி காப்பி செய்யப்பட்டது!" : "✅ Email content copied to clipboard!", "success");
      } catch {
        prompt(isTa ? "செய்தியை காப்பி செய்யவும்:" : "Copy text below:", fullText);
      }
    };
  }

  if (mailtoBtn) {
    mailtoBtn.onclick = () => {
      const { subject, body } = updatePreview();
      const to = toInput ? toInput.value.trim() : "";
      const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast(isTa ? "📬 Mail App திறக்கப்படுகிறது..." : "📬 Opening default mail app...", "info");
      window.location.href = mailtoUrl;
    };
  }

  if (gmailBtn) {
    gmailBtn.onclick = () => {
      const { subject, body } = updatePreview();
      const to = toInput ? toInput.value.trim() : "";
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast(isTa ? "🚀 Gmail திறக்கப்படுகிறது..." : "🚀 Opening Gmail compose...", "info");
      window.open(gmailUrl, "_blank");
    };
  }
}

// ----------------------------------------------------
// UNIVERSAL EMAIL GROCERY LIST SHARING ENGINE
// ----------------------------------------------------

function formatShoppingListForEmail({
  items = [],
  title = "",
  dishFilter = "all",
  onlyPending = false
}) {
  const isTa = lang() === "ta";
  let filtered = (items || []).slice();

  if (dishFilter && dishFilter !== "all" && dishFilter !== "All Dishes") {
    filtered = filtered.filter(i => {
      const d = String(i.dish_name || i.category || "").trim().toLowerCase();
      return d === dishFilter.trim().toLowerCase();
    });
  }

  if (onlyPending) {
    filtered = filtered.filter(i => !i.purchased);
  }

  const todayStr = new Date().toLocaleDateString(isTa ? "ta-IN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const subject = isTa
    ? `🛒 CookShare: மளிகைப் பட்டியல் (${todayStr})`
    : `🛒 CookShare: Grocery & Shopping Checklist (${todayStr})`;

  let body = isTa
    ? `🛒 குக்ஷேர் - மளிகைப் பட்டியல்\n📅 தேதி: ${todayStr}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    : `🛒 CookShare - Grocery & Shopping List\n📅 Date: ${todayStr}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Group by dish or category
  const groups = {};
  filtered.forEach(item => {
    const g = item.dish_name || item.category || (isTa ? "பொதுவான மளிகை" : "General Groceries");
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  Object.keys(groups).forEach(groupName => {
    body += `🍽️ ${groupName.toUpperCase()} (${groups[groupName].length} items)\n`;
    groups[groupName].forEach(i => {
      const check = i.purchased ? "☑" : "◻";
      const name = i.name || "";
      const qty = i.quantity ? String(i.quantity).trim() : "";
      const unit = i.unit ? String(i.unit).trim() : "";
      let qtyStr = "";
      if (qty && unit) qtyStr = ` - ${qty} ${unit}`;
      else if (qty) qtyStr = ` - ${qty}`;
      else if (unit) qtyStr = ` - ${unit}`;

      body += `  ${check} ${name}${qtyStr}\n`;
    });
    body += `\n`;
  });

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `📊 ${isTa ? 'மொத்த பொருட்கள்' : 'Total Items'}: ${filtered.length}\n`;
  body += `✨ ${isTa ? 'CookShare சமையல் தளம் வழியாக பகிரப்பட்டது' : 'Shared via CookShare Culinary Platform'}\n`;
  body += `🌐 ${window.location.origin}/shopping.html\n`;

  return { subject, body, count: filtered.length };
}

function openEmailModal({
  title = "",
  items = [],
  dishes = [],
  defaultDish = "all",
  showPendingToggle = true
}) {
  const isTa = lang() === "ta";
  let activeDish = defaultDish || "all";
  let onlyPending = false;
  const savedEmail = localStorage.getItem("cookshare_email_to") || (typeof getUser === "function" && getUser() ? getUser().email : "") || "";

  // Remove existing
  const existing = document.getElementById("cookshare-email-modal");
  if (existing) existing.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "cookshare-email-modal";
  backdrop.className = "whatsapp-modal-backdrop";

  const dishOptions = (dishes && dishes.length > 0) ? `
    <div style="margin-bottom:12px">
      <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
        🍽 ${isTa ? 'டிஷ் / மெனு வாரியாக தேர்வு' : 'Filter by Dish / Menu'}:
      </label>
      <select id="emailDishSelect" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
        <option value="all">${isTa ? '🍽 அனைத்து உணவுகள் (All Dishes)' : '🍽 All Dishes'}</option>
        ${dishes.map(d => `<option value="${esc(d)}" ${d.toLowerCase() === activeDish.toLowerCase() ? 'selected' : ''}>${esc(d)}</option>`).join("")}
      </select>
    </div>
  ` : "";

  backdrop.innerHTML = `
    <div class="whatsapp-modal" role="dialog" aria-modal="true" aria-labelledby="emailModalTitle">
      <div class="email-modal-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.2);flex-shrink:0;font-size:20px">
            📧
          </div>
          <div>
            <h3 id="emailModalTitle" style="margin:0;font-size:1.15rem;font-weight:700;color:#ffffff">
              ${isTa ? "📧 மளிகைப் பட்டியல் Email-ல் அனுப்ப" : "📧 Share Grocery List via Email"}
            </h3>
            <small style="color:rgba(255,255,255,0.88);font-size:12px;display:block">
              ${isTa ? "பொருட்கள் பட்டியல் தயாராக மெயில் வடிவில் அனுப்பப்படும்" : "Shopping list formatted ready to send to any inbox"}
            </small>
          </div>
        </div>
        <button id="emailCloseBtn" type="button" aria-label="Close" style="background:rgba(255,255,255,0.2);border:none;color:#ffffff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s">✕</button>
      </div>

      <div style="padding:18px 20px;overflow-y:auto;flex:1">
        <!-- Recipient Email -->
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            ✉️ ${isTa ? "பெறுநர் ஈமெயில் முகவரி (To Email Address):" : "Recipient Email (To):"}
          </label>
          <input id="emailToInput" type="email" value="${esc(savedEmail)}" placeholder="${isTa ? 'எ.கா. myemail@gmail.com' : 'e.g. name@example.com'}" style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
        </div>

        <!-- Subject -->
        <div style="margin-bottom:12px">
          <label style="display:block;font-size:12.5px;font-weight:700;margin-bottom:6px;color:var(--text)">
            🏷️ ${isTa ? "மின்னஞ்சல் தலைப்பு (Subject):" : "Email Subject:"}
          </label>
          <input id="emailSubjectInput" type="text" style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--input-bg);color:var(--text);font-size:13px;font-weight:600">
        </div>

        ${dishOptions}

        ${showPendingToggle ? `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;padding:10px 14px;background:var(--panel-alt);border:1px solid var(--line);border-radius:10px">
            <div>
              <strong style="font-size:13px;display:block;color:var(--text)">
                🛒 ${isTa ? "வாங்க வேண்டியவை மட்டும் (Pending Only)" : "Only Pending Items"}
              </strong>
              <small class="muted" style="font-size:11.5px">
                ${isTa ? "ஏற்கனவே வாங்கிய பொருட்களை தவிர்க்க" : "Hides already purchased items"}
              </small>
            </div>
            <input type="checkbox" id="emailPendingToggle" style="width:20px;height:20px;cursor:pointer">
          </div>
        ` : ""}

        <!-- Live Preview -->
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label style="font-size:12.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:6px">
              <span>📄</span> ${isTa ? "ஈமெயில் முன்னோட்டம் (Live Preview):" : "Email Message Preview:"}
            </label>
            <span id="emailItemCountBadge" class="pill" style="font-size:11px;padding:2px 8px">0 items</span>
          </div>
          <div id="emailPreviewBox" class="email-preview-box"></div>
        </div>
      </div>

      <div style="padding:14px 20px;background:var(--panel-alt);border-top:1px solid var(--line);display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end">
        <button id="emailCopyBtn" type="button" class="btn alt" style="font-weight:700;display:inline-flex;align-items:center;gap:6px">
          📋 ${isTa ? "மெயில் காப்பி செய்" : "Copy Email"}
        </button>
        <button id="emailMailtoBtn" type="button" class="btn alt" style="font-weight:700;display:inline-flex;align-items:center;gap:6px">
          📬 ${isTa ? "Default Mail App" : "Mail App"}
        </button>
        <button id="emailGmailBtn" type="button" class="btn email-btn" style="display:inline-flex;align-items:center;gap:8px">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          ${isTa ? "Gmail-ல் திறக்க ➔" : "Send via Gmail ➔"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  function updatePreview() {
    const res = formatShoppingListForEmail({
      items,
      title,
      dishFilter: activeDish,
      onlyPending
    });

    const subInput = document.getElementById("emailSubjectInput");
    if (subInput && (!subInput.dataset.userEdited || subInput.value === "")) {
      subInput.value = res.subject;
    }

    const preview = document.getElementById("emailPreviewBox");
    if (preview) preview.textContent = res.body;

    const badge = document.getElementById("emailItemCountBadge");
    if (badge) badge.textContent = `${res.count} items`;

    return { subject: subInput ? subInput.value : res.subject, body: res.body };
  }

  updatePreview();

  const closeBtn = document.getElementById("emailCloseBtn");
  const dishSelect = document.getElementById("emailDishSelect");
  const pendingToggle = document.getElementById("emailPendingToggle");
  const copyBtn = document.getElementById("emailCopyBtn");
  const mailtoBtn = document.getElementById("emailMailtoBtn");
  const gmailBtn = document.getElementById("emailGmailBtn");
  const toInput = document.getElementById("emailToInput");
  const subInput = document.getElementById("emailSubjectInput");

  const closeModal = () => backdrop.remove();
  if (closeBtn) closeBtn.onclick = closeModal;
  backdrop.onclick = e => { if (e.target === backdrop) closeModal(); };

  if (toInput) {
    toInput.oninput = () => {
      localStorage.setItem("cookshare_email_to", toInput.value.trim());
    };
  }

  if (subInput) {
    subInput.oninput = () => {
      subInput.dataset.userEdited = "true";
    };
  }

  if (dishSelect) {
    dishSelect.onchange = () => {
      activeDish = dishSelect.value;
      if (subInput) delete subInput.dataset.userEdited;
      updatePreview();
    };
  }

  if (pendingToggle) {
    pendingToggle.onchange = () => {
      onlyPending = pendingToggle.checked;
      updatePreview();
    };
  }

  if (copyBtn) {
    copyBtn.onclick = async () => {
      const { subject, body } = updatePreview();
      const fullText = `Subject: ${subject}\n\n${body}`;
      try {
        await navigator.clipboard.writeText(fullText);
        showToast(isTa ? "✅ ஈமெயில் செய்தி காப்பி செய்யப்பட்டது!" : "✅ Email content copied to clipboard!", "success");
      } catch {
        prompt(isTa ? "செய்தியை காப்பி செய்யவும்:" : "Copy text below:", fullText);
      }
    };
  }

  if (mailtoBtn) {
    mailtoBtn.onclick = () => {
      const { subject, body } = updatePreview();
      const to = toInput ? toInput.value.trim() : "";
      const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast(isTa ? "📬 Mail App திறக்கப்படுகிறது..." : "📬 Opening default mail app...", "info");
      window.location.href = mailtoUrl;
    };
  }

  if (gmailBtn) {
    gmailBtn.onclick = () => {
      const { subject, body } = updatePreview();
      const to = toInput ? toInput.value.trim() : "";
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showToast(isTa ? "🚀 Gmail திறக்கப்படுகிறது..." : "🚀 Opening Gmail compose...", "info");
      window.open(gmailUrl, "_blank");
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  mountHeader();
  applyLang();
  mountChefBot();
  updateNavShoppingBadge();
  syncGuestShoppingToCloud();
});

