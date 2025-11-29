# GoDaddy Domain Setup für Heroku

Diese Anleitung zeigt, wie du deine Domain `ritamahlis.com` von GoDaddy mit deiner Heroku-App verbindest.

## Voraussetzungen

1. Heroku App ist deployed und läuft
2. Domain `ritamahlis.com` ist bei GoDaddy registriert
3. Zugriff auf GoDaddy Domain Manager

## Schritt 1: Domain in Heroku hinzufügen

### Option A: Via Heroku CLI

```bash
# Füge die Domain hinzu
heroku domains:add ritamahlis.com
heroku domains:add www.ritamahlis.com

# Zeige die DNS Target Information
heroku domains
```

### Option B: Via Heroku Dashboard

1. Gehe zu deiner App im Heroku Dashboard
2. Klicke auf "Settings"
3. Scrolle zu "Domains"
4. Klicke auf "Add domain"
5. Füge `ritamahlis.com` hinzu
6. Füge `www.ritamahlis.com` hinzu

**Wichtig:** Notiere dir die DNS Target Information, die Heroku dir gibt. Sie sieht etwa so aus:
- `ritamahlis.com` → `your-app-name.herokuapp.com`
- `www.ritamahlis.com` → `your-app-name.herokuapp.com`

## Schritt 2: DNS Einstellungen in GoDaddy konfigurieren

### 2.1 GoDaddy Domain Manager öffnen

