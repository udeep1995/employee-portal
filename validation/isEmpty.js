const isEmpty = (val) => {
    if(val.constructor === Object) {
        return Object.keys(val).length === 0? true: false;
    } else if (val.constructor === String) {
        return val.length === 0 ? true: false;
    } else if (val.constructor === Number) {
        return isNaN(val);
    } else if (val.constructor === Array) {
        return val.length === 0 ? true: false;
    } else {
        return false;
    }
}

module.exports = {isEmpty};