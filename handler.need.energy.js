var object = {

    run: function (spawn, creep) {
        needEnergy(spawn, creep)
    }

}

module.exports = object

function findContainerInTheMiddle(creep, source) {
    // console.log(JSON.stringify(creep.room.lookAt(source.middlePos.x, source.middlePos.y)))
    let x = source.middlePos.x
    let y = source.middlePos.y
    return creep.room.find(FIND_STRUCTURES)
        .filter(el => el.structureType === STRUCTURE_CONTAINER && el.pos.x === x && el.pos.y === y)

}

function findDroppedEnergy(creep, sourceMineablePositions) {
    let findClosestByRange = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: function (resource) {
                return sourceMineablePositions.some(pos =>
                    resource.pos.x === pos.minerX &&
                    resource.pos.y === pos.minerY)
            }
        }
    )
    // console.log(JSON.stringify(findClosestByRange))
    return findClosestByRange
}

function handleFoundContainer(creep, foundContainer, x, y) {
    // console.log(creep.withdraw(foundResource))
    if (creep.withdraw(foundContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}})
    }
}

function handleFoundDroppedEnergy(creep, foundDroppedEnergy, x, y) {
    // console.log(creep.pickup(foundDroppedEnergy))
    if (creep.pickup(foundDroppedEnergy) === ERR_NOT_IN_RANGE) {
        creep.moveTo(foundDroppedEnergy.pos, {visualizePathStyle: {stroke: '#ffaa00'}})
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


    let foundContainer = findContainerInTheMiddle(creep, source)
    if (foundContainer.length > 0  /*&& foundContainer*/) {
        console.log('foundContainer: ' + foundContainer + ' ,' + JSON.stringify(foundContainer))
        handleFoundContainer(creep, foundContainer[0], x, y)
    } else {
        let foundDroppedEnergy = findDroppedEnergy(creep, sourceMineablePositions)
        if (foundDroppedEnergy) {
            // if (creep.memory.role = 'Builder') {
            //     console.log('wtf2: ' + JSON.stringify(foundDroppedEnergy))
            // }
            handleFoundDroppedEnergy(creep, foundDroppedEnergy, x, y)
        } else {
            // if (creep.memory.role = 'Builder') {
            //     console.log('wtf3')
            // }
            creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
    }


}