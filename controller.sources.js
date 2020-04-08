function howMuchCanMineAt(sourceX, sourceY, room) {
    var mineablePositionsCount = 0
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (isMineableAt(sourceX + i, sourceY + j, room)) {
                mineablePositionsCount++
            }
        }
    }
    return mineablePositionsCount
}

function isMineableAt(x, y, room) {
    var block = room.lookAt(x, y)
    console.log('x: ' + x + ' y: ' + y)

    for (let i = 0; i < block.length; i++) {
        let content = block[i];
        if (content.type === LOOK_TERRAIN &&
            (content.terrain === 'plain' || content.terrain === 'swamp')
        ) {
            console.log(' ,type: ' + content.type)
            return true
        }
    }
    return false
}

var object = {

    run: function (room) {
        let sources = room.find(FIND_SOURCES);
        for (let i = 0; i < sources.length; i++) {
            if (i == 1) {
                break
            }
            let source = sources[i];
            // console.log('source: ' + source)

            let sourceX = source.pos.x
            let sourceY = source.pos.y

            console.log('sourceX: ' + sourceX + ' sourceY: ' + sourceY)

            let maxMinersCount = howMuchCanMineAt(sourceX, sourceY, room)
            console.log('maxMinersCount: ' + maxMinersCount)
        }


    }
};

module.exports = object;

