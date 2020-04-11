function upgradeController(creep) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

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

function handleUpgrader(spawnName, creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.upgrading = false;
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
        upgradeController(creep)
    }
    else {
        needEnergy(spawnName, creep)
    }
}

var object = {

    run: function (spawnName, creep) {
        handleUpgrader(spawnName, creep);
    }
};

module.exports = object;
