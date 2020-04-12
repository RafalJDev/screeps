var object = {

    run: function (spawnName, creep) {
        let memory = creep.memory
        var sourceNumber = memory.source
        var source = creep.room.find(FIND_SOURCES)[sourceNumber]


        if (creep.store.getFreeCapacity() === 0) {
            let middlePos = Memory.mySpawns[spawnName].sources[sourceNumber].middlePos

            let x = middlePos.x
            let y = middlePos.y
            // let foundContainer = creep.room.lookAt(x, y)
            //     .filter(el => el.type === LOOK_STRUCTURES && el[LOOK_STRUCTURES].structureType === STRUCTURE_CONTAINER)
            let foundContainer = creep.room.find(FIND_STRUCTURES)
                .filter(el => el.structureType === STRUCTURE_CONTAINER && el.pos.x === x && el.pos.y === y)

            if (foundContainer > 0) {
                console.log('log')
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
    }
}

module.exports = object
