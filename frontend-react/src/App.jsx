import { useEffect, useMemo, useState } from 'react'
import './App.css'

const defaultRecipes = [
  {
    id: 1,
    title: 'Coconut Lime Rice Bowl',
    title_ta: 'கோகோனா லைம் ரைஸ் பவுல்',
    description: 'A bright, comforting bowl with herb rice, greens, and roasted vegetables.',
    cuisine: 'Thai',
    difficulty: 'Easy',
    prep_minutes: 20,
    cook_minutes: 25,
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    author: 'Maya',
  },
  {
    id: 2,
    title: 'Spicy Paneer Tikka Wrap',
    title_ta: 'சிப்ஸ் பனீர் டிக்கா ராப்',
    description: 'Charred paneer wrapped in warm flatbread with mint yogurt and crunchy slaw.',
    cuisine: 'Indian',
    difficulty: 'Medium',
    prep_minutes: 25,
    cook_minutes: 18,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    author: 'Riya',
  },
  {
    id: 3,
    title: 'Mediterranean Chickpea Tray',
    title_ta: 'மெடிடரேனியன் சிக்பீன் ட்ரே',
    description: 'Roasted chickpeas, feta, peppers, and olives layered with herb dressing.',
    cuisine: 'Mediterranean',
    difficulty: 'Easy',
    prep_minutes: 18,
    cook_minutes: 30,
    image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    author: 'Nina',
  },
  {
    id: 4,
    title: 'Saffron Tomato Pasta',
    title_ta: 'சஃப்ரான் தக்காளி பாஸ்தா',
    description: 'Silky tomato sauce, garlic, roasted tomatoes, and a pinch of saffron.',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prep_minutes: 15,
    cook_minutes: 22,
    image_url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    author: 'Asha',
  },
]

