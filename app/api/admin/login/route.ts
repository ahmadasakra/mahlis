import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('=== LOGIN REQUEST START ===');
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    // Validiere Eingabe
    if (!email || !password) {
      console.log('Missing email or password');
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
          console.log('✓ Decoded password from BASE64');
          console.log('Decoded password length:', rawPassword.length);
          console.log('Decoded password starts with $:', rawPassword.startsWith('$'));
        } catch (e) {
          console.error('✗ Failed to decode BASE64 password:', e);
        }
      } else {
        console.log('⚠ ADMIN_PASSWORD_B64 not found');
      }
    } else {
      console.log('✓ Using ADMIN_PASSWORD directly');
    }
    
    // Debug: Zeige alle Environment Variables die mit ADMIN_ beginnen
    console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
    const adminEnvKeys = Object.keys(process.env).filter(k => k.startsWith('ADMIN_'));
    console.log('All ADMIN_* env vars found:', adminEnvKeys);
    console.log('ADMIN_EMAIL raw:', adminEmail);
    console.log('ADMIN_EMAIL type:', typeof adminEmail);
    console.log('ADMIN_EMAIL length:', adminEmail?.length);
    console.log('ADMIN_PASSWORD raw (first 15 chars):', rawPassword ? `${rawPassword.substring(0, 15)}...` : 'undefined');
    console.log('ADMIN_PASSWORD type:', typeof rawPassword);
    console.log('ADMIN_PASSWORD length:', rawPassword?.length);
    console.log('ADMIN_PASSWORD is undefined:', rawPassword === undefined);
    console.log('ADMIN_PASSWORD is null:', rawPassword === null);
    console.log('ADMIN_PASSWORD is empty string:', rawPassword === '');
    if (rawPassword) {
      console.log('ADMIN_PASSWORD starts with $:', rawPassword.startsWith('$'));
      console.log('ADMIN_PASSWORD starts with ":', rawPassword.startsWith('"'));
      console.log('ADMIN_PASSWORD starts with \':', rawPassword.startsWith("'"));
      console.log('ADMIN_PASSWORD first char code:', rawPassword.charCodeAt(0));
    }
    
    // Entferne Anführungszeichen falls vorhanden (für .env.local Kompatibilität)
    // Next.js kann Anführungszeichen in .env.local Dateien behalten
    let adminPassword = rawPassword;
    if (adminPassword && adminPassword.length > 0) {
      // Entferne sowohl einfache als auch doppelte Anführungszeichen am Anfang und Ende
      adminPassword = adminPassword.trim();
      // Entferne Anführungszeichen am Anfang
      if ((adminPassword.startsWith('"') && adminPassword.endsWith('"')) || 
          (adminPassword.startsWith("'") && adminPassword.endsWith("'"))) {
        adminPassword = adminPassword.slice(1, -1);
      }
      console.log('After removing quotes, length:', adminPassword.length);
      console.log('After removing quotes, first 10 chars:', adminPassword.substring(0, 10));
      console.log('After removing quotes, starts with $:', adminPassword.startsWith('$'));
    } else {
      console.log('WARNING: adminPassword is empty or falsy');
      console.log('Raw password value:', rawPassword);
      console.log('Raw password type:', typeof rawPassword);
    }

    console.log('=== PROCESSED VALUES ===');
    console.log('Admin Email configured:', !!adminEmail);
    console.log('Admin Password configured:', !!adminPassword);
    console.log('Admin Password length after cleanup:', adminPassword?.length || 0);
    console.log('Admin Password first 10 chars:', adminPassword?.substring(0, 10) || 'undefined');

    if (!adminEmail || !adminPassword) {
      console.error('=== ERROR: Missing credentials ===');
      console.error('ADMIN_EMAIL exists:', !!adminEmail);
      console.error('ADMIN_EMAIL value:', adminEmail || 'undefined');
      console.error('ADMIN_PASSWORD exists:', !!adminPassword);
      console.error('ADMIN_PASSWORD raw value:', rawPassword || 'undefined');
      console.error('ADMIN_PASSWORD processed value:', adminPassword || 'undefined');
      return NextResponse.json({ error: 'Server-Konfigurationsfehler. Bitte überprüfe die Environment Variables.' }, { status: 500 });
    }

    // Vergleiche Email (case-insensitive)
    console.log('=== EMAIL COMPARISON ===');
    console.log('Input email:', email.toLowerCase().trim());
    console.log('Admin email:', adminEmail.toLowerCase().trim());
    console.log('Email match:', email.toLowerCase().trim() === adminEmail.toLowerCase().trim());
    
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      console.log('Email mismatch - returning 401');
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    // Vergleiche Passwort
    console.log('=== PASSWORD COMPARISON ===');
    // Prüfe ob das Passwort bereits gehasht ist (beginnt mit $2a$ oder $2b$)
    const isHashed = adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$');
    console.log('Password is hashed:', isHashed);
    console.log('Password hash prefix:', adminPassword.substring(0, 7));
    console.log('Input password length:', password.length);
    
    let passwordMatch = false;
    try {
      if (isHashed) {
        console.log('Comparing with bcrypt...');
        passwordMatch = await bcrypt.compare(password, adminPassword);
        console.log('Bcrypt comparison result:', passwordMatch);
      } else {
        console.log('Comparing directly (not hashed)...');
        // Fallback: Direkter Vergleich wenn nicht gehasht (für Migration)
        passwordMatch = password === adminPassword;
        console.log('Direct comparison result:', passwordMatch);
      }
    } catch (bcryptError: any) {
      console.error('=== BCRYPT ERROR ===');
      console.error('Bcrypt comparison error:', bcryptError);
      console.error('Error message:', bcryptError?.message);
      console.error('Error stack:', bcryptError?.stack);
      return NextResponse.json({ error: 'Fehler bei der Passwort-Überprüfung' }, { status: 500 });
    }
    
    console.log('=== FINAL PASSWORD CHECK ===');
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password mismatch - returning 401');
      return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }

    // Erstelle JWT Token
    console.log('=== CREATING JWT TOKEN ===');
    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' } // Token gültig für 7 Tage
    );
    console.log('JWT token created, length:', token.length);

    // Erstelle Response mit Cookie
    const response = NextResponse.json({ success: true, message: 'Login erfolgreich' });
    
    // Setze HttpOnly Cookie für Sicherheit
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
      path: '/',
    });
    
    console.log('=== LOGIN SUCCESS ===');
    console.log('Cookie set, returning success response');

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json({ 
      error: 'Fehler beim Anmelden',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 });
  }
}

// Logout Route
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logout erfolgreich' });
  response.cookies.delete('admin_token');
  return response;
}

