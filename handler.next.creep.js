const object = {

    run: function (sources, actualMetrics) {
        return decideWhichCreepToSpawn(sources, actualMetrics)
    }
}

module.exports = object


function decideWhichCreepToSpawn(sources, actualMetrics) {

    let occupiedRoles = calculateOccupiedRole(actualMetrics.creeps)
    console.log('occupiedRoles = ' + JSON.stringify(occupiedRoles))

    let roleToCreate
    let nextSourceNumber = 0
    let nextMineSpotNumber = 0

    for (let role in occupiedRoles) {

        let occupiedSpotsCounter = [0]
        if (actualMetrics.missingCreep) {
            role = actualMetrics.missingCreep
        } else {
            occupiedSpotsCounter = occupiedRoles[role].occupiedSpotsCounter
        }

        if (shouldThisRoleBeSkipped(role, actualMetrics)) {
            continue
        }
        // console.log('occ = ' + JSON.stringify(occupiedSpotsCounter) + ' typeof: ' + typeof occupiedSpotsCounter)
        for (let sourceNum = 0; sourceNum < occupiedSpotsCounter.length; sourceNum++) {
            let availableMineSpotsCount = actualMetrics.mineSpotsCountArray[sourceNum]

            nextSourceNumber = sourceNum
            nextMineSpotNumber = occupiedSpotsCounter[sourceNum]

            // console.log(
            //     'occupiedSpotCounter: ' + occupiedSpotCounter +
            //     ' mineSpotsCountArray[sourceNum]: ' + actualMetrics.mineSpotsCountArray[sourceNum]
            // )

            if (nextMineSpotNumber < availableMineSpotsCount) {
                roleToCreate = role
                break
            } else if (nextMineSpotNumber === availableMineSpotsCount) {
                if (actualMetrics.mineSpotsCountArray.length >= sourceNum + 1) {
                    nextSourceNumber = sourceNum + 1
                } else {
                    roleToCreate = 'Dont create creep'
                    break
                }
                nextMineSpotNumber = 0
            } else {
                console.log('WTf: nextMineSpotNumber: ' + nextMineSpotNumber +
                    ' availableMineSpotsCount: ' + availableMineSpotsCount
                )
            }

        }
        if (roleToCreate) {
            break
        }
    }

    if (!roleToCreate) {
        roleToCreate = 'Miner'
    }
    console.log(
        'foundNextSourceNumber: ' + nextSourceNumber +
        ' ,foundNextMineSpotNumber: ' + nextMineSpotNumber +
        ' ,roleToCreate = ' + JSON.stringify(roleToCreate)
    )

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

function shouldThisRoleBeSkipped(role, actualMetrics) {
    const MINER = Memory.constants.MINER
    const HAULER = Memory.constants.HAULER
    const BUILDER = Memory.constants.BUILDER
    const UPGRADER = Memory.constants.UPGRADER

    if (role === MINER && actualMetrics.minersCount / 2.5 > actualMetrics.haulersCount) {
        return true
    } else if (role === HAULER && actualMetrics.minersCount / 2.5 <= actualMetrics.haulersCount) {
        return true
    } else if (role === BUILDER && actualMetrics.minersCount / 1.9 <= actualMetrics.buildersCount) {
        return true
    } else if (role === UPGRADER && actualMetrics.minersCount / 1.9 <= actualMetrics.upgradersCount) {
        return true
    }
    return false
}


