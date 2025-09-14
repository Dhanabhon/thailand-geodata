# 🚀 Web App Setup Guide

## GitHub Pages Setup (Recommended)

### Step 1: Enable GitHub Pages Manually

**⚠️ IMPORTANT:** The GitHub Action workflow cannot automatically enable Pages due to permissions. You **MUST** enable it manually first:

1. **Go to your GitHub repository**
2. **Click on "Settings" tab**
3. **Scroll down to "Pages" section (left sidebar)**
4. **Under "Source", select:**
   - Source: "GitHub Actions" (recommended)
   - OR "Deploy from a branch" → Branch: "main" → Folder: "/ (root)"
5. **Click "Save"**

### Step 2: Access Your Web App

After enabling Pages, your web app will be available at:
- **Full repo:** `https://[username].github.io/thailand-geodata/examples/web-app/`
- **If using GitHub Actions:** The workflow will deploy automatically on pushes

### Step 3: Troubleshooting Workflow Failures

If you see errors like "Resource not accessible by integration":

**✅ Solution 1: Use GitHub Actions Source**
1. In Settings > Pages, select "GitHub Actions" as source
2. The `static.yml` workflow will deploy the entire repo
3. Access app at: `https://[username].github.io/thailand-geodata/examples/web-app/`

**✅ Solution 2: Use Branch Deployment**
1. In Settings > Pages, select "Deploy from a branch"
2. Choose "main" branch and "/ (root)" folder
3. No workflow needed - GitHub will serve files directly
4. Access app at: `https://[username].github.io/thailand-geodata/examples/web-app/`

---

## Alternative Deployment Options

### Option 1: Local Development Server

```bash
# Navigate to web app folder
cd examples/web-app

# Option A: Python
python -m http.server 8000

# Option B: Node.js
npx serve .

# Option C: PHP
php -S localhost:8000

# Then visit: http://localhost:8000
```

### Option 2: Netlify (Free)

1. **Visit [netlify.com](https://netlify.com)**
2. **Drag and drop the `examples/web-app` folder**
3. **Get instant live URL**
4. **No configuration needed!**

### Option 3: Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# In the web-app directory
cd examples/web-app
vercel --prod

# Follow prompts for instant deployment
```

### Option 4: GitHub Codespaces

1. **Open repository in Codespaces**
2. **Run:** `cd examples/web-app && python -m http.server 8000`
3. **Codespaces will provide a public URL automatically**

---

## Troubleshooting

### GitHub Pages Not Working?

**Error: "Pages site failed"**
- ✅ Make sure you manually enabled Pages in Settings first
- ✅ Ensure the workflow has proper permissions
- ✅ Check that your repository is public (or has GitHub Pro for private repos)

**Error: "404 Not Found"**
- ✅ Wait 5-10 minutes after first deployment
- ✅ Check the Actions tab for deployment status
- ✅ Verify the correct URL format: `https://[username].github.io/[repo-name]/examples/web-app/`

**Data Not Loading?**
- ✅ The app automatically detects if running on GitHub Pages vs locally
- ✅ On GitHub Pages, it loads data from the raw GitHub URLs
- ✅ Locally, it loads data from relative paths

### CORS Issues?

If you see CORS errors when running locally:
- ✅ Use a proper HTTP server (not file:// protocol)
- ✅ Python's `http.server` or Node's `serve` work perfectly
- ✅ Don't open `index.html` directly in browser

---

## Quick Start Commands

```bash
# Clone repository
git clone https://github.com/[username]/thailand-geodata.git
cd thailand-geodata/examples/web-app

# Start local server
python -m http.server 8000

# Open browser
open http://localhost:8000
```

That's it! The web app should load with full functionality, showing Thailand's provinces, districts, and sub-districts with interactive search and exploration features.