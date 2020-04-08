var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawnCreep = require('spawn.creep');
var totalBodyCost = require('calculate.total.body.cost');
var sourcesController = require('controller.sources');

const MINER = 'miner'
const BUILDER = 'builder'
const UPGRADER = 'upgrader'

const universalWorker = [WORK, CARRY, MOVE]
const universalWorker2 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]

var creepsToCreate = [
    {
        role: MINER,
        body: universalWorker
    },
    /*{
        role: MINER,
        body: universalWorker
    },*/
    /*{
        role: BUILDER,
        body: universalWorker
    },
    {
        role: UPGRADER,
        body: universalWorker
    },*/
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
        // if (creep.memory.role === HARVESTER) {
        //     console.log('time: ' + Game.time);
        //     if (Game.time % 5 == 0) {
        //         var sources = creep.room.find(FIND_SOURCES);
        //         sources.forEach(source => console.log('source: ' + source));
        //         creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
        //     }
        // }
        if (creep.memory.role === MINER) {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === BUILDER) {
            roleBuilder.run(creep);
        }
        if (creep.memory.role === UPGRADER) {
            roleUpgrader.run(creep);
        }
    }

    //TODO NEW MAIN
    // for (var spawnName in Game.spawns) {
    //     let spawn = Game.spawns[spawnName];
    //     // console.log('spawn: ' + spawn)
    //     let room = spawn.room;
    //
    //     sourcesController.run(room)
    // }


}

function howMuchLeftToFillSpawnAndExtensions() {
    return Game.spawns.Spawn1.store.getCapacity(RESOURCE_ENERGY) -
        Game.spawns.Spawn1.store[RESOURCE_ENERGY]

}

function createCreeps() {
    const existingCreeps = Object.keys(Game.creeps)
    const existingCreepsRoles = existingCreeps.map(creepName => Game.creeps[creepName].memory.role)

    var createdCreep
    for (var creepToCreate of creepsToCreate) {
        if (!existingCreepsRoles.includes(creepToCreate.role)) {
        if (totalBodyCost.run(creepToCreate.body)) {
            spawnCreep.run(creepToCreate);
            createdCreep = creepToCreate
            break;
        }
        }
    }
    if (createdCreep) {
        let index = creepsToCreate.indexOf(createdCreep);
        creepsToCreate.splice(index, 1)
    }


    if (Object.keys((Game.creeps)).length < 1) {
        spawnCreep.run(null);
    }

}

