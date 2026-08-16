# 💍 Invitación de Casamiento - Wedding Invitation Website

Sitio web moderno y elegante para invitaciones de boda con gestión completa de invitados, menús y confirmaciones.

## 🌟 Características

- ✨ **Hero Section** con contador regresivo hasta el día de la boda
- 📖 **Galería de Historia** - Cuenta vuestra historia a través de fotos deslizables
- 📅 **Cronograma** - Timeline interactivo del día del evento
- 🍽️ **Selección de Menú** - Los invitados pueden elegir su menú y especificar alergias
- 🎁 **Sección de Regalos** - Información de cuentas bancarias con función de copiar
- 📝 **RSVP** - Sistema de confirmación de asistencia
- 🔥 **Firebase Integration** - Base de datos en tiempo real para almacenar confirmaciones y menús
- 📱 **Responsive Design** - Perfecto en todos los dispositivos
- 🎨 **Animaciones Elegantes** - Con Framer Motion

## 🛠️ Stack Tecnológico

- **React 18** - Framework frontend
- **Vite** - Build tool rápido
- **Firebase** - Backend as a Service
  - Firestore - Base de datos NoSQL
  - Storage - Para almacenar imágenes
  - Hosting - Deploy del sitio
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación

## 📋 Requisitos Previos

- Node.js 18+ y npm instalados
- Cuenta de Firebase (gratis)

## 🚀 Instalación

### 1. Instalar Node.js

Si aún no tienes Node.js instalado en tu Mac:

