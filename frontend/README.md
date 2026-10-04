# CookShare Enhanced — Bilingual Recipe Sharing Platform

This version keeps the original full-stack structure and adds a professional, user-friendly experience.

## Added features
- **English + தமிழ் UI switch** from the top navigation.
- **Bilingual recipe content:** English/Tamil title, description, ingredients, units and cooking steps.
- **Tamil recipe search:** search works against English and Tamil recipe/ingredient fields.
- **Video URL support:** paste a YouTube, Vimeo or direct MP4 URL. YouTube/Vimeo links open as embedded video instead of only showing a URL.
- **Subtitles:** direct MP4 videos can use a `.vtt` subtitle URL. YouTube videos use the platform's CC/captions when available.
- **Light / Dark theme switch** at the top; the preference is remembered in the browser.
- **Cook Mode:** large, easy-to-read cooking instructions.
- **Share Recipe:** uses the device share sheet when supported or copies the link.
- **Print / Save PDF** for recipe pages.
- **Quick search chips** and responsive mobile layout.
- Existing features retained: authentication, Google OAuth, favorites, reviews, recently accessed recipes, shopping list, meal planner, community and admin dashboard.

## Run
### Option A — full stack
1. Install Node.js and MySQL.
2. Create/update the database:
   - For a **new database**, run `backend/sql/schema.sql`.
   - For an **existing CookShare database**, run `backend/sql/migration.sql` once.
3. Copy `backend/.env.example` to `backend/.env` and fill in MySQL/Google OAuth values.
4. Open Command Prompt/PowerShell in `backend`:
   ```bash
   npm install
   npm start
   ```
5. Open **http://localhost:5000**

### Recipe creator
Use **Share Recipe** after login.
- Title: English + Tamil
- Ingredients format:
  `quantity | unit EN | ingredient EN | ingredient தமிழ் | unit தமிழ்`
- Steps format:
  `English step || தமிழ் step`
- Video URL: YouTube / Vimeo / direct MP4
- Subtitle URL: direct `.vtt` URL for direct MP4 videos

## Important
The database still contains **no fake recipe/sample INSERT records**. Add your own real recipes through the application.

## Additional feature ideas for the next version
1. Voice search in English/Tamil.
2. Nutrition calculator (calories, protein, carbs, fat).
3. Pantry scan / ingredient availability matcher.
4. Automatic shopping-list quantity scaling by servings.
5. Offline/PWA support.
6. Recipe collections and private/public sharing.
7. Accessibility controls: font-size and high-contrast modes.
