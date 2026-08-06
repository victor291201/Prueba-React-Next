# KIBBO · Gestor de productos

> Prueba técnica — Desarrollador Junior React / Next.js

Aplicación de una sola página para gestionar un inventario de productos. Permite crear, editar, eliminar, ordenar y filtrar productos. Los datos persisten en `localStorage` sin necesidad de backend.

🔗 **Repositorio:** [github.com/victor291201/Prueba-React-Next](https://github.com/victor291201/Prueba-React-Next)
🌐 **Demo en vivo:** [https://prueba-react-next.vercel.app](https://prueba-react-next.vercel.app)

<a name="instalacion"></a>
## Instalación y ejecución

### Requisitos previos

- **Node.js** ≥ 20 (verificar con `node --version`)
- **npm** ≥ 9 (verificar con `npm --version`)

### Guía paso a paso

```bash
# 1. Clonar el repositorio
git clone https://github.com/victor291201/Prueba-React-Next.git
cd Prueba-React-Next

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en localhost:3000 |
| `npm run build` | Build de producción optimizado |
| `npm start` | Servir la build de producción |
| `npm run lint` | ESLint — revisa errores de código |
| `npm run typecheck` | TypeScript — revisa errores de tipos |
| `npm test` | Ejecutar los 73 tests |
| `npm test -- --watch` | Tests en modo watch |
| `npm test -- --coverage` | Tests con reporte de cobertura |

---

## Cumplimiento de la prueba

### Requisitos obligatorios

| # | Requisito | Cumplido | Cómo se implementó |
|---|---|---|---|
| 1 | **Interfaz gráfica** React/Next.js para crear y visualizar productos | ✔ | Next.js 14 App Router. `ProductForm` (creación/edición) + `ProductList`/`ProductCard` (visualización en grid) |
| 2 | **Estructura de Producto** con 5 campos | ✔ | `src/types/product.ts`: `codigo (number)`, `nombre (string)`, `descripcion (string)`, `cantidad (number)`, `creacion (string ISO 8601)` |
| 3 | **Crear producto** | ✔ | `ProductForm.tsx` con validación (nombre 2-100, descripción 5-500, cantidad entero ≥ 0) |
| 3 | **Ver lista de productos** | ✔ | Grid responsiva de tarjetas con código, nombre, descripción, cantidad y fecha |
| 3 | **Eliminar producto** | ✔ | Confirmación mediante modal accesible (`alertdialog` con focus trap) |
| 3 | **Ordenar por cantidad, creación, código y nombre** | ✔ | Select de orden con 4 campos + toggle ascendente/descendente |
| 3 | **Filtrar por nombre** | ✔ | Input de búsqueda con debounce de 300 ms (case-insensitive) |
| 4 | **Persistencia en localStorage** | ✔ | Middleware `persist` de Zustand. Guarda automáticamente en cada cambio y rehidrata al recargar |
| 5 | **Manejo de estado** (Context/Redux/Zustand) | ✔ | **Zustand** — 2 stores: `productStore` (persistido) y `toastStore` (efímero). Componentes acceden solo mediante hooks (`useProducts`, `useToast`) |
| 6 | **Componentes reutilizables** | ✔ | 5 componentes atómicos en `ui/` (`Button`, `Input`, `Select`, `TextArea`, `ConfirmDialog`) + `icons.tsx` con 13 iconos SVG |
| 6 | **Buen manejo de carpetas** | ✔ | `components/products/`, `components/ui/`, `hooks/`, `store/`, `types/`, `utils/`, `__tests__/` |
| 6 | **TypeScript** (deseable) | ✔ | `strict: true`. Sin `any`. Tipos en `src/types/product.ts`. Interfaces para props de todos los componentes |

### Extras valorados en la prueba

| # | Extra | Cumplido | Cómo se implementó |
|---|---|---|---|
| 7a | **Despliegue en Vercel** | ✔ | [prueba-react-next.vercel.app](https://prueba-react-next.vercel.app) — deploy automático desde GitHub |
| 7b | **Tests unitarios / integración** con Jest + Testing Library | ✔ | 73 tests en 11 archivos: store, hooks, validators, formatters, y componentes (form, list, filters, dialog, theme) |
| 7c | **Librería de diseño** (TailwindCSS, MUI, etc.) | ✔ | **TailwindCSS** 3.4 con `dark:` variants, `clsx` + `tailwind-merge` para resolución de conflictos de clases |
| 7d | **Aplicación responsiva** (móvil/desktop) | ✔ | Mobile-first con breakpoints `sm:`, `lg:`, `xl:`. En desktop: layout de 2 columnas (formulario + lista). En mobile: columna única |
| 7e | **Lazy loading / dynamic imports** | ✔ | `ProductList` y `ProductFilters` cargados con `next/dynamic`. Skeleton de carga mientras se cargan |
| 7f | **Accesibilidad básica** (aria, focus visible) | ✔ | Skip link, `aria-required`, `aria-invalid` + `aria-describedby` + `role="alert"`, `aria-live`, `aria-label` en botones, `role="alertdialog"` + `aria-modal` + focus trap en modal de confirmación, `tabIndex` + teclado en tarjetas, `focus:ring` en todos los interactivos |

### Extras adicionales (añadidos por iniciativa propia)

| # | Extra | Cómo se implementó |
|---|---|---|
| +1 | **Editar producto** | Clic en el lápiz de una tarjeta → el formulario se rellena con los datos y cambia a modo "Editar producto". Al guardar se actualiza el producto |
| +2 | **Tema oscuro** | Toggle sol/luna animado en el header. Paleta: fondo negro (`neutral-950`/`900`) + acentos índigo. Persistido con `next-themes`, sin flash al cargar |
| +3 | **Notificaciones toast** | Toasts animados en esquina superior derecha (éxito/error/info). Auto-cierre en 3 segundos. Botón para cerrar manualmente |
| +4 | **Animaciones con Framer Motion** | Entrada/salida de tarjetas con fade + slide + scale. Reordenamiento fluido de la grid. Modal con scale + fade. Toasts con spring. Toggle de tema con rotación |
| +5 | **Modal de confirmación al eliminar** | Evita eliminaciones accidentales. Focus trap, cierre con Escape, click fuera, foco restaurado al cerrar |
| +6 | **Detección de duplicados** | Si se crea un producto con un nombre ya existente, se suman las cantidades en vez de duplicar. Si se edita y el nombre colisiona con otro, se rechaza con error |
| +7 | **CI con GitHub Actions** | `.github/workflows/ci.yml`: lint + typecheck + tests con cobertura en Node 20 y 22 en cada push/PR |
| +8 | **Branding con logo** | Logo en el favicon (`public/logo.png` + `app/icon.png`) y en el header |
| +9 | **Helper `cn()`** | `clsx` + `tailwind-merge` en `src/lib/utils.ts` para composición de clases sin conflictos |

---

## Guía de uso

### Crear un producto

1. En el panel izquierdo, completa el formulario "Nuevo producto" con nombre, descripción y cantidad.
2. Haz clic en **Agregar producto**.
3. Aparecerá un toast verde de confirmación y la tarjeta se animará entrando en la lista.
4. **Si el nombre ya existe**, se sumará la cantidad al producto existente y verás un toast azul informativo.

### Editar un producto

1. Haz clic en el ícono del lápiz en la tarjeta del producto.
2. El formulario cambia a "Editar producto" con los campos pre-rellenados.
3. Modifica los datos y haz clic en **Guardar cambios**, o **Cancelar** para descartar.
4. **No puedes cambiar el nombre a uno que ya tenga otro producto.**

### Eliminar un producto

1. Haz clic en el ícono del basurero en la tarjeta.
2. Aparece un modal de confirmación: *"¿Estás seguro de que deseas eliminar X?"*
3. Haz clic en **Eliminar** para confirmar, o **Cancelar** / Escape / click fuera para cerrar sin eliminar.

### Ordenar la lista

1. En la barra de filtros, selecciona el campo por el que ordenar: **Código**, **Nombre**, **Cantidad** o **Fecha de creación**.
2. Usa el botón junto al select (Ascendente / Descendente) para alternar la dirección.

### Filtrar por nombre

1. En la barra de filtros, escribe en el campo "Buscar producto".
2. La lista se filtra automáticamente tras 300 ms de inactividad (debounce).
3. El contador muestra cuántos productos coinciden con la búsqueda.

### Cambiar tema (claro / oscuro)

1. Haz clic en el ícono de sol/luna en el header (junto a las estadísticas).
2. El tema se aplica instantáneamente y se recuerda entre recargas.

### Atajos de teclado

| Tecla | Contexto | Acción |
|---|---|---|
| Tab | Tarjetas de producto | Navegar entre tarjetas |
| Enter / Espacio | Tarjeta enfocada | Activar edición del producto |
| Escape | Modal abierto | Cerrar el modal |
| Tab | Dentro del modal | Ciclar entre botones (Cancelar ↔ Confirmar) |
| Tab | Página | Primer foco visible: "Saltar al contenido principal" |

---

## Stack tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** (App Router) | 14.2 | Framework SSR/SSG, routing |
| **React** | 18 | UI |
| **TypeScript** | 5 | Tipado estático estricto |
| **Zustand** | 5 | Gestión de estado + persistencia en localStorage |
| **TailwindCSS** | 3.4 | Estilos utility-first responsivos |
| **next-themes** | 0.4 | Tema oscuro SSR-safe |
| **Framer Motion** | 13 | Animaciones declarativas |
| **clsx** + **tailwind-merge** | 2 + 3 | Composición segura de clases CSS |
| **Jest** + **Testing Library** | 30 + 16 | Tests unitarios e integración |

### Decisiones técnicas

- **Zustand sobre Context/Redux:** El middleware `persist` de Zustand permite persistir en localStorage con 2 líneas de configuración. Requiere cero providers. Los selectores granulares evitan re-renders innecesarios.

- **`cn()` helper (`clsx` + `tailwind-merge`):** Compone clases condicionales y resuelve conflictos (ej: `p-2` + `p-4` → gana `p-4`). Evita strings monolíticos de 200+ caracteres inlegibles.

- **`editingProduct` no se persiste:** Al recargar la página, el formulario siempre vuelve a modo creación limpio.

- **Lista derivada con `useMemo`:** Los productos filtrados y ordenados nunca se almacenan en el estado; se calculan a demanda a partir de `products` + `searchTerm` + `sortField` + `sortOrder`.

- **Server Component + Client Components:** `page.tsx` es un Server Component (sin JavaScript en el servidor). Los componentes interactivos están marcados con `"use client"`. Los más pesados (`ProductList`, `ProductFilters`) se cargan con `next/dynamic` mostrando un skeleton.

---

## Arquitectura

```
src/
├── app/                    # layout, providers, página principal, estilos
├── components/
│   ├── products/           # ProductForm, ProductCard, ProductList,
│   │                         ProductFilters, ProductSort, ProductHeader,
│   │                         EmptyState, ProductListSkeleton
│   └── ui/                 # Button, Input, Select, TextArea,
│                             ConfirmDialog, ToastContainer, ThemeToggle, icons
├── hooks/                  # useProducts, useDebounce, useToast
├── lib/                    # utils (cn helper)
├── store/                  # productStore (persistido), toastStore (efímero)
├── types/                  # product.ts
├── utils/                  # validators, formatters
└── __tests__/              # 73 tests en 11 archivos
```

---

## Tests

```bash
npm test                 # 73 tests
npm test -- --coverage   # con reporte de cobertura
```

Cobertura de tests por área:

| Área | Archivos | Qué se prueba |
|---|---|---|
| **Store** | `productStore.test.ts`, `toastStore.test.ts` | CRUD, persistencia, merge de duplicados, codigo incremental, toasts |
| **Hooks** | `useProducts.test.ts`, `useDebounce.test.ts` | Selectores, lista derivada, debounce |
| **Utilidades** | `validators.test.ts`, `formatters.test.ts` | Validación de todos los campos, formatos de fecha/cantidad |
| **Componentes** | `ProductForm.test.tsx`, `ProductList.test.tsx`, `ProductFilters.test.tsx`, `ConfirmDialog.test.tsx`, `ThemeToggle.test.tsx` | Flujo crear/editar con duplicados, eliminar con confirmación, filtros con debounce, modal accesible, toggle de tema |

---

## CI y despliegue

### CI (GitHub Actions)

El workflow `.github/workflows/ci.yml` se ejecuta automáticamente en cada push/PR a `main`/`master`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test -- --coverage`

Probado en **Node 20** y **Node 22**.

### Despliegue en Vercel

**En vivo:** [https://prueba-react-next.vercel.app](https://prueba-react-next.vercel.app)

Para replicar el despliegue:

1. Sube el repositorio a GitHub ([github.com/victor291201/Prueba-React-Next](https://github.com/victor291201/Prueba-React-Next)).
2. Ve a [vercel.com/new](https://vercel.com/new) e importa el repositorio.
3. Vercel detecta automáticamente Next.js. No requiere variables de entorno.
4. Haz clic en **Deploy**.