1. Gehe zu [GoDaddy.com](https://www.godaddy.com) und logge dich ein
2. Klicke auf "My Products"
3. Finde deine Domain `ritamahlis.com`
4. Klicke auf "DNS" oder "Manage DNS"

### 2.2 DNS Records hinzufügen/ändern

Du musst folgende DNS Records konfigurieren:

#### A) CNAME Record für www.ritamahlis.com

1. Klicke auf "Add" oder "Add Record"
2. Wähle Typ: **CNAME**
3. Name/Host: `www`
4. Value/Points to: `your-app-name.herokuapp.com` (deine Heroku App URL)
5. TTL: `600` (10 Minuten) oder Standard
6. Speichere

#### B) A Record für ritamahlis.com (Root Domain)

**WICHTIG:** Heroku verwendet keine A Records direkt. Du musst einen der folgenden Ansätze verwenden:

**Option 1: CNAME Record für Root Domain (Empfohlen)**

Einige DNS-Provider (inklusive GoDaddy) unterstützen CNAME Records für Root Domains (ALIAS oder ANAME Records):

1. Klicke auf "Add" oder "Add Record"
2. Wähle Typ: **CNAME** (oder **ALIAS** falls verfügbar)
3. Name/Host: `@` oder leer lassen (für Root Domain)
4. Value/Points to: `your-app-name.herokuapp.com`
5. TTL: `600`
6. Speichere

**Option 2: A Record mit Heroku IP (Nicht empfohlen, da IPs sich ändern können)**

Falls CNAME für Root Domain nicht funktioniert:

1. Klicke auf "Add" oder "Add Record"
2. Wähle Typ: **A**
3. Name/Host: `@` oder leer lassen
4. Value/Points to: `75.101.145.87` (Heroku IP - kann sich ändern!)
5. TTL: `600`
6. Speichere

**Besser:** Verwende einen DNS-Service wie Cloudflare, der ALIAS Records unterstützt.

### 2.3 Bestehende Records prüfen

Stelle sicher, dass keine konfliktierenden Records existieren:
- Entferne alte A Records für `@` (Root Domain)
- Entferne alte CNAME Records die auf andere Ziele zeigen

## Schritt 3: SSL/HTTPS aktivieren (Automatisch)

Heroku aktiviert automatisch SSL für Custom Domains:

```bash
# Prüfe SSL Status
heroku certs:auto

# Aktiviere automatische SSL (falls nicht aktiv)
heroku certs:auto:enable
```

Oder im Heroku Dashboard:
1. Gehe zu Settings → Domains
2. Klicke auf "Configure SSL"
3. Wähle "Automatic Certificate Management (ACM)"
4. Aktiviere es

**Wichtig:** SSL wird automatisch aktiviert, sobald die DNS Records korrekt propagiert sind (kann 24-48 Stunden dauern).

## Schritt 4: DNS Propagation prüfen

Nach dem Setzen der DNS Records kann es 24-48 Stunden dauern, bis sie weltweit propagiert sind.

### Prüfen ob DNS funktioniert:

```bash
# Prüfe DNS Records
dig ritamahlis.com
dig www.ritamahlis.com

# Oder online:
# https://www.whatsmydns.net/#A/ritamahlis.com
```

### Prüfen ob Domain auf Heroku zeigt:

```bash
# Prüfe Domain Status in Heroku
heroku domains

# Prüfe ob Domain erreichbar ist
curl -I https://ritamahlis.com
```

## Schritt 5: Next.js Base URL konfigurieren

Stelle sicher, dass `NEXT_PUBLIC_BASE_URL` in Heroku gesetzt ist:

```bash
heroku config:set NEXT_PUBLIC_BASE_URL="https://ritamahlis.com"
```

## Schritt 6: App neu starten (falls nötig)

```bash
heroku restart
```

## Troubleshooting

### Domain zeigt nicht auf Heroku

1. **Prüfe DNS Records:**
   ```bash
   dig ritamahlis.com
   dig www.ritamahlis.com
   ```
   - Sollte auf `your-app-name.herokuapp.com` zeigen

2. **Prüfe DNS Propagation:**
   - Verwende [whatsmydns.net](https://www.whatsmydns.net)
   - Warte 24-48 Stunden nach Änderungen

3. **Prüfe Heroku Domain Status:**
   ```bash
   heroku domains
   ```
   - Domain sollte als "configured" angezeigt werden

### SSL Zertifikat wird nicht erstellt

1. Warte 24-48 Stunden nach DNS Propagation
2. Prüfe ob DNS Records korrekt sind
3. Aktiviere ACM manuell:
   ```bash
   heroku certs:auto:enable
   ```

### www.ritamahlis.com funktioniert, aber ritamahlis.com nicht

- Das ist ein häufiges Problem mit Root Domain CNAME Records
- Lösung: Verwende einen DNS-Service wie Cloudflare, der ALIAS Records unterstützt
- Oder: Verwende einen A Record (weniger zuverlässig)

### Redirect von www zu non-www (oder umgekehrt)

Falls du alle Besucher auf eine Version umleiten möchtest, kannst du das in Next.js konfigurieren:

**Option 1: Via Middleware (empfohlen)**

Erstelle `middleware.ts` im Root-Verzeichnis:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Redirect www zu non-www (oder umgekehrt)
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Option 2: Via GoDaddy Domain Forwarding**

1. Gehe zu GoDaddy Domain Settings
2. Klicke auf "Forwarding"
3. Setze Forwarding für `www.ritamahlis.com` → `https://ritamahlis.com`
4. Wähle "Permanent (301)"

## GoDaddy spezifische Schritte (Screenshots-Beschreibung)

### DNS Records hinzufügen in GoDaddy:

1. **Gehe zu DNS Management:**
   - My Products → ritamahlis.com → DNS

2. **CNAME für www hinzufügen:**
   - Klicke auf "Add"
   - Type: CNAME
   - Name: `www`
   - Value: `your-app-name.herokuapp.com`
   - TTL: 600
   - Save

3. **CNAME für Root Domain:**
   - Klicke auf "Add"
   - Type: CNAME (oder ALIAS falls verfügbar)
   - Name: `@` (oder leer)
   - Value: `your-app-name.herokuapp.com`
   - TTL: 600
   - Save

## Checkliste

- [ ] Domain in Heroku hinzugefügt (`heroku domains:add`)
- [ ] DNS Records in GoDaddy konfiguriert
- [ ] CNAME für www.ritamahlis.com gesetzt
- [ ] CNAME/ALIAS für ritamahlis.com gesetzt
- [ ] NEXT_PUBLIC_BASE_URL in Heroku gesetzt
- [ ] SSL/HTTPS aktiviert (automatisch)
- [ ] DNS Propagation abgewartet (24-48h)
- [ ] Domain funktioniert (getestet)

## Support

Bei Problemen:
1. Prüfe Heroku Logs: `heroku logs --tail`
2. Prüfe DNS: `dig ritamahlis.com`
3. Prüfe Heroku Domain Status: `heroku domains`
4. Kontaktiere GoDaddy Support falls DNS Probleme

## Alternative: Cloudflare verwenden

Falls GoDaddy Probleme mit Root Domain CNAME macht, kannst du Cloudflare verwenden:

1. Transferiere DNS zu Cloudflare (kostenlos)
2. Cloudflare unterstützt ALIAS Records für Root Domains
3. Bessere Performance durch CDN
4. Kostenloses SSL

