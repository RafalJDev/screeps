function f() {
    Game.spawns['Spawn1'].room.find(FIND_SOURCES)[3].pos
    Game.rooms['sim'].visual.circle(10,20, {fill: '#00FF00'});
    Game.rooms.sim.createConstructionSite(10, 15, STRUCTURE_ROAD);
    Game.rooms[Game.spawns['Spawn1']].createConstructionSite(10, 15, STRUCTURE_ROAD);

    Game.spawns.Spawn1.pos.findPathTo(35, 20)
        .forEach(pos => Game.rooms.sim.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD))
}