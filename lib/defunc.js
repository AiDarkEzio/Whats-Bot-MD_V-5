const { getBuffer } = require("./function");

const thumbs = async (text, isbuffer = false) => {

    let flaming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';
    let flarun ='https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';
    let fluming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=fluffy-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';
    let flasmurf = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=smurfs-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text=';

    let picaks = [flaming, fluming, flarun, flasmurf];
    let picak = picaks[Math.floor(Math.random() * picaks.length)];

    let url = picak + text

    return isbuffer == true ? await getBuffer(url) : url

};


module.exports = {thumbs};