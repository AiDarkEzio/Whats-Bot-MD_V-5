const fs = require('fs');

var Commands = [];

const addCommand = (info, func) =>  {
    var infos = {
        pattern: info['pattern'] === null || undefined ? [] : info['pattern'],
        desc: info['desc'] === null || undefined ? '' : info['desc'],
        usage: info['usage'] === null || undefined ? '' : info['usage'],
        warn: info['warn'] === null || undefined ? '' : info['warn'],
        onlyfromMe: info['fromMe'] === null || undefined ? false : info['fromMe'], // Or Sudo
        onlyGroup: info['onlyGroup'] === null || undefined ? false : info['onlyGroup'],
        onlyPm: info['onlyPm'] === null || undefined ? false : info['onlyPm'],
        deleteCommand: info['deleteCommand'] === null || undefined ? false : info['deleteCommand'],
        AddCommandList: info['dontAddCommandList'] === null || undefined ? true : info['dontAddCommandList'],
        function: func
    };
    Commands.push(infos);
    return infos;
};

const jsonConfig = JSON.parse(fs.readFileSync("./config.json"));

var json = JSON.parse(fs.readFileSync("./database/" + "EN" + ".json"));

function getString(file) {
  return json['STRINGS'][file];
}

function successfullMessage(msg) {
  return "👩‍🦰 *Successful*:  ```" + msg + "```";
}
function errorMessage(msg) {
  return "🚀 *Error*:  ```" + msg + "```";
}
function infoMessage(msg) {
  return "🤖 *Info*:  ```" + msg + "```";
}

module.exports = {
    successfullMessage: successfullMessage,
    errorMessage: errorMessage,
    infoMessage: infoMessage,
    addCommand: addCommand,
    jsonConfig,jsonConfig,
    getString: getString,
    commands: Commands,
    language: json,
};
