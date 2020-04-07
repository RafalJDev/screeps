var spawnBuilder = {

    /** @param {Creep} creep **/
    run: function (creep, uniqueNumber) {

        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Upgrader' + uniqueNumber, {
            memory: {role: 'upgrader'}
        });
    }
};

module.exports = spawnHarvester;
