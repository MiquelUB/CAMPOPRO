# Skill: Design System

## Descripció
Aquesta skill defineix el sistema de disseny global per a CampoPro, garantint una interfície d'usuari (UI) consistent, accessible i adaptable per a les dues aplicacions principals: Operari PWA (mòbil) i Gestió Dashboard (escriptori). El sistema es basa en Next.js 14, Tailwind CSS 3.4, i variables CSS (custom properties) per permetre la tematització de marca blanca (white-label). Utilitzem Lucide React per a la iconografia.

## Template

### Configuració de Tailwind CSS (tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Marca Blanca
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Marca Blanca
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "#16a34a", // green-600
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b", // amber-500
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#dc2626", // red-600
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3b82f6", // blue-500
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

### Components Base

```tsx
// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        danger: "bg-error text-white hover:bg-error/90",
      },
      size: {
        default: "h-10 px-4 py-2", // General
        sm: "h-9 rounded-md px-3", // Dashboard
        lg: "h-14 rounded-md px-8 text-lg font-semibold", // Operari Primary Actions
        xl: "h-16 w-full rounded-xl px-8 text-xl font-bold uppercase tracking-wider", // Operari START/STOP
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## Exemple d'ús

```tsx
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"

export function IniciarTasca() {
  return (
    <div className="p-4 bg-background h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Tasca #1234</h1>
      {/* Botó massiu per operaris sota el sol brillant */}
      <Button size="xl" variant="default" className="shadow-lg">
        <PlayCircle className="w-8 h-8 mr-3" />
        INICIAR FEINA
      </Button>
    </div>
  )
}
```

## Validació
- Comprovar que la tipografia base és llegible (Inter).
- Comprovar que el radi de les cantonades és consistent mitjançant les variables `--radius`.
- Comprovar que els botons grans (`xl`) tenen un contrast adequat i es poden prémer amb un dit gros/guant.
- Els elements del Dashboard han d'utilitzar les mides `sm` i `default`.

## Errors comuns
- Utilitzar colors hexadecimals directament (ex. `#000000`) en lloc de les variables de tema (`text-foreground`).
- Aplicar marges o paddings arbitraris (ex. `p-[17px]`) en lloc de l'escala de 4px (`p-4`).
- Crear un botó START petit (ex. `size="default"`) a la PWA de l'operari, la qual cosa dificulta l'ús sobre el terreny.
