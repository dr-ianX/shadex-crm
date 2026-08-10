# Plan local: feat/agenda

Objetivo
- Implementar módulo Agenda/Calendario con vistas diaria/semanal/mensual, creación/edición de eventos, asignación de instaladores y recordatorios. Integración con Google Maps para localización de instalaciones.

Asignación de agentes
- Scarlett: backend (event model, reminders, endpoints, cron/worker for notifications).
- Lumen: frontend (Calendar views, event creation UI, reminders display).
- Rigel: pruebas E2E (event creation, reminder notifications, map links).
- Atlas: documentación y run instructions.

Estructura propuesta (archivos a crear/modificar)
- Backend (Scarlett)
  - packages\backend\prisma\schema.prisma -> añadir modelo Event / CalendarEvent con campos: title, description, startAt, endAt, location (lat,lng,address), assignedTo(userId), projectId, reminderMinutes, status
  - packages\backend\src\controllers\agenda.controller.ts -> CRUD endpoints y reminder enqueue
  - packages\backend\src\services\reminder.service.ts -> worker to send notifications (console/log or integrate with notifier)
  - packages\backend\src\routes\agenda.routes.ts

- Frontend (Lumen)
  - packages\frontend\src\pages\Agenda.tsx -> main calendar page
  - packages\frontend\src\components\CalendarView.tsx -> encapsulate day/week/month views (use a light calendar lib or MUI integration)
  - packages\frontend\src\services\agendaService.ts -> fetch wrappers

- Tests (Rigel)
  - packages\frontend\tests\agenda.spec.ts -> create event, verify appears in calendar, verify reminder triggers (simulated)

- Docs (Atlas)
  - docs\feature-agenda.md
  - workspace\feat\agenda\branch-plan.md (este archivo)

Criterios de aceptación
- Crear/editar/borrar eventos desde UI.
- Eventos asignados a instaladores aparecen en su lista (Installer mobile UI integration later).
- Reminders encolar y mostrar notificaciones en UI or log.
- Location link opens Google Maps with coordinates.

Comandos y ejecución local
- Levantar stack: docker-compose up -d --build
- Generar prisma client: cd packages\backend && npx prisma generate
- Ejecutar backend y frontend en dev como en plan de installations
- Ejecutar tests: cd packages\frontend && npx playwright test tests/agenda.spec.ts

Checklist (mínimo)
- [ ] Modelo Event creado y prisma generate ok
- [ ] CRUD endpoints funcionando
- [ ] Calendar page with day/week/month
- [ ] Event creation UI with location (maps link)
- [ ] Reminder worker stub in backend
- [ ] Playwright test passing

Tiempo estimado
- Backend: 2 días
- Frontend: 2 días
- Tests & Docs: 1 día

(END plan for agenda)