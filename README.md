# WhatsApp Privacy Blur Extension

A lightweight Chrome extension that **automatically blurs WhatsApp Web content** for privacy in public or work environments. **Hover to reveal** content re-blurs when the mouse leaves.
![Blurred View](Screenshots/WhatsappWebBlurred.png)
---

## Features

* **Automatic blur** of chat list, messages, media, names, and profile pictures
* **Hover to reveal** with smooth transitions
* **Dynamic support** for new messages and chat switching (MutationObserver)
* **Privacy-first**: no data collection, no network calls, works offline
* **Zero interference** with normal WhatsApp usage

---

## Installation

### Load Unpacked (Chrome / Chromium)

1. Download or clone this repository.
2. Open `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. Open **[https://web.whatsapp.com](https://web.whatsapp.com)**.

---

## Usage

* Open **WhatsApp Web**.
* All content is blurred by default.
* **Hover** over any blurred area to reveal it.
* Move the mouse away to re-apply blur.

---

## How It Works

* **Manifest V3** Chrome extension
* **Content script** injects CSS/JS on WhatsApp Web
* **CSS blur** (`filter: blur()`) for performance
* **MutationObserver** keeps blur applied to dynamic content

---

## Privacy & Security

* No data collection or storage
* No external connections
* Minimal permissions (WhatsApp Web only)
* Open-source and auditable

---

## Customization

Edit `styles.css`:

```css
.privacy-blur {
  filter: blur(8px); /* Adjust blur intensity */
  transition: filter 0.2s ease-in-out; /* Adjust speed */
}
```

---

## Compatibility

* Chrome 88+
* Edge, Brave, and other Chromium browsers

*Not compatible with Firefox, Safari, or the WhatsApp Desktop app.*

---

## License

Free to use, modify, and distribute.

---

## Version

**v1.0.0** — Initial release
