function calculateMineablePositions(sourceX, sourceY, room) {
    var mineablePositions = []
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (isMineableAt(sourceX + i, sourceY + j, room)) {
                mineablePositions.push(
                    {
                        minerX: sourceX + i, minerY: sourceY + j,
                        workerX: sourceX + 2 * i, workerY: sourceY + 2 * j,
                    }
                )
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
            (content[LOOK_TERRAIN] === 'plain' || content.terrain === 'swamp')
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
            middlePos: mineablePositions[Math.floor(mineablePositions.length / 2)]
        }
    )

}

function handleRoom(room, spawn) {

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

        fillMemoryWithSource(spawn.name, sourceX, sourceY, mineablePositions)
    }


}

var object = {

    run: function (spawn) {
        if (!Memory['mySpawns']) {
            Memory['mySpawns'] = {}
        }

        let room = spawn.room

        if (!Memory['mySpawns'][spawn.name]) {
            Memory['mySpawns'][spawn.name] = {
                sources: []
            }
            handleRoom(room, spawn)
        }


    }
}

module.exports = object

