function needEnergy(spawnName, creep) {
    let minerPosition = creep.memory.minerPosition
    let x = minerPosition.x
    let y = minerPosition.y
    let sourceNum = creep.memory.source

    let source = Memory.mySpawns[spawnName].sources[sourceNum]
    let sourceMineablePositions = source.mineablePositions
    // console.log('hauler role x:' + x + ' y:' + y)

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
            creep.moveTo(foundResource.pos.x, foundResource.pos.y, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
    } else {
        creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}})
    }
}

function deliverEnergy(creep) {
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

function handleHauler(spawnName, creep) {
    if (creep.store.getFreeCapacity() > 0) {
        needEnergy(spawnName, creep)
    } else {
        deliverEnergy(creep)
    }
}


var object = {

    run: function (spawnName, creep) {
        handleHauler(spawnName, creep)
    }
}

module.exports = object
