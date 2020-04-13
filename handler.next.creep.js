const object = {

    run: function (creeps, sources) {
        decideOnNextCreep(creeps, sources)
    }
}

module.exports = object


function decideOnNextCreep(creeps, sources) {
    const HAULER = Memory.constants.HAULER
    const BUILDER = Memory.constants.BUILDER
    const TEMP_BUILDER = Memory.constants.TEMP_BUILDER
    const UPGRADER = Memory.constants.UPGRADER
    const TEMP_UPGRADER = Memory.constants.TEMP_UPGRADER

    let mineSpotsCountArray = sources.map(source => source.mineablePositions.length)
    let availableMineSpotsCount = mineSpotsCountArray
        .reduce((prev, cur) => prev + cur)

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
    console.log('occupiedRoles = ' + JSON.stringify(occupiedRoles))

    let roleToCreate
    let nextSourceNumber = 0
    let nextMineSpotNumber = 0

    const canThisRoleBeCreated = roole => {
        if (roole === HAULER &&) {
            return true
        }
        return false
    }

    if (canThisRoleBeCreated(role)) {
    }

    for (let role in occupiedRoles) {
        let occupiedSpotsCounter = occupiedRoles[role].occupiedSpotsCounter
        // console.log('occ = ' + JSON.stringify(occupiedSpotsCounter) + ' typeof: ' + typeof occupiedSpotsCounter)
        for (let sourceNum = 0; sourceNum < occupiedSpotsCounter.length; sourceNum++) {
            let occupiedSpotCounter = occupiedSpotsCounter[sourceNum]

            // console.log(
            //     'occupiedSpotCounter: ' + occupiedSpotCounter +
            //     ' mineSpotsCountArray[sourceNum]: ' + mineSpotsCountArray[sourceNum]
            // )
            if (occupiedSpotCounter < mineSpotsCountArray[sourceNum]) {
                nextSourceNumber = sourceNum
                nextMineSpotNumber = occupiedSpotCounter
                roleToCreate = role
                break
            }
        }
        if (roleToCreate) {
            break
        }
    }
    console.log(
        'foundNextSourceNumber: ' + nextSourceNumber +
        ' ,foundNextMineSpotNumber: ' + nextMineSpotNumber +
        'roleToCreate = ' + JSON.stringify(roleToCreate)
    )

    return {
        nextSourceNumber: nextSourceNumber,
        nextMineSpotNumber: nextMineSpotNumber,
        roleToCreate: roleToCreate
    }
}