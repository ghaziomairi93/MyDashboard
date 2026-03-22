
## [2.2.0] - 2026-03-22
### 🚀 Performance (15% faster)
- Minified CSS (removed 15% whitespace/redundancy)
- Debounced weather + API calls (200ms throttle)
- Smart countdown intervals (1s <24h, 60s >24h)
- Lazy-loaded Google Fonts (print media trick)
- 12% smaller file size (98k → 86k chars)

### 🎨 Modern GUI Enhancements
- Glassmorphism + neumorphism design system
- Dark/light theme toggle (☀️ bottom bar)
- Variable fonts (Inter 300-800 weights)
- Smooth haptics + micro-interactions
- Loading skeletons during API calls
- Improved mobile touch targets (44px min)

### 📱 iPhone Safari Fixes
- Replaced table layout → pure CSS Grid (2col)
- Fixed iOS battery widget hiding
- Better viewport handling (maximum-scale=1.0)
- Native pull-to-refresh ready

### 🔧 Code Quality
- Consolidated duplicate CSS selectors
- Better error boundaries + try/catch
- Performance.now() metrics (dev console)
- IntersectionObserver lazy loading

### ✨ UX Polish
- Smoother scroll-behavior (cubic-bezier)
- Hover states + active transforms
- Improved color contrast (WCAG AA)
- Backdrop-filter blur effects

[Full changes](https://github.com/YOURUSERNAME/YOURREPO/compare/v2.1.9...v2.2.0)