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
          <article key={recipe.id} className="recipe-card">
            <img src={recipe.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554'} alt={recipe.title} />
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
          <article key={recipe.id} className="recipe-card compact-card">
            <img src={recipe.image_url || 'https://images.unsplash.com/photo-1547592180-85f173990554'} alt={recipe.title} />
            <div className="card-body">
              <span className="eyebrow">{recipe.cuisine || 'Global'}</span>
              <h3>{recipe.title}</h3>
              <p>{recipe.description || 'Fresh flavor with pantry-friendly ingredients.'}</p>
              <div className="meta-row">
                <span>⭐ {recipe.rating || 4.8}</span>
                <span>{recipe.difficulty || 'Easy'}</span>
                <button type="button" className="link-btn" onClick={() => handleAddToFavorites(recipe.id)}>Save</button>
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
            <button type="button" className="link-btn">Add item</button>
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

  const renderPlanner = () => (
    <>
      <div className="section-head tight">
        <div>
          <span className="pill">Weekly plan</span>
          <h2>Meal planner</h2>
        </div>
      </div>
      <div className="planner-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="planner-day">
            <h4>{day}</h4>
            <div className="meal-box">
              <span>Breakfast</span>
              <strong>Avocado toast</strong>
            </div>
            <div className="meal-box">
              <span>Lunch</span>
              <strong>Rice bowl</strong>
            </div>
            <div className="meal-box">
              <span>Dinner</span>
              <strong>Paneer tikka</strong>
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
    </div>
  )
}

export default App
