
const groupBy = (arr,  modulo) => {
    const obj = arr.reduce(function (acc, currentValue) {
        if (!acc[currentValue[modulo]]) {
            acc[currentValue[modulo]] = [];
        }
        
        acc[currentValue[modulo]].push(currentValue);
        return acc;

    }, {});
    return obj;
};

/*

const groupBy = (arr, criteria) => {    
    const obj = arr.reduce(function (acc, currentValue) {
        if (!acc[currentValue[criteria]]) {
            acc[currentValue[criteria]] = [];   
        }
        
        acc[currentValue[criteria]].push(currentValue);
        
        return acc;
    }, {});
    return obj;
};

*/


module.exports = groupBy 