# Narova Minecraft Server Landing Page

A beautiful, Apple-inspired landing page for the Narova Minecraft server. This single-page website features a modern design with smooth animations, responsive layout, and interactive elements.

## 🎮 Features

### Design & Layout
- **Apple-inspired design** with clean typography and smooth animations
- **Fully responsive** - looks great on desktop, tablet, and mobile
- **Floating navigation bar** with iOS-style rounded corners and backdrop blur
- **Full-screen hero section** with video background and call-to-action button

### Sections
1. **Hero Section** - Full-screen welcome with video background
2. **Intro Section** - Information about the Minecraft server and features
3. **Players Section** - iOS-style table showing online players with gradient avatars
4. **Join Section** - Server connection options for Java and Bedrock editions
5. **Staff Section** - Links to staff portal and volunteer application
6. **Footer** - Quick links and company information

### Interactive Features
- **Smooth scrolling navigation** between sections
- **Copy to clipboard** functionality for server addresses
- **Auto-launch Minecraft** for Java edition (desktop only)
- **Mobile instructions modal** for Bedrock edition
- **Animated notifications** for user feedback
- **Hover effects** and micro-interactions
- **Mobile-responsive hamburger menu**

## 🚀 Getting Started

### Prerequisites
- A web server (local or hosted)
- Modern web browser with JavaScript enabled

### Installation
1. Download all files to your web server directory
2. Open `index.html` in your browser
3. Customize the content as needed (see Customization section)

### File Structure
```
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Customization

### Server Information
Update the server addresses in `index.html`:
```html
<!-- Java Edition -->
<span class="address-text">mc.narova.org:25565</span>

<!-- Bedrock Edition -->
<span class="address-text">mc.narova.org:19132</span>
```

### Player List
Modify the `samplePlayers` array in `script.js` to show real player data:
```javascript
const samplePlayers = [
    { name: 'PlayerName', status: 'online', playtime: '2h 15m' },
    // Add more players...
];
```

### Links and URLs
Update the following URLs in `index.html`:
- Staff Portal: `https://staffing-mc.knovon.org`
- Volunteer Application: `https://forms.gle/hxRSL6g6xk2mm8Jm7`
- Legal: `https://legal.knovon.net`

### Branding
- Replace placeholder logo images with your actual logo
- Update color scheme in `styles.css` (search for `#007AFF`, `#4A90E2`, etc.)
- Modify the hero video background URL

### Hero Video
Replace the sample video URL in `index.html`:
```html
<source src="your-video-url.mp4" type="video/mp4">
```

## 📱 Responsive Design

The website is fully responsive and includes:
- **Desktop**: Full layout with floating navigation
- **Tablet**: Adjusted grid layouts and spacing
- **Mobile**: Hamburger menu, stacked layouts, optimized touch targets

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter font family)

### Key Features
- **Backdrop Filter** - Glass morphism effects
- **CSS Grid & Flexbox** - Modern layout techniques
- **Intersection Observer** - Scroll-based animations
- **Clipboard API** - Modern copy functionality
- **CSS Custom Properties** - Maintainable styling

### Performance Optimizations
- Lazy loading for animations
- Efficient DOM manipulation
- Optimized CSS selectors
- Minimal JavaScript footprint

## 🎨 Color Scheme

The design uses a modern color palette inspired by Apple's design language:
- **Primary Blue**: #007AFF
- **Secondary Purple**: #5856D6
- **Success Green**: #34C759
- **Warning Orange**: #FF9500
- **Error Red**: #FF3B30
- **Text Dark**: #1d1d1f
- **Text Light**: #86868b

## 📝 License

This project is created for the Narova Minecraft server. Feel free to modify and use for your own projects.

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions about this landing page, please email mcteam@knovon.org

---

**Built with ❤️ for the Minecraft community** 
