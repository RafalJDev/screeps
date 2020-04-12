var totalBodyCost = require('calculate.total.body.cost')
var sourcesController = require('controller.sources')
var towersController = require('controller.towers')
var creepsController = require('controller.creeps')
var createCreepsController = require('controller.create.creeps')
var structuresController = require('controller.structures')

Memory.constants = {
    MINER: 'Miner',
    BUILDER: 'Builder',
    TEMP_BUILDER: 'Temp Builder',
    UPGRADER: 'Upgrader',
    TEMP_UPGRADER: 'Temp Upgrader',
    FIRST_CREEP: 'First_creep',
    WORKER: 'Worker',
    HAULER: 'Hauler',
}

module.exports.loop = function () {

    // clearMemoryFromNonExistingCreeps()

    for (const spawnName in Game.spawns) {
        let spawn = Game.spawns[spawnName]

        sourcesController.run(spawn)
        towersController.run()
        creepsController.run(spawn)
        createCreepsController.run(spawn)
        structuresController.run(spawn)
    }
}

// function clearMemoryFromNonExistingCreeps() {
//     for (const name in Memory.creeps) {
//         if (!(name in Game.creeps)) {
//             delete Memory.creeps[name];
//         }
//     }
// }