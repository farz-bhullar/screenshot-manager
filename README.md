# 📸 Screenshot Manager

A lightweight JavaScript utility to capture screenshots of the **visible screen (viewport)** or specific **rectangles (x, y, width, height)**.  
Supports **interval-based automatic captures** and **manual one-time captures**, with **success & error callbacks**.

---

## ✨ Features
- ⏱️ Schedule screenshots at independent intervals per capture  
- 🖼️ Capture full visible screen or custom rectangles  
- 🖱️ Manual one-time captures (no interval)  
- ✅ `onSuccess(blob, id, config)` and ❌ `onError(error, id, config)` callbacks  
- 🔍 Thumbnails clickable to open in a new tab (demo)  
- 🧹 Clear captured previews (demo)  

---

## 🚀 Usage
1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/screenshot-manager.git
   cd screenshot-manager
   ```
2. Open `index.html` in your browser.  
3. Try:
   - Adding screenshots with intervals  
   - Capturing manual screenshots by specifying coordinates  
   - Clicking previews to open in a new tab  

---

## 📂 Project Structure
```
.
├── index.html
├── css/
│   └── style.css
└── js/
    ├── screenshot-manager.js   # ScreenshotManager class
    └── custom.js               # Demo / initialization logic
```

---

## 💡 Quick Start (Code)

```html
<!-- index.html -->
<link rel="stylesheet" href="css/style.css">
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
<script src="js/screenshot-manager.js"></script>
<script src="js/custom.js"></script>
```

```js
// js/custom.js

// Create the manager
const manager = new ScreenshotManager({
  screenshotConfigs: [
    { id: 'full-1', type: 'full', interval: 60000 } // full visible screen every 60s
  ],
  onSuccess: (blob, id, config) => {
    console.log('✅ Screenshot succeeded:', id, config);
    const url = URL.createObjectURL(blob);

    // Show preview + click to open
    const img = document.createElement('img');
    img.src = url;
    img.onclick = () => window.open(url, '_blank');
    document.getElementById('screenshots').appendChild(img);
  },
  onError: (error, id, config) => {
    console.error('❌ Screenshot failed:', id, error, config);
  }
});

// Add/update an interval-based rectangle capture later
manager.addOrUpdateScreenshotConfig('section-1', {
  type: 'section',
  x: 100, y: 80, width: 300, height: 200,
  interval: 120000 // 2 minutes
});

// Manual one-time full capture
manager.captureOnce({ type: 'full' }, 'manual-full');

// Manual one-time rectangle capture
manager.captureOnce({ type: 'section', x: 50, y: 50, width: 250, height: 150 }, 'manual-rect');
```

---

## 🧰 API

### Constructor
```js
new ScreenshotManager({
  screenshotConfigs = [],     // Array<{ id, type: 'full'|'section', x?, y?, width?, height?, interval }>
  onSuccess(blob, id, config),// Called on successful capture
  onError(error, id, config)  // Called on failure
})
```

### Methods
```js
addOrUpdateScreenshotConfig(id, config) // Add or update an interval-based capture
removeScreenshotConfig(id)              // Remove a scheduled capture by id
stopAllScreenshots()                    // Stop & clear all scheduled captures
captureOnce(config, id = 'manual')      // Manual one-time capture (no interval)
```

**Notes**
- **Full visible screen** uses current viewport size (`window.innerWidth`, `window.innerHeight`).  
- For `type: 'section'`, provide `{ x, y, width, height }` in **CSS pixels**.  

---

## 🌐 Connect
💼 [LinkedIn – Farzpal Singh](https://www.linkedin.com/in/farzpal)
