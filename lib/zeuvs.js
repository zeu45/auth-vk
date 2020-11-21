var parse = require("./profile").parse,
  util = require("util"),
  OAuth2Strategy = require("passport-oauth2"),
  InternalOAuthError = require("passport-oauth2").InternalOAuthError,
  VkontakteTokenError = require("./errors/vkontaktetokenerror"),
  VkontakteAPIError = require("./errors/vkontakteapierror");
function Zeuvs(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL || "https://oauth.vk.com/authorize";
  options.tokenURL = options.tokenURL || "https://oauth.vk.com/access_token";
  options.scopeSeparator = options.scopeSeparator || ",";
  options.passReqToCallback = false;
  this.lang = options.lang || "ru";
  this.photoSize = options.photoSize || 200;
  delete options.lang;
  delete options.photoSize;

  OAuth2Strategy.call(this, options, verifyWrapper(options, verify));
  this.name = "vkontakte";
  this._profileURL =
    options.profileURL || "https://api.vk.com/method/users.get";
  this._profileFields = options.profileFields || [];
  this._apiVersion = options.apiVersion || "5.130";
}

function verifyWrapper(options, verify) {
  return function passportVerify(
    accessToken,
    refreshToken,
    params,
    profile,
    verified
  ) {
    if (params && params.email) {
      profile.emails = [{ value: params.email }];
    }

    var arity = verify.length;
    if (arity == 5) {
      verify(accessToken, refreshToken, params, profile, verified);
    } else if (arity == 4) {
      verify(accessToken, refreshToken, profile, verified);
    } else {
      this.error(
        new Error(
          "API Error (by @zeuvs): Проверка обратного вызова должна принимать 4 или 5 параметров"
        )
      );
    }
  };
}

util.inherits(Zeuvs, OAuth2Strategy);
Zeuvs.prototype.authorizationParams = function (options) {
  var params = {};
  if (options.display) {
    params.display = options.display;
  }
  return params;
};

Zeuvs.prototype.userProfile = function (accessToken, done) {
  var url = this._profileURL;
  var fields = [
    "uid",
    "first_name",
    "last_name",
    "screen_name",
    "sex",
    "bdate",
    "followers_count",
    "home_town",
    "site",
    "status",
    "verified",
    "city",
  ];

  this._profileFields.forEach(function (f) {
    if (fields.indexOf(f) < 0) fields.push(f);
  });
  url += "?fields=" + fields.join(",") + "&v=" + this._apiVersion + "&https=1";
  if (this.lang) url += "&lang=" + this.lang;
  this._oauth2.getProtectedResource(url, accessToken, function (
    err,
    body,
    res
  ) {
    if (err) {
      return done(
        new InternalOAuthError(
          "API Error: Не удалось получить данные профиля",
          err
        )
      );
    }
    try {
      var json = JSON.parse(body);
      if (json.error)
        throw new VkontakteAPIError(
          json.error.error_msg,
          json.error.error_code
        );
      json = json.response[0];
      var profile = parse(json);
      profile.provider = "ВКонтакте";
      profile.vkurl = "vk.com";
      profile.vkapiurl = "api.vk.com";
      profile.vkmethodurl = "api.vk.com/method";
      profile.access_token = accessToken;
      profile.vk = json;
      done(null, profile);
    } catch (e) {
      done(e);
    }
  });
};

Zeuvs.prototype.parseErrorResponse = function (body, status) {
  var json = JSON.parse(body);
  if (json.error && typeof json.error == "object") {
    return new VkontakteTokenError(json.error.error_msg, json.error.error_code);
  }
  return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};
module.exports = Zeuvs;
