function VkontakteAuthorizationError(message, type, code, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "VkontakteAuthorizationError";
  this.message = message;
  this.type = type;
  this.code = code || "server_error";
  this.status = status || 500;
}
VkontakteAuthorizationError.prototype.__proto__ = Error.prototype;
module.exports = VkontakteAuthorizationError;
