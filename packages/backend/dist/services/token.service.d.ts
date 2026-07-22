export interface AccessPayload {
    userId: string;
    role: string;
    email?: string;
}
export declare const generateAccessToken: (payload: AccessPayload) => any;
export declare const generateRefreshToken: (userId: string) => Promise<any>;
export declare const verifyRefreshToken: (token: string) => Promise<{
    userId: string;
    tokenId: string;
    record: any;
}>;
export declare const rotateRefreshToken: (oldTokenId: string, userId: string) => Promise<any>;
export declare const revokeRefreshToken: (tokenId: string) => Promise<void>;
export declare const generateTokensForUser: (user: {
    id: string;
    email?: string;
    role?: string;
}) => Promise<{
    access: any;
    refresh: any;
}>;
//# sourceMappingURL=token.service.d.ts.map