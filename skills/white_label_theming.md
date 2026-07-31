# Skill: White-Label Theming

## Descripció
Aquesta skill estableix com CampoPro s'adapta visualment (marca blanca) per a cada empresa client. L'objectiu és carregar dinàmicament els colors corporatius i el logotip basant-se en l'empresa de l'usuari o en el domini personalitzat. Aquest procés es realitza mitjançant variables CSS inyectades al `<body>`, la generació de manifests PWA dinàmics i un middleware de Next.js per la detecció del domini.

## Template

### CSS Variables i Root (app/globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors per defecte (CampoPro Base) */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    
    /* Primary: Blau Fosc (#1E3A5F) per defecte, serà sobreescrit per marca blanca */
    --primary: 214 52% 24%;
    --primary-foreground: 210 40% 98%;
    
    /* Secondary: Ambre Càlid (#D97706) per defecte */
    --secondary: 38 92% 44%;
    --secondary-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 214 52% 24%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    
    --primary: 214 52% 44%; /* Ajustat per Dark Mode */
    --primary-foreground: 210 40% 98%;
    
    --secondary: 38 92% 54%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 214 52% 44%;
  }
}
```

### Proveïdor de Tema de l'Empresa (components/ThemeProvider.tsx)
```tsx
'use client'

import React, { useEffect } from 'react'

interface EmpresaConfig {
  primaryColorHsl: string; // Ex: "214 52% 24%"
  secondaryColorHsl: string;
  logoUrl: string;
}

export function ThemeProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode, 
  config?: EmpresaConfig 
}) {
  useEffect(() => {
    if (config) {
      const root = document.documentElement;
      root.style.setProperty('--primary', config.primaryColorHsl);
      root.style.setProperty('--secondary', config.secondaryColorHsl);
      // Ajustar colors de foreground segons contrast si fos necessari
    }
  }, [config]);

  return <>{children}</>;
}
```

### Next.js Middleware (middleware.ts)
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  
  // Lògica per extreure el domini i determinar el tenant/empresa
  // Això es pot passar com a capçalera o reescriure la URL
  const response = NextResponse.next()
  
  // Guardem l'empresa identificada a les capçaleres per llegir-la als Server Components
  if (hostname && !hostname.includes('campopro.local')) {
      const tenantDomain = hostname.split('.')[0]; // Simplificat
      response.headers.set('x-tenant-domain', tenantDomain)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## Exemple d'ús

Dins del Layout arrel (app/layout.tsx):
```tsx
import { ThemeProvider } from '@/components/ThemeProvider'
import { headers } from 'next/headers'

// [PLACEHOLDER]: Funció per obtenir config de DB (asyncpg)
async function getEmpresaConfig(domain: string | null) {
  if (domain === 'jardineria-pep') {
    return {
      primaryColorHsl: "142 71% 45%", // Verd Menta
      secondaryColorHsl: "38 92% 44%",
      logoUrl: "https://s3.aws.com/campopro/logos/pep.png"
    }
  }
  return null; // Utilitzar defecte
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const domain = headers().get('x-tenant-domain')
  const config = await getEmpresaConfig(domain)

  return (
    <html lang="ca">
      <body>
        <ThemeProvider config={config}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Validació
- Comprovar que iniciar sessió o accedir amb un domini de client actualitza els colors a la interfície.
- Comprovar que el manifest PWA (`/manifest.json`) retorna el `theme_color` i els icons correctes basats en el tenant demanant la URL.
- Comprovar que les pàgines impreses (PDF) inclouen la capçalera de l'empresa.

## Errors comuns
- Guardar valors Hex a les variables CSS que esperen HSL (Tailwind requereix un format específic quan s'utilitza la sintaxi de variants d'opacitat com `bg-primary/50`).
- No preveure colors accessibles quan el client escull un color primari molt clar (el `primary-foreground` hauria de calcular-se com a negre en lloc de blanc).
- Referenciar Supabase Storage (Recorda: utilitza AWS S3 amb presigned URLs).
