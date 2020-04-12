var needEnergy = require('handler.need.energy')

function deliverEnergy(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER)
        }
    })
    // console.log(JSON.stringify(creep))
    if (targets.length > 0) {
        // console.log(Game.time + 'transfer:' + creep.transfer(targets[0], RESOURCE_ENERGY))
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#123456'}})
            // console.log('moveTo:' + moveTo + ' fatigue: ' )
        }
    }
}

function handleHauler(spawnName, creep) {
    if (creep.store.getFreeCapacity() > 0) {
        // console.log('hauler need energy')
        needEnergy.run(spawnName, creep)
    } else {
        // console.log('deliverEnergy')
        deliverEnergy(creep)
    }
}


var object = {

    run: function (spawnName, creep) {
        handleHauler(spawnName, creep)
    }
}

module.exports = object
