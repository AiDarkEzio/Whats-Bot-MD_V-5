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
var Commands = [];
const jsonConfig = JSON.parse(fs.readFileSync("./config.json"));
var json = JSON.parse(fs.readFileSync("./database/" + "EN" + ".json"));

function getString(file) {
  return json["STRINGS"][file];
}

const reactArry = async (text) => {
  const reactArry = getString("react");
  const react = reactArry[text];
  let picak = react[Math.floor(Math.random() * react.length)];
  return picak;
};

function successfullMessage(msg) {
  return "👩‍🦰 *Successful*:  ```" + msg + "```";
}

function errorMessage(msg) {
  return "🚀 *Error*:  ```" + msg + "```";
}

function infoMessage(msg) {
  return "🤖 *Info*: " + '       ' + msg ;
}

// ["search", "all", "downloade", "chat", "system", 'fun', '18+', 'owner', 'create',  ];

const addCommand = (info, func) => {
  // const SR = reactArry("SUCCESS");
  const SP = "\n*Processing...*";
  var infos = {
    on: info['on'] === null || undefined ? '' : info['on'],
    pattern: info["pattern"] === null || undefined ? [] : info["pattern"],
    desc: info["desc"] === null || undefined ? "" : info["desc"],
    usage: info["usage"] === null || undefined ? "" : info["usage"],
    warn: info["warn"] === null || undefined ? "" : info["warn"],
    sucReact: info["sucReact"] === null || undefined ? "💗" : info["sucReact"],
    onlyfromMe: info["fromMe"] === null || undefined ? false : info["fromMe"], // Or Sudo
    onlyGroup:
      info["onlyGroup"] === null || undefined ? false : info["onlyGroup"],
    onlyPm: info["onlyPm"] === null || undefined ? false : info["onlyPm"],
    strPross: info["strPross"] === null || undefined ? SP : info["strPross"],
    deleteCommand:
      info["deleteCommand"] === null || undefined
        ? false
        : info["deleteCommand"],
    category:
      info["category"] === null || undefined ? ["all"] : info["category"],
    AddCommandList:
      info["dontAddCommandList"] === null || undefined
        ? true
        : info["dontAddCommandList"],
    function: func,
  };
  Commands.push(infos);
  return infos;
};

module.exports = {
  successfullMessage: successfullMessage,
  errorMessage: errorMessage,
  infoMessage: infoMessage,
  addCommand: addCommand,
  jsonConfig,
  jsonConfig,
  reactArry: reactArry,
  getString: getString,
  commands: Commands,
  language: json,
};
