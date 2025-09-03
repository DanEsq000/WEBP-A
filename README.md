---

# 📷 Captura cámara → WebP animado

Este proyecto permite capturar video desde la cámara del navegador, extraer frames en formato **WebP**, enviarlos al servidor en lotes y finalmente generar una animación **WebP animada**.

El backend usa **Node.js con Express** y el binario `webpmux` para construir la animación.
El frontend es un cliente web sencillo que maneja la cámara, la captura de frames, la subida con progreso y la visualización del resultado.

---

## 🚀 Requisitos

* [Node.js](https://nodejs.org/) (>=14)
* Tener instalado `webpmux` (incluido en [libwebp](https://developers.google.com/speed/webp/download))

En Linux se puede instalar con:

```bash
sudo apt-get install webp
```

En macOS (con Homebrew):

```bash
brew install webp
```

---

## 📦 Instalación

Clonar el repositorio y entrar en la carpeta del proyecto:

```bash
git clone <url-del-repo>
cd <nombre-del-repo>
```

Instalar dependencias:

```bash
npm install
```

---

## ▶️ Uso

Inicia el servidor con:

```bash
node server.js
```

Por defecto estará en:

```
http://localhost:3000
```

Si deseas exponerlo públicamente (por ejemplo, para usar en móvil), puedes usar **ngrok**:

```bash
ngrok http 3000
```

---

## 🌐 Flujo de funcionamiento

1. El navegador lista las cámaras disponibles y permite elegir una.
2. Al presionar **Iniciar**, se comienza a capturar frames (`image/webp`) a 15 fps.
3. Al presionar **Detener**, los frames se envían al servidor en lotes.
4. El backend genera un `.webp` animado con `webpmux`.
5. El archivo final se devuelve al cliente y se puede **ver o descargar**.

---

## 📂 Estructura

```
├── server.js        # Servidor Express
├── uploads/         # Carpeta temporal para frames y animaciones
├── index.html       # Interfaz web
└── package.json
```

---

## 📡 Endpoints

### `POST /upload-batch`

Sube un lote de frames WebP.

* **Parámetros**: `frame` (array de archivos).
* **Respuesta**:

  ```json
  { "ok": true, "count": 50 }
  ```

### `POST /finalize`

Combina todos los frames en una animación `.webp`.

* **Respuesta**: Devuelve el binario `image/webp`.

---

## 🖼️ Ejemplo de uso

* Abrir en el navegador: `http://localhost:3000`
* Seleccionar cámara → **Iniciar** → **Detener**
* Esperar procesamiento y descargar la animación.

---

## ⚠️ Notas

* Los frames se guardan en `/uploads/frames` de forma temporal.
* Una vez generada la animación, se limpian los frames y el `.webp` para evitar acumulación de archivos.
* Funciona en navegadores modernos con soporte para **MediaDevices API** y **WebP**.

---

## 📜 Licencia

MIT

---

