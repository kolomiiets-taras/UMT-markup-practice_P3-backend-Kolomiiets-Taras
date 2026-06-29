const HTTP_STATUS_MESSAGES = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Server Error',
};

class HttpError extends Error {
  constructor(status, message) {
    super(message || HTTP_STATUS_MESSAGES[status] || 'Error');
    this.status = status;
  }
}

module.exports = HttpError;
