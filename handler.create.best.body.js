var object = {

    run: function (baseBody) {
        console.log('b')
        return createBestBody(baseBody)
    }

}

module.exports = object

function createBestBody(baseBody) {
    console.log('func')
    const bodyPartLength = baseBody.length

    let baseBodyCost = baseBody
        .map(part => BODYPART_COST[part])
        .reduce((prev, cur) => prev + cur)

    const availableEnergyCap = Game.spawns.Spawn1.room.energyCapacityAvailable

    let currentBodyCost = baseBodyCost
    let body = baseBody
    let i = 0

    while (currentBodyCost < availableEnergyCap) {
        console.log('while')
        let nextBodyPart = baseBody[i++ % bodyPartLength]
        body.push(nextBodyPart)
        currentBodyCost = +BODYPART_COST[nextBodyPart]
    }
    console.log(' = ' + JSON.stringify(body))

    return body
}