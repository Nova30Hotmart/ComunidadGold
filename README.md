# Camino a NOVA 30 — Landing

Landing del programa de Comunidades Hotmart LATAM. Evento 23 de junio 2026.

## Estructura

```
landing-final/
├── index.html              ← Página principal
├── gracias.html            ← Página de agradecimiento post-inscripción
├── css/
│   ├── base.css            ← Fuentes, variables, reset
│   └── blocks.css          ← Estilos de cada bloque
├── js/
│   └── main.js             ← Scroll animations, parallax, formulario
└── assets/
    ├── fonts/              ← 7 fuentes Hotmart oficiales (WOFF2)
    ├── logos/              ← 4 logos Hotmart oficiales + logo NOVA 30
    ├── illustrations/      ← 4 ilustraciones de las cards (placeholders)
    ├── orbs/               ← 3 orbes 3D placeholder (silver, gold, copper)
    ├── speakers/           ← Placeholder de ponentes
    └── textures/           ← Grano de fondo
```

## Cómo levantarla localmente

Simplemente abre `index.html` en un navegador. Funciona sin servidor.

Si querés un server local (para que las fonts y los SVG carguen sin errores de CORS):

```bash
# Con Python
python3 -m http.server 8000

# Con Node
npx serve

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000`.

## Reemplazar placeholders por assets finales

Cuando tu diseñadora te entregue los assets finales, reemplaza los archivos en `/assets/`:

| Placeholder actual | Reemplazar por |
|---|---|
| `assets/logos/nova30-logo.svg` | Logo NOVA 30 oficial con la estrella custom |
| `assets/orbs/orb-silver.svg` | Render 3D del orbe plateado (PNG transparente) |
| `assets/orbs/orb-gold.svg` | Render 3D del orbe dorado (variante Gold) |
| `assets/orbs/orb-copper.svg` | Render 3D del orbe cobre (variante Titanium) |
| `assets/illustrations/card-01-robot.svg` | Ilustración robot/astronauta |
| `assets/illustrations/card-02-astronaut.svg` | Ilustración astronauta con globo |
| `assets/illustrations/card-03-notebook.svg` | Ilustración cuaderno con pluma |
| `assets/illustrations/card-04-bird.svg` | Ilustración ave cacatúa |
| `assets/speakers/placeholder.svg` | Fotos reales de los 4 ponentes (JPG 1500x2000) |

**Importante:** mantener el mismo nombre de archivo o ajustar las referencias en `index.html` y los CSS.

## Conectar formulario a Brevo

El formulario actual redirige a `gracias.html` después de un delay simulado. Para conectarlo a Brevo:

### Opción A — Embed URL de Brevo (más simple)

1. En Brevo, ve a: **Contacts → Forms → tu formulario → Share → Embed URL**
2. Copia la URL del action del form embed
3. En `js/main.js`, busca `BREVO_FORM_URL` y reemplázalo
4. Descomenta el bloque "Opción A" dentro de `form.addEventListener('submit')`

### Opción B — API directa (recomendado para producción)

Por seguridad, **NO** poner la API key de Brevo directamente en el JS público. Hacer lo siguiente:

1. Crear un endpoint en tu backend (Node, Python, PHP) que reciba `{name, email}`
2. Desde el backend, llamar a la API de Brevo:
   ```
   POST https://api.brevo.com/v3/contacts
   api-key: TU_API_KEY
   {
     "email": "creator@example.com",
     "attributes": { "NOMBRE": "Nombre Completo" },
     "listIds": [TU_LIST_ID]
   }
   ```
3. En `js/main.js`, cambiar el endpoint del fetch a tu endpoint backend
4. Descomenta el bloque "Opción B" en el código

## Variantes del bloque personalizado por tier

El bloque 5 tiene 3 variantes (Gold, Platinum, Titanium). En `index.html` busca:

```html
<section class="personalizado">
  <div class="personalizado-card gold">  ← cambiar "gold" por "platinum" o "titanium"
```

La lógica de detección del tier del usuario debe hacerse server-side (al renderizar la página) o client-side leyendo el email del usuario y consultando un endpoint propio.

## Colores

Todos los colores están en variables CSS en `css/base.css`:

```css
--orange: #FF4000;   /* Naranja Hotmart oficial */
--black: #0D0D0D;
--cream: #F5F3EF;
--cta-green: #3DB36A;
--gold: #D4A75A;
--silver: #C0C0C0;
--titanium: #B85A30;
```

Para cambiar cualquier color globalmente, modificar solo `base.css`.

## Animaciones

- **Parallax** en los orbes (velocidades distintas según el bloque)
- **Reveal on scroll** en bloques de contenido (clase `.reveal`)
- **Nav** cambia de transparente a sólido al hacer scroll
- **Hover states** en cards y botones
- **Respeta `prefers-reduced-motion`** para accesibilidad

## Deploy recomendado

Vercel, Netlify o Cloudflare Pages. Tres pasos:

```bash
# Vercel
npm i -g vercel
vercel

# O simplemente arrastra la carpeta a netlify.com/drop
```

## Responsive

Breakpoints en `css/blocks.css`:
- `980px` — tablet (cambia layouts a una columna)
- `640px` — mobile (ajusta tamaños tipográficos)

## Soporte de navegadores

Funciona en navegadores modernos (Chrome, Safari, Firefox, Edge) últimas 2 versiones. Si necesitas IE11 o navegadores muy antiguos, avisa para agregar polyfills.

---

**Edgar Vergara · Hotmart LATAM · 2026**
