# 🔧 XCS Reader

> 🌐 **[Version française](README_FR.md)**

**xTool Creative Space file reader (.xcs)**

A static web application that reads and displays the contents of XCS files used by xTool Creative Space laser engraving/cutting software.

## ✨ Features

- 📁 **Easy loading**: Drag & drop or file selection
- 📊 **Structured display**: Information organized in tabs
- 🖼️ **Image preview**: Automatic decoding of embedded base64 images
- 🔍 **Path visualization**: SVG rendering of paths/vectors
- 📐 **Distance calculation**: Automatic measurement between elements
- 🔗 **Smart navigation**: Link between processing parameters and elements
- 🌍 **Multilingual**: French and English interface
- 💾 **No installation**: Works directly in the browser

## 📋 Tabs

1. **General** - File metadata (name, version, software, creation date)
2. **Device** - Target machine information (model, firmware, work area)
3. **Cover** - Project thumbnail preview
4. **Canvas** - Workspace properties (dimensions, origin, rotation)
5. **Layers** - Project layer list with colors and processing types
6. **Processing** - Laser parameters (power, speed, passes, DPI)
7. **Elements** - List of all objects (images, paths, text)
8. **Distances** - Distance matrix between elements
9. **JSON** - Complete raw data with syntax highlighting

## 🚀 Usage

1. Open `index.html` in a modern browser
2. Drag & drop an XCS file or click to select it
3. Navigate through tabs to explore the contents

## 🔧 XCS Format

XCS files are JSON files containing:
- Images encoded in base64
- SVG path data
- Laser processing parameters
- Layer structure and colors
- Machine metadata

## 💻 Technologies

- HTML5 / CSS3 / JavaScript (vanilla)
- No external dependencies
- Compatible with all modern browsers

## 📁 Project Structure

```
XCSREADER/
├── index.html    # Main HTML structure
├── styles.css    # Styling (dark theme)
├── app.js        # Application logic
├── i18n.js       # Translations (FR/EN)
├── README.md     # Documentation (EN)
└── README_FR.md  # Documentation (FR)
```

## 🌐 Language Selection

The interface is available in French and English. The language can be changed via the dropdown menu in the top right corner. The preference is saved in the browser.

## 📝 License

Open source project - Free to use and modify.
