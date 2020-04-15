const run = function (baseBody) {
    const availableEnergyCap = Game.spawns.Spawn1.room.energyCapacityAvailable
    return createBestBody(baseBody, availableEnergyCap)

}

const createBestBody = function (baseBody, availableEnergyCap) {
    console.log('func')
    const bodyPartLength = baseBody.length

    let currentBodyCost = baseBody
        .map(part => BODYPART_COST[part])
        .reduce((prev, cur) => prev + cur)
    let body = baseBody
    let i = 0

    let addNextBodyPart = currentBodyCost < availableEnergyCap
    while (addNextBodyPart) {

        let nextBodyPart = baseBody[i++ % bodyPartLength]
        let nextBodyPartCost = BODYPART_COST[nextBodyPart]

        if (currentBodyCost + nextBodyPartCost <= availableEnergyCap) {
            body.push(nextBodyPart)
            addNextBodyPart = true
        } else if (currentBodyCost + 50 <= availableEnergyCap) {
            body.push(MOVE)
            addNextBodyPart = false
        } else {
            addNextBodyPart = false
        }
        currentBodyCost += nextBodyPartCost
    }

    return body
}

module.exports = {
    run,
    createBestBody
}