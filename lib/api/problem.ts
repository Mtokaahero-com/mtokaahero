export interface FieldError {
    field: string;
    message: string;
}

export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly code: string,
        message: string,
        readonly fieldErrors: FieldError[] = [],
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function parseProblem(res: Response): Promise<ApiError> {
    const body = (await res.json().catch(() => null)) as
        | { code?: string; detail?: string; errors?: FieldError[] }
        | null;
    return new ApiError(
        res.status,
        body?.code ?? 'HTTP_ERROR',
        body?.detail ?? `Request failed (${res.status})`,
        body?.errors ?? [],
    );
}
