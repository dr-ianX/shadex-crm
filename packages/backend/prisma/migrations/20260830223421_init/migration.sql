-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SALES', 'OPERATIONS', 'INSTALLER', 'FINANCE', 'WAREHOUSE', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('RESIDENTIAL', 'CORPORATE', 'COMMERCIAL', 'INSTITUTIONAL', 'HOTEL', 'HEALTHCARE', 'EDUCATION', 'AUTOMOTIVE', 'DISTRIBUTOR', 'ARCHITECT', 'DEVELOPER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFYING', 'INFO_PENDING', 'PHOTOS_PENDING', 'MEASURES_PENDING', 'INFO_COMPLETE', 'SOLUTION_DEFINED', 'QUOTE_PREPARING', 'QUOTED', 'FOLLOW_UP', 'APPOINTMENT_SCHEDULED', 'NEGOTIATION', 'DEPOSIT_PENDING', 'WON', 'LOST', 'NURTURE', 'SCHEDULED', 'MATERIAL_RESERVED', 'INSTALLATION_SCHEDULED', 'IN_INSTALLATION', 'QUALITY_CONTROL', 'LIQUIDATION_PENDING', 'COMPLETED', 'WARRANTY_ACTIVE');

-- CreateEnum
CREATE TYPE "LeadNeed" AS ENUM ('TEMPERATURE_REDUCTION', 'UV_PROTECTION', 'SOLAR_CONTROL', 'MAINTAIN_VIEWS', 'PERMANENT_PRIVACY', 'DYNAMIC_PRIVACY', 'SMARTFILM', 'SECURITY', 'GLASS_PROTECTION', 'TECH_INTEGRATION', 'LED_DISPLAY', 'DESIGN_DECORATION', 'SURFACE_PROTECTION', 'AUTOMOTIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductFamily" AS ENUM ('CONTROL_SOLAR', 'SMARTFILM', 'SECURITY', 'PRIVACY', 'SPECIALTY', 'DIGITAL_LED', 'STONEGUARD', 'SERVICES');

-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('PIECE', 'ROLL', 'LINEAR_METER', 'SQM', 'SERVICE', 'KIT', 'PROJECT');

-- CreateEnum
CREATE TYPE "RollStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'PARTIALLY_USED', 'DEPLETED', 'DAMAGED', 'SAMPLE', 'IN_TRANSIT');

-- CreateEnum
CREATE TYPE "InventoryLocation" AS ENUM ('WAREHOUSE_CHIHUAHUA', 'VEHICLE', 'INSTALLER', 'PROJECT', 'CDMX', 'IN_TRANSIT', 'SAMPLES');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('PURCHASE', 'RECEIPT', 'RESERVATION', 'INSTALLATION_OUTPUT', 'CONSUMPTION', 'RETURN', 'WASTE', 'SAMPLE', 'ADJUSTMENT', 'TRANSFER', 'CANCELLATION');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEPOSIT', 'PARTIAL', 'LIQUIDATION', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFER', 'SPEI', 'MERCADO_PAGO', 'CARD', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PHOTO', 'VIDEO', 'QUOTATION', 'INVOICE', 'TECHNICAL_SPEC', 'CONTRACT', 'RECEIPT', 'WARRANTY', 'IDENTIFICATION', 'SURVEY', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('CALL', 'VIDEO_CALL', 'SURVEY', 'VISIT', 'SMARTFILM_DEMO', 'INSTALLATION', 'DELIVERY', 'FOLLOW_UP', 'WARRANTY');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "fiscal_address" TEXT,
    "fiscal_zip_code" TEXT,
    "tax_regime" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "tagline" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rate" (
    "id" TEXT NOT NULL,
    "from_currency" TEXT NOT NULL,
    "to_currency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "user_id" TEXT,
    "is_automatic" BOOLEAN NOT NULL DEFAULT false,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SALES',
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "type" "ClientType" NOT NULL DEFAULT 'RESIDENTIAL',
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "company_name" TEXT,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT NOT NULL,
    "rfc" TEXT,
    "fiscal_address" TEXT,
    "fiscal_zip_code" TEXT,
    "tax_regime" TEXT,
    "cfdi_usage" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Mexico',
    "notes" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" TEXT,
    "executive_id" TEXT,
    "location" TEXT,
    "city" TEXT,
    "property_type" TEXT,
    "main_need" TEXT,
    "needs" TEXT[],
    "problem_desc" TEXT,
    "budget" DOUBLE PRECISION,
    "urgency" TEXT,
    "interest_product" TEXT,
    "notes" TEXT,
    "next_action" TEXT,
    "follow_up_date" TIMESTAMP(3),
    "campaign_source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lead_id" TEXT,
    "client_id" TEXT NOT NULL,
    "contact_id" TEXT,
    "location" TEXT NOT NULL,
    "city" TEXT,
    "executive_id" TEXT,
    "description" TEXT,
    "need" TEXT,
    "product" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'INFO_COMPLETE',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "estimated_duration" INTEGER,
    "budget" DOUBLE PRECISION,
    "architect" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "area_sqm" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'mm',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "family" "ProductFamily" NOT NULL,
    "commercial_name" TEXT NOT NULL,
    "description" TEXT,
    "variant" TEXT,
    "vlt" DOUBLE PRECISION,
    "color" TEXT,
    "thickness" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "roll_length" DOUBLE PRECISION,
    "purchase_unit" "ProductUnit" NOT NULL,
    "inventory_unit" "ProductUnit" NOT NULL,
    "sale_unit" "ProductUnit" NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "cost_currency" TEXT NOT NULL DEFAULT 'USD',
    "suggested_price" DOUBLE PRECISION,
    "price_currency" TEXT NOT NULL DEFAULT 'MXN',
    "supplier" TEXT,
    "warranty_years" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "technical_spec" TEXT,
    "restrictions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roll_inventory" (
    "id" TEXT NOT NULL,
    "roll_code" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "lot" TEXT,
    "supplier" TEXT,
    "received_date" TIMESTAMP(3) NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "initial_length" DOUBLE PRECISION NOT NULL,
    "available_length" DOUBLE PRECISION NOT NULL,
    "location" "InventoryLocation" NOT NULL DEFAULT 'WAREHOUSE_CHIHUAHUA',
    "total_cost" DOUBLE PRECISION NOT NULL,
    "cost_currency" TEXT NOT NULL DEFAULT 'USD',
    "exchange_rate" DOUBLE PRECISION,
    "cost_mxn" DOUBLE PRECISION,
    "status" "RollStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roll_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movement" (
    "id" TEXT NOT NULL,
    "roll_id" TEXT NOT NULL,
    "type" "MovementType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "previous_length" DOUBLE PRECISION,
    "new_length" DOUBLE PRECISION,
    "location" "InventoryLocation",
    "project_id" TEXT,
    "user_id" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "location" "InventoryLocation" NOT NULL DEFAULT 'WAREHOUSE_CHIHUAHUA',
    "minimum_stock" DOUBLE PRECISION,
    "reorder_point" DOUBLE PRECISION,
    "preferred_order_qty" DOUBLE PRECISION,
    "status" "RollStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "project_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validity_days" INTEGER NOT NULL DEFAULT 15,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "executive_id" TEXT,
    "location" TEXT,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discounts" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.16,
    "tax_amount" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "exchange_rate" DOUBLE PRECISION,
    "exchange_rate_id" TEXT,
    "deposit" DOUBLE PRECISION,
    "liquidation" DOUBLE PRECISION,
    "scheduled_date" TIMESTAMP(3),
    "estimated_duration" INTEGER,
    "warranty_years" INTEGER,
    "includes" TEXT,
    "excludes" TEXT,
    "notes" TEXT,
    "observations" TEXT,
    "terms" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_item" (
    "id" TEXT NOT NULL,
    "quotation_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "discount_percent" DOUBLE PRECISION,
    "discount_amount" DOUBLE PRECISION,
    "final_price" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotation_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "quotation_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PaymentType" NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "reference" TEXT,
    "proof_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "mercado_pago_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installation" (
    "id" TEXT NOT NULL,
    "work_order_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "quotation_id" TEXT,
    "installer_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "product" TEXT,
    "areas" TEXT,
    "measures" TEXT,
    "material_reserved" TEXT,
    "tools" TEXT,
    "observations" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,

    CONSTRAINT "installation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installation_checklist" (
    "id" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installation_checklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "installation_evidence" (
    "id" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installation_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranty" (
    "id" TEXT NOT NULL,
    "warranty_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "installation_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku" TEXT,
    "lot" TEXT,
    "installer_id" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "years" INTEGER NOT NULL,
    "coverage" TEXT,
    "exclusions" TEXT,
    "qr_code" TEXT,
    "pdf_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warranty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "project_id" TEXT,
    "client_id" TEXT,
    "type" "DocumentType" NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "description" TEXT,
    "uploaded_by" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" TEXT NOT NULL,
    "project_id" TEXT,
    "client_id" TEXT,
    "description" TEXT NOT NULL,
    "assigned_to" TEXT,
    "due_date" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL,
    "project_id" TEXT,
    "client_id" TEXT,
    "type" "AppointmentType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "assigned_to" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "google_calendar_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_rfc_key" ON "company"("rfc");

-- CreateIndex
CREATE INDEX "exchange_rate_from_currency_to_currency_idx" ON "exchange_rate"("from_currency", "to_currency");

-- CreateIndex
CREATE INDEX "exchange_rate_valid_from_idx" ON "exchange_rate"("valid_from");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "audit_log_entity_entity_id_idx" ON "audit_log"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_user_id_idx" ON "audit_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "client_code_key" ON "client"("code");

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_rfc_key" ON "client"("rfc");

-- CreateIndex
CREATE INDEX "client_email_idx" ON "client"("email");

-- CreateIndex
CREATE INDEX "client_phone_idx" ON "client"("phone");

-- CreateIndex
CREATE INDEX "client_rfc_idx" ON "client"("rfc");

-- CreateIndex
CREATE INDEX "client_status_idx" ON "client"("status");

-- CreateIndex
CREATE INDEX "lead_client_id_idx" ON "lead"("client_id");

-- CreateIndex
CREATE INDEX "lead_status_idx" ON "lead"("status");

-- CreateIndex
CREATE INDEX "lead_follow_up_date_idx" ON "lead"("follow_up_date");

-- CreateIndex
CREATE UNIQUE INDEX "project_lead_id_key" ON "project"("lead_id");

-- CreateIndex
CREATE INDEX "project_client_id_idx" ON "project"("client_id");

-- CreateIndex
CREATE INDEX "project_status_idx" ON "project"("status");

-- CreateIndex
CREATE INDEX "space_project_id_idx" ON "space"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");

-- CreateIndex
CREATE INDEX "product_family_idx" ON "product"("family");

-- CreateIndex
CREATE INDEX "product_is_active_idx" ON "product"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "roll_inventory_roll_code_key" ON "roll_inventory"("roll_code");

-- CreateIndex
CREATE INDEX "roll_inventory_product_id_idx" ON "roll_inventory"("product_id");

-- CreateIndex
CREATE INDEX "roll_inventory_status_idx" ON "roll_inventory"("status");

-- CreateIndex
CREATE INDEX "roll_inventory_location_idx" ON "roll_inventory"("location");

-- CreateIndex
CREATE INDEX "inventory_movement_roll_id_idx" ON "inventory_movement"("roll_id");

-- CreateIndex
CREATE INDEX "inventory_movement_type_idx" ON "inventory_movement"("type");

-- CreateIndex
CREATE INDEX "inventory_movement_project_id_idx" ON "inventory_movement"("project_id");

-- CreateIndex
CREATE INDEX "inventory_item_product_id_idx" ON "inventory_item"("product_id");

-- CreateIndex
CREATE INDEX "inventory_item_location_idx" ON "inventory_item"("location");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_folio_key" ON "quotation"("folio");

-- CreateIndex
CREATE INDEX "quotation_project_id_idx" ON "quotation"("project_id");

-- CreateIndex
CREATE INDEX "quotation_client_id_idx" ON "quotation"("client_id");

-- CreateIndex
CREATE INDEX "quotation_folio_idx" ON "quotation"("folio");

-- CreateIndex
CREATE INDEX "quotation_status_idx" ON "quotation"("status");

-- CreateIndex
CREATE INDEX "quotation_item_quotation_id_idx" ON "quotation_item"("quotation_id");

-- CreateIndex
CREATE INDEX "quotation_item_product_id_idx" ON "quotation_item"("product_id");

-- CreateIndex
CREATE INDEX "payment_quotation_id_idx" ON "payment"("quotation_id");

-- CreateIndex
CREATE INDEX "payment_project_id_idx" ON "payment"("project_id");

-- CreateIndex
CREATE INDEX "payment_client_id_idx" ON "payment"("client_id");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "installation_work_order_id_key" ON "installation"("work_order_id");

-- CreateIndex
CREATE INDEX "installation_project_id_idx" ON "installation"("project_id");

-- CreateIndex
CREATE INDEX "installation_client_id_idx" ON "installation"("client_id");

-- CreateIndex
CREATE INDEX "installation_installer_id_idx" ON "installation"("installer_id");

-- CreateIndex
CREATE INDEX "installation_status_idx" ON "installation"("status");

-- CreateIndex
CREATE INDEX "installation_checklist_installation_id_idx" ON "installation_checklist"("installation_id");

-- CreateIndex
CREATE INDEX "installation_evidence_installation_id_idx" ON "installation_evidence"("installation_id");

-- CreateIndex
CREATE UNIQUE INDEX "warranty_warranty_id_key" ON "warranty"("warranty_id");

-- CreateIndex
CREATE INDEX "warranty_project_id_idx" ON "warranty"("project_id");

-- CreateIndex
CREATE INDEX "warranty_client_id_idx" ON "warranty"("client_id");

-- CreateIndex
CREATE INDEX "warranty_warranty_id_idx" ON "warranty"("warranty_id");

-- CreateIndex
CREATE INDEX "document_project_id_idx" ON "document"("project_id");

-- CreateIndex
CREATE INDEX "document_client_id_idx" ON "document"("client_id");

-- CreateIndex
CREATE INDEX "document_type_idx" ON "document"("type");

-- CreateIndex
CREATE INDEX "task_project_id_idx" ON "task"("project_id");

-- CreateIndex
CREATE INDEX "task_client_id_idx" ON "task"("client_id");

-- CreateIndex
CREATE INDEX "task_assigned_to_idx" ON "task"("assigned_to");

-- CreateIndex
CREATE INDEX "task_due_date_idx" ON "task"("due_date");

-- CreateIndex
CREATE INDEX "appointment_project_id_idx" ON "appointment"("project_id");

-- CreateIndex
CREATE INDEX "appointment_client_id_idx" ON "appointment"("client_id");

-- CreateIndex
CREATE INDEX "appointment_assigned_to_idx" ON "appointment"("assigned_to");

-- CreateIndex
CREATE INDEX "appointment_date_idx" ON "appointment"("date");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roll_inventory" ADD CONSTRAINT "roll_inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_roll_id_fkey" FOREIGN KEY ("roll_id") REFERENCES "roll_inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation" ADD CONSTRAINT "quotation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_item" ADD CONSTRAINT "quotation_item_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_item" ADD CONSTRAINT "quotation_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation" ADD CONSTRAINT "installation_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation" ADD CONSTRAINT "installation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation" ADD CONSTRAINT "installation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation_checklist" ADD CONSTRAINT "installation_checklist_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "installation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation_evidence" ADD CONSTRAINT "installation_evidence_installation_id_fkey" FOREIGN KEY ("installation_id") REFERENCES "installation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty" ADD CONSTRAINT "warranty_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty" ADD CONSTRAINT "warranty_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
