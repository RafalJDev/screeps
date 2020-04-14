const spawnCreep = require('handler.spawn.creep')
const decideWhichCreepToSpawn = require('handler.next.creep')
const creepsMetrics = require('calculate.creeps.metrics')

const object = {

    run: function (spawn) {
        let sources = Memory.mySpawns[spawn.name].sources
        let actualMetrics = creepsMetrics.run(sources)

        if (
            spawn.spawning ||
            spawn.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
        ) {
            // console.log('won\'t create creep' )
            return
        }

        if (actualMetrics.creepsCount < 1) {
            spawnFirstCreep(spawn)
        } else {
            spawnNormalCreeps(spawn, sources, actualMetrics)
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


function spawnNormalCreeps(spawn, sources, actualMetrics) {
    const HAULER = Memory.constants.HAULER
    const BUILDER = Memory.constants.BUILDER
    const UPGRADER = Memory.constants.UPGRADER
    const MINER = Memory.constants.MINER

    let foundMineSpots = decideWhichCreepToSpawn.run(sources, actualMetrics)
    let nextSourceNumber = foundMineSpots.nextSourceNumber
    let nextMineSpotNumber = foundMineSpots.nextMineSpotNumber
    let roleToCreate = foundMineSpots.roleToCreate

    let creep

    switch (roleToCreate) {
        case MINER:
            creep = prepareMiner(sources, nextSourceNumber, nextMineSpotNumber)
            break
        case HAULER:
            creep = prepareHauler(sources, nextSourceNumber, nextMineSpotNumber)
            break
        case UPGRADER:
            creep = prepareUpgrader(sources, nextSourceNumber, nextMineSpotNumber)
            break
        case BUILDER:
            creep = prepareBuilder(sources, nextSourceNumber, nextMineSpotNumber)
            break
        case 'Dont create creep':
            break
        default:
            console.log('I can\'t create creep with that role: ' + roleToCreate)
    }

    if (
        creep &&
        spawn.canCreateCreep(creep.body, creep.name) === OK
    ) {
        spawnCreep.run(spawn, creep)
    }
}