var roleMiner = require('role.miner')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roleFirstCreep = require('role.first.creep')
var roleHauler = require('role.hauler')

var object = {

    run: function (spawn) {
        const MINER = Memory.constants.MINER
        const BUILDER = Memory.constants.BUILDER
        const TEMP_BUILDER = Memory.constants.TEMP_BUILDER
        const UPGRADER = Memory.constants.UPGRADER
        const TEMP_UPGRADER = Memory.constants.TEMP_UPGRADER
        const FIRST_CREEP = Memory.constants.FIRST_CREEP
        const HAULER = Memory.constants.HAULER

        for (var name in Game.creeps) {
            var creep = Game.creeps[name]
            let role = creep.memory.role

            switch (role) {
                case FIRST_CREEP:
                    roleFirstCreep.run(spawn.name, creep)
                    break
                case MINER:
                    roleMiner.run(spawn.name, creep)
                    break
                case BUILDER:
                    roleBuilder.run(spawn.name, creep)
                    break
                case TEMP_BUILDER:
                    if (spawn.room.controller.level === 2 && Game.constructionSites) {
                        creep.memory.role = UPGRADER
                    }
                    roleBuilder.run(spawn.name, creep)
                    break
                case UPGRADER:
                    roleUpgrader.run(spawn.name, creep)
                    break
                case TEMP_UPGRADER:
                    if (Object.keys(Game.constructionSites).length) {
                        creep.memory.role = BUILDER
                    }
                    roleUpgrader.run(spawn.name, creep)
                    break
                case HAULER:
                    roleHauler.run(spawn.name, creep)
                    break
                default:
                    console.log('WTF is that role: ' + role + ' creep: ' + JSON.stringify(creep))
            }
        }
    }
}

module.exports = object