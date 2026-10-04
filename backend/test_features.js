const http = require("http");

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==================================================================");
  console.log(" COOKSHARE MANDATORY FEATURES AUTOMATED VERIFICATION SUITE ");
  console.log("==================================================================\n");

  const results = [];

  // TEST 1: 5+ USER LOGINS & JWT VERIFICATION
  console.log("🔹 CHECK 1: Testing 6 User Logins (1 Admin + 5 Regular Users) with JWT...");
  const testUsers = [
    { email: "admin@cookshare.com", role: "ADMIN", expectedName: "Gowri Admin" },
    { email: "maya.raman@cookshare.com", role: "USER", expectedName: "Chef Maya Raman" },
    { email: "rajesh.nutrition@cookshare.com", role: "USER", expectedName: "Dr. Rajesh Varma" },
    { email: "priya.sundaram@cookshare.com", role: "USER", expectedName: "Priya Sundaram" },
    { email: "arvind.swaminathan@cookshare.com", role: "USER", expectedName: "Chef Arvind Swaminathan" },
    { email: "kavitha.cooks@cookshare.com", role: "USER", expectedName: "Kavitha Ananth" }
  ];

  let adminToken = "";
  let regularUserToken = "";

  for (const u of testUsers) {
    const res = await request({
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }, { email: u.email, password: "Password@123" });

    const ok = res.status === 200 && res.body.token && res.body.user.role === u.role;
    console.log(`  [${ok ? "PASS" : "FAIL"}] Login ${u.email} -> Role: ${res.body?.user?.role}, Token: ${res.body?.token ? "Issued (" + res.body.token.slice(0, 18) + "...)" : "None"}`);
    if (u.role === "ADMIN") adminToken = res.body.token;
    if (u.email === "maya.raman@cookshare.com") regularUserToken = res.body.token;
    results.push({ name: `Login ${u.email}`, passed: ok });
  }

  // TEST 2: JWT AUTHENTICATION ON PROTECTED ROUTE
  console.log("\n🔹 CHECK 2: Verifying JWT Protection on /api/auth/me...");
  const meRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/me",
    method: "GET",
    headers: { "Authorization": `Bearer ${regularUserToken}` }
  });
  const jwtPass = meRes.status === 200 && meRes.body.user && meRes.body.user.email === "maya.raman@cookshare.com";
  console.log(`  [${jwtPass ? "PASS" : "FAIL"}] /api/auth/me decoded user: ${meRes.body?.user?.name} (${meRes.body?.user?.email})`);
  results.push({ name: "JWT Header Verification", passed: jwtPass });

  // TEST 3: OAUTH AUTHENTICATION (Google Verified Profile Simulation)
  console.log("\n🔹 CHECK 3: Testing OAuth Authentication Flow...");
  const oauthRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/google-demo",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  const oauthPass = oauthRes.status === 200 && oauthRes.body.user?.oauth_provider === "google" && Boolean(oauthRes.body.token);
  console.log(`  [${oauthPass ? "PASS" : "FAIL"}] Google OAuth Handler -> Provider: ${oauthRes.body?.user?.oauth_provider}, Token: Issued`);
  results.push({ name: "OAuth Authentication", passed: oauthPass });

  // TEST 4: ADMIN DASHBOARD MANDATORY RESTRICTION
  console.log("\n🔹 CHECK 4: Testing Admin Dashboard Access & Role Security...");
  // 4a: Admin Access
  const adminDash = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/admin/dashboard",
    method: "GET",
    headers: { "Authorization": `Bearer ${adminToken}` }
  });
  const adminPass = adminDash.status === 200 && adminDash.body.users >= 6 && adminDash.body.recipes >= 6;
  console.log(`  [${adminPass ? "PASS" : "FAIL"}] Admin Login Access: Users: ${adminDash.body?.users}, Recipes: ${adminDash.body?.recipes}, Reviews: ${adminDash.body?.reviews}`);

  // 4b: Non-admin rejection (Must return 403 Forbidden)
  const forbiddenRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/admin/dashboard",
    method: "GET",
    headers: { "Authorization": `Bearer ${regularUserToken}` }
  });
  const forbiddenPass = forbiddenRes.status === 403;
  console.log(`  [${forbiddenPass ? "PASS" : "FAIL"}] Non-Admin Access Rejected with HTTP 403: ${forbiddenPass ? "Enforced" : "Failed"}`);
  results.push({ name: "Admin Dashboard & Role Enforcement", passed: adminPass && forbiddenPass });

  // TEST 5: RECENTLY ACCESSED FEATURE
  console.log("\n🔹 CHECK 5: Testing Recently Accessed Tracking & Retrieval...");
  // Record recipe 2 as recently viewed for Maya
  await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/me/recent/2",
    method: "POST",
    headers: { "Authorization": `Bearer ${regularUserToken}` }
  });

  const recentRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/users/me/recent",
    method: "GET",
    headers: { "Authorization": `Bearer ${regularUserToken}` }
  });
  const recentPass = recentRes.status === 200 && Array.isArray(recentRes.body) && recentRes.body.length > 0;
  console.log(`  [${recentPass ? "PASS" : "FAIL"}] Recently Accessed count: ${recentRes.body?.length}, Latest: "${recentRes.body?.[0]?.title}"`);
  results.push({ name: "Recently Accessed Feature", passed: recentPass });

  // TEST 6: MULTI-LINGUAL CAPABILITY (Tamil & English Data Validation)
  console.log("\n🔹 CHECK 6: Testing Multi-Lingual Data (English + Tamil தமிழ்)...");
  const recipesRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/recipes/1",
    method: "GET"
  });
  const multiPass = Boolean(recipesRes.body?.title && recipesRes.body?.title_ta && recipesRes.body?.ingredients?.[0]?.name_ta);
  console.log(`  [${multiPass ? "PASS" : "FAIL"}] English: "${recipesRes.body?.title}"`);
  console.log(`         Tamil: "${recipesRes.body?.title_ta}"`);
  console.log(`         Bilingual Ingredient: ${recipesRes.body?.ingredients?.[0]?.name} / ${recipesRes.body?.ingredients?.[0]?.name_ta}`);
  results.push({ name: "Multi-Lingual Support (EN + TA)", passed: multiPass });

  // TEST 7: CULINARY AI CHATBOT ("ChefBot")
  console.log("\n🔹 CHECK 7: Testing Culinary AI Chatbot (ChefBot)...");
  const chatEn = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/ai/chat",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, { message: "How do I make crispy dosa?", language: "en" });

  const chatTa = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/ai/chat",
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }, { message: "தோசை செய்முறை", language: "ta" });

  const chatPass = chatEn.status === 200 && Boolean(chatEn.body.reply) && chatTa.status === 200 && Boolean(chatTa.body.reply);
  console.log(`  [${chatPass ? "PASS" : "FAIL"}] ChefBot EN: "${chatEn.body?.reply?.slice(0, 75)}..."`);
  console.log(`         ChefBot TA: "${chatTa.body?.reply?.slice(0, 75)}..."`);
  results.push({ name: "ChefBot AI Chatbot (Bilingual)", passed: chatPass });

  // TEST 8: UNIQUE FEATURE BEYOND CRUD (Pantry-to-Recipe Matcher)
  console.log("\n🔹 CHECK 8: Testing Unique Feature: Reverse Pantry-to-Recipe Matcher...");
  const pantryRes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/ai/pantry-match",
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, { ingredients: ["chicken", "pepper", "shallots", "curry leaves", "fennel"] });

  const pantryPass = pantryRes.status === 200 && pantryRes.body.matches && pantryRes.body.matches.length > 0;
  const topMatch = pantryRes.body?.matches?.[0];
  console.log(`  [${pantryPass ? "PASS" : "FAIL"}] Analyzed: ${pantryRes.body?.totalAnalyzed} recipes`);
  console.log(`         Top Match: "${topMatch?.title}" -> Match: ${topMatch?.matchPercentage}% (${topMatch?.matchedCount} matched, ${topMatch?.missingCount} missing)`);
  results.push({ name: "Unique Reverse Pantry Matcher Algorithm", passed: pantryPass });

  // TEST 9: NO SAMPLE DATA CHECK
  console.log("\n🔹 CHECK 9: Verifying Data Integrity (No sample/placeholder data)...");
  const allRecipes = await request({
    hostname: "localhost",
    port: 5000,
    path: "/api/recipes",
    method: "GET"
  });
  const hasSampleData = allRecipes.body.some(r =>
    /test|lorem|dummy|sample|asdf/i.test(r.title) ||
    /test|lorem|dummy|sample|asdf/i.test(r.description)
  );
  const dataPass = !hasSampleData && allRecipes.body.length >= 6;
  console.log(`  [${dataPass ? "PASS" : "FAIL"}] Valid recipes verified: ${allRecipes.body?.length} authentic recipes, Zero placeholder words found.`);
  results.push({ name: "Authentic Valid Data Verification", passed: dataPass });

  // SUMMARY
  console.log("\n==================================================================");
  const totalPassed = results.filter(r => r.passed).length;
  console.log(` TEST SUITE COMPLETE: ${totalPassed} / ${results.length} CHECKS PASSED `);
  console.log("==================================================================");

  if (totalPassed === results.length) {
    console.log("ALL MANDATORY REQUIREMENTS VERIFIED SUCCESSFULLY!\n");
  } else {
    console.log("SOME CHECKS FAILED. PLEASE REVIEW LOGS ABOVE.\n");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
