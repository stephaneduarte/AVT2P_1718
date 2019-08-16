class Present extends GameObject{

  constructor(x, y, z, matPresent, presentRadius){

    super(x , y , z, 0, 0, presentRadius);
    this.addPresent(matPresent);

  }

  addPresent(material){
    'use strict';

    geometry = new THREE.CubeGeometry (20, 10, 20, 1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.set(0, 0, 0);

    this.add(mesh);
  }
}
