# SHADEX Data Request

Este documento recoge las preguntas necesarias para obtener los datos reales de ShadeX y poder implementar la UI y las integraciones con datos reales.

Por favor responde cada ítem con la mayor precisión posible. Si algún punto no aplica, indícalo.

## 1) Información general
- Nombre legal de la empresa (para facturación): 
- Nombre comercial short / display (para UI):
- Dirección fiscal completa:
- RFC / Tax ID (si aplica):
- Teléfonos de contacto y emails (soporte, ventas, operaciones):

## 2) Usuarios y roles
- Lista de roles y permisos esperados (ej. Admin, Ventas, Instalación, Operaciones, IT). Para cada rol, confirmar las acciones permitidas (create, read, update, delete, aprobar, generar-PDF, etc.).
- ¿Qué usuario(es) iniciales deseas que creemos en las seeds? (email, nombre, rol)

## 3) Flujos de negocio (ejemplos concretos)
- Describe 2–3 casos de uso prioritarios que quieres probar en staging/local (por ejemplo: crear cotización con múltiples ítems, aprobar proyecto, generar PDF de cotización y enviar por email).
- ¿Qué campos obligatorios debe contener una cotización? (cliente, moneda, impuestos, vencimiento, items con cantidad/precio/unidad, descuento, notas)

## 4) Datos maestros y catálogos
- ¿Qué catálogos iniciales hay (productos, servicios, tipos de cliente, estados del proyecto)? Proporciona CSV o muestra de 10 filas por catálogo si posible.
- ¿Necesitas multi-moneda? Indica monedas (ej: MXN, USD) y cuál es la default.
- ¿Necesitas manejo de impuestos por ítem o global? (ej: IVA 16% por item)

## 5) Branding y assets
- Path o archivos del logo en alta resolución (AI/PDF/SVG), variantes (light/dark), y paleta de colores (HEX). Si ya subiste al repo, confirma la ruta.
- Tipografías: ¿usar Google Fonts equivalentes o fuentes propietarias? Lista y tamaños principales (headings, body, UI small).

## 6) Integraciones y entorno
- ¿Habrá integración con sistemas externos (contabilidad, correo SMTP, pasarela de pagos)? Proveer endpoints y credenciales para staging si existen.
- ¿Deseas que el entorno local use SQLite (recomendado) o prefieres configurar Postgres local/Docker? Si Postgres, provee DATABASE_URL para staging.

## 7) Requisitos de despliegue local
- ¿Deseas contenedores Docker con compose para todo (database + backend + frontend + nginx) o solo Docker para backend y preview del frontend? (elige una)
- ¿Quieres que prepare un comando único para levantar el entorno local (npm run docker:up) y otro para bajar y limpiar volúmenes?

## 8) Datos de ejemplo para poblar (seeds)
- Proveer 3 clientes de ejemplo con: nombre, email, teléfono, dirección, tipo.
- Proveer 3 productos/servicios con código, descripción, unidad, precio MXN y USD.

## 9) Seguridad y accesos
- Políticas de contraseñas (longitud mínima, mayúsculas, caracteres especiales).
- ¿Deseas inicio de sesión por email+password solamente o también SSO/OAuth (Google, Microsoft)?

## 10) Priorización y entregables
- Indica las tres tareas más urgentes para que Scarlett implemente primero.
- Indica si quieres una demo guiada local (screen share) o solo los artefactos y pasos para correr en local.

---

Cuando respondas este documento, Scarlett tomará las respuestas y generará automáticamente:
- Seeds actualizados (users, clients, products)
- Mock data fixtures para Playwright
- Ajustes de UI (logo, paleta, tipografías)

Gracias. Si algo no está claro, responde con notas y se aclarará antes de crear código.