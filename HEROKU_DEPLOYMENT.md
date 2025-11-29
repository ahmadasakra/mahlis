# Heroku Deployment Guide

## Voraussetzungen

1. Heroku Account (kostenlos erstellbar auf [heroku.com](https://www.heroku.com))
2. Heroku CLI installiert: `brew install heroku/brew/heroku` (macOS) oder [Download](https://devcenter.heroku.com/articles/heroku-cli)
3. Git Repository (lokal oder auf GitHub)

## Schritt 1: Heroku CLI Login

```bash
heroku login
```

## Schritt 2: Heroku App erstellen

```bash
# Erstelle eine neue Heroku App
heroku create rita-mahlis

# Oder verwende einen eigenen Namen
heroku create dein-app-name
```

## Schritt 3: Node.js Version setzen

Stelle sicher, dass deine `package.json` eine `engines` Sektion hat:

```json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

## Schritt 4: Environment Variables setzen

Setze alle benötigten Environment Variables in Heroku:

```bash
# MongoDB
heroku config:set MONGODB_URI="dein_mongodb_connection_string"

# Admin Credentials
heroku config:set ADMIN_EMAIL="info@rita.com"
heroku config:set ADMIN_PASSWORD_B64="JDJiJDEwJGVBVXpJQTdZZG0wTmZ0dlhWNGJOeHUxd0lUYUo4ektCUk9qN244VlBWa1VRNDNaZThkaUlt"

# JWT Secret (WICHTIG: Ändere diesen Wert!)
heroku config:set JWT_SECRET="dein_starker_zufaelliger_secret_string"

# AWS S3
heroku config:set AWS_REGION="eu-central-1"
heroku config:set AWS_ACCESS_KEY_ID="dein_aws_access_key"
heroku config:set AWS_SECRET_ACCESS_KEY="dein_aws_secret_key"
heroku config:set AWS_S3_BUCKET_NAME="mahlis"

# Base URL (wird automatisch gesetzt, aber du kannst es überschreiben)
heroku config:set NEXT_PUBLIC_BASE_URL="https://dein-app-name.herokuapp.com"
```

### Alle Variablen auf einmal setzen

Du kannst auch eine `.env` Datei verwenden und dann:

```bash
# Erstelle eine .env.heroku Datei mit allen Variablen
# Dann:
heroku config:set $(cat .env.heroku | xargs)
```

## Schritt 5: Git Repository vorbereiten

```bash
# Stelle sicher, dass du in einem Git Repository bist
git init  # Falls noch nicht initialisiert
git add .
git commit -m "Initial commit for Heroku deployment"
```

## Schritt 6: Heroku Remote hinzufügen

```bash
# Wenn du die App bereits erstellt hast
heroku git:remote -a rita-mahlis

# Oder wenn du die App noch nicht erstellt hast
heroku create rita-mahlis
```

## Schritt 7: Deployen

```bash
# Deploye zur Heroku App
git push heroku main

# Oder falls dein Branch anders heißt:
git push heroku master
```

## Schritt 8: App öffnen

```bash
heroku open
```

## Wichtige Befehle

### Logs ansehen
```bash
heroku logs --tail
```

### Environment Variables anzeigen
```bash
heroku config
```

### Environment Variable löschen
```bash
heroku config:unset VARIABLE_NAME
```

### App neu starten
```bash
heroku restart
```

### App skalieren (falls nötig)
```bash
heroku ps:scale web=1
```

## Troubleshooting

### Build fehlgeschlagen

1. Prüfe die Logs: `heroku logs --tail`
2. Stelle sicher, dass alle Environment Variables gesetzt sind
3. Prüfe die Node.js Version in `package.json`

### App startet nicht

1. Prüfe ob `Procfile` vorhanden ist
2. Prüfe die Logs: `heroku logs --tail`
3. Stelle sicher, dass `npm run build` erfolgreich ist

### MongoDB Connection Error

1. Prüfe ob `MONGODB_URI` korrekt gesetzt ist
2. Stelle sicher, dass die MongoDB IP Whitelist deine Heroku IPs erlaubt
3. Prüfe die MongoDB Connection String Format

### Login funktioniert nicht

1. Prüfe ob `ADMIN_PASSWORD_B64` korrekt gesetzt ist
2. Prüfe ob `ADMIN_EMAIL` korrekt ist
3. Prüfe die Server-Logs: `heroku logs --tail`

## Kostenlose Heroku Limits

- **Dyno Hours**: 550 Stunden/Monat (kostenlos)
- **Sleep Mode**: App schläft nach 30 Minuten Inaktivität (kostenloser Plan)
- **Database**: MongoDB Atlas (kostenloser M0 Plan verfügbar)

## Upgrade auf Paid Plan

Falls du keinen Sleep Mode möchtest:
```bash
heroku ps:scale web=1:standard-1x
```

## Custom Domain hinzufügen

```bash
heroku domains:add www.deine-domain.com
heroku domains:add deine-domain.com
```

Dann konfiguriere DNS Records bei deinem Domain Provider.

## Automatisches Deployment von GitHub

1. Verbinde dein GitHub Repository in Heroku Dashboard
2. Aktiviere "Automatic deploys" für den `main` Branch
3. Jeder Push zu `main` deployt automatisch

## Sicherheits-Checkliste

- [ ] `JWT_SECRET` wurde geändert (nicht der Default-Wert)
- [ ] `ADMIN_PASSWORD` wurde geändert (nicht `admin123`)
- [ ] Alle Environment Variables sind gesetzt
- [ ] MongoDB Connection String ist sicher
- [ ] AWS Credentials sind sicher gespeichert
- [ ] HTTPS ist aktiviert (automatisch bei Heroku)

## Support

Bei Problemen:
1. Prüfe die Logs: `heroku logs --tail`
2. Prüfe die Heroku Dashboard für mehr Details
3. Siehe [Heroku Next.js Documentation](https://devcenter.heroku.com/articles/deploying-nextjs-apps)

