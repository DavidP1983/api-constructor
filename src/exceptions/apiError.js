export class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static unauthorizeError() {
        return new ApiError(401, 'User not authorize');
    }

    static badRequest(status, message, errors = []) {
        return new ApiError(status, message, errors);
    }

    static notFound(status, message) {
        return new ApiError(status, message);
    }
    static internal(status, message) {
        return new ApiError(status, message);
    }
};