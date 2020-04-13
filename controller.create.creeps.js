const spawnCreep = require('handler.spawn.creep')
const decideOnNextCreep = require('handler.next.creep')

const object = {

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

function prepareMiner(sources, nextSourceNumber, nextMineSpotNumber) {
    const baseMinerBody = [WORK, WORK, CARRY, MOVE]
    const MINER = Memory.constants.MINER

    return {
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
}

function prepareUpgrader(sources, nextSourceNumber, nextMineSpotNumber) {
    const baseWorkerBody = [WORK, CARRY, MOVE, WORK]
    const UPGRADER = Memory.constants.UPGRADER
    const WORKER = Memory.constants.WORKER


    return {
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
}

function prepareBuilder(sources, nextSourceNumber, nextMineSpotNumber) {
    const baseWorkerBody = [WORK, CARRY, MOVE, WORK]
    const BUILDER = Memory.constants.BUILDER
    const WORKER = Memory.constants.WORKER

    return {
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

function prepareHauler(sources, nextSourceNumber, nextMineSpotNumber) {
    const baseHaulerBody = [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY]
    const HAULER = Memory.constants.HAULER

    return {
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
}


function spawnNormalCreeps(spawn) {
    const HAULER = Memory.constants.HAULER
    const BUILDER = Memory.constants.BUILDER
    const TEMP_BUILDER = Memory.constants.TEMP_BUILDER
    const UPGRADER = Memory.constants.UPGRADER
    const TEMP_UPGRADER = Memory.constants.TEMP_UPGRADER
    const MINER = Memory.constants.MINER
    const WORKER = Memory.constants.WORKER

    let creeps = Game.creeps
    let haulers = Object.values(creeps).filter(creep => creep.memory.role === HAULER)
    let builders = Object.values(creeps).filter(creep => creep.memory.role === BUILDER || creep.memory.role === TEMP_UPGRADER)
    let upgraders = Object.values(creeps).filter(creep => creep.memory.role === UPGRADER || creep.memory.role === TEMP_BUILDER)
    let miners = Object.keys(creeps).filter(creep => creep.includes(MINER))

    let minersCount = miners.length
    let haulersCount = haulers.length
    let upgradersCount = upgraders.length
    let buildersCount = builders.length

    let sources = Memory.mySpawns[spawn.name].sources

    let foundMineSpots = decideOnNextCreep.run(creeps, sources)
    let nextSourceNumber = foundMineSpots.nextSourceNumber
    let nextMineSpotNumber = foundMineSpots.nextMineSpotNumber
    let roleToCreate = foundMineSpots.roleToCreate

    // console.log(
    //     'let create some creep, haulersCount: ' + haulersCount +
    //     ' minersCount: ' + minersCount +
    //     ' availableMineSpotsCount: ' + availableMineSpotsCount)
    let creep

    switch (roleToCreate) {
        case MINER:
            creep = prepareMiner(sources, nextSourceNumber, nextMineSpotNumber)
            break
        case HAULER:
            break
        case UPGRADER:
            creep = prepareUpgrader(sources, nextSourceNumber, nextMineSpotNumber)
            break
        case BUILDER:
            creep = prepareBuilder(sources, nextSourceNumber, nextMineSpotNumber)
            break
        default:
            console.log('I can\'t create creep with that role: ' + roleToCreate)
    }

    if (haulersCount < 1) {
        // console.log('should create hauler')
        creep = prepareHauler(sources, nextSourceNumber, nextMineSpotNumber)
        // console.log('wtf: ' + JSON.stringify(creep))
    } else if (minersCount - 1 <= buildersCount) {
        // console.log('should create miner')
        creep = prepareMiner(sources, nextSourceNumber, nextMineSpotNumber)
    } else if (upgradersCount < minersCount) {
        // console.log('should create upgrader')
        creep = prepareUpgrader(sources, nextSourceNumber, nextMineSpotNumber)
    } else if (buildersCount < minersCount) {
        // console.log('should create builder')
        creep = prepareBuilder(sources, nextSourceNumber, nextMineSpotNumber)
    }

    if (
        creep &&
        spawn.canCreateCreep(creep.body, creep.name) === OK
    ) {
        spawnCreep.run(spawn, creep)
    }
}