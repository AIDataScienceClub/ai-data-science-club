# Atlanta AI & Data Lab Website

A professional, accessible website for a student-led club helping high schoolers learn and apply AI and data science to solve local problems—responsibly.

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm** (Download from [nodejs.org](https://nodejs.org/))

### Installation

1. Navigate to the project directory:
```bash
cd atlanta-ai-lab
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
atlanta-ai-lab/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Home page
│   ├── programs/          # Programs route
│   ├── projects/          # Projects route
│   ├── ethics/            # Ethics & Safety route
│   ├── impact/            # Impact route
│   ├── events/            # Events route (to be completed)
│   ├── get-involved/      # Get Involved route (to be completed)
│   ├── about/             # About route (to be completed)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section component
│   ├── Card.tsx           # Card component for projects/programs
│   ├── SectionHeader.tsx  # Section heading component
│   ├── Testimonial.tsx    # Testimonial component
│   └── CTA.tsx            # Call-to-action button component
├── public/                # Static assets (images, files)
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Colors

- **Primary (Electric Blue)**: `#0066FF` - Main brand color, CTAs
- **Secondary (Spring Green)**: `#00E676` - Accent color, highlights
- **Neutral Charcoal**: `#2C2C2C` - Body text
- **Neutral Off-White**: `#F8F9FA` - Background
- **Gray Scale**: `100-900` - Various UI elements

### Typography

- **Font**: Inter (Google Fonts)
- **Body**: 16-18px, line-height 1.6
- **Headings**: Bold, responsive scaling (h1: 48-72px → h6: 18px)

### Accessibility

This website meets **WCAG 2.2 AA** standards:

✅ Color contrast ≥ 4.5:1 for text  
✅ Keyboard navigable (Tab, Arrow keys)  
✅ Focus indicators visible  
✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)  
✅ ARIA labels for screen readers  
✅ Skip-to-content link  
✅ Responsive (mobile-first)  
✅ Touch targets ≥ 44×44px  
✅ Reduced motion support

### Testing Accessibility

1. **Automated**:
   ```bash
   # Run Lighthouse audit in Chrome DevTools
   # Target score: 90+ for Accessibility
   ```

2. **Manual**:
   - Navigate using only keyboard (Tab, Shift+Tab, Enter)
   - Test with screen reader (NVDA on Windows, VoiceOver on Mac)
   - Resize text to 200% (Ctrl/Cmd +)
   - Test on mobile device

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding a New Page

1. Create a new folder in `app/` (e.g., `app/events/`)
2. Add `page.tsx` with your content:
   ```tsx
   export default function Events() {
     return <div>Events Page</div>
   }
   ```
3. Update navigation in `components/Header.tsx`

### Creating a New Component

1. Create file in `components/` (e.g., `components/Timeline.tsx`)
2. Export as default function
3. Import and use in pages

### Styling Guidelines

- Use Tailwind utility classes (preferred)
- Custom classes in `globals.css` (when needed)
- Follow naming convention: `btn-primary`, `card`, `section-py`

## 📄 Content Management

### Project Data

Project information is currently hardcoded in `app/projects/page.tsx`. For easier management, consider:

- **Option 1**: Move to JSON file in `public/data/projects.json`
- **Option 2**: Use a headless CMS (e.g., Sanity, Contentful)
- **Option 3**: Connect to a database (PostgreSQL, MongoDB)

### Images

- Store in `public/images/`
- Optimize for web (use WebP format, compress)
- Always include descriptive `alt` text
- Use Next.js `<Image>` component for optimization

## 🚢 Deployment

### Recommended Platforms

1. **Vercel** (recommended for Next.js):
   - Push to GitHub
   - Connect repo to Vercel
   - Auto-deploy on push to `main`

2. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Self-hosted**:
   ```bash
   npm run build
   npm run start
   ```

### Environment Variables

Create `.env.local` for API keys, database URLs, etc.:

```env
# Example (not real keys)
NEXT_PUBLIC_SITE_URL=https://atl-ai-lab.org
CONTACT_FORM_API=your_api_key_here
```

## ♿ Accessibility Checklist

Before launch, verify:

- [ ] All images have `alt` text
- [ ] Color contrast passes WCAG AA (use WebAIM Contrast Checker)
- [ ] Form inputs have visible labels
- [ ] Keyboard navigation works (no traps)
- [ ] Focus states visible
- [ ] Heading hierarchy logical (h1 → h2 → h3)
- [ ] ARIA labels for icon buttons
- [ ] Screen reader tested
- [ ] Mobile responsive (320px - 2560px)
- [ ] Lighthouse Accessibility score ≥ 90

## 🔒 Security

- Never commit API keys or secrets to Git
- Use `.env.local` for sensitive data (add to `.gitignore`)
- Validate all form inputs
- Sanitize user-generated content
- Keep dependencies updated: `npm audit fix`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)

## 📞 Support

For questions about this codebase:
- Review documentation in `/docs` folder (see additional markdown files)
- Check component examples in `/components`
- Refer to page copy in root folder markdown files

## 📝 License

© 2026 Atlanta AI & Data Lab. All rights reserved.

---

**Built with ❤️ by students, for students.**
