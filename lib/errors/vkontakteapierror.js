function VkontakteAPIError(message, code, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "VkontakteAPIError";
  this.message = message;
  this.code = code || "api_error";
  this.status = status || 500;
}
VkontakteAPIError.prototype.__proto__ = Error.prototype;
module.exports = VkontakteAPIError;
