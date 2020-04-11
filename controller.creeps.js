var roleMiner = require('role.miner')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roleFirstCreep = require('role.first.creep')
var roleHauler = require('role.hauler')

var object = {

    run: function (spawnName) {
        const MINER = Memory.constants.MINER
        const BUILDER = Memory.constants.BUILDER
        const UPGRADER = Memory.constants.UPGRADER
        const FIRST_CREEP = Memory.constants.FIRST_CREEP
        const HAULER = Memory.constants.HAULER

        for (var name in Game.creeps) {
            var creep = Game.creeps[name]
            let role = creep.memory.role

            switch (role) {
                case FIRST_CREEP:
                    roleFirstCreep.run(spawnName, creep)
                    break
                case MINER:
                    roleMiner.run(spawnName, creep)
                    break
                case BUILDER:
                    roleBuilder.run(spawnName, creep)
                    break
                case UPGRADER:
                    roleUpgrader.run(spawnName, creep)
                    break
                case HAULER:
                    roleHauler.run(spawnName, creep)
                    break
                default:
                    console.log('WTF is that role: ' + role)
            }
        }
    }
}

module.exports = object