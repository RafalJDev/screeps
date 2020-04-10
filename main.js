var totalBodyCost = require('calculate.total.body.cost')
var sourcesController = require('controller.sources')
var towersController = require('controller.towers')
var creepsController = require('controller.creeps')
var createCreepsController = require('controller.create.creeps')

Memory.constants = {
    MINER: 'Miner',
    BUILDER: 'Builder',
    UPGRADER: 'Upgrader',
    FIRST_CREEP: 'First_creep',
    WORKER: 'Worker',
    HAULER: 'Hauler',
}

const basicCreep = [WORK, CARRY, MOVE]
const universalWorker2 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]

//     {
//         name: Memory.constants.MINER,
//         memory: {
//             role: Memory.constants.FIRST_CREEP,
//             source: 0,
//             minePoisitionNumber: 0,
//             index: 0,
//             minePosition: [35, 20],
//             atMinePosition: false
//         },
//         body: basicCreep,
//     },


module.exports.loop = function () {
    sourcesController.run()
    towersController.run()
    creepsController.run()
    createCreepsController.run()
}

function howMuchLeftToFillSpawnAndExtensions() {
    return Game.spawns.Spawn1.store.getCapacity(RESOURCE_ENERGY) -
        Game.spawns.Spawn1.store[RESOURCE_ENERGY]

}

