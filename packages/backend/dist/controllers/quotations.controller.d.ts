import { Request, Response } from 'express';
export declare const quotationsController: {
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    convertToInvoice: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    pdf: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=quotations.controller.d.ts.map