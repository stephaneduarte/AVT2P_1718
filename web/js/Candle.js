class Candle extends GameObject{

  constructor (x, y, z, matCandle){

    super(x, y, z, 0, 0, 10);
    this.addCone(matCandle);

  }

  addCone(material){
    'use strict';

    geometry = new THREE.ConeGeometry(5, 40, 32, 10, true, 1, 6.3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(20, 0, 0);
    mesh.rotateX(Math.PI);

    this.add(mesh);
  }
}
