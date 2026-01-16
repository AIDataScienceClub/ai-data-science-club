# 🚀 Complete Setup Guide

## Atlanta AI & Data Lab Website

This guide will help you get the website up and running, even if you're new to web development.

---

## 📋 Prerequisites

Before you start, you need to install **Node.js** (JavaScript runtime that lets you run the website locally).

### Install Node.js

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS (Long Term Support)** version (recommended for most users)
   - Current LTS version: 20.x or higher

2. **Install Node.js**:
   - Run the downloaded installer
   - Follow the installation wizard (use default settings)
   - **Important**: Check the box that says "Automatically install the necessary tools"

3. **Verify Installation**:
   - Open PowerShell (Windows) or Terminal (Mac/Linux)
   - Type the following commands to verify:
   ```powershell
   node --version
   # Should show: v20.x.x or higher

   npm --version
   # Should show: 10.x.x or higher
   ```

---

## 🔧 Installation Steps

### Step 1: Navigate to Project Folder

Open PowerShell and navigate to the website folder:

```powershell
cd "c:\Users\hongyang\Downloads\AIClub\atlanta-ai-lab"
```

### Step 2: Install Dependencies

Install all required packages (this downloads libraries the website needs):

```powershell
npm install
```

**What this does**: Downloads React, Next.js, Tailwind CSS, and other dependencies into a `node_modules` folder. This may take 2-5 minutes.

**Troubleshooting**:
- If you see errors about permissions, try running PowerShell as Administrator
- If you see "command not found," Node.js isn't installed correctly (go back to Prerequisites)

### Step 3: Start Development Server

Run the website locally:

```powershell
npm run dev
```

**What this does**: Starts a local web server at `http://localhost:3000`

**You should see**:
```
- Local:   http://localhost:3000
- Ready in 2.5s
```

### Step 4: View the Website

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Atlanta AI & Data Lab homepage!

**To stop the server**: Press `Ctrl+C` in PowerShell

---

## 📁 Project Structure Explained

```
atlanta-ai-lab/
│
├── app/                      # Website pages (Next.js App Router)
│   ├── page.tsx             # Home page (/)
│   ├── programs/page.tsx    # Programs page (/programs)
│   ├── projects/page.tsx    # Projects page (/projects)
│   ├── ethics/page.tsx      # Ethics page (/ethics)
│   ├── impact/page.tsx      # Impact page (/impact)
│   ├── events/page.tsx      # Events page (/events)
│   ├── get-involved/page.tsx # Get Involved page (/get-involved)
│   ├── about/page.tsx       # About page (/about)
│   ├── layout.tsx           # Root layout (header, footer, etc.)
│   └── globals.css          # Global styles
│
├── components/              # Reusable components
│   ├── Header.tsx          # Site navigation
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Hero section (large title + CTAs)
│   ├── Card.tsx            # Card component (projects, programs)
│   ├── SectionHeader.tsx   # Section titles
│   ├── Testimonial.tsx     # Quote cards
│   └── CTA.tsx             # Call-to-action buttons
│
├── public/                 # Static files (images, PDFs, etc.)
│   └── (add images here)
│
├── node_modules/           # Installed dependencies (auto-generated)
├── package.json            # Project configuration & dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

---

## 🎨 Customization Guide

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#0066FF', // Change this to your brand color
    light: '#3385FF',
    dark: '#0052CC',
  },
  secondary: {
    DEFAULT: '#00E676', // Change this to your accent color
    light: '#33EB8F',
    dark: '#00C763',
  },
}
```

**After changing**: The website will auto-reload with new colors.

### Editing Page Content

All page content is in `app/[page-name]/page.tsx` files.

**Example**: To edit the home page:
1. Open `app/page.tsx`
2. Find the text you want to change
3. Edit and save
4. Browser will auto-reload with changes

### Adding Images

1. Add images to `public/images/` folder
2. Reference in code:
   ```tsx
   <img src="/images/your-image.jpg" alt="Description" />
   ```

### Editing Navigation

Edit `components/Header.tsx`:

```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Programs', href: '/programs' },
  // Add or remove links here
]
```

---

## 🚢 Deployment (Publishing Your Website)

### Option 1: Vercel (Recommended - Free & Easy)

Vercel is made by the creators of Next.js and offers the best integration.

1. **Create Vercel Account**:
   - Go to [https://vercel.com/signup](https://vercel.com/signup)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Push Code to GitHub**:
   ```powershell
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create GitHub repo and push (follow GitHub instructions)
   git remote add origin https://github.com/yourusername/atlanta-ai-lab.git
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Deploy"
   - **Done!** Your site is live at `https://your-project.vercel.app`

4. **Custom Domain** (Optional):
   - Buy a domain (e.g., `atl-ai-lab.org` from Namecheap, Google Domains)
   - In Vercel dashboard: Settings → Domains → Add Domain
   - Follow instructions to connect domain

**Auto-Deploy**: Every time you push to GitHub, Vercel automatically updates your live website!

### Option 2: Netlify (Alternative - Also Free)

1. **Create Netlify Account**:
   - Go to [https://app.netlify.com/signup](https://app.netlify.com/signup)

2. **Deploy**:
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

### Option 3: Self-Hosting (Advanced)

If you have your own server:

```powershell
# Build for production
npm run build

# Start production server
npm run start
```

Server will run on port 3000. Use a reverse proxy (nginx, Apache) to serve on port 80/443.

---

## 🔧 Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Node.js not installed. Go back to Prerequisites section.

### Issue: "Port 3000 is already in use"
**Solution**: 
```powershell
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Images not loading
**Solution**: 
- Ensure images are in `public/` folder
- Reference with `/images/file.jpg` (note the leading slash)
- Check `next.config.js` for allowed domains if using external images

### Issue: "Module not found" errors
**Solution**:
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue: Styles not applying
**Solution**:
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 📚 Learning Resources

### For Beginners:
- **Next.js Tutorial**: [https://nextjs.org/learn](https://nextjs.org/learn)
- **React Basics**: [https://react.dev/learn](https://react.dev/learn)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

### For Accessibility:
- **WCAG Guidelines**: [https://www.w3.org/WAI/WCAG22/quickref/](https://www.w3.org/WAI/WCAG22/quickref/)
- **A11y Project**: [https://www.a11yproject.com/](https://www.a11yproject.com/)

### For Deployment:
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs**: [https://docs.netlify.com/](https://docs.netlify.com/)

---

## 🆘 Getting Help

1. **Check the README.md** in the project root
2. **Review documentation** in the `/docs` folder (markdown files in parent folder)
3. **Google the error message** (often leads to Stack Overflow solutions)
4. **Ask for help**:
   - Next.js Discord: [https://nextjs.org/discord](https://nextjs.org/discord)
   - Stack Overflow: Tag questions with `next.js`, `react`, `tailwindcss`

---

## ✅ Next Steps

After setup, you can:

1. **Customize Content**:
   - Edit page copy in `app/` files
   - Update project data
   - Add real images

2. **Test Accessibility**:
   - Run Lighthouse audit (Chrome DevTools → Lighthouse)
   - Test keyboard navigation
   - Try with screen reader

3. **Deploy**:
   - Follow deployment steps above
   - Connect custom domain
   - Set up analytics (optional)

4. **Maintain**:
   - Keep dependencies updated: `npm update`
   - Check for security issues: `npm audit fix`
   - Back up code regularly (Git + GitHub)

---

**Questions?** Review the main README.md or contact: hello@atl-ai-lab.org

**Happy building! 🚀**
