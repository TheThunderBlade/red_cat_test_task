export interface tokens {
    accessToken: string;
    refreshToken: string;
}

export interface tokensData {
    userId: number;
    refreshToken: string;
}

export interface validatedToken {
    userId: number;
    email: string;
}
