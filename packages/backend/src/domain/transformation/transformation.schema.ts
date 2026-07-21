import { z } from 'zod';
import {
  TRANSFORMATION_JOURNEY_PHASES,
  TRANSFORMATION_OPERATIONAL_STATUSES,
  TRANSFORMATION_PRIORITIES,
} from './transformation.model';

const nonNegativeDecimalString = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'Value must be a non-negative decimal');

const nullableDecimalString = z.union([nonNegativeDecimalString, z.null()]);

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const transformationDomainSchema = z
  .object({
    id: z.string().uuid(),
    folioNumber: z.string().min(1),
    name: z.string().min(1),
    clientId: z.string().uuid(),
    clientContactPerson: z.string().min(1).nullable(),
    sector: z.string().min(1),
    projectType: z.string().min(1).nullable(),
    status: z.enum(TRANSFORMATION_OPERATIONAL_STATUSES),
    priority: z.enum(TRANSFORMATION_PRIORITIES),
    journeyPhase: z.enum(TRANSFORMATION_JOURNEY_PHASES),
    completionPercentage: z.number().int().min(0).max(100),
    architectId: z.string().uuid().nullable(),
    salesRepresentativeId: z.string().uuid().nullable(),
    projectManagerId: z.string().uuid().nullable(),
    country: z.string().min(1).nullable(),
    state: z.string().min(1).nullable(),
    city: z.string().min(1).nullable(),
    address: z.string().min(1).nullable(),
    coordinates: z.union([coordinatesSchema, z.null()]),
    estimatedStartDate: z.date().nullable(),
    estimatedCompletionDate: z.date().nullable(),
    actualCompletionDate: z.date().nullable(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    estimatedBudget: nullableDecimalString,
    approvedBudget: nullableDecimalString,
    currency: z.string().length(3),
    actualBudget: nullableDecimalString,
    description: z.string().min(1).nullable(),
    observations: z.string().min(1).nullable(),
    notes: z.string().min(1).nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.string().uuid().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.estimatedStartDate &&
      data.estimatedCompletionDate &&
      data.estimatedCompletionDate < data.estimatedStartDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['estimatedCompletionDate'],
        message: 'Estimated completion date cannot be before estimated start date',
      });
    }
  });

export const createTransformationSchema = transformationDomainSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    status: z.enum(TRANSFORMATION_OPERATIONAL_STATUSES).default('Lead'),
    priority: z.enum(TRANSFORMATION_PRIORITIES).default('Medium'),
    journeyPhase: z.enum(TRANSFORMATION_JOURNEY_PHASES).default('Discover'),
    completionPercentage: z.number().int().min(0).max(100).default(0),
    currency: z.string().length(3).default('MXN'),
  });

export const updateTransformationSchema = createTransformationSchema.partial();

export type TransformationSchemaType = z.infer<typeof transformationDomainSchema>;
export type CreateTransformationSchemaType = z.infer<typeof createTransformationSchema>;
export type UpdateTransformationSchemaType = z.infer<typeof updateTransformationSchema>;
