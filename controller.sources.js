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

function fillMemoryWithSource(sourceX, sourceY, mineablePositions) {
    Memory['mySpawns']['Spawn1']['sources'].push(
        {
            x: sourceX, y: sourceY, mineablePositions: mineablePositions
        }
    )

}

function handleRoom(room) {

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

        fillMemoryWithSource(sourceX, sourceY, mineablePositions)
    }


}

var object = {

    //todo will calculate only once for first room
    run: function () {
        if (!Memory['mySpawns']) {
            Memory['mySpawns'] = {
                'Spawn1': {sources: []}
            }

            for (var spawnName in Game.spawns) {
                let spawn = Game.spawns[spawnName]
                // console.log('spawn: ' + spawn)
                let room = spawn.room

                handleRoom(room, spawnName)
            }
        }


    }
}

module.exports = object

