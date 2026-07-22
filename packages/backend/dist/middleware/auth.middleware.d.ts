import { Request, Response, NextFunction } from 'express';
interface TokenPayload {
    userId: string;
    role: string;
    email?: string;
}
export declare const authMiddleware: (req: Request & {
    user?: TokenPayload;
}, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRole: (roles: string[]) => (req: Request & {
    user?: TokenPayload;
}, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.middleware.d.ts.map