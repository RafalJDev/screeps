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

function buildSomething(creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
        }
    } else {
        creep.memory.role = 'Upgrader'
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
        buildSomething(creep)
    } else {
        needEnergy(spawnName, creep)
    }
}

var object = {

    run: function (spawnName, creep) {
        handleBuilder(spawnName, creep)
    }
}

module.exports = object
