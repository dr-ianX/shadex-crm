"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransformationSchema = exports.createTransformationSchema = exports.transformationDomainSchema = void 0;
const zod_1 = require("zod");
const transformation_model_1 = require("./transformation.model");
const nonNegativeDecimalString = zod_1.z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Value must be a non-negative decimal');
const nullableDecimalString = zod_1.z.union([nonNegativeDecimalString, zod_1.z.null()]);
const coordinatesSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
});
exports.transformationDomainSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid(),
    folioNumber: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    clientId: zod_1.z.string().uuid(),
    clientContactPerson: zod_1.z.string().min(1).nullable(),
    sector: zod_1.z.string().min(1),
    projectType: zod_1.z.string().min(1).nullable(),
    status: zod_1.z.enum(transformation_model_1.TRANSFORMATION_OPERATIONAL_STATUSES),
    priority: zod_1.z.enum(transformation_model_1.TRANSFORMATION_PRIORITIES),
    journeyPhase: zod_1.z.enum(transformation_model_1.TRANSFORMATION_JOURNEY_PHASES),
    completionPercentage: zod_1.z.number().int().min(0).max(100),
    architectId: zod_1.z.string().uuid().nullable(),
    salesRepresentativeId: zod_1.z.string().uuid().nullable(),
    projectManagerId: zod_1.z.string().uuid().nullable(),
    country: zod_1.z.string().min(1).nullable(),
    state: zod_1.z.string().min(1).nullable(),
    city: zod_1.z.string().min(1).nullable(),
    address: zod_1.z.string().min(1).nullable(),
    coordinates: zod_1.z.union([coordinatesSchema, zod_1.z.null()]),
    estimatedStartDate: zod_1.z.date().nullable(),
    estimatedCompletionDate: zod_1.z.date().nullable(),
    actualCompletionDate: zod_1.z.date().nullable(),
    startDate: zod_1.z.date().nullable(),
    endDate: zod_1.z.date().nullable(),
    estimatedBudget: nullableDecimalString,
    approvedBudget: nullableDecimalString,
    currency: zod_1.z.string().length(3),
    actualBudget: nullableDecimalString,
    description: zod_1.z.string().min(1).nullable(),
    observations: zod_1.z.string().min(1).nullable(),
    notes: zod_1.z.string().min(1).nullable(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
    createdBy: zod_1.z.string().uuid().nullable(),
})
    .superRefine((data, ctx) => {
    if (data.estimatedStartDate &&
        data.estimatedCompletionDate &&
        data.estimatedCompletionDate < data.estimatedStartDate) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['estimatedCompletionDate'],
            message: 'Estimated completion date cannot be before estimated start date',
        });
    }
});
exports.createTransformationSchema = exports.transformationDomainSchema
    .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})
    .extend({
    status: zod_1.z.enum(transformation_model_1.TRANSFORMATION_OPERATIONAL_STATUSES).default('Lead'),
    priority: zod_1.z.enum(transformation_model_1.TRANSFORMATION_PRIORITIES).default('Medium'),
    journeyPhase: zod_1.z.enum(transformation_model_1.TRANSFORMATION_JOURNEY_PHASES).default('Discover'),
    completionPercentage: zod_1.z.number().int().min(0).max(100).default(0),
    currency: zod_1.z.string().length(3).default('MXN'),
});
exports.updateTransformationSchema = exports.createTransformationSchema.partial();
//# sourceMappingURL=transformation.schema.js.map