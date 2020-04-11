function calculateMineablePositions(sourceX, sourceY, room) {
    var mineablePositions = []
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (isMineableAt(sourceX + i, sourceY + j, room)) {
                mineablePositions.push({x: sourceX + i, y: sourceY + j})
            }
        }
    }
    return mineablePositions
}

function isMineableAt(x, y, room) {
    var block = room.lookAt(x, y)
    // console.log('x: ' + x + ' y: ' + y)

    for (let i = 0; i < block.length; i++) {
        let content = block[i]
        if (content.type === LOOK_TERRAIN &&
            (content.terrain === 'plain' || content.terrain === 'swamp')
        ) {
            // console.log('Type: ' + content.type)
            return true
        }
    }
    return false
}

function fillMemoryWithSource(spawnName, sourceX, sourceY, mineablePositions) {
    Memory['mySpawns'][spawnName]['sources'].push(
        {
            x: sourceX, y: sourceY,
            mineablePositions: mineablePositions,
        }
    )

}

function handleRoom(spawnName, room) {

    let sources = room.find(FIND_SOURCES)
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i]
        // console.log('source: ' + source)

        let sourceX = source.pos.x
        let sourceY = source.pos.y

        // console.log('sourceX: ' + sourceX + ' sourceY: ' + sourceY)

        let mineablePositions = calculateMineablePositions(sourceX, sourceY, room)
        let maxMinersCount = mineablePositions.length
        // console.log('mineablePositions1: ' + mineablePositions1)

        fillMemoryWithSource(spawnName, sourceX, sourceY, mineablePositions)
    }


}

var object = {

    //todo will calculate only once for first room
    run: function (spawnName) {
        if (!Memory['mySpawns']) {
            Memory['mySpawns'] = {}
        }

        let spawn = Game.spawns[spawnName]
        let room = spawn.room

        if (!Memory['mySpawns'][spawnName]) {
            Memory['mySpawns'][spawnName] = {
                sources: []
            }
            handleRoom(room, spawnName)
        }


    }
}

module.exports = object

