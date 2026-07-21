import { Request, Response } from 'express';
export declare const transformationController: {
    getAllTransformations: (req: Request, res: Response) => Promise<void>;
    getTransformationById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    createTransformation: (req: Request, res: Response) => Promise<void>;
    updateTransformation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteTransformation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=transformation.controller.d.ts.map