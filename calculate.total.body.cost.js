var object = {

    run: function (body) {
        return body
            .map(part => BODYPART_COST[part])
            .reduce((previousValue, currentValue) => previousValue + currentValue)
    }

};

module.exports = object;
