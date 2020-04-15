import {mockGlobal} from 'screeps-jest'

const bestBody = require('../handler.create.best.body')

module.exports = {
    // ...
    testEnvironment: "screeps-jest"
    // ...
};

mockGlobal('Game', {
    spawns: {
        Spawn1: {
            room: {
                energyCapacityAvailable: 300
            }
        }
    }
})


describe('Filter function', () => {
    test('it should filter by a search term (link)', () => {
        console.log('a')
        let message = bestBody.run([MOVE, WORK, CARRY])
        console.log('a')

        console.log('bestB: ' + JSON.stringify(message))

        expect('output').toEqual('output')
    })
})