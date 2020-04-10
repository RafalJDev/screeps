var object = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES)
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}})
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {

                    return structure.structureType === STRUCTURE_SPAWN &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                }
            })
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    console.log(Game.time)
                    console.log('move to spawn?')
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        }

        if (Object.keys(Game.creeps).length > 1) {
            let mineSourceNumber = 0
            let source = Memory.mySpawns.Spawn1.sources[mineSourceNumber]
            let x = source.x
            let y = source.y

            creep.memory = {
                role: Memory.constants.MINER,
                source: mineSourceNumber,
                minePositionNumber: 0,
                minePosition: [{x: x, y: y}],
            }
        }
    }
}

module.exports = object
