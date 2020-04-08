var totalBodyCost = require('calculate.total.body.cost');

var spawnCreep = {

    run: function (creep) {

        console.log(
            'Will create creep with body cost: ' +
            totalBodyCost.run(creep.body) +
            ' body: ' +
            creep.body
        )

        Game.spawns['Spawn1'].spawnCreep(creep.body, creep.role + Game.time, {
            memory: {role: creep.role}
        });
    }

};

module.exports = spawnCreep;