const RECIPE_VIDEOS_MAP = {
  1: [ // AUTHENTIC CHETTINAD CHICKEN PEPPER MASALA
    {
      id: "dq3__hTaSLk",
      title: "செட்டிநாடு மிளகு சிக்கன் மசாலா / Chettinad Chicken Pepper Masala Recipe in Tamil",
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

function getYtThumbnail(url, defaultImg) {
  const vid = getYtVideoId(url);
  if (vid) {
    return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
  return defaultImg || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80";
}

function getRecipeVideos(r) {
  if (r.videos && Array.isArray(r.videos) && r.videos.length >= 5) {
    return r.videos.slice(0, 5).map(v => ({
      id: v.video_id || getYtVideoId(v.url || v.video_url),
      title: v.title,
      channel: v.channel_name || v.channel || "Tamil Cooking",
      url: v.url || v.video_url,
      thumbnail: v.thumbnail_url || getYtThumbnail(v.url || v.video_url, r.image_url)
    }));
  }
  if (r.id && RECIPE_VIDEOS_MAP[r.id]) {
    return RECIPE_VIDEOS_MAP[r.id];
  }
  const t = (r.title || "").toLowerCase();
  if (t.includes("dosa")) return RECIPE_VIDEOS_MAP[2];
  if (t.includes("biryani")) return RECIPE_VIDEOS_MAP[3];
  if (t.includes("paneer")) return RECIPE_VIDEOS_MAP[4];
  if (t.includes("sambar")) return RECIPE_VIDEOS_MAP[5];
  if (t.includes("chettinad") || t.includes("chicken")) return RECIPE_VIDEOS_MAP[1];
  if (t.includes("koozh") || t.includes("millet")) return RECIPE_VIDEOS_MAP[6];
  return RECIPE_VIDEOS_MAP[1];
}

const navItems = ['home', 'explore', 'upload', 'planner', 'community', 'profile', 'admin']

async function requestJson(path, options = {}) {
  const token = localStorage.getItem('cookshare_token')
  const headers = { ...(options.headers || {}) }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

function App() {
  const [activeView, setActiveView] = useState('home')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cookshare_user') || 'null')
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('cookshare_token') || '')
  const [recipes, setRecipes] = useState(defaultRecipes)
  const [favorites, setFavorites] = useState([])
  const [recent, setRecent] = useState([])
  const [shoppingList, setShoppingList] = useState([])
  const [adminStats, setAdminStats] = useState({ users: 18, recipes: 126, reviews: 342, recentAccesses: 48 })
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: 'demo@cookshare.com', password: 'cookshare123' })
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [notice, setNotice] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [carouselSlide, setCarouselSlide] = useState(0)

  const openRecipeModal = async (recipe) => {
    setCarouselSlide(0)
    try {
      const full = await requestJson(`/recipes/${recipe.id}`)
      setSelectedRecipe(full && full.id ? full : recipe)
    } catch {
      setSelectedRecipe(recipe)
    }
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('cookshare_token', token)
    } else {
      localStorage.removeItem('cookshare_token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('cookshare_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('cookshare_user')
    }
  }, [user])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (cuisine) params.set('cuisine', cuisine)

    requestJson(`/recipes?${params.toString()}`)
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setRecipes(data)
        }
      })
      .catch(() => {
        setRecipes(defaultRecipes)
      })
  }, [query, cuisine])

  useEffect(() => {
    if (!token) return

    Promise.all([
      requestJson('/users/me/recent').catch(() => []),
      requestJson('/users/me/favorites').catch(() => []),
      requestJson('/users/me/shopping-list').catch(() => []),
    ])
      .then(([recentData, favoriteData, shoppingData]) => {
        setRecent(recentData)
        setFavorites(favoriteData)
        setShoppingList(shoppingData)
      })
      .catch(() => {
        setRecent([])
        setFavorites([])
        setShoppingList([])
      })
  }, [token])

  const topRecipes = useMemo(() => recipes.slice(0, 4), [recipes])

  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    try {
      const path = authMode === 'login' ? '/auth/login' : '/auth/register'
      const payload = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password }

      const response = await requestJson(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.token) {
        setToken(response.token)
        setUser(response.user || { name: authForm.name || authForm.email.split('@')[0], email: authForm.email, role: 'USER' })
        setNotice(authMode === 'login' ? 'Welcome back to CookShare.' : 'Account created successfully.')
        setActiveView('home')
      }
    } catch (error) {
      setNotice(error.message)
    }
  }

  const handleLogout = () => {
    setToken('')
    setUser(null)
    setActiveView('home')
    setNotice('You were signed out.')
  }

  const handleAddToFavorites = async (recipeId) => {
    if (!token) {
      setActiveView('auth')
      setNotice('Login to save your favorite recipes.')
      return
    }

    try {
      await requestJson(`/users/me/favorites/${recipeId}`, { method: 'POST' })
      setNotice('Recipe saved to favorites.')
      const nextFavorites = await requestJson('/users/me/favorites')
      setFavorites(nextFavorites)
    } catch (error) {
      setNotice(error.message)
    }
  }

  const handleTogglePurchased = async (itemId, purchased) => {
    try {
      await requestJson(`/users/me/shopping-list/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ purchased: !purchased }),
      })

      const updated = await requestJson('/users/me/shopping-list')
      setShoppingList(updated)
    } catch (error) {
      setNotice(error.message)
    }
  }

  const renderHeader = () => (
    <header className="topbar">
      <div className="brand">CookShare</div>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className={activeView === item ? 'nav-link active' : 'nav-link'}
            onClick={() => setActiveView(item)}
          >
            {item === 'home' && 'Home'}
            {item === 'explore' && 'Explore'}
            {item === 'upload' && 'Upload'}
            {item === 'planner' && 'Planner'}
            {item === 'community' && 'Community'}
            {item === 'profile' && 'Profile'}
            {item === 'admin' && 'Admin'}
          </button>
        ))}
      </nav>
      <div className="top-actions">
        <button type="button" className="icon-btn">Search</button>
        {token && user ? (
          <>
            <span className="user-pill">{user.name ? user.name.split(' ')[0] : 'Chef'}</span>
            <button type="button" className="btn small" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button type="button" className="btn small" onClick={() => setActiveView('auth')}>Join now</button>
        )}
      </div>
    </header>
  )

  const renderHome = () => (
    <>
      <section className="hero-layout">
        <div className="hero-copy">
          <span className="pill">Smart kitchen companion</span>
          <h1>
            Cook deliciously.<br />
            <span>Share your story.</span>
          </h1>
          <p>
            Discover trending recipes, build weekly plans, and keep ingredients in sync across your kitchen and your community.
          </p>
          <div className="action-row">
            <button type="button" className="btn" onClick={() => setActiveView('explore')}>Explore recipes</button>
            <button type="button" className="btn btn-ghost" onClick={() => setActiveView('upload')}>Upload recipe</button>
          </div>
          <div className="mini-stats">
            <div>
              <strong>24K+</strong>
              <span>weekly cooks</span>
            </div>
            <div>
              <strong>1.8K</strong>
              <span>new recipes</span>
            </div>
            <div>
              <strong>92%</strong>
              <span>meal success</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
            alt="Chef preparing food"
          />
        </div>
      </section>

      <div className="section-head">
        <div>
          <span className="pill">Trending now</span>
          <h2>Fresh picks for your week</h2>
        </div>
        <button type="button" className="btn btn-ghost small" onClick={() => setActiveView('explore')}>View all</button>
      </div>
      <div className="recipe-grid recipe-grid-4">
        {topRecipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card" style={{ cursor: 'pointer' }} onClick={() => openRecipeModal(recipe)}>
            <div style={{ position: 'relative' }}>
              <img src={recipe.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554'} alt={recipe.title} />
              <span style={{ position: 'absolute', top: 10, right: 10, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 999, padding: '3px 8px', fontSize: 11, fontWeight: 800 }}>▶ 5 Videos</span>
            </div>
            <div className="card-body">
              <span className="eyebrow">{recipe.cuisine || 'Global'}</span>
              <h3>{recipe.title}</h3>
              <p>{recipe.description || 'Fresh, flavorful and easy to recreate.'}</p>
              <div className="meta-row">
                <span>⭐ {recipe.rating || 4.8}</span>
                <span>{recipe.difficulty || 'Easy'}</span>
                <span>{recipe.prep_minutes + recipe.cook_minutes || 35} min</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="recent-panel">
        <div className="panel-header">
          <h3>Recently accessed</h3>
          <span className="status-tag">Updated today</span>
        </div>
        <div className="recent-list">
          {(recent.length ? recent : [{ id: 1, title: 'Chickpea Salad Bowl', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' }, { id: 2, title: 'Cedar Tikka', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' }]).map((item) => (
            <div key={item.id} className="recent-item">
              <div className="tiny-thumb" style={{ backgroundImage: `url(${item.image_url})` }} />
              <div>
                <strong>{item.title}</strong>
                <small>{item.accessed_at ? new Date(item.accessed_at).toLocaleDateString() : '2 hours ago'}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const renderExplore = () => (
    <>
      <div className="section-head tight">
        <div>
          <span className="pill">Discover</span>
          <h2>Explore recipes</h2>
        </div>
      </div>
      <div className="toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by ingredient or title" />
        <select value={cuisine} onChange={(event) => setCuisine(event.target.value)}>
          <option value="">All cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Italian">Italian</option>
          <option value="Thai">Thai</option>
        </select>
        <select>
          <option>Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select>
          <option>20 min</option>
          <option>30 min</option>
          <option>45 min</option>
        </select>
        <button type="button" className="btn small">Filter</button>
      </div>
      <div className="chip-row">
        <span className="chip active">Healthy</span>
        <span className="chip">High protein</span>
        <span className="chip">Vegetarian</span>
        <span className="chip">Meal prep</span>
      </div>
      <div className="recipe-grid recipe-grid-4" style={{ marginTop: 20 }}>
        {recipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card compact-card" style={{ cursor: 'pointer' }} onClick={() => openRecipeModal(recipe)}>
            <div style={{ position: 'relative' }}>
              <img src={recipe.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554'} alt={recipe.title} />
              <span style={{ position: 'absolute', top: 10, right: 10, background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 999, padding: '3px 8px', fontSize: 11, fontWeight: 800 }}>▶ 5 Videos</span>
            </div>
            <div className="card-body">
              <span className="eyebrow">{recipe.cuisine || 'Global'}</span>
              <h3>{recipe.title}</h3>
              <p>{recipe.description || 'Fresh flavor with pantry-friendly ingredients.'}</p>
              <div className="meta-row">
                <span>⭐ {recipe.rating || 4.8}</span>
                <span>{recipe.difficulty || 'Easy'}</span>
                <button type="button" className="link-btn" onClick={(e) => { e.stopPropagation(); handleAddToFavorites(recipe.id); }}>Save</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )

  const renderUpload = () => (
    <>
      <div className="section-head tight">
        <div>
          <span className="pill">Create</span>
          <h2>Upload a recipe</h2>
        </div>
      </div>
      <div className="panel-box upload-form">
        <div className="form-two">
          <label>
            Recipe title
            <input defaultValue="Lemon Herb Quinoa Bowl" />
          </label>
          <label>
            Cuisine
            <select defaultValue="Mediterranean">
              <option>Indian</option>
              <option>Mediterranean</option>
              <option>Thai</option>
              <option>Italian</option>
            </select>
          </label>
          <label className="wide">
            Description
            <textarea rows="4" defaultValue="Bright grains, roasted vegetables, creamy feta, and a lemon dressing that feels light and fresh." />
          </label>
          <label>
            Prep minutes
            <input defaultValue="20" />
          </label>
          <label>
            Cook minutes
            <input defaultValue="25" />
          </label>
          <label>
            Image URL
            <input defaultValue="https://images.unsplash.com/photo-1547592180-85f173990554" />
          </label>
          <label>
            Video URL
            <input defaultValue="https://youtube.com/watch?v=" />
          </label>
        </div>
        <div className="upload-actions">
          <button type="button" className="btn btn-ghost">Save draft</button>
          <button type="button" className="btn">Publish now</button>
        </div>
      </div>
    </>
  )

  const renderProfile = () => (
    <>
      <div className="profile-header">
        <div className="avatar-lg">{(user?.name || 'C').slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{user?.name || 'Chef Cook'}</h2>
          <p>{user?.email || 'chef@cookshare.io'}</p>
        </div>
        <button type="button" className="btn small">Edit Profile</button>
      </div>
      <div className="profile-stats">
        <div className="stat-box">
          <strong>184</strong>
          <span>Recipes saved</span>
        </div>
        <div className="stat-box">
          <strong>32</strong>
          <span>Collections</span>
        </div>
        <div className="stat-box">
          <strong>91</strong>
          <span>Followers</span>
        </div>
        <div className="stat-box">
          <strong>12</strong>
          <span>Challenges</span>
        </div>
      </div>
      <div className="profile-grid">
        <div className="panel-box wide-panel">
          <div className="panel-header">
            <h3>Favorite dishes</h3>
            <button type="button" className="link-btn">View all</button>
          </div>
          <div className="favorites-grid">
            {(favorites.length ? favorites : defaultRecipes).slice(0, 3).map((recipe) => (
              <div key={recipe.id} className="recipe-card compact-card">
                <img src={recipe.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554'} alt={recipe.title} />
                <div className="card-body">
                  <h3>{recipe.title}</h3>
                  <small>{recipe.cuisine || 'Global'}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel-box">
          <div className="panel-header">
            <h3>Shopping list</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="link-btn"
                style={{ color: '#25D366', fontWeight: 700 }}
                onClick={() => {
                  const items = shoppingList.length ? shoppingList : [
                    { id: 1, name: 'Cucumber', category: 'Veg', purchased: false },
                    { id: 2, name: 'Lime', category: 'Fruit', purchased: true },
                  ];
                  const text = `🛒 *CookShare - Shopping List*\n\n` +
                    items.map(i => `  ${i.purchased ? '☑' : '◻'} ${i.name} (${i.category || 'General'})`).join('\n') +
                    `\n\n✨ Shared via CookShare`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                title="Send items list to WhatsApp"
              >
                📲 WhatsApp
              </button>
              <button type="button" className="link-btn">Add item</button>
            </div>
          </div>
          <div className="mini-cards">
            {(shoppingList.length ? shoppingList : [
              { id: 1, name: 'Cucumber', category: 'Veg', purchased: false },
              { id: 2, name: 'Lime', category: 'Fruit', purchased: true },
            ]).map((item) => (
              <div key={item.id} className="mini-card">
                <input type="checkbox" checked={Boolean(item.purchased)} onChange={() => handleTogglePurchased(item.id, item.purchased)} />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.category || 'General'}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  const plannerDays = [
    { day: 'Mon', fullDay: 'Monday / திங்கள்', breakfast: 'Idli & Sambar', lunch: 'Sambar Rice & Potato Roast', dinner: 'Chapati & Kurma' },
    { day: 'Tue', fullDay: 'Tuesday / செவ்வாய்', breakfast: 'Ven Pongal & Chutney', lunch: 'Lemon Rice & Papad', dinner: 'Dosa & Chutney' },
    { day: 'Wed', fullDay: 'Wednesday / புதன்', breakfast: 'Rava Upma', lunch: 'Chettinad Chicken Masala & Rice', dinner: 'Phulka & Dal Tadka' },
    { day: 'Thu', fullDay: 'Thursday / வியாழன்', breakfast: 'Paniyaram & Kara Chutney', lunch: 'Curd Rice & Pickle', dinner: 'Roti & Paneer Curry' },
    { day: 'Fri', fullDay: 'Friday / வெள்ளி', breakfast: 'Poori & Masala', lunch: 'Bisi Bele Bath', dinner: 'Millet Khichdi' },
    { day: 'Sat', fullDay: 'Saturday / சனி', breakfast: 'Ghee Roast Dosa', lunch: 'South Indian Veg Meals', dinner: 'Parotta & Salna' },
    { day: 'Sun', fullDay: 'Sunday / ஞாயிறு', breakfast: 'Appam & Coconut Milk', lunch: 'Thalassery Biryani', dinner: 'Light Upma' },
  ]

  const shareMealPlanToWhatsApp = (targetDay = null) => {
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    let text = `🍽️ *CookShare - Weekly Meal Plan (உணவு அட்டவணை)*\n📅 Date: ${today}\n━━━━━━━━━━━━━━━━━━━━\n\n`
    
    const daysToShare = targetDay ? plannerDays.filter(d => d.day === targetDay) : plannerDays
    daysToShare.forEach(d => {
      text += `🗓️ *${d.fullDay}*\n`
      text += `  🌅 Breakfast (காலை): ${d.breakfast}\n`
      text += `  ☀️ Lunch (மதியம்): ${d.lunch}\n`
      text += `  🌙 Dinner (இரவு): ${d.dinner}\n\n`
    })
    
    text += `━━━━━━━━━━━━━━━━━━━━\n`
    text += `✨ _Planned via CookShare Culinary Platform_\n`
    text += `🌐 http://localhost:5000/planner.html`
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const renderPlanner = () => (
    <>
      <div className="section-head tight" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="pill">Weekly plan</span>
          <h2>Meal planner</h2>
        </div>
        <button
          type="button"
          onClick={() => shareMealPlanToWhatsApp()}
          className="btn"
          style={{ background: '#25D366', color: '#fff', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}
          title="Share weekly meal timetable to WhatsApp"
        >
          📲 WhatsApp-ல் உணவு அட்டவணை அனுப்ப
        </button>
      </div>
      <div className="planner-grid">
        {plannerDays.map((d) => (
          <div key={d.day} className="planner-day">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0 }}>{d.day}</h4>
              <button
                type="button"
                onClick={() => shareMealPlanToWhatsApp(d.day)}
                style={{ background: 'transparent', border: '1px solid #25D366', color: '#128C7E', borderRadius: '6px', fontSize: '11px', padding: '2px 6px', cursor: 'pointer', fontWeight: 600 }}
                title={`Share ${d.day}'s meals to WhatsApp`}
              >
                📲 Share
              </button>
            </div>
            <div className="meal-box">
              <span>Breakfast</span>
              <strong>{d.breakfast}</strong>
            </div>
            <div className="meal-box">
              <span>Lunch</span>
              <strong>{d.lunch}</strong>
            </div>
            <div className="meal-box">
              <span>Dinner</span>
              <strong>{d.dinner}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const renderCommunity = () => (
    <>
      <div className="section-head tight">
        <div>
          <span className="pill">Community</span>
          <h2>CookShare social</h2>
        </div>
      </div>
      <div className="community-layout">
        <div className="feed-list">
          <div className="post-card">
            <div className="user-row">
              <div className="avatar-sm">RK</div>
              <div>
                <strong>Ritika</strong>
                <small>2 hours ago</small>
              </div>
            </div>
            <h3>Sunday dinner made easy</h3>
            <div className="post-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80)' }} />
            <div className="post-actions">
              <span>♥ 483</span>
              <span>💬 24</span>
              <span>↻ Share</span>
            </div>
          </div>
          <div className="post-card">
            <div className="user-row">
              <div className="avatar-sm">SP</div>
              <div>
                <strong>Suhail</strong>
                <small>Yesterday</small>
              </div>
            </div>
            <h3>Budget meal prep for the week</h3>
            <div className="post-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80)' }} />
            <div className="post-actions">
              <span>♥ 621</span>
              <span>💬 41</span>
              <span>↻ Share</span>
            </div>
          </div>
        </div>
        <aside className="community-side">
          <div className="panel-box">
            <div className="panel-header">
              <h3>Top creators</h3>
            </div>
            <div className="creator-row">
              <div className="avatar-xs">A</div>
              <strong>Ananya</strong>
              <span>8.9k</span>
            </div>
            <div className="creator-row">
              <div className="avatar-xs">M</div>
              <strong>Mehul</strong>
              <span>7.2k</span>
            </div>
          </div>
          <div className="panel-box">
            <div className="panel-header">
              <h3>Popular tags</h3>
            </div>
            <div className="tag-list">
              <span>#healthy</span>
              <span>#familydinner</span>
              <span>#weeknight</span>
              <span>#veg</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )

  const renderAuth = () => (
    <div className="auth-body">
      <div className="auth-card admin-auth-card">
        <div className="auth-visual admin-visual">
          <span className="pill">CookShare access</span>
          <h2>{authMode === 'login' ? 'Welcome back' : 'Create a kitchen account'}</h2>
          <p>Track recipes, save favorites, and get smarter meal suggestions with your personal profile.</p>
          <ul>
            <li>JWT protected sessions</li>
            <li>Google OAuth ready</li>
            <li>AI ingredient matching</li>
          </ul>
        </div>
        <div className="auth-panel">
          <div className="segmented">
            <button type="button" className={authMode === 'login' ? 'segment active' : 'segment'} onClick={() => setAuthMode('login')}>Log in</button>
            <button type="button" className={authMode === 'register' ? 'segment active' : 'segment'} onClick={() => setAuthMode('register')}>Sign up</button>
          </div>
          <form onSubmit={handleAuthSubmit}>
            {authMode === 'register' && (
              <label>
                Full name
                <input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} placeholder="Your name" />
              </label>
            )}
            <label>
              Email
              <input type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="you@example.com" />
            </label>
            <label>
              Password
              <input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="Enter password" />
            </label>
            <div className="row-inline">
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <button type="button" className="link-btn">Forgot password?</button>
            </div>
            <button type="submit" className="btn full">{authMode === 'login' ? 'Log in' : 'Create account'}</button>
          </form>
          {notice && <p className="notice">{notice}</p>}
          <div className="auth-foot">
            <span>or continue with Google</span>
          </div>
          <button type="button" className="btn btn-ghost full top-gap">Continue with Google</button>
        </div>
      </div>
    </div>
  )

  const renderAdmin = () => (
    <>
      <div className="section-head tight">
        <div>
          <span className="pill">Admin</span>
          <h2>Moderator dashboard</h2>
        </div>
      </div>
      <div className="stats-row">
        <div className="stat-box">
          <strong>{adminStats.users}</strong>
          <span>Users</span>
        </div>
        <div className="stat-box">
          <strong>{adminStats.recipes}</strong>
          <span>Recipes</span>
        </div>
        <div className="stat-box">
          <strong>{adminStats.reviews}</strong>
          <span>Reviews</span>
        </div>
        <div className="stat-box">
          <strong>{adminStats.recentAccesses}</strong>
          <span>Recent access</span>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="panel-box">
          <div className="panel-header">
            <h3>Published recipes</h3>
            <span className="status-tag">Healthy</span>
          </div>
          <div className="mini-cards">
            {recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id} className="mini-card">
                <div className="mini-thumb" style={{ backgroundImage: `url(${recipe.image_url})` }} />
                <div>
                  <strong>{recipe.title}</strong>
                  <small>{recipe.author || 'CookShare'}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel-box">
          <div className="panel-header">
            <h3>Moderation queue</h3>
          </div>
          <ul className="check-list">
            <li><input type="checkbox" defaultChecked /> Lentil stew draft</li>
            <li><input type="checkbox" defaultChecked /> Veggie rice bowl</li>
            <li><input type="checkbox" /> Spicy noodles</li>
          </ul>
        </div>
        <div className="panel-box">
          <div className="panel-header">
            <h3>Latest activity</h3>
          </div>
          <div className="mini-cards">
            <div className="mini-card">
              <div className="avatar-xs">A</div>
              <div>
                <strong>Arjun joined</strong>
                <small>5 minutes ago</small>
              </div>
            </div>
            <div className="mini-card">
              <div className="avatar-xs">P</div>
              <div>
                <strong>Paneer recipe approved</strong>
                <small>1 hour ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;
    const videos = getRecipeVideos(selectedRecipe);
    const total = videos.length;
    const prep = Number(selectedRecipe.prep_minutes) || 0;
    const cook = Number(selectedRecipe.cook_minutes) || 0;
    const totalTime = prep + cook;

    return (
      <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close-btn" onClick={() => setSelectedRecipe(null)}>✕</button>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
            <img 
              src={selectedRecipe.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'} 
              alt={selectedRecipe.title} 
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '18px' }} 
            />
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span className="pill">{selectedRecipe.cuisine || 'Global'} · {selectedRecipe.difficulty || 'Medium'}</span>
                <span className="pill" style={{ background: '#fee2e2', color: '#b91c1c', borderColor: '#fecaca' }}>▶ 5 YouTube Videos</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', margin: '4px 0 8px' }}>{selectedRecipe.title}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '14px' }}>{selectedRecipe.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'var(--panel-alt)', padding: '12px', borderRadius: '14px', border: '1px solid var(--line)' }}>
                <div>
                  <small style={{ color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>⏱ Prep</small>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{prep} min</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>🍳 Cook</small>
                  <strong style={{ display: 'block', fontSize: '1rem' }}>{cook} min</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>⏳ Total</small>
                  <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--primary)' }}>{totalTime} min</strong>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button type="button" className="btn small" onClick={() => handleAddToFavorites(selectedRecipe.id)}>♡ Save</button>
                <button type="button" className="btn small btn-ghost" onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(`${window.location.origin}/recipe.html?id=${selectedRecipe.id}`);
                    setNotice('Recipe link copied to clipboard!');
                  }
                }}>↗ Share</button>
              </div>
            </div>
          </div>

          {/* 5-Video YouTube Carousel Section */}
          <section className="yt-carousel-section" aria-label="Watch Recipe Videos">
            <div className="yt-carousel-header">
              <div className="yt-carousel-title-group">
                <span className="yt-carousel-top-badge">🎥 5 Verified Tamil Videos</span>
                <h2>🎥 தமிழில் செய்முறை வீடியோக்கள்</h2>
                <p>இந்த உணவிற்கான 5 நேரடி தமிழ் செய்முறை யூடியூப் வீடியோக்கள் (சுழற்றிப் பார்க்கவும்)</p>
              </div>
              <div className="yt-carousel-counter">
                {carouselSlide + 1} / {total}
              </div>
            </div>

            <div className="yt-carousel-layout">
              <button 
                type="button" 
                className="yt-carousel-nav-btn prev-btn" 
                onClick={() => setCarouselSlide((prev) => (prev - 1 + total) % total)}
                aria-label="Previous Video"
              >
                <span>←</span> <span className="nav-text">முந்தையது</span>
              </button>

              <div className="yt-carousel-viewport">
                <div 
                  className="yt-carousel-track" 
                  style={{ transform: `translateX(-${carouselSlide * (100 / (window.innerWidth > 900 ? 3 : 1))}%)` }}
                >
                  {videos.map((v, idx) => {
                    const videoUrl = v.url || v.video_url;
                    const thumb = getYtThumbnail(videoUrl, selectedRecipe.image_url);
                    const channelName = v.channel || v.channel_name || "Tamil Cooking";
                    return (
                      <div 
                        key={idx} 
                        className={`yt-video-card ${idx === carouselSlide ? 'active-slide' : ''}`}
                        onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <div className="yt-thumb-wrapper">
                          <img src={thumb} alt={v.title} className="yt-thumb-img" loading="lazy" />
                          <div className="yt-play-pill">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                          <span className="yt-badge-index">{idx + 1} / 5</span>
                          <span className="yt-badge-bottom">▶ YouTube</span>
                        </div>
                        <div className="yt-card-body">
                          <div className="yt-meta-header">
                            <span className="yt-brand-logo-badge">
                              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#ff0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon fill="#ffffff" points="9.545,15.568 15.818,12 9.545,8.432"/></svg>
                              <span>YouTube</span>
                            </span>
                            <span className="yt-channel-badge" title={channelName}>📺 {channelName}</span>
                          </div>
                          <h4 className="yt-video-card-title">{v.title}</h4>
                          <a 
                            href={videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="yt-watch-action-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 20c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 4c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
                            <span>YouTube-ல் பார்க்க</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                type="button" 
                className="yt-carousel-nav-btn next-btn" 
                onClick={() => setCarouselSlide((prev) => (prev + 1) % total)}
                aria-label="Next Video"
              >
                <span className="nav-text">அடுத்தது</span> <span>→</span>
              </button>
            </div>

            {/* Carousel Indicators Below: ● ○ ○ ○ ○ and Counter 1 / 5 */}
            <div className="yt-carousel-footer">
              <div className="yt-carousel-indicators">
                {videos.map((_, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className={`yt-carousel-dot ${idx === carouselSlide ? 'active' : ''}`}
                    onClick={() => setCarouselSlide(idx)}
                    aria-label={`Go to Video ${idx + 1}`}
                  >
                    {idx === carouselSlide ? '●' : '○'}
                  </button>
                ))}
              </div>
              <div className="yt-carousel-counter">
                {carouselSlide + 1} / {total}
              </div>
            </div>
          </section>

          {/* Ingredients & Steps */}
          {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Ingredients</h3>
              <ul style={{ lineHeight: 1.8, columns: 2, marginTop: '8px' }}>
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}><b>{ing.quantity} {ing.unit}</b> {ing.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="prototype-body">
      <div className="prototype-gallery">
        <div className="screen">
          {renderHeader()}
          <div className="page-body">
            {notice && <div className="notice-banner">{notice}</div>}
            {activeView === 'home' && renderHome()}
            {activeView === 'explore' && renderExplore()}
            {activeView === 'upload' && renderUpload()}
            {activeView === 'planner' && renderPlanner()}
            {activeView === 'community' && renderCommunity()}
            {activeView === 'profile' && renderProfile()}
            {activeView === 'auth' && renderAuth()}
            {activeView === 'admin' && renderAdmin()}
          </div>
          <div className="footer-bar">© 2025 CookShare • Your everyday recipe companion</div>
        </div>
      </div>
      {renderRecipeModal()}
    </div>
  )
}

export default App
