import { Request, Response } from 'express';
export declare const authController: {
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    refresh: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=auth.controller.d.ts.map