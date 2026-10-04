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
    servings: "Servings", prepTime: "Prep", cookTime: "Cook", minutes: "min"
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
    servings: "நபர்கள்", prepTime: "தயாரிப்பு", cookTime: "சமையல்", minutes: "நிமிடம்"
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

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  mountHeader();
  applyLang();
  mountChefBot();
  updateNavShoppingBadge();
  syncGuestShoppingToCloud();
});