\`\`\`bash
# Con Homebrew
brew install node

# Verificar instalación
node --version
npm --version
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
cd "/Users/francopapp/Proyectos WEB/Invitaccion casamiennto"
npm install
\`\`\`

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database**:
   - Ve a "Build" > "Firestore Database"
   - Crea una base de datos en modo de prueba
   - Configura las reglas de seguridad (ejemplo más abajo)

4. Habilita **Storage** (para las fotos de la galería):
   - Ve a "Build" > "Storage"
   - Comenzar en modo de prueba

5. Obtén tu configuración:
   - Ve a Project Settings (⚙️)
   - En "Your apps", agrega una Web App
   - Copia las credenciales de configuración

6. Crea el archivo \`.env\`:

\`\`\`bash
cp .env.example .env
\`\`\`

7. Edita \`.env\` y pega tus credenciales de Firebase:

\`\`\`env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
\`\`\`

### 4. Firestore Security Rules

En Firebase Console > Firestore Database > Rules, usa estas reglas:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // RSVPs - cualquiera puede leer/escribir
    match /rsvps/{document} {
      allow read, write: if true;
    }
    
    // Menu selections - cualquiera puede leer/escribir
    match /menuSelections/{document} {
      allow read, write: if true;
    }
  }
}
\`\`\`

## 🎯 Uso

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

El sitio estará disponible en: http://localhost:5173

### Build para Producción

\`\`\`bash
npm run build
\`\`\`

### Preview del Build

\`\`\`bash
npm run preview
\`\`\`

## 🎨 Personalización

### 1. Actualizar Información de la Boda

Edita los siguientes archivos:

- **Hero.jsx** - Nombres, fecha y lugar de la boda
- **OurStory.jsx** - Tu historia de amor y fotos
- **Schedule.jsx** - Cronograma del evento
- **Gifts.jsx** - Cuentas bancarias
- **Footer.jsx** - Hashtag de redes sociales

### 2. Cambiar Colores

En \`src/index.css\`, modifica las variables CSS:

\`\`\`css
:root {
  --color-primary: #d4af37;     /* Dorado principal */
  --color-secondary: #8b7355;   /* Marrón secundario */
  --color-accent: #fff5e6;      /* Crema claro */
  --color-text: #333333;        /* Texto principal */
}
\`\`\`

### 3. Agregar Fotos a la Galería

En \`OurStory.jsx\`, reemplaza las URLs de placeholder:

\`\`\`javascript
const storySlides = [
  {
    image: '/ruta/a/tu/foto1.jpg',
    title: 'Nuestro Primer Encuentro',
    description: 'Nuestra historia...',
    date: 'Enero 2020'
  },
  // ... más fotos
];
\`\`\`

Puedes:
- Usar Firebase Storage y obtener las URLs
- Colocar las imágenes en \`public/images/\` y usar \`/images/foto.jpg\`
- Usar URLs externas

### 4. Personalizar Menús

En \`Menu.jsx\`, edita el array \`menuOptions\`:

\`\`\`javascript
const menuOptions = [
  {
    id: 'carne',
    name: 'Menú de Carne',
    description: 'Tu descripción del menú',
    icon: '🥩'
  },
  // ... más opciones
];
\`\`\`

## 📊 Base de Datos

### Colecciones de Firestore

#### 1. **rsvps** (Confirmaciones)
\`\`\`javascript
{
  name: string,
  email: string,
  phone: string,
  attendance: 'yes' | 'no',
  guests: number,
  message: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
\`\`\`

#### 2. **menuSelections** (Selección de Menús)
\`\`\`javascript
{
  email: string,
  name: string,
  menuChoice: string,
  allergies: string,
  dietaryRestrictions: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
\`\`\`

## 🚀 Deploy

### Deploy con Firebase Hosting

1. Instala Firebase CLI:

\`\`\`bash
npm install -g firebase-tools
\`\`\`

2. Login a Firebase:

\`\`\`bash
firebase login
\`\`\`

3. Inicializa Firebase:

\`\`\`bash
firebase init hosting
\`\`\`

Configuración recomendada:
- Public directory: \`dist\`
- Single-page app: \`Yes\`
- Automatic builds: Opcional

4. Build y Deploy:

\`\`\`bash
npm run build
firebase deploy
\`\`\`

### Deploy con Vercel

1. Instala Vercel CLI:

\`\`\`bash
npm install -g vercel
\`\`\`

2. Deploy:

\`\`\`bash
vercel
\`\`\`

## 📱 Características por Sección

### Hero
- Contador regresivo animado
- Nombres de los novios
- Fecha y ubicación
- Botón CTA a confirmación

### Nuestra Historia
- Carrusel de fotos con navegación
- Títulos y descripciones por slide
- Dots de navegación
- Animaciones suaves

### Cronograma
- Timeline vertical con íconos
- Distribución alternada
- Tarjeta de ubicación con enlace a Google Maps

### Menú
- Selección visual de 4 opciones de menú
- Checkboxes para restricciones comunes
- Campo de texto para alergias específicas
- Guardado en Firebase

### Regalos
- Tarjetas con información bancaria
- Botones para copiar CBU/Alias
- Confirmación visual al copiar
- Sección de opciones alternativas

### RSVP
- Formulario completo de confirmación
- Radio buttons visuales para asistencia
- Selector de número de invitados
- Mensaje personalizado
- Actualización automática si ya confirmó

## 🐛 Troubleshooting

### Error: npm no encontrado

\`\`\`bash
# Instala Node.js con Homebrew
brew install node
\`\`\`

### Error de Firebase

Verifica que:
1. Las credenciales en \`.env\` sean correctas
2. Firestore esté habilitado en Firebase Console
3. Las reglas de seguridad permitan lectura/escritura

### Imágenes no se cargan

- Verifica las rutas de las imágenes
- Si usas Firebase Storage, asegúrate de que las URLs sean públicas
- Revisa la consola del navegador para errores

## 📝 Tareas Pendientes

- [ ] Configurar Firebase (requerido)
- [ ] Personalizar nombres y fecha
- [ ] Agregar fotos reales a la galería
- [ ] Actualizar información de cuentas bancarias
- [ ] Personalizar cronograma del evento
- [ ] Ajustar opciones de menú según tu catering
- [ ] Cambiar colores si es necesario
- [ ] Probar en diferentes dispositivos
- [ ] Deploy a producción

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal.

## 🤝 Contribuciones

Este es un proyecto personal, pero siéntete libre de hacer fork y adaptarlo a tus necesidades.

---

**¡Felicidades por tu boda! 🎉💕**

Para preguntas o ayuda, revisa la documentación de:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
