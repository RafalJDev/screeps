var object = {

    run: function () {
        var tower = Game.getObjectById('3b8a3df328bdc22754c98e8f')
        if (tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax,
            })
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure)
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if (closestHostile) {
                tower.attack(closestHostile)
            }
        }
    }
}

module.exports = object