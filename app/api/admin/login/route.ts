import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Warnung in Production wenn Default Secret verwendet wird
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-secret-key-change-in-production') {
  console.warn('[SECURITY WARNING] JWT_SECRET is using default value! Change it immediately!');
}

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    
    const { email, password } = await request.json();

    // Validiere Eingabe
    if (!email || !password) {
      return NextResponse.json({ error: 'Email und Passwort sind erforderlich' }, { status: 400 });
    }

    // Hole Credentials aus Environment Variables
    const adminEmail = process.env.ADMIN_EMAIL;
    let rawPassword = process.env.ADMIN_PASSWORD;
    
    // Wenn ADMIN_PASSWORD leer ist, versuche es aus ADMIN_PASSWORD_B64 zu decoden
    // (Base64 wird verwendet, um Probleme mit $ Zeichen in .env.local zu vermeiden)
    if (!rawPassword || rawPassword.length === 0) {
      const base64Password = process.env.ADMIN_PASSWORD_B64;
      if (base64Password) {
        try {
          rawPassword = Buffer.from(base64Password, 'base64').toString('utf-8');
          if (isDev) {
            console.log('[DEV] Password decoded from BASE64');
          }
        } catch (e) {
          console.error('[ERROR] Failed to decode BASE64 password');
          return NextResponse.json({ error: 'Server-Konfigurationsfehler' }, { status: 500 });
        }
      }
    }
    
    // Entferne Anführungszeichen falls vorhanden (für .env.local Kompatibilität)
    let adminPassword = rawPassword;
    if (adminPassword && adminPassword.length > 0) {
      adminPassword = adminPassword.trim();
      // Entferne Anführungszeichen am Anfang und Ende
      if ((adminPassword.startsWith('"') && adminPassword.endsWith('"')) || 
          (adminPassword.startsWith("'") && adminPassword.endsWith("'"))) {
        adminPassword = adminPassword.slice(1, -1);
      }
    }

    // Validiere dass Credentials konfiguriert sind
    if (!adminEmail || !adminPassword) {
      console.error('[ERROR] Admin credentials not configured');
      return NextResponse.json({ error: 'Server-Konfigurationsfehler' }, { status: 500 });
    }

    // Vergleiche Email (case-insensitive)
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    // Vergleiche Passwort
    // Prüfe ob das Passwort bereits gehasht ist (beginnt mit $2a$ oder $2b$)
    const isHashed = adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$');
    
    let passwordMatch = false;
    try {
      if (isHashed) {
        passwordMatch = await bcrypt.compare(password, adminPassword);
      } else {
        // Fallback: Direkter Vergleich wenn nicht gehasht (für Migration)
        passwordMatch = password === adminPassword;
      }
    } catch (bcryptError: any) {
      console.error('[ERROR] Bcrypt comparison failed:', bcryptError?.message);
      return NextResponse.json({ error: 'Fehler bei der Passwort-Überprüfung' }, { status: 500 });
    }
    
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    // Erstelle JWT Token
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' } // Token gültig für 7 Tage
    );

    // Erstelle Response mit Cookie
    const response = NextResponse.json({ success: true, message: 'Login erfolgreich' });
    
    // Setze HttpOnly Cookie für Sicherheit
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Nur HTTPS in Production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[ERROR] Login failed:', error?.message || 'Unknown error');
    // In Production keine Details preisgeben
    return NextResponse.json({ 
      error: 'Fehler beim Anmelden'
    }, { status: 500 });
  }
}

// Logout Route
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logout erfolgreich' });
  response.cookies.delete('admin_token');
  return response;
}

