-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "secondaryPhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "clientType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT
);

-- CreateTable
CREATE TABLE "transformations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folioNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientContactPerson" TEXT,
    "sector" TEXT NOT NULL,
    "projectType" TEXT,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "journeyPhase" TEXT NOT NULL DEFAULT 'Discover',
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "architectId" TEXT,
    "salesRepresentativeId" TEXT,
    "projectManagerId" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "address" TEXT,
    "coordinates" JSONB,
    "estimatedStartDate" DATETIME,
    "estimatedCompletionDate" DATETIME,
    "actualCompletionDate" DATETIME,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "estimatedBudget" DECIMAL,
    "approvedBudget" DECIMAL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "actualBudget" DECIMAL,
    "description" TEXT,
    "observations" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    CONSTRAINT "transformations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transformations_architectId_fkey" FOREIGN KEY ("architectId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "applicationType" JSONB,
    "costPrice" DECIMAL NOT NULL,
    "salePrice" DECIMAL NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "marginPercentage" DECIMAL NOT NULL,
    "minimumOrder" DECIMAL,
    "manufacturer" TEXT,
    "model" TEXT,
    "specs" JSONB,
    "performanceFactors" JSONB,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "stockLevel" INTEGER NOT NULL DEFAULT 0,
    "reorderPoint" INTEGER NOT NULL DEFAULT 0,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 7,
    "supplierId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    CONSTRAINT "technologies_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxId" TEXT,
    "businessType" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "secondaryPhone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "paymentTerms" TEXT,
    "creditLimit" DECIMAL,
    "currentBalance" DECIMAL NOT NULL DEFAULT 0,
    "discountPercentage" DECIMAL NOT NULL DEFAULT 0,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 7,
    "minimumOrder" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "rating" INTEGER NOT NULL DEFAULT 3,
    "preferredLevel" TEXT NOT NULL DEFAULT 'Standard',
    "contractStartDate" DATETIME,
    "contractEndDate" DATETIME,
    "notes" TEXT,
    "portalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "portalUsername" TEXT,
    "portalLastLogin" DATETIME,
    "portalPermissions" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "lastLogin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "replacedById" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "batchNumber" TEXT,
    "serialNumber" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "specifications" JSONB,
    "locationId" TEXT,
    "warehouse" TEXT,
    "zone" TEXT,
    "shelf" TEXT,
    "position" TEXT,
    "unitOfMeasure" TEXT NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "quantityAllocated" INTEGER NOT NULL DEFAULT 0,
    "quantityAvailable" INTEGER NOT NULL DEFAULT 0,
    "quantityOnOrder" INTEGER NOT NULL DEFAULT 0,
    "reorderPoint" INTEGER NOT NULL DEFAULT 0,
    "maxStock" INTEGER,
    "safetyStock" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL NOT NULL,
    "averageCost" DECIMAL NOT NULL,
    "totalValue" DECIMAL NOT NULL,
    "manufactureDate" DATETIME,
    "expiryDate" DATETIME,
    "receivedDate" DATETIME,
    "lastMovementDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "condition" TEXT NOT NULL DEFAULT 'New',
    "supplierId" TEXT,
    "purchaseOrderId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    CONSTRAINT "inventory_items_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_items_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "movementNumber" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "beforeQuantity" INTEGER NOT NULL,
    "afterQuantity" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "transformationId" TEXT,
    "fromLocationId" TEXT,
    "toLocationId" TEXT,
    "fromWarehouse" TEXT,
    "toWarehouse" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "authorizedBy" TEXT,
    "notes" TEXT,
    "unitCost" DECIMAL,
    "totalCost" DECIMAL,
    "valuationMethod" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" DATETIME,
    CONSTRAINT "inventory_movements_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "allocations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inventoryItemId" TEXT NOT NULL,
    "transformationId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "allocatedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdBy" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "allocations_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentNumber" TEXT NOT NULL,
    "transformationId" TEXT NOT NULL,
    "quotationId" TEXT,
    "paymentType" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "amount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "taxAmount" DECIMAL NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL NOT NULL,
    "remainingBalance" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentDetails" JSONB,
    "paymentDate" DATETIME,
    "dueDate" DATETIME,
    "processedDate" DATETIME,
    "clearedDate" DATETIME,
    "invoiceId" TEXT,
    "invoiceStatus" TEXT NOT NULL DEFAULT 'NotInvoiced',
    "clientId" TEXT NOT NULL,
    "payerName" TEXT,
    "payerContact" TEXT,
    "notes" TEXT,
    "receiptSent" BOOLEAN NOT NULL DEFAULT false,
    "receiptSentDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" DATETIME,
    CONSTRAINT "payments_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "uuidFiscal" TEXT,
    "transformationId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "taxAmount" DECIMAL NOT NULL,
    "totalAmount" DECIMAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "invoiceDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "paymentStatus" TEXT NOT NULL DEFAULT 'Unpaid',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_summaries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transformationId" TEXT NOT NULL,
    "totalProjectAmount" DECIMAL NOT NULL,
    "totalPaymentsReceived" DECIMAL NOT NULL DEFAULT 0,
    "totalPendingBalance" DECIMAL NOT NULL,
    "totalEstimatedCosts" DECIMAL NOT NULL,
    "estimatedMargin" DECIMAL NOT NULL,
    "paymentProgressPercentage" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "support_cases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "transformationId" TEXT NOT NULL,
    "warrantyId" TEXT,
    "installationId" TEXT,
    "technologyId" TEXT,
    "caseType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "category" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reportedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationProblem" TEXT,
    "clientId" TEXT NOT NULL,
    "clientContact" TEXT,
    "clientPriority" TEXT NOT NULL DEFAULT 'Regular',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "resolutionStatus" TEXT NOT NULL DEFAULT 'NotStarted',
    "rootCause" TEXT,
    "resolutionDescription" TEXT,
    "resolutionMethod" TEXT,
    "resolutionCost" DECIMAL NOT NULL DEFAULT 0,
    "warrantyClaim" BOOLEAN NOT NULL DEFAULT false,
    "warrantyApproved" BOOLEAN NOT NULL DEFAULT false,
    "warrantyCoverage" TEXT,
    "assignedTo" TEXT,
    "assignedTeam" TEXT,
    "assignedDate" DATETIME,
    "targetResolutionDate" DATETIME,
    "actualResolutionDate" DATETIME,
    "firstResponseDate" DATETIME,
    "slaDueDate" DATETIME,
    "customerImpact" TEXT NOT NULL,
    "businessImpact" TEXT NOT NULL,
    "revenueAtRisk" DECIMAL NOT NULL DEFAULT 0,
    "reputationRisk" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    "closedBy" TEXT,
    "closedAt" DATETIME,
    "totalTimeToResolve" INTEGER,
    "satisfactionRating" INTEGER,
    "lessonsLearned" TEXT,
    "preventiveActions" TEXT,
    CONSTRAINT "support_cases_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_cases_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_cases_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "support_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supportCaseId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT,
    "performedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMinutes" INTEGER,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "support_activities_supportCaseId_fkey" FOREIGN KEY ("supportCaseId") REFERENCES "support_cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "support_attachments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supportCaseId" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "description" TEXT,
    "uploadedBy" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" INTEGER,
    CONSTRAINT "support_attachments_supportCaseId_fkey" FOREIGN KEY ("supportCaseId") REFERENCES "support_cases" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transformation_technologies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transformationId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transformation_technologies_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transformation_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quotationNumber" TEXT NOT NULL,
    "transformationId" TEXT,
    "clientId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "subtotal" DECIMAL NOT NULL DEFAULT 0,
    "taxPercent" DECIMAL NOT NULL DEFAULT 16,
    "taxAmount" DECIMAL NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "validUntil" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT,
    CONSTRAINT "quotations_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "quotations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quotation_lines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quotationId" TEXT NOT NULL,
    "productId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "unitPrice" DECIMAL NOT NULL,
    "lineTotal" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quotation_lines_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sequences" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "last" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "installations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "installationNumber" TEXT NOT NULL,
    "transformationId" TEXT NOT NULL,
    "scheduledDate" DATETIME NOT NULL,
    "actualStartDate" DATETIME,
    "actualEndDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "installerId" TEXT,
    "address" TEXT,
    "materials" JSONB,
    "quantity" DECIMAL,
    "unitOfMeasure" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "notes" TEXT,
    "photographs" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "installations_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "warrantyNumber" TEXT NOT NULL,
    "transformationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "coverage" TEXT NOT NULL,
    "terms" TEXT,
    "documentPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "warranties_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transformationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "description" TEXT,
    "uploadedBy" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" INTEGER,
    CONSTRAINT "documents_transformationId_fkey" FOREIGN KEY ("transformationId") REFERENCES "transformations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "technologyId" TEXT NOT NULL,
    "oldPrice" DECIMAL NOT NULL,
    "newPrice" DECIMAL NOT NULL,
    "changeDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "authorizedBy" TEXT,
    CONSTRAINT "price_history_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "supplier_evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "evaluationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evaluatorId" TEXT,
    "qualityScore" INTEGER NOT NULL,
    "deliveryScore" INTEGER NOT NULL,
    "priceScore" INTEGER NOT NULL,
    "serviceScore" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "comments" TEXT,
    "recommendation" TEXT,
    CONSTRAINT "supplier_evaluations_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_code_key" ON "clients"("code");

-- CreateIndex
CREATE UNIQUE INDEX "transformations_folioNumber_key" ON "transformations"("folioNumber");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_code_key" ON "technologies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenId_key" ON "refresh_tokens"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_sku_key" ON "inventory_items"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_movements_movementNumber_key" ON "inventory_movements"("movementNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentNumber_key" ON "payments"("paymentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_uuidFiscal_key" ON "invoices"("uuidFiscal");

-- CreateIndex
CREATE UNIQUE INDEX "financial_summaries_transformationId_key" ON "financial_summaries"("transformationId");

-- CreateIndex
CREATE UNIQUE INDEX "support_cases_caseNumber_key" ON "support_cases"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "transformation_technologies_transformationId_technologyId_key" ON "transformation_technologies"("transformationId", "technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_quotationNumber_key" ON "quotations"("quotationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "installations_installationNumber_key" ON "installations"("installationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "warranties_warrantyNumber_key" ON "warranties"("warrantyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "warranties_transformationId_key" ON "warranties"("transformationId");
