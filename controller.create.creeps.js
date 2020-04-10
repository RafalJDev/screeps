var spawnCreep = require('spawn.creep')

//todo delete
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
                minePositionNumber: 0,//todo delete ?
                minePosition: [firstMineablePosition.x, firstMineablePosition.y],//todo delete ?
            }
        }
    )
}

function spawnNormalCreeps() {

    const baseHaulerBody = [CARRY, CARRY, MOVE]
    const baseMinerBody = [WORK, CARRY, MOVE]
    const baseWorkerBody = [WORK, CARRY, MOVE]

    const hauler = Memory.constants.HAULER
    const builder = Memory.constants.BUILDER
    const upgrader = Memory.constants.UPGRADER
    const miner = Memory.constants.MINER

    let haulers = Object.values(Game.creeps).filter(creep => creep.memory.role === hauler)
    let builders = Object.values(Game.creeps).filter(creep => creep.memory.role === builder)
    let upgraders = Object.values(Game.creeps).filter(creep => creep.memory.role === upgrader)
    let miners = Object.keys(Game.creeps).filter(creep => {
        console.log('creep: ' + creep)
        return creep.includes(miner)
    })

    let minersCount = miners.length
    let haulersCount = haulers.length
    let upgradersCount = upgraders.length
    let buildersCount = builders.length

    let mineSpotsCountArray = Memory.mySpawns.Spawn1.sources.map(source => source.mineablePositions.length)
    var availableMineSpotsCount = mineSpotsCountArray
        .reduce((prev, cur) => prev + cur)

    let totalMinerCount = 0
    let foundNextSourceNumber = 0
    let foundNextMineSpotNumber = 0
    for (let i = 0; i < mineSpotsCountArray.length; i++) {
        let currentMineSpotsCount = mineSpotsCountArray[i]
        if (totalMinerCount + currentMineSpotsCount <= minersCount) {
            totalMinerCount += currentMineSpotsCount
            foundNextSourceNumber++
        } else {

        }
    }

    // mineSpotsCountArray = [3, 2, 2]
    // minersCount = 6
    // => foundNextSourceNumber = 2, foundNextMineSpotNumber = 0

    console.log('let create some creep, haulersCount: ' + haulersCount + ' minersCount: ' + minersCount)
    if (haulersCount < minersCount) {
        console.log('let create some creep 2')

        let creep = {
            body: baseHaulerBody,
            name: 'hauler',
            memory: {
                role: hauler,
                source: 0
            }
        }
        spawnCreep.run(creep)
    } else if (upgradersCount < minersCount) {
        //create upgrader
    } else if (buildersCount < minersCount) {
        //create builder
    } else {
        if (miners < availableMineSpotsCount
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