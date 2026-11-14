# MARHU Sushi Bar — Menú web con pedidos por WhatsApp

Sitio estático (HTML + CSS + JS, sin dependencias ni compilación).
El cliente arma su pedido, escribe su nombre, elige **pasar a recoger** o **comer aquí**,
revisa el mensaje y se abre WhatsApp con el pedido listo para enviar.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `menu-data.js` | **Platillos, precios, fotos y número de WhatsApp.** Es el único archivo que normalmente se edita. |
| `index.html` | Estructura de la página |
| `styles.css` | Diseño |
| `app.js` | Carrito, pasos del pedido y mensaje de WhatsApp |
| `img/` | Logo, íconos y fotos |

## Configurar el número de WhatsApp

En `menu-data.js`, cambia:

```js
whatsapp: "520000000000",
```

por el número del negocio: `52` + los 10 dígitos (solo números, sin espacios ni `+`).

## Agregar o cambiar fotos

1. Copia la foto a la carpeta `img/` (de preferencia `.jpg`, horizontal, ~900 px de ancho).
2. En `menu-data.js`, agrega `img: "img/nombre.jpg"` al platillo:

```js
{ n: "Amazon", p: 170, t: ["fresco"], d: "…", img: "img/amazon.jpg" },
```

Los platillos con foto aparecen con miniatura y en la tira de fotos de su sección.

## Probar en tu computadora

```bash
python3 -m http.server 5173
```

Luego abre http://localhost:5173

## Subir a GitHub y desplegar en Vercel

```bash
git init && git add . && git commit -m "Menú MARHU"
```

1. Crea un repositorio vacío en GitHub y sigue las instrucciones para hacer `git push`.
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
3. Framework Preset: **Other**. No hay comando de build ni carpeta de salida. Presiona **Deploy**.

Cada vez que hagas `git push`, Vercel publica los cambios automáticamente.
