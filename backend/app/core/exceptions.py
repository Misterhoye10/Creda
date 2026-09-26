class CredaException(Exception):
    """Base application exception for Creda platform."""
    def __init__(self, message: str, status_code: int = 400, details: dict = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class ResourceNotFoundException(CredaException):
    """Raised when a requested resource is not found."""
    def __init__(self, message: str = "Resource not found", details: dict = None):
        super().__init__(message=message, status_code=404, details=details)


class ConflictException(CredaException):
    """Raised when a resource state conflict occurs (e.g. duplicate email or slug)."""
    def __init__(self, message: str = "Resource conflict occurred", details: dict = None):
        super().__init__(message=message, status_code=409, details=details)


class UnauthorizedException(CredaException):
    """Raised when authentication fails or is missing."""
    def __init__(self, message: str = "Authentication required", details: dict = None):
        super().__init__(message=message, status_code=401, details=details)


class ValidationException(CredaException):
    """Raised when input validation fails."""
    def __init__(self, message: str = "Validation failed", details: dict = None):
        super().__init__(message=message, status_code=422, details=details)
