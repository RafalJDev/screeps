const object = {

    run: function (sources, actualMetrics) {
        return decideWhichCreepToSpawn(sources, actualMetrics)
    }
}

module.exports = object


function decideWhichCreepToSpawn(sources, actualMetrics) {

    let occupiedRoles = calculateOccupiedRole(actualMetrics.creeps)

    let roleToCreate = whichRoleToCreate(actualMetrics)
    let nextSourceNumber = 0
    let nextMineSpotNumber = 0

    let occupiedRole = occupiedRoles[roleToCreate]
    if (!occupiedRole || roleToCreate === 'Dont create creep') {
        return {
            nextSourceNumber: 0,
            nextMineSpotNumber: 0,
            roleToCreate: roleToCreate
        }
    }
    let occupiedSpotsCounter = occupiedRole.occupiedSpotsCounter

    console.log('roleToCreate: ' + roleToCreate + ', occupiedRoles = ' + JSON.stringify(occupiedRoles))
    for (let sourceNum = 0; sourceNum < occupiedSpotsCounter.length; sourceNum++) {
        let availableMineSpotsCount = actualMetrics.mineSpotsCountArray[sourceNum]

        nextSourceNumber = sourceNum
        nextMineSpotNumber = occupiedSpotsCounter[sourceNum]

        // console.log(' mineSpotsCountArray[sourceNum]: ' + actualMetrics.mineSpotsCountArray[sourceNum])

        if (nextMineSpotNumber < availableMineSpotsCount) {
            break
        } else if (nextMineSpotNumber === availableMineSpotsCount) {
            if (actualMetrics.mineSpotsCountArray.length > sourceNum + 1) {
                nextSourceNumber = sourceNum + 1
            } else {
                roleToCreate = 'Dont create creep'
            }
            nextMineSpotNumber = 0
        }
    }

    // console.log(
    //     'NextSourceNumber: ' + nextSourceNumber +
    //     ' ,NextMineSpotNumber: ' + nextMineSpotNumber +
    //     ' ,roleToCreate = ' + JSON.stringify(roleToCreate)
    // )

    return {
        nextSourceNumber: nextSourceNumber,
        nextMineSpotNumber: nextMineSpotNumber,
        roleToCreate: roleToCreate
    }
}

function calculateOccupiedRole(creeps) {
    const TEMP_BUILDER = Memory.constants.TEMP_BUILDER
    const TEMP_UPGRADER = Memory.constants.TEMP_UPGRADER
    const BUILDER = Memory.constants.BUILDER
    const UPGRADER = Memory.constants.UPGRADER

    let occupiedRoles = {}
    for (let name in creeps) {
        let creep = creeps[name]
        let memory = creep.memory
        let role = memory.role

        if (role === TEMP_BUILDER) {
            role = UPGRADER
        } else if (role === TEMP_UPGRADER) {
            role = BUILDER
        }
        let sourceNum = memory.source

        if (!occupiedRoles[role]) {
            occupiedRoles[role] = {occupiedSpotsCounter: []}
        }
        let occupiedSpotCounter = occupiedRoles[role]['occupiedSpotsCounter'][sourceNum]
        let occupiedSpotsCounter = occupiedSpotCounter ?
            occupiedSpotCounter : 0
        occupiedRoles[role]['occupiedSpotsCounter'][sourceNum] = occupiedSpotsCounter + 1
    }
    return occupiedRoles
}

function whichRoleToCreate(actualMetrics) {
    // console.log('minersCount: ' + actualMetrics.minersCount)
    // console.log('haulersCount: ' + actualMetrics.haulersCount)
    // console.log('2:' + actualMetrics.minersCount / 2.5 > actualMetrics.haulersCount)
    // console.log('actualMetrics.availableMineSpotsCount:' + actualMetrics.availableMineSpotsCount)
    if (actualMetrics.missingCreep) {
        return actualMetrics.missingCreep
    } else if (
        actualMetrics.minersCount / 2.5 <= actualMetrics.haulersCount &&
        actualMetrics.minersCount < actualMetrics.availableMineSpotsCount
    ) {
        return Memory.constants.MINER
    } else if (actualMetrics.minersCount / 1.5 > actualMetrics.haulersCount) {
        return Memory.constants.HAULER
    } else if (actualMetrics.minersCount / 1.7 > actualMetrics.buildersCount) {
        return Memory.constants.BUILDER
    } else if (actualMetrics.minersCount / 1.7 > actualMetrics.upgradersCount) {
        return Memory.constants.UPGRADER
    }
    return 'Dont create creep'
}



