function goToMiner(creep) {
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

var hauler = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let minerPosition = creep.memory.minerPosition
        let x = minerPosition.x
        let y = minerPosition.y

        // console.log('hauler role x:' + x + ' y:' + y)
        creep
        if (creep.store.getFreeCapacity() > 0) {
            // console.log('Free capacity')
            let foundResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: function (object) {
                        return object.pos.x === x && object.pos.y === y;
                    }
                }
            )
            // console.log('foundResource: ' + foundResource)
            if (foundResource) {
                if (creep.pickup(foundResource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.moveTo(x, y, {visualizePathStyle: {stroke: '#ffaa00'}});
            }

        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = hauler;
