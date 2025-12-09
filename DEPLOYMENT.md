# Deployment Guide

## Environment Variables

Für das Deployment müssen folgende Environment Variables gesetzt werden:

### Erforderliche Variablen

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Admin Login Credentials
ADMIN_EMAIL=info@rita.com
ADMIN_PASSWORD_B64=JDJiJDEwJGVBVXpJQTdZZG0wTmZ0dlhWNGJOeHUxd0lUYUo4ektCUk9qN244VlBWa1VRNDNaZThkaUlt

# JWT Secret (wichtig: ändere dies in Production!)
JWT_SECRET=rita_mahlis_jwt_secret_2024_change_in_production

# AWS S3 Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=mahlis

# Base URL (für Production)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Wichtige Hinweise

1. **ADMIN_PASSWORD_B64**: Das Passwort wird als Base64-encoded String gespeichert, um Probleme mit Sonderzeichen (wie `$`) zu vermeiden. Das ursprüngliche Passwort ist `admin123` (bcrypt gehasht).

2. **JWT_SECRET**: **WICHTIG**: Ändere diesen Wert in Production! Verwende einen starken, zufälligen String.

3. **AWS S3**: Stelle sicher, dass der S3 Bucket die richtigen Permissions hat:
   - Bucket Policy für öffentlichen Lesezugriff auf Uploads
   - CORS konfiguriert
   - Block Public Access deaktiviert (nur für den Upload-Ordner)

### Passwort ändern

Um das Admin-Passwort zu ändern:

1. Generiere einen neuen bcrypt Hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('dein_neues_passwort', 10).then(hash => console.log(hash));"
   ```

2. Encode den Hash als Base64:
   ```bash
   node -e "const hash = 'DEIN_BCRYPT_HASH'; console.log(Buffer.from(hash).toString('base64'));"
   ```

3. Setze `ADMIN_PASSWORD_B64` in den Environment Variables.

## Deployment Plattformen

### Vercel

1. Füge alle Environment Variables in den Vercel Project Settings hinzu
2. Deploy automatisch via Git oder manuell via CLI

### Netlify

1. Füge alle Environment Variables in den Netlify Site Settings hinzu
2. Deploy automatisch via Git oder manuell via CLI

### Andere Plattformen

Stelle sicher, dass:
- Alle Environment Variables gesetzt sind
- Node.js Version 18+ verwendet wird
- Die Build-Kommandos korrekt sind (`npm run build`)

## Sicherheits-Checkliste

- [ ] JWT_SECRET wurde geändert (nicht der Default-Wert)
- [ ] ADMIN_PASSWORD wurde geändert (nicht `admin123`)
- [ ] AWS Credentials sind sicher gespeichert
- [ ] MongoDB Connection String ist sicher
- [ ] HTTPS ist aktiviert (für Production)
- [ ] Cookie `secure` Flag ist aktiviert (automatisch in Production)

## Troubleshooting

### Login funktioniert nicht

1. Prüfe ob `ADMIN_PASSWORD_B64` gesetzt ist
2. Prüfe ob `ADMIN_EMAIL` korrekt ist
3. Prüfe die Server-Logs für Fehler

### Bilder werden nicht hochgeladen

1. Prüfe AWS S3 Credentials
2. Prüfe S3 Bucket Permissions
3. Prüfe CORS Konfiguration



