function build(spawn) {
    if (spawn.room.controller.level === 1) {
        Memory.mySpawns[spawn.name].sources.forEach(source => {
            let mineablePositions = source.mineablePositions
            let posLength = mineablePositions.length
            let middleSpot = mineablePositions[Math.floor(posLength / 2)]
            // spawn.room.createConstructionSite(middleSpot.minerX, middleSpot.minerY, STRUCTURE_CONTAINER)

            // if (Game.time < 2) {
            //     Game.spawns.Spawn1.pos.findPathTo(middleSpot.minerX, middleSpot.minerY)
            //         .forEach(pos => Game.rooms.sim.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD))
            // }
        })
    }
    //[0,-1,-2,-3][Math.floor(3/2)] => -1

    if (spawn.room.controller.level >= 2) {
    }
    let x = spawn.pos.x
    let y = spawn.pos.y
    if (!Memory.thinksToBuild) {
        let thinksToBuild = [
            {
                x: x - 1, y: y,
                structureType: STRUCTURE_EXTENSION
            },
            {
                x: x + 1, y: y,
                structureType: STRUCTURE_EXTENSION
            },
            {
                x: x, y: y - 1,
                structureType: STRUCTURE_EXTENSION
            },
            {
                x: x, y: y + 1,
                structureType: STRUCTURE_EXTENSION
            },
        ]

        Memory.thinksToBuild = thinksToBuild
    }

    Memory.thinksToBuild.forEach(structure => {
            // console.log(JSON.stringify(structure))
            spawn.room.createConstructionSite(structure.x, structure.y, structure.structureType)
        }
    )
}

var object = {

    run: function (spawn) {
        build(spawn)
    }
}

module.exports = object