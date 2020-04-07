var spawnHarvester = {

  /** @param {Creep} creep **/
  run: function (creep) {

    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Worker1', {
      memory: {role: 'harvester'}
    });
  }
};

module.exports = spawnHarvester;

