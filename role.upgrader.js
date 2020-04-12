var needEnergy = require('handler.need.energy')

function upgradeController(creep) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
    }

}

function handleUpgrader(spawnName, creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.upgrading = false
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.upgrading = true
    }

    if (creep.memory.upgrading) {
        upgradeController(creep)
    }
    else {
        needEnergy.run(spawnName, creep)
    }
}

var object = {

    run: function (spawnName, creep) {
        handleUpgrader(spawnName, creep)
    }
}

module.exports = object
