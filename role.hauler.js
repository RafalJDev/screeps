function handleFreeCapacity(creep) {
    let minerPosition = creep.memory.minerPosition
    let x = minerPosition.x
    let y = minerPosition.y
    let sourceNum = creep.memory.source

    let source = Memory.mySpawns.Spawn1.sources[sourceNum]
    let sourceMineablePositions = source.mineablePositions
    // console.log('hauler role x:' + x + ' y:' + y)

    // console.log('Free capacity')

    let foundResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: function (resource) {
                return sourceMineablePositions.some(pos =>
                    resource.pos.x === pos.x &&
                    resource.pos.y === pos.y
                )
            }
        }
    )
    // console.log('foundResource: ' + foundResource)
    if (foundResource) {
        if (creep.pickup(foundResource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
    } else {
        creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}})
    }
}

function handleNoCapacity(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    })
    if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
        }
    }

}

function handleHauler(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        handleFreeCapacity(creep)
    } else {
        handleNoCapacity(creep)
    }
}


var hauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        handleHauler(creep)
    }
}

module.exports = hauler
