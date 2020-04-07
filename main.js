var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawnCreep = require('spawn.creep');
var totalBodyCost = require('total.body.cost');

const HARVESTER = 'harvester'
const BUILDER = 'builder'
const UPGRADER = 'upgrader'

var creepsToCreate = [
    {
        role: HARVESTER,
        body: [WORK, CARRY, MOVE]
    },
    {
        role: BUILDER,
        body: [WORK, CARRY, MOVE]
    },
    {
        role: UPGRADER,
        body: [WORK, CARRY, MOVE]
    },
]

module.exports.loop = function () {

    var tower = Game.getObjectById('3b8a3df328bdc22754c98e8f');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    createCreeps();

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === HARVESTER) {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === UPGRADER) {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === BUILDER) {
            roleBuilder.run(creep);
        }
    }
}

function createCreeps() {
    const existingCreeps = Object.keys((Game.creeps))
    const existingCreepsRoles = existingCreeps.map(creepName => Game.creeps[creepName].memory.role)

    for (var creepToCreate of creepsToCreate) {
        if (!existingCreepsRoles.includes(creepToCreate.role)) {
            if (totalBodyCost.run(creepToCreate.body)) {
                spawnCreep.run(creepToCreate);
                break;
            }
        }
    }

    if (Object.keys((Game.creeps)).length < 1) {
        spawnCreep.run(null)
    }

}

