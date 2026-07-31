# Skill: PWA Patterns

## Descripció
Aquesta skill defineix els patrons de disseny per a l'aplicació PWA de l'Operari. L'entorn de treball sovint inclou condicions extremes (llum del sol brillant, mans brutes, utilització amb una sola mà, pèrdua de cobertura a la muntanya/soterrani). El disseny se centra en "L'operari triga menys de 30 segons a reportar" mitjançant elements d'interfície massius, contrast alt i zones tàctils considerables.

## Template

### Patrons Principals
1. **Touch Targets Massius**: Mínim 48x48px (Ideal 64px per botons principals).
2. **Bottom Navigation**: Controls a la zona del polze.
3. **Indicador Offline**: Feedback constant d'estat de xarxa i cua de sincronització.
4. **Contrast Alt**: Colors clars/foscos forts per sobre del gris subtil.

### Bottom Navigation Component
```tsx
// src/components/pwa/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Camera, Wrench, AlertTriangle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/feines', icon: ClipboardList, label: 'Feines' },
  { href: '/camera', icon: Camera, label: 'Càmera' },
  { href: '/material', icon: Wrench, label: 'Material' },
  { href: '/incidencia', icon: AlertTriangle, label: 'Incidència' },
  { href: '/perfil', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border pb-safe flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full space-y-1 text-muted-foreground transition-colors",
              isActive && "text-primary font-semibold"
            )}
          >
            <item.icon className={cn("w-7 h-7", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] leading-none">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

### Botó d'Acció Tàctica (START/STOP)
```tsx
// src/components/pwa/ActionPanel.tsx
import { Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ActionPanel({ status, onStart, onStop }: { status: 'idle' | 'running', onStart: () => void, onStop: () => void }) {
  return (
    <div className="p-4 mt-auto mb-24">
      {status === 'idle' ? (
        <Button 
          size="xl" 
          onClick={onStart}
          className="w-full bg-success hover:bg-success/90 text-white shadow-xl h-20 text-2xl"
        >
          <Play className="w-8 h-8 mr-4 fill-current" />
          INICIAR FEINA
        </Button>
      ) : (
        <Button 
          size="xl" 
          variant="danger"
          onClick={onStop}
          className="w-full shadow-xl h-20 text-2xl"
        >
          <Square className="w-8 h-8 mr-4 fill-current" />
          FINALITZAR
        </Button>
      )}
    </div>
  )
}
```

### Indicador d'Estat Offline
```tsx
// src/components/pwa/OfflineBadge.tsx
'use client'

import { WifiOff } from 'lucide-react'
import { useEffect, useState } from 'react'

export function OfflineBadge({ pendingTasksCount = 0 }) {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // [PLACEHOLDER]: Connectar al context de Celery/Sincronització
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    setIsOffline(!navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOffline && pendingTasksCount === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-warning text-warning-foreground px-4 py-2 flex items-center justify-center text-sm font-bold z-[60]">
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 mr-2" />
          Sense connexió - Treballant fora de línia
        </>
      ) : (
        <>
          <span className="animate-pulse mr-2">🔄</span>
          Sincronitzant {pendingTasksCount} elements pendents...
        </>
      )}
    </div>
  )
}
```

## Exemple d'ús
En l'aplicació mòbil (`app/operari/layout.tsx`), hem d'incloure el `BottomNav`, configurar els espais segurs de la part inferior per a pantalles amb "notch", i col·locar el `OfflineBadge` a la part superior. Totes les llistes de verificació (Checklists) haurien de tenir `padding` i marges amplis per ser controlades amb guants.

## Validació
- Comprovar que tots els botons d'interacció principal tinguin almenys una mida de 48x48px (ideal 64px a l'Operari PWA).
- Comprovar que els textos crítics (com el nom del client o la tasca actual) tinguin alt contrast sota llum forta.
- Simulador Chrome (F12) -> Xarxa -> "Offline", hauria d'aparèixer la barra taronja amb "Sense connexió".

## Errors comuns
- Posar els botons d'acció principals a la part superior de la pantalla (lluny del polze).
- Ús d'icones grises subtils per indicar estats importants, la qual cosa resulta il·legible a ple sol.
- Mostrar errors tècnics HTTP/PostgreSQL directament a l'usuari en comptes de missatges en català amistosos (ex. "No hem pogut connectar. Es guardarà per enviar més tard.").
