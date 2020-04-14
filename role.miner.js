var object = {

    run: function (spawnName, creep) {
        handleMiner(spawnName, creep)
    }
}

module.exports = object

function handleMiner(spawnName, creep) {
    let memory = creep.memory
    let sourceNumber = memory.source
    let source = creep.room.find(FIND_SOURCES)[sourceNumber]


    if (creep.store.getFreeCapacity() === 0) {
        let middlePos = Memory.mySpawns[spawnName].sources[sourceNumber].middlePos

        let x = middlePos.minerX
        let y = middlePos.minerY
        // let foundContainer = creep.room.lookAt(x, y)
        //     .filter(el => el.type === LOOK_STRUCTURES && el[LOOK_STRUCTURES].structureType === STRUCTURE_CONTAINER)
        let foundContainer = creep.room.find(FIND_STRUCTURES)
            .filter(el => el.structureType === STRUCTURE_CONTAINER && el.pos.x === x && el.pos.y === y)

        if (foundContainer.length > 0) {
            if (creep.transfer(foundContainer[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(foundContainer[0], {visualizePathStyle: {stroke: '#11aa00'}})
            }
        } else {
            creep.drop(RESOURCE_ENERGY)
        }
    } else {
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
    }

    checkIfWillDieSoon(creep)
}

function checkIfWillDieSoon(creep) {
    const ticksToCreate = 15
    const ticksToArriveAtMineSpot = 20
    const safeTicks = 20
    if (creep.ticksToLive <= ticksToCreate + ticksToArriveAtMineSpot + safeTicks) {
        console.log('miner will die soon')
        Memory.creepThatWilDieSoon = creep.memory.role
    }
}

