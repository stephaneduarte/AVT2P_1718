class Table extends GameObject{

  constructor(x, y, z, matTable){

    super (x, y, z, 0, 0, 0);

    this.addTable(matTable);
  }

  addTable(material){
		'use strict';

		geometry = new THREE.CubeGeometry(950, 700, 5, 1 , 1, 1);
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);

		this.add(mesh);
	}

}
