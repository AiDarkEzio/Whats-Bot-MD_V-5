let print = console.log 
module.exports = (message) => {
    if (message.isGroup) print(
      `[ GROUP ] = ID: ${message.from} | SENDER_ID: ${message.sender} | MESSAGE: ${message.body}\n`
    ); 
    if (!message.isGroup) print(
     `[ CHAT ] = ID: ${message.sender} | MESSAGE: ${message.body}`
    );
};