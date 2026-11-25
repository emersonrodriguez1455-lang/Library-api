# Library API

API REST de práctica para gestionar un catálogo de libros. Está escrita en Node.js y Express. La lógica de negocio y las validaciones viven en un solo archivo, `src/server.js`.

Los datos se guardan en memoria: se pierden al detener el servidor. No hay base de datos ni autenticación.

## Qué resuelve

Permite listar, consultar, registrar, actualizar (de forma parcial o completa) y eliminar libros, con reglas explícitas sobre el título y el estado. El ejercicio se centra en la lógica de backend: validar la entrada antes de mutar los datos, rechazar campos no permitidos y devolver códigos HTTP coherentes.

## Stack

- Node.js (módulos ES, `"type": "module"` en `package.json`)
- Express 5
- Nodemon, solo para desarrollo (`npm run dev`)

## Modelo de datos

Cada libro tiene esta forma:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | number | Entero autogenerado: el mayor `id` existente más uno, o `1` si la lista está vacía |
| `title` | string | Título del libro, sin espacios de más al inicio o al final |
| `status` | string | Uno de: `available`, `borrowed`, `maintenance` |

Datos iniciales al arrancar el servidor:

| id | title | status |
| --- | --- | --- |
| 1 | Cien años de soledad | available |
| 2 | El principito | borrowed |

## Endpoints

| Método | Ruta | Descripción | Respuestas |
| --- | --- | --- | --- |
| `GET` | `/` | Mensaje de bienvenida | `200` |
| `GET` | `/libros` | Lista todos los libros | `200` |
| `GET` | `/libros/:id` | Obtiene un libro por identificador | `200`, `404` si no existe |
| `POST` | `/registrarLibro` | Crea un libro. Cuerpo: `{ "title", "status" }` | `201`, `400` si la validación falla |
| `PATCH` | `/libros/:id` | Actualización parcial: solo `title` y/o `status` | `200`, `400`, `404` |
| `PUT` | `/libros/:id` | Reemplazo completo: debe enviar exactamente `title` y `status` | `200`, `400`, `404` |
| `DELETE` | `/libros/:id` | Elimina el libro | `200`, `404` |

El identificador de las rutas se interpreta con `Number`. Si no coincide con ningún libro, la API responde `404`.

## Validaciones y reglas de negocio

### Registro (`POST /registrarLibro`)

- `title` debe ser una cadena. Después de recortar espacios no puede quedar vacía.
- `status` debe ser uno de los tres valores permitidos: `available`, `borrowed` o `maintenance`.
- Si la validación falla, responde `400`. Si el alta es correcta, responde `201` con el libro creado, incluido su nuevo `id`.

### Actualización parcial (`PATCH /libros/:id`)

- Si el libro no existe, responde `404`.
- El cuerpo debe ser un objeto (no un arreglo) y no puede ir vacío.
- Solo se aceptan las propiedades `title` y `status`. Cualquier otra produce `400`.
- Si viene `title`, se aplican las mismas reglas que en el alta.
- Si viene `status`, debe ser un texto no vacío y un valor permitido.
- Los cambios se aplican **solo después** de validar todos los campos recibidos, para no dejar el libro a medias si un campo es inválido.

### Reemplazo completo (`PUT /libros/:id`)

- Si el libro no existe, responde `404`.
- El cuerpo debe ser un objeto.
- Debe enviar exactamente las dos propiedades `title` y `status`: ni más, ni menos, ni un subconjunto.
- El título y el estado se validan con las mismas reglas del alta.
- Si todo es correcto, reemplaza ambos campos y responde `200` con el libro actualizado.

### Eliminación (`DELETE /libros/:id`)

- Si el libro no existe, responde `404`.
- Si existe, lo quita de la lista y responde `200` con el registro eliminado.

## Cómo ejecutarlo

```bash
npm install
npm start
```

Para desarrollo, con recarga automática:

```bash
npm run dev
```

El servidor queda en [http://localhost:3000](http://localhost:3000). El puerto está definido en `src/server.js` (3000).

## Ejemplos de peticiones

Listar los libros:

```bash
curl http://localhost:3000/libros
```

Obtener un libro:

```bash
curl http://localhost:3000/libros/1
```

Registrar un libro:

```bash
curl -X POST http://localhost:3000/registrarLibro \
  -H "Content-Type: application/json" \
  -d '{"title": "El señor de los anillos", "status": "available"}'
```

Actualización parcial:

```bash
curl -X PATCH http://localhost:3000/libros/3 \
  -H "Content-Type: application/json" \
  -d '{"status": "borrowed"}'
```

Reemplazo completo:

```bash
curl -X PUT http://localhost:3000/libros/3 \
  -H "Content-Type: application/json" \
  -d '{"title": "El señor de los anillos", "status": "maintenance"}'
```

Eliminar un libro:

```bash
curl -X DELETE http://localhost:3000/libros/3
```

Una petición inválida, por ejemplo un estado no permitido, responde `400`:

```bash
curl -i -X POST http://localhost:3000/registrarLibro \
  -H "Content-Type: application/json" \
  -d '{"title": "Un título", "status": "perdido"}'
```
