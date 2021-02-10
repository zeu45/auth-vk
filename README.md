<p align="center"><img src="https://s3.tproger.ru/uploads/2016/12/vk-java-auth.png"></p>
<p align="center">
<a href="https://www.npmjs.com/package/auth-vk"><img src="https://img.shields.io/npm/v/auth-vk.svg?style=flat-square" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/auth-vk"><img src="https://img.shields.io/npm/dt/auth-vk.svg?style=flat-square" alt="NPM downloads"></a>
</p>

AUTH-VK is a powerful [Node.js](https://nodejs.org) a module that allows you to easily log in to Vkontakte 🚀

| 📖 [Documentation](https://www.npmjs.com/package/auth-vk) | 🤖 [Author](https://vk.com/zeuvs) |
| --------------------------------------------------------- | --------------------------------- |

## Features

- 100% coverage of the VKontakte API
- Predictable abstraction
- Works with large collections of data
- Easy authorization form

## Installation

> **[Node.js](https://nodejs.org/) 12.0.0 or newer is required**

### NPM

```
npm i auth-vk
npm i passport
```

### Interaction with the library

- После установки библиотеки, вам понадобится следующий код:

```js
// Пример использования библиотеки:
new auth(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: process.env.SCOPE,
    profileFields: process.env.PROFILE_FIELDS,
  },
  async function verify(accessToken, refreshToken, params, profile, done) {
    process.nextTick(function () {
      done(null, profile);
    });
  }
);
```

- Вам потребуется создать приложение:

<p align="center"><img src="https://dev-up.ru/img/start.png"></p>

- После создания приложения, зайдя в настройки вам понадобится:

<p align="center"><img src="https://dev-up.ru/img/next.png"></p>

```
ID приложения
Защищённый ключ
```

```js
clientID: 7624701,
clientSecret: 'xZUHQ8vgnMk4okBAKn1e',
```

- Далее нужно указать ссылку на свой сайт по данному примеру:

```js
callbackURL: "https://dev-up.ru/auth/vk/callback",
```

Затем нужно указать права приложения и отображение прав:<br>
Список прав можно получить тут 📖 [Права приложений](https://vk.com/dev/permissions).<br>
В примере мы укажем права на: Доступ в любое время, Группы, Электронная почта, Список друзей.

```js
      scope: ["offline", "groups", "email", "friends"],
      profileFields: ["offline", "groups", "email", "friends"],
```

Вот и всё!

## Example usage

Пример кода:

```js
const auth = require("auth-vk").Zeuvs;
const express = require("express");
const passport = require("passport");
const app = express();
require("http").Server(app).listen(80);
app.set("views", __dirname + "/scr");
app.set("view engine", "ejs");

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new auth(
    {
      clientID: "7624701",
      clientSecret: "xZUHQ8vgnMk4okBAKn1e",
      callbackURL: "https://dev-up.ru/auth/vk/callback",
      scope: ["offline", "groups", "email", "friends"],
      profileFields: ["offline", "groups", "email", "friends"],
    },
    async function verify(accessToken, refreshToken, params, profile, done) {
      process.nextTick(function () {
        done(null, profile);
      });
    }
  )
);

app.get("/", autch, function (req, res) {
  res.json({
    user: {
      id: req.user.id,
      fullname: req.user.displayName,
      pname: req.user.name,
      sex: req.user.gender,
      url: req.user.url,
    },
  });
  /*
    RESULT:
    user.id: 449532928
    user.fullname: Mihail Bezmolenko
    user.pname: { "givenName": "Mihail", "familyName": "Bezmolenko" }
    user.sex: Мужской
    user.url: "http://vk.com/zeuvs"
    */
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/auth/vk", passport.authenticate("vkontakte"), function (req, res) {
  req.session.returnTo = req.originalUrl;
});

app.get(
  "/auth/vk/callback",
  passport.authenticate("vkontakte", {
    failureRedirect: "/",
    session: true,
  }),
  async function (req, res) {
    res.redirect(req.session.returnTo || "/");
    delete req.session.returnTo;
  }
);

async function autch(req, res, next) {
  if (!req.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/auth/vk/");
  }
  return next();
}
```
