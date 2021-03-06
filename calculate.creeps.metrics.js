const object = {

    run: function (sources) {
        const HAULER = Memory.constants.HAULER
        const BUILDER = Memory.constants.BUILDER
        const UPGRADER = Memory.constants.UPGRADER
        const MINER = Memory.constants.MINER
        const TEMP_BUILDER = Memory.constants.TEMP_BUILDER
        const TEMP_UPGRADER = Memory.constants.TEMP_UPGRADER

        const creeps = Game.creeps
        let haulers = Object.values(creeps).filter(creep => creep.memory.role === HAULER)
        let builders = Object.values(creeps).filter(creep =>
            creep.memory.role === BUILDER || creep.memory.role === TEMP_UPGRADER
        )
        let upgraders = Object.values(creeps).filter(creep =>
            creep.memory.role === UPGRADER || creep.memory.role === TEMP_BUILDER
        )
        let miners = Object.keys(creeps).filter(creep => creep.includes(MINER))

        let minersCount = miners.length
        let haulersCount = haulers.length
        let upgradersCount = upgraders.length
        let buildersCount = builders.length

        let mineSpotsCountArray = sources.map(source => source.mineablePositions.length)
        let availableMineSpotsCount = mineSpotsCountArray
            .reduce((prev, cur) => prev + cur)

        return {
            creeps: creeps,
            haulers: haulers,
            builders: builders,
            upgraders: upgraders,
            miners: miners,
            minersCount: minersCount,
            haulersCount: haulersCount,
            upgradersCount: upgradersCount,
            buildersCount: buildersCount,
            mineSpotsCountArray: mineSpotsCountArray,
            availableMineSpotsCount: availableMineSpotsCount,
            creepsCount: Object.keys(creeps).length,
        }
    }
}

module.exports = object