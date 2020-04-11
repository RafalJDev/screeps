var object = {

    run: function (spawnName, creep) {
        // console.log('harv')
        let memory = creep.memory;
        var sourceNumber = memory.source;
        var source = creep.room.find(FIND_SOURCES)[sourceNumber];


        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        if (creep.store.getFreeCapacity() === 0) {
            creep.drop(RESOURCE_ENERGY)
        }
    }
};

module.exports = object;
