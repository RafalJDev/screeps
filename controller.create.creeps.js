var spawnCreep = require('handler.spawn.creep')

var object = {

    run: function (spawn) {
        if (
            spawn.spawning ||
            spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        ) {
            // console.log('won\'t create creep' )
            return
        }

        if (Object.keys(Game.creeps).length < 1) {
            spawnFirstCreep(spawn)
        } else {
            spawnNormalCreeps(spawn)
        }
    }
}

module.exports = object

function spawnFirstCreep(spawn) {
    spawnCreep.run(spawn,
        {
            body: [MOVE, WORK, WORK, CARRY],
            name: Memory.constants.MINER,
            memory: {
                role: Memory.constants.FIRST_CREEP,
            }
        }
    )
}


function spawnNormalCreeps(spawn) {

    const baseHaulerBody = [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY]
    const baseMinerBody = [WORK, WORK, CARRY, MOVE]
    const baseWorkerBody = [WORK, CARRY, MOVE, WORK]

    const HAULER = Memory.constants.HAULER
    const BUILDER = Memory.constants.BUILDER
    const TEMP_BUILDER = Memory.constants.TEMP_BUILDER
    const UPGRADER = Memory.constants.UPGRADER
    const TEMP_UPGRADER = Memory.constants.TEMP_UPGRADER
    const MINER = Memory.constants.MINER
    const WORKER = Memory.constants.WORKER

    let haulers = Object.values(Game.creeps).filter(creep => creep.memory.role === HAULER)
    let builders = Object.values(Game.creeps).filter(creep => creep.memory.role === BUILDER || creep.memory.role === TEMP_UPGRADER)
    let upgraders = Object.values(Game.creeps).filter(creep => creep.memory.role === UPGRADER || creep.memory.role === TEMP_BUILDER)
    let miners = Object.keys(Game.creeps).filter(creep => creep.includes(MINER))

    let minersCount = miners.length
    let haulersCount = haulers.length
    let upgradersCount = upgraders.length
    let buildersCount = builders.length

    let sources = Memory.mySpawns[spawn.name].sources
    let mineSpotsCountArray = sources.map(source => source.mineablePositions.length)
    let availableMineSpotsCount = mineSpotsCountArray
        .reduce((prev, cur) => prev + cur)

    let occupiedRoles = {}
    for (let name in Game.creeps) {
        let creep = Game.creeps[name]
        let memory = creep.memory
        let role = memory.role
        let sourceNum = memory.source
        let positionNumber = memory.minerPositionNumber
        occupiedRoles[role].push({source: sourceNum, positionNumber: positionNumber})
        {
            miner: [

            ],
                builder:

        }
    }


    let totalMinerCounter = 0
    let nextSourceNumber = 0
    let nextMineSpotNumber = 0

    for (let i = 0; i < mineSpotsCountArray.length; i++) {
        let currentMineSpotsCount = mineSpotsCountArray[i]
        if (totalMinerCounter + currentMineSpotsCount <= minersCount) {
            nextSourceNumber++
            totalMinerCounter += currentMineSpotsCount
        } else {
            nextMineSpotNumber = minersCount - totalMinerCounter
            break
        }
    }

    console.log('foundNextSourceNumber: ' + nextSourceNumber + ' ,foundNextMineSpotNumber: ' + nextMineSpotNumber)

    // console.log(
    //     'let create some creep, haulersCount: ' + haulersCount +
    //     ' minersCount: ' + minersCount +
    //     ' availableMineSpotsCount: ' + availableMineSpotsCount)
    let creep

    if (minersCount - 1 <= buildersCount && minersCount < availableMineSpotsCount) {
        console.log('should create miner')
        creep = {
            body: baseMinerBody,
            name: MINER,
            memory: {
                role: MINER,
                source: nextSourceNumber,
                minerPosition: {
                    minerPositionNumber: nextMineSpotNumber,
                    x: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].minerX,
                    y: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].minerY
                }
            }
        }
    } else if (haulersCount < 1) {
        // console.log('should create hauler')
        creep = {
            body: baseHaulerBody,
            name: HAULER,
            memory: {
                role: HAULER,
                source: nextSourceNumber,
                minerPosition: {
                    minerPositionNumber: nextMineSpotNumber,
                    x: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].workerX,
                    y: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].workerY,
                }
            }
        }
        // console.log('wtf: ' + JSON.stringify(creep))
    } else if (upgradersCount < minersCount) {
        // console.log('should create upgrader')
        creep = {
            body: baseWorkerBody,
            name: WORKER,
            memory: {
                role: UPGRADER,
                source: nextSourceNumber,
                minerPosition: {
                    minerPositionNumber: nextMineSpotNumber,
                    x: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].workerX,
                    y: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].workerY,
                },
            }
        }
    } else if (buildersCount < minersCount) {
        // console.log('should create builder')
        creep = {
            body: baseWorkerBody,
            name: WORKER,
            memory: {
                role: BUILDER,
                source: nextSourceNumber,
                minerPosition: {
                    minerPositionNumber: nextMineSpotNumber,
                    x: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].workerX,
                    y: sources[nextSourceNumber].mineablePositions[nextMineSpotNumber].workerY
                },
                building: false,
            }
        }
    }

    if (
        creep &&
        spawn.canCreateCreep(creep.body, creep.name) === OK
    ) {
        spawnCreep.run(spawn, creep)
    }
}