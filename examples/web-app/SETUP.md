# 🚀 Web App Setup Guide

## GitHub Pages Setup (Recommended)

### Step 1: Enable GitHub Pages Manually

**Important:** You must enable GitHub Pages in your repository settings first, before the workflow can deploy.

1. **Go to your GitHub repository**
2. **Click on "Settings" tab**
3. **Scroll down to "Pages" section (left sidebar)**
4. **Under "Source", select:**
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
5. **Click "Save"**

### Step 2: Wait for Automatic Deployment

After enabling Pages and pushing your code:
- The GitHub Action will automatically run
- It will deploy the web app from `examples/web-app/`
- Your app will be available at: `https://[username].github.io/thailand-geodata/examples/web-app/`

### Step 3: Verify Deployment

- Check the "Actions" tab to see deployment status
- Look for the green checkmark ✅
- Visit your live URL once deployment completes

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