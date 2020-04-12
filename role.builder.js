var needEnergy = require('handler.need.energy')

function buildSomething(creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
        }
    } else {
        creep.memory.role = Memory.constants.TEMP_UPGRADER
    }

}

function handleBuilder(spawnName, creep) {
    let building = creep.memory.building
    if (building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false
    }
    if (!building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true
    }

    if (building) {
        // console.log('building')
        buildSomething(creep)
    } else {
        // console.log('need energy')
        needEnergy.run(spawnName, creep)
    }
}

var object = {

    run: function (spawnName, creep) {
        handleBuilder(spawnName, creep)
    }
}

module.exports = object
