var totalBodyCost = require('calculate.total.body.cost')

var handlerSpawnCreep = {

    run: function (spawn, creep) {

        console.log(
            'Will create creep with body cost: ' +
            totalBodyCost.run(creep.body) +
            ' ,body: ' +
            creep.body +
            ' , memory: ' +
            JSON.stringify(creep.memory)
        )

        spawn.spawnCreep(
            creep.body,
            creep.name + '_' + Game.time,
            {
                memory: creep.memory,
            },
            {directions: RIGHT}
        )
    }

}

module.exports = handlerSpawnCreep
