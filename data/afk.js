/* ═══════════════════════════════════════════════════════ //
=> If you want to recode, reupload,
=> or copy the codes/script,
=> pls give credit,
=> no credit? i will take action immediately.
==> Copyright (C) 2022 Dark_Ezio.
==> Licensed under the  MIT License;
===> you may not use this file except in compliance with the License.
=> Thank you to Lord Buddha, Family and Myself.
=> Whats Bot - Dark_Ezio.
// ════════════════════════════ */

const fs = require("fs");

const addAfkUser = (userId, time, reason, sejak, _dir) => {
  const obj = { id: userId, time: time, reason: reason, sejak: sejak };
  _dir.push(obj);
  fs.writeFileSync("./database/afk.json", JSON.stringify(_dir));
};
const checkAfkUser = (userId, _dir) => {
  let status = false;
  Object.keys(_dir).forEach((i) => {
    if (_dir[i].id === userId) {
      status = true;
    }
  });
  return status;
};
const getAfkTime = (userId, _dir) => {
  let position = null;
  Object.keys(_dir).forEach((i) => {
    if (_dir[i].id === userId) {
      position = i;
    }
  });
  if (position !== null) {
    return _dir[position].time;
  }
};
const getAfkSejak = (userId, _dir) => {
  let position = null;
  Object.keys(_dir).forEach((i) => {
    if (_dir[i].id === userId) {
      position = i;
    }
  });
  if (position !== null) {
    return _dir[position].sejak;
  }
};
const getAfkReason = (userId, _dir) => {
  let position = null;
  Object.keys(_dir).forEach((i) => {
    if (_dir[i].id === userId) {
      position = i;
    }
  });
  if (position !== null) {
    return _dir[position].reason;
  }
};
const getAfkPosition = (userId, _dir) => {
  let position = null;
  Object.keys(_dir).forEach((i) => {
    if (_dir[i].id === userId) {
      position = i;
    }
  });
  return position;
};
const getAfkId = (userId, _dir) => {
  let position = null;
  Object.keys(_dir).forEach((i) => {
    if (_dir[i].id === userId) {
      position = i;
    }
  });
  if (position !== null) {
    return _dir[position].id;
  }
};

module.exports = {
  addAfkUser,
  checkAfkUser,
  getAfkTime,
  getAfkReason,
  getAfkPosition,
  getAfkId,
  getAfkSejak,
};
