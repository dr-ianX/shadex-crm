# Plan local: feat/installations

Objetivo
- Implementar el módulo Instalaciones (backend + frontend + tests + docs) en el workspace local sin hacer commits ni pushes.
- Entregables mínimos: página de Instalaciones, API para crear/consultar/actualizar instalaciones, botones Start / End que cambian estado y registran timestamps, subida de fotos, consumo de inventario y generación de evento para la agenda/garantía.

Asignación de agentes
- Scarlett: backend (modelos, endpoints, seeds, migraciones, tests unitarios).
- Lumen: frontend (página Instalaciones, UI de fotos, integración con calendario y proyectos).
- Rigel: E2E / Playwright (pruebas smoke y flujo de instalación).
- Atlas: documentación local (branch-plan.md) y orquestación de pruebas locales.
- Aurora: supervisión arquitectural (revisión de branch-plan.md y PRs—por ahora revisión local).

Estructura propuesta (archivos a crear/modificar)
- Backend (Scarlett)
  - packages\backend\prisma\schema.prisma  -> añadir modelo Installation y relaciones con Project, User, InventoryItem, Photo, Warranty
  - packages\backend\src\controllers\installations.controller.ts  -> endpoints CRUD, start, end
  - packages\backend\src\services\installation.service.ts  -> lógica de negocio: start/end, inventory deduction
  - packages\backend\src\routes\installations.routes.ts  -> rutas y middleware (auth, role guard)
  - packages\backend\src\uploads\ (reusar uploads existente) para fotos
  - packages\backend\src\seeds\seed.ts  -> seed demo installation(s)

- Frontend (Lumen)
  - workspace\feat\installations\ui-notes.md  (plan de UI antes de implementar)
  - packages\frontend\src\pages\Installations.tsx  -> nueva página/listado
  - packages\frontend\src\components\InstallationCard.tsx -> detalle + botones start/end + foto upload
  - packages\frontend\src\services\installationService.ts -> wrappers fetch para API
  - Integración con Context: si existe a nivel de App, usar Context para current user

- Tests (Rigel)
  - packages\frontend\tests\installations.spec.ts  -> Playwright scenarios: schedule a job, start job, upload photo, end job, assert inventory changed

- Docs (Atlas)
  - docs\feature-installations.md  -> descripción, endpoints, sample payloads, run instructions
  - workspace\feat\installations\branch-plan.md (este archivo)

Criterios de aceptación (mínimos)
1. Backend: endpoints para list, get, create, update, start, end. Start endpoint sets startedAt and installerId; end endpoint sets endedAt, records photos and calls inventory deduction. Unit tests para service functions.
2. Frontend: listado de instalaciones, vista detalle con Start/End buttons, foto upload (preview), and visual state transitions (Scheduled -> In Progress -> Completed).
3. Integración: cuando se finaliza una instalación, inventario se reduce acorde a las líneas usadas. Una garantía se encola para generación (puede ser un flag) y evento para Agenda creado.
4. Tests: Playwright smoke test que cubra el flujo Start -> Upload Photo -> End y aserciones de estado e inventario.

Comandos y ejecución local (sin push)
- Levantar stack local (desde repo root):
  docker-compose up -d --build
- Generar prisma client dentro del contenedor o local (usar la técnica ya probada):
  cd packages\backend
  npx prisma generate
- Ejecutar seeds localmente (si no se usan contenedores):
  node dist/src/seeds/seed.js  OR  ts-node src/seeds/seed.ts
- Ejecutar servidor backend en local (modo dev):
  cd packages\backend
  npm run dev
- Ejecutar frontend en modo dev:
  cd packages\frontend
  npm run dev
- Ejecutar Playwright (Rigel):
  cd packages\frontend
  npx playwright test --config=playwright.config.ts

Notas importantes (reglas)
- NO crear commits, ramas ni PRs. TODO trabajo dentro de workspace\feat\installations y edits locales en packages/*.
- Cuando un agente termine un subtask, notificar aquí y actualizar el todo correspondiente (yo actualizo el estado).
- Mantener archivos temporales claramente nombrados (ej. workspace/feat/installations/patch-01.md) para revisión.

Checklist rápido (marcar cuando se complete)
- [ ] Modelo Prisma agregado y client generado
- [ ] Endpoints backend implementados y probados con curl/Postman
- [ ] Página frontend Installations creada y muestra datos reales
- [ ] Start/End buttons funcionan y cambian estados
- [ ] Foto upload & preview working
- [ ] Inventory deduction verified
- [ ] Playwright smoke test passing locally
- [ ] docs/feature-installations.md completado

Tiempo estimado (heurístico)
- Backend: 2-3 días (Scarlett) para modelo+endpoints+tests
- Frontend: 2-3 días (Lumen) para UI y integration
- Tests & Docs: 1-2 días (Rigel + Atlas)

---

(END plan for installations)