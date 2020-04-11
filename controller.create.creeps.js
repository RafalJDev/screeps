var spawnCreep = require('spawn.creep')

function spawnFirstCreep(spawnName) {
    spawnCreep.run(spawnName,
        {
            body: [MOVE, WORK, WORK, CARRY],
            name: Memory.constants.MINER,
            memory: {
                role: Memory.constants.FIRST_CREEP,
            }
        }
    )
}

function spawnNormalCreeps(spawnName) {

    const baseHaulerBody = [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,]
    const baseMinerBody = [WORK, WORK, CARRY, MOVE]
    const baseWorkerBody = [WORK, CARRY, MOVE, WORK,]

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

    let sources = Memory.mySpawns[spawnName].sources
    let mineSpotsCountArray = sources.map(source => source.mineablePositions.length)
    var availableMineSpotsCount = mineSpotsCountArray
        .reduce((prev, cur) => prev + cur)

    let totalMinerCounter = 0
    let foundNextSourceNumber = 0
    let foundNextMineSpotNumber = 0

    for (let i = 0; i < mineSpotsCountArray.length; i++) {
        let currentMineSpotsCount = mineSpotsCountArray[i]
        if (totalMinerCounter + currentMineSpotsCount <= minersCount) {
            foundNextSourceNumber++
            totalMinerCounter += currentMineSpotsCount
        } else {
            foundNextMineSpotNumber = minersCount - totalMinerCounter
            break
        }
    }

    console.log('foundNextSourceNumber: ' + foundNextSourceNumber + ' ,foundNextMineSpotNumber: ' + foundNextMineSpotNumber)

    // console.log(
    //     'let create some creep, haulersCount: ' + haulersCount +
    //     ' minersCount: ' + minersCount +
    //     ' availableMineSpotsCount: ' + availableMineSpotsCount)
    let creep
    if (haulersCount < 1) {
        // console.log('should create hauler')
        creep = {
            body: baseHaulerBody,
            name: HAULER,
            memory: {
                role: HAULER,
                source: foundNextSourceNumber,
                minerPosition: {
                    x: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].x,
                    y: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].y
                }
            }
        }
        // console.log('wtf: ' + JSON.stringify(creep))
    } else if (upgradersCount < minersCount) {
        console.log('should create upgrader')
        creep = {
            body: baseWorkerBody,
            name: WORKER,
            memory: {
                role: UPGRADER,
                source: foundNextSourceNumber,
                minerPosition: {
                    x: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].x,
                    y: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].y
                }
            }
        }
    } else if (buildersCount < minersCount) {
        // console.log('should create builder')
        creep = {
            body: baseWorkerBody,
            name: WORKER,
            memory: {
                role: BUILDER,
                source: foundNextSourceNumber,
                minerPosition: {
                    x: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].x,
                    y: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].y
                },
                building: false
            }
        }
    } else {
        if (minersCount < availableMineSpotsCount
        ) {
            // console.log('should create miner')
            creep = {
                body: baseMinerBody,
                name: MINER,
                memory: {
                    role: MINER,
                    source: foundNextSourceNumber,
                    minerPosition: {
                        x: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].x,
                        y: sources[foundNextSourceNumber].mineablePositions[foundNextMineSpotNumber].y
                    }
                }
            }
        }
    }

    if (
        creep &&
        Game.spawns[spawnName].canCreateCreep(creep.body, creep.name) === OK
    ) {
        spawnCreep.run(spawnName, creep)
    }
}

var object = {

    run: function (spawnName) {
        if (
            Game.spawns[spawnName].spawning ||
            Game.spawns[spawnName].store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        ) {
            // console.log('won\'t create creep' )
            return
        }

        if (Object.keys(Game.creeps).length < 1) {
            spawnFirstCreep(spawnName)
        } else {
            spawnNormalCreeps(spawnName)
        }
    }
}

module.exports = object