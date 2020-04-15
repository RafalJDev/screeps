const bestBody = require('../handler.create.best.body')

// module.exports = {
//     // ...
//     testEnvironment: 'screeps-jest'
//     // ...
// }

test('should check if creep will be created properly 300', () => {
    let body = bestBody.createBestBody([WORK, CARRY, MOVE, WORK], 300)

    // console.log('best: ' + JSON.stringify(body))

    expect(body).toEqual([WORK, CARRY, MOVE, WORK])
})

test('should check if creep will be created properly 350', () => {
    let body = bestBody.createBestBody([WORK, CARRY, MOVE, WORK], 350)

    // console.log('best: ' + JSON.stringify(body))

    expect(body).toBe([WORK, CARRY, MOVE, WORK, MOVE])
})

test('should check if creep will be created properly 400', () => {
    let body = bestBody.createBestBody([WORK, CARRY, MOVE, WORK], 400)

    console.error('best: ' + JSON.stringify(body))

    expect(body).toBe([WORK, CARRY, MOVE, WORK, WORK])
})

test('should check if creep will be created properly 450', () => {
    let body = bestBody.createBestBody([WORK, CARRY, MOVE, WORK], 450)

    console.error('best: ' + JSON.stringify(body))

    expect(body).toBe([WORK, CARRY, MOVE, WORK, WORK, CARRY])
})