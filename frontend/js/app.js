function recipeCard(r) {
  const image = r.image_url || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80";
  const title = lang() === "ta" ? (r.title_ta || r.title) : r.title;
  const desc = lang() === "ta" ? (r.description_ta || r.description) : r.description;
  const isTa = lang() === "ta";
  const prep = Number(r.prep_minutes) || 0;
  const cook = Number(r.cook_minutes) || 0;
  const servings = Number(r.servings) || 4;
  const encodedTitle = encodeURIComponent(title);

  return `
    <article class="card">
      <div style="position:relative">
        <a href="recipe.html?id=${r.id}" style="display:block;overflow:hidden">
          <img src="${esc(image)}" alt="${esc(title)}" loading="lazy" style="transition:transform 0.3s ease">
        </a>
        ${r.video_url ? `<a href="recipe.html?id=${r.id}#recipeVideos" class="video-badge" style="position:absolute;top:12px;right:12px;box-shadow:0 4px 10px rgba(0,0,0,0.25);text-decoration:none;background:#fee2e2;color:#b91c1c;border:1px solid #fecaca;font-weight:800">▶ ${isTa ? '5 வீடியோ' : '5 Videos'}</a>` : ""}
      </div>
      <div class="card-content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span class="pill">${esc(r.cuisine || "")} · ${esc(r.difficulty || "Medium")}</span>
          <span style="font-weight:700;font-size:0.85rem;color:#f59e0b">⭐ ${Number(r.rating || 5).toFixed(1)}</span>
        </div>
        <h3 style="margin:6px 0 4px"><a href="recipe.html?id=${r.id}" style="color:var(--text);text-decoration:none">${esc(title)}</a></h3>
        <p class="muted" style="font-size:0.82rem;margin-bottom:8px">⏱ Prep: <b>${prep}m</b> | Cook: <b>${cook}m</b> | 🍽 <b>${servings} ${tr("servings")}</b></p>
        <p style="font-size:0.88rem;line-height:1.5;margin-bottom:12px;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(desc || "")}</p>
        
        <div class="card-actions" style="display:flex;flex-wrap:wrap;gap:6px">
          <a class="btn small" href="recipe.html?id=${r.id}">👨‍🍳 ${tr("cook")}</a>
          ${r.video_url ? `<a class="btn small alt" href="recipe.html?id=${r.id}#recipeVideos" title="Watch 5 YouTube Recipe Videos" style="border-color:#ef4444;color:#ef4444;font-weight:700">▶ 5 Videos</a>` : ""}
          <button class="btn small alt" onclick="quickSaveFavorite(${r.id}, '${esc(encodedTitle)}')" title="Save to Favorites">♡ Save</button>
          <button class="btn small alt" onclick="quickShareRecipe('${esc(encodedTitle)}', ${r.id})" title="Share Recipe">↗ Share</button>
        </div>
      </div>
    </article>
  `;
}

async function quickSaveFavorite(id, encodedTitle) {
  if (getToken()) {
    try {
      await api("/users/me/favorites/" + id, { method: "POST" });
      alert("❤️ Added to your CookShare favorites!");
      return;
    } catch (e) {
      if ((e.message || "").toLowerCase().includes("duplicate") || (e.message || "").toLowerCase().includes("already")) {
        alert("This recipe is already in your favorites!");
        return;
      }
    }
  }
  let localFavs = JSON.parse(localStorage.getItem("cookshare_favs") || "[]");
  if (!localFavs.includes(id)) {
    localFavs.push(id);
    localStorage.setItem("cookshare_favs", JSON.stringify(localFavs));
    alert("❤️ Saved to your Favorites!");
  } else {
    alert("This recipe is already in your saved favorites!");
  }
}

function quickShareRecipe(encodedTitle, id) {
  const shareTitle = decodeURIComponent(encodedTitle);
  const shareUrl = location.origin + "/recipe.html?id=" + id;
  if (navigator.share) {
    navigator.share({ title: shareTitle, text: `Check out ${shareTitle} recipe on CookShare:`, url: shareUrl }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("📋 Recipe link copied to clipboard!\n" + shareUrl);
    });
  } else {
    prompt("Copy recipe link:", shareUrl);
  }
}

async function loadRecipes(targetId = "recipes") {
  const box = document.getElementById(targetId);
  if (!box) return;
  try {
    const rows = await api("/recipes");
    box.innerHTML = rows.length ? rows.map(recipeCard).join("") : `<div class="panel empty">${tr("noRecipes")}</div>`;
  } catch (e) {
    box.innerHTML = `<div class="panel">${esc(e.message)}</div>`;
  }
}

async function loadRecent(targetId = "recent") {
  const box = document.getElementById(targetId);
  if (!box || !getToken()) return;
  try {
    const rows = await api("/users/me/recent");
    box.innerHTML = rows.length ? rows.map(r => `
      <div class="recent" style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--line)">
        <div>
          <a href="recipe.html?id=${r.id}" style="font-weight:700;color:var(--text)">${esc(lang() === "ta" ? (r.title_ta || r.title) : r.title)}</a>
          <br><small style="color:var(--muted)">${new Date(r.accessed_at).toLocaleString()}</small>
        </div>
        <a class="btn small alt" href="recipe.html?id=${r.id}">View</a>
      </div>
    `).join("") : `<p class="muted">No recently accessed recipes.</p>`;
  } catch (e) {
    box.textContent = e.message;
  }
}
