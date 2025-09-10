# Crown Aviation CEO Simulator – New Edition

Dieses Repository enthält die nächste Generation des Crown Aviation CEO Simulators.  
Die Anwendung wurde von Grund auf neu konzipiert und setzt auf moderne Front‑End‑Technologien sowie eine modulare Architektur.

## Features

- **Dark Mode & Liquid‑Glass Look** – die gesamte Oberfläche basiert auf einem dunklen Farbschema, abgerundet durch Glassmorphism‑Panels, abgerundete Ecken und elegante Schatten.  
- **User‑Driven Theme** – bei der Registrierung wählt der User zwei Farben, die als Primär- und Sekundärfarben in der gesamten UI eingesetzt werden (per CSS Variablen).  
- **Onboarding & Auth** – einfache Registrierung/Login mit lokalem Passwort.  
  - Logo‑Wizard: In der Registrierung kann der Nutzer ein generiertes Logo auswählen oder entfernen.  
- **Dashboard** – übersichtliche KPI‑Karten, Event‑Feed sowie ein Chat, der über eine Netlify‑Function mit OpenAI verbunden ist (Streaming‑API).  
- **Operation Control Center (OCC)** – Liste aktiver Flüge, Detail‑Pane mit Quick‑Actions und Genehmigungs‑Queue für mittlere/hohe Auswirkungen.  
- **Modularer Aufbau** – Flotte, Finanzen und weitere Module können einfach ergänzt werden.  
- **Netlify Functions** – bereitgestellte Serverless Functions für ChatGPT (SSE) und DALL·E Image Generation (Logo).  

## Installation & Betrieb

1. **Repo klonen**
   ```bash
   git clone <dieses-repo>
   cd airline-ceo-simulator
   ```
2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```
3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   Die Anwendung läuft dann unter `http://localhost:5173`.

4. **Deploy auf Netlify**
   - Verbinde das Repo mit Netlify und aktiviere die Netlify Functions.  
   - Setze das Environment‑Variable `OPENAI_API_KEY` in den Netlify‑Einstellungen.  
   - Deploye den Branch `main` oder `production`.  

## Projektstruktur

- `src/`: Alle React‑Komponenten, Hooks und Types.  
  - `components/Auth.tsx`: Registrierung und Login inkl. Color Picker und Logo‑Wizard.  
  - `components/Dashboard.tsx`: KPI‑Cards, Event Feed, AI Chat.  
  - `components/OCC.tsx`: Flüge, Detail‑Pane, Actions, Approval Queue.  
  - `hooks/useChat.ts`: Hook zur Kommunikation mit der ChatGPT‑Function (Streaming).  
- `netlify/functions/`: Serverless Functions für Chat und DALL·E.  
  - `chatgpt.js`: Proxy zur OpenAI Chat API (streamt SSE an den Browser).  
  - `dalle.js`: Generiert Logos über die OpenAI Image API.  
- `public/`: Statische Assets und HTML‑Entry‑Point.  
- `tailwind.config.cjs` & `postcss.config.js`: Tailwind‑ und PostCSS‑Konfiguration.  

## Weiterentwicklung

- Die Anwendung nutzt vorerst keine Datenbank.  
  Alle Daten (Airline‑Konfigurationen, Flüge, Aktionen) werden im Browser gespeichert.  
  Eine Anbindung an eine echte Datenbank (z. B. Fauna, Supabase) kann später einfach integriert werden.  
- Module wie **Fleet**, **Finance**, **PR/Comms** sind als Platzhalter angelegt und können je nach Wunsch erweitert werden.  
- Die Chat‑Rollen sowie das JSON‑Action‑Schema sollten analog zum Vorgängerprojekt beibehalten werden.  

## Lizenz

Dieses Projekt steht unter der MIT‑Lizenz.