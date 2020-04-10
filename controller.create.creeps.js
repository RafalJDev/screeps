var spawnCreep = require('spawn.creep')

function spawnFirstCreep() {
    // let firstMineablePosition = Memory.mySpawns.Spawn1.sources[0].mineablePositions[0]

    spawnCreep.run(
        {
            body: [MOVE, WORK, CARRY],
            name: Memory.constants.MINER,
            memory: {
                role: Memory.constants.FIRST_CREEP,
                source: 0,
                minePositionNumber: 0,//todo delete ?
                // minePosition: [firstMineablePosition.x, firstMineablePosition.y],//todo delete ?
            }
        }
    )
}

function spawnNormalCreeps() {

    const baseHaulerBody = [CARRY, CARRY, MOVE]
    const baseMinerBody = [WORK, CARRY, MOVE]
    const baseWorkerBody = [WORK, CARRY, MOVE]

    const HAULER = Memory.constants.HAULER
    const BUILDER = Memory.constants.BUILDER
    const UPGRADER = Memory.constants.UPGRADER
    const MINER = Memory.constants.MINER
    const WORKER = Memory.constants.WORKER

    let haulers = Object.values(Game.creeps).filter(creep => creep.memory.role === HAULER)
    let builders = Object.values(Game.creeps).filter(creep => creep.memory.role === BUILDER)
    let upgraders = Object.values(Game.creeps).filter(creep => creep.memory.role === UPGRADER)
    let miners = Object.keys(Game.creeps).filter(creep => creep.includes(MINER))

    let minersCount = miners.length
    let haulersCount = haulers.length
    let upgradersCount = upgraders.length
    let buildersCount = builders.length

    let sources = Memory.mySpawns.Spawn1.sources
    let mineSpotsCountArray = sources.map(source => source.mineablePositions.length)
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

    // console.log('let create some creep, haulersCount: ' + haulersCount + ' minersCount: ' + minersCount)
    let creep
    if (haulersCount < 1) {
        creep = {
            body: baseHaulerBody,
            name: HAULER,
            memory: {
                role: HAULER,
                source: 0,
                minerPosition: {x: sources[0].mineablePositions[0].x, y: sources[0].mineablePositions[0].y}
            }
        }
        console.log('wtf: ' + JSON.stringify(creep))
    } else if (upgradersCount < minersCount) {
        creep = {
            body: baseWorkerBody,
            name: WORKER,
            memory: {
                role: UPGRADER,
                source: 0,
                minerPosition: {x: sources[0].mineablePositions[0].x, y: sources[0].mineablePositions[0].y}
            }
        }
    } else if (buildersCount < minersCount) {
        creep = {
            body: baseWorkerBody,
            name: WORKER,
            memory: {
                role: BUILDER,
                source: 0,
                minerPosition: {x: sources[0].mineablePositions[0].x, y: sources[0].mineablePositions[0].y}
            }
        }
    } else {
        if (miners < availableMineSpotsCount
        ) {
            //create miner
        }
    }

    if (
        creep &&
        Game.spawns['Spawn1'].canCreateCreep(creep.body, creep.name) === OK
    ) {
        spawnCreep.run(creep)
    }
}

var object = {

    run: function () {
        // createCreeps()

        if (Object.keys(Game.creeps).length < 1) {
            spawnFirstCreep()
        } else {
            spawnNormalCreeps()

            // if (Object.keys(Game.creeps).length === 1) {
            //     spawnCreep.run(
            //         {
            //             name: 'Hauler',
            //             body: [MOVE, CARRY, CARRY],
            //             memory: {
            //                 role: 'Hauler',
            //                 source: 0,
            //                 minerPosition: {x: 34, y: 21},
            //             }
            //         }
            //     )
            // }
        }
    }
}

module.exports = object