export declare const TRANSFORMATION_JOURNEY_PHASES: readonly ["Discover", "Curate", "Design", "Transform", "Experience"];
export type TransformationJourneyPhase = (typeof TRANSFORMATION_JOURNEY_PHASES)[number];
export declare const TRANSFORMATION_OPERATIONAL_STATUSES: readonly ["Lead", "Contacted", "Survey", "Quotation", "FollowUp", "Deposit", "Scheduled", "Installation", "Warranty", "Completed", "Cancelled", "Active", "Archived"];
export type TransformationOperationalStatus = (typeof TRANSFORMATION_OPERATIONAL_STATUSES)[number];
export declare const TRANSFORMATION_PRIORITIES: readonly ["Low", "Medium", "High", "Urgent"];
export type TransformationPriority = (typeof TRANSFORMATION_PRIORITIES)[number];
export interface TransformationCoordinates {
    latitude: number;
    longitude: number;
}
export interface TransformationDomainModel {
    id: string;
    folioNumber: string;
    name: string;
    clientId: string;
    clientContactPerson: string | null;
    sector: string;
    projectType: string | null;
    status: TransformationOperationalStatus;
    priority: TransformationPriority;
    journeyPhase: TransformationJourneyPhase;
    completionPercentage: number;
    architectId: string | null;
    salesRepresentativeId: string | null;
    projectManagerId: string | null;
    country: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    coordinates: TransformationCoordinates | null;
    estimatedStartDate: Date | null;
    estimatedCompletionDate: Date | null;
    actualCompletionDate: Date | null;
    startDate: Date | null;
    endDate: Date | null;
    estimatedBudget: string | null;
    approvedBudget: string | null;
    currency: string;
    actualBudget: string | null;
    description: string | null;
    observations: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string | null;
}
export type CreateTransformationInput = Omit<TransformationDomainModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTransformationInput = Partial<CreateTransformationInput>;
//# sourceMappingURL=transformation.model.d.ts.map