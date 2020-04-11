var totalBodyCost = require('calculate.total.body.cost');

var spawnCreep = {

    run: function (spawnName, creep) {

        console.log(
            'Will create creep with body cost: ' +
            totalBodyCost.run(creep.body) +
            ' ,body: ' +
            creep.body +
            ' , memory: ' +
            JSON.stringify(creep.memory)
        )

        Game.spawns[spawnName].spawnCreep(creep.body, creep.name + '_' + Game.time, {
            memory: creep.memory
        });
    }

};

module.exports = spawnCreep;
