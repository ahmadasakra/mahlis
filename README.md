# Rita Mahlis - Web-Plattform

Web-Plattform für Journalismus, Online-Unterricht und Kursverwaltung.

## 🚀 Setup

### 1. Environment Variables

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
MONGODB_URI=mongodb+srv://onlyonehrms_db_user:gY9BWcFD1HFgtz9K@cluster0mahlis.fcnnfxi.mongodb.net/?appName=Cluster0mahlis
ADMIN_API_KEY=rita_mahlis_admin_2024_secure_key_change_this
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Wichtig:** Ändere den `ADMIN_API_KEY` zu einem sicheren, zufälligen Wert!

### 2. Dependencies installieren

```bash
npm install
```

### 3. Development Server starten

```bash
npm run dev
```

Die App läuft dann auf [http://localhost:3000](http://localhost:3000)

## 📁 Projektstruktur

```
rita/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin API (CRUD für Kurse, Artikel, Bewertungen)
│   │   ├── courses/        # Öffentliche Kurs-API
│   │   ├── articles/      # Öffentliche Artikel-API
│   │   └── reviews/       # Bewertungs-API
│   ├── courses/           # Kurs-Seiten
│   ├── articles/          # Artikel-Seiten
│   ├── contact/           # Kontakt-Seite
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/
│   │   └── portfolio-hero.tsx  # Hero-Komponente
│   ├── ReviewForm.tsx     # Bewertungsformular
│   └── ReviewsList.tsx    # Bewertungsliste
├── lib/
│   ├── mongodb.ts         # MongoDB Connection
│   └── locale.tsx         # Mehrsprachigkeit (DE/AR)
├── models/
│   ├── Course.ts          # Kurs-Model
│   ├── Review.ts          # Bewertungs-Model
│   └── Article.ts         # Artikel-Model
└── .env.local             # Environment Variables (nicht im Git)
```

## 🔑 Admin API

Die Admin API ist unter `/api/admin` verfügbar und erfordert einen `x-api-key` Header.

### Beispiel: Neuen Kurs erstellen

```bash
curl -X POST http://localhost:3000/api/admin \
  -H "Content-Type: application/json" \
  -H "x-api-key: rita_mahlis_admin_2024_secure_key_change_this" \
  -d '{
    "type": "course",
    "titleDe": "Schreib-Workshop",
    "descriptionDe": "Lerne professionelles Schreiben",
    "language": "de",
    "price": 99,
    "status": "published"
  }'
```

### Beispiel: Alle Daten abrufen

```bash
curl -H "x-api-key: rita_mahlis_admin_2024_secure_key_change_this" \
  http://localhost:3000/api/admin
```

### Verfügbare Endpoints

- **GET** `/api/admin` - Alle Kurse, Bewertungen, Artikel + Statistiken
- **POST** `/api/admin` - Neues Element erstellen (`type: "course" | "article"`)
- **PUT** `/api/admin` - Element aktualisieren
- **DELETE** `/api/admin?type=course&id=...` - Element löschen

## 🌍 Mehrsprachigkeit

Die Plattform unterstützt Deutsch (DE) und Arabisch (AR) mit automatischem RTL-Support für Arabisch.

Die Sprache wird im Browser-LocalStorage gespeichert und kann über einen Language Switcher geändert werden (noch zu implementieren).

## 📝 Features

- ✅ Portfolio Hero Homepage
- ✅ Kursverwaltung (CRUD via Admin API)
- ✅ Bewertungssystem für Studenten
- ✅ Artikel/Blog-System
- ✅ Mehrsprachigkeit (DE/AR) mit RTL
- ✅ Responsive Design
- ✅ Dark/Light Theme Toggle
- ✅ MongoDB Atlas Integration

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Datenbank:** MongoDB Atlas (Mongoose)
- **UI:** shadcn/ui, Lucide Icons
- **i18n:** Custom Locale Context (DE/AR)

## 📦 Build für Production

```bash
npm run build
npm start
```

## 🔒 Sicherheit

- Admin API ist durch API-Key geschützt
- Environment Variables sollten nie committed werden
- MongoDB Connection String enthält Credentials - sicher aufbewahren!

## 📄 License

Private Projekt für Rita Mahlis
