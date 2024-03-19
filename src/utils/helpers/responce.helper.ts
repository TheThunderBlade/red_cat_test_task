export interface ResponseHelper {
    status: number;
    message?: string | null;
    data?: any | null;
}

export default function responceHelper(payload: ResponseHelper): ResponseHelper {
    return payload;
}
