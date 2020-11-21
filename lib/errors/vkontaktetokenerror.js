function VkontakteTokenError(message, code, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'VkontakteTokenError';
  this.message = message;
  this.code = code || 'invalid_request';
  this.status = status || 500;
}
VkontakteTokenError.prototype.__proto__ = Error.prototype;
module.exports = VkontakteTokenError;
