var spawnCreep = require('spawn.creep')

function createCreeps() {
    if (Game.spawns['Spawn1'].spawning) {
        return
    }

    const existingCreeps = Object.keys(Game.creeps)

    var createdCreep
    for (var creepToCreate of creepsToCreate) {
        if (Game.spawns['Spawn1'].canCreateCreep(creepToCreate.body, creepToCreate.name) === OK
        ) {
            spawnCreep.run(creepToCreate)
            createdCreep = creepToCreate
            break
        }
    }


    if (Object.keys((Game.creeps)).length < 1) {
        // spawnCreep.run(null)
    }

}

function spawnFirstCreep() {
    let firstMineablePosition = Memory.mySpawns.Spawn1.sources[0].mineablePositions[0]

    spawnCreep.run(
        {
            body: [MOVE, WORK, CARRY],
            name: Memory.constants.MINER,
            memory: {
                role: Memory.constants.FIRST_CREEP,
                source: 0,
                minePositionNumber: 0,
                minePosition: [firstMineablePosition.x, firstMineablePosition.y],
            }
        }
    )
}

function spawnNormalCreeps() {

    // 0 1 2
    const baseHaulerBody = [CARRY, CARRY, MOVE]
    const baseMinerBody = [WORK, CARRY, MOVE]
    const baseWorkerBody = [WORK, CARRY, MOVE]
    //1: 1 1 2

    const hauler = Memory.constants.HAULER
    const builder = Memory.constants.BUILDER
    const upgrader = Memory.constants.UPGRADER
    const miner = Memory.constants.MINER

    let haulers = Object.values(Game.creeps).filter(creep => creep.memory.role === Memory.constants.HAULER)
    let builders = Object.values(Game.creeps).filter(creep => creep.memory.role === Memory.constants.BUILDER)
    let upgraders = Object.values(Game.creeps).filter(creep => creep.memory.role === Memory.constants.UPGRADER)
    let miners = Object.values(Game.creeps).filter(creep => creep.memory.role === miner)

    let minersCount = miners.length
    let haulersCount = haulers.length
    let upgradersCount = upgraders.length
    let buildersCount = builders.length

    if (haulersCount < minersCount) {
        let creep = {
            body: baseHaulerBody,
            name: 'hauler',
            memory: {
                role: hauler,
            }
        }
        spawnCreep.run()
    } else if (upgradersCount < minersCount) {
        //create upgrader
    } else if (buildersCount < minersCount) {
        //create builder
    } else {
        var availableMineSpots = Memory.mySpawns.Spawn1.sources.map(source => source.mineablePositions.length)
            .reduce((prev, cur) => prev + cur)
        if (false
        ) {
            //create miner
        }
    }
}

var object = {

    run: function () {
        // createCreeps()

        if (Object.keys(Game.creeps).length < 1) {
            spawnFirstCreep()
        } else {
            spawnNormalCreeps()
        }
    }
}

module.exports = object