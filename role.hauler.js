var needEnergy = require('handler.need.energy')

function deliverEnergy(creep) {
    var targets = creep.room.find(FIND_STRUCTURES)
        .filter(structure => {
                return (
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER
                    ) &&
                    structure.energy !== structure.energyCapacity
            }
        )
    // console.log('sth:' + JSON.stringify(targets))
    if (targets.length > 0) {
        // console.log(Game.time + 'transfer:' + creep.transfer(targets[0], RESOURCE_ENERGY))
        let transfer = creep.transfer(targets[0], RESOURCE_ENERGY)
        if (transfer === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#123456'}})
        } else if (transfer === ERR_FULL) {
            let targetPos = targets[0].pos
            let creepPos = creep.pos
            let x = creepPos.x + (creepPos.x - targetPos.x)
            let y = creepPos.y + (creepPos.y - targetPos.y)
            creep.moveTo(x, y)
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
