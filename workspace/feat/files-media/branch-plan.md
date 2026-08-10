# Plan local: feat/files-media

Objetivo
- Implementar gestor de Archivos & Multimedia: subida, previsualización, organización por proyecto, thumbnails, y descarga. Soportar fotos, videos y PDFs. Integración con existing uploads folder.

Asignación de agentes
- Scarlett: backend (endpoints de upload, metadata model, storage linking, access control, cleanup job).
- Lumen: frontend (Media Manager UI, upload UX, preview gallery, attach to project flows).
- Rigel: E2E tests for upload/preview/download.
- Atlas: docs for storage config, limits and thumbnails.

Estructura propuesta (archivos a crear/modificar)
- Backend (Scarlett)
  - packages\backend\prisma\schema.prisma -> añadir modelo MediaFile (id, filename, path, mimetype, size, projectId, uploadedBy, createdAt)
  - packages\backend\src\controllers\media.controller.ts -> endpoints: upload, list by project, get metadata, download, delete
  - packages\backend\src\services\media.service.ts -> thumbnail generation (if sharp available) or fallback, storage management
  - reusar packages\backend\uploads for physical files

- Frontend (Lumen)
  - packages\frontend\src\pages\MediaManager.tsx -> UI for listing and uploading
  - packages\frontend\src\components\MediaGrid.tsx -> thumbnails and preview modal
  - packages\frontend\src\services\mediaService.ts -> wrapper to interact with backend

- Tests (Rigel)
  - packages\frontend\tests\media.spec.ts -> upload test, preview test, download test

- Docs (Atlas)
  - docs\feature-files-media.md
  - workspace\feat\files-media\branch-plan.md (este archivo)

Criterios de aceptación
- Upload endpoint accepts file and returns metadata
- Frontend can upload image and preview it
- Files are linkable to projects
- Download endpoint streams file
- Playwright tests for upload and preview succeed

Comandos y ejecución local
- Levantar stack: docker-compose up -d --build
- Backend: cd packages\backend && npm run dev
- Frontend: cd packages\frontend && npm run dev
- Tests: cd packages\frontend && npx playwright test tests/media.spec.ts

Checklist
- [ ] MediaFile model added
- [ ] Upload endpoint implemented
- [ ] Frontend upload UI and preview
- [ ] Link to project works
- [ ] Playwright test passes

Tiempo estimado
- Backend: 2 días
- Frontend: 2 días
- Tests & Docs: 1 día

(END plan for files-media)