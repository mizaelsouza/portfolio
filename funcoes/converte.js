const moment = require("moment")

const converteData = (data) => {    
    let dat = moment(data, "DD/MM/YYYY")
    return dat.format("YYYY-MM-DD")
}

const converteDataEN = (data) => {    
    let dat = moment(data, "YYYY-MM-DD")
    return dat.format("YYYY-MM-DD")
}


module.exports = {converteData, converteDataEN}