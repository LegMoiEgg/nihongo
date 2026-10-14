# Shop-Item-Icons

Hier kommen eigene Icon-Bilder für Shop-Items rein (statt der Emojis).

## So fügst du ein Icon hinzu

1. Lege die Bilddatei in diesen Ordner, z. B. `power.png` oder `miku.svg`.
   - Empfohlen: quadratisch, mind. 128×128 px, PNG (mit Transparenz) oder SVG.
   - Dateiname am besten klein und ohne Leerzeichen (z. B. `frieren.png`).

2. Trage den Dateinamen beim passenden Item in `src/data/shop.ts` als
   `iconImage` ein, z. B.:

   ```ts
   {
     id: 'accent-power',
     name: 'Power-Pink',
     // ...
     icon: '😈',                 // bleibt als Fallback, falls das Bild fehlt
     iconImage: 'power.png',     // <-- Datei aus diesem Ordner
     // ...
   }
   ```

3. Fertig. Die App zeigt dann automatisch das Bild statt des Emojis — überall,
   wo das Item-Icon erscheint (Shop-Karte, Vorschau, Anpassen-Menü).

## Hinweise

- Fehlt `iconImage` oder wird die Datei nicht gefunden, fällt die App auf das
  Emoji (`icon`) zurück — es bricht also nichts.
- Unterstützte Formate: PNG, JPG, WEBP, SVG, GIF.
- Die Bilder werden beim Build mitgebündelt (Vite), daher bitte wirklich in
  diesen Ordner legen und nicht nur verlinken.
