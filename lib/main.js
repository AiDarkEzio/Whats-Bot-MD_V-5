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

let print = console.log;
module.exports = (message) => {
  if (message.isGroup)
    print(
      `[ GROUP ] = ID: ${message.from} | SENDER_ID: ${
        message.sender
      } | MESSAGE: ${message.body.slice(0, 50)}\n`
    );
  if (!message.isGroup)
    print(
      `[ CHAT ] = ID: ${message.sender} | MESSAGE: ${message.body.slice(0, 50)}`
    );
};
