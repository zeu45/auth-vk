exports.parse = function (json) {
  if ("string" == typeof json) {
    json = JSON.parse(json);
  }

  const profile = {};
  profile.apiV = "5.130";
  profile.lang = "ru";
  profile.id = json.id;
  profile.domain = json.screen_name;
  profile.pushV1 = `[${json.screen_name}|${json.first_name}]`;
  profile.pushV2 = `@${json.screen_name} (${json.first_name})`;
  profile.displayName = json.first_name + " " + json.last_name;
  profile.name = {
    givenName: json.first_name,
    familyName: json.last_name,
  };

  const mname = {
    1: "января",
    2: "февраля",
    3: "марта",
    4: "апреля",
    5: "мая",
    6: "июня",
    7: "июля",
    8: "августа",
    9: "сентября",
    10: "октября",
    11: "ноября",
    12: "декабря",
  };

  if (json.sex) {
    profile.gender = json.sex == 1 ? "Женский" : "Мужской";
  }

  const sex = json.sex;
  profile.gender = sex == 1 ? "Женский" : sex == 2 ? "Мужской" : void 1;
  profile.url = "http://vk.com/" + json.screen_name;
  profile.photos = [];
  for (let key in json) {
    if (key.indexOf("photo") !== 0) continue;
    profile.photos.push({
      value: json[key],
      type: key,
    });
  }

  if (json.city) {
    profile.city = json.city.title;
  }

  const bdate = /^(\d+)\.(\d+)\.(\d+)$/.exec(json.bdate);
  if (bdate) {
    profile.bdate = `${bdate[1]} ${mname[bdate[2]]}, ${bdate[3]} г.`;
  }

  return profile;
};
