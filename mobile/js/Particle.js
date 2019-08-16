class Particle extends GameObject{

  constructor(lifetime, fade, x , y, z, velocity, acceleration){


    super(x, y, z, velocity , acceleration, 1);
    this.addParticle(matParticle);
    this.lifetime = lifetime;
    this.fade = fade;

  }


  addParticle(matParticle){
    'use strict';

    geometry = new THREE.CubeGeometry(5, 5, 5, 1, 1, 1);
    mesh = new THREE.Mesh(geometry, matParticle);
    mesh.position.set(0, 0 , 0);
    this.add(mesh);
  }

    updateMovement(timePassed){
      console.log('entrei');
      if(this.life > 0){
        this.position.x = this.position.x + (this.velocity[0] * timePassed);
        this.position.y = this.position.y + (this.velocity[1] * timePassed);
        this.position.z = this.position.z + (this.velocity[2] * timePassed);

        this.velocity[0] = this.velocity[0] + (this.acceleration[0] * timePassed);
        this.velocity[1] = this.velocity[1] + (this.acceleration[1] * timePassed);
        this.velocity[2] = this.velocity[2] + (this.acceleration[2] * timePassed);

      	this.life -= this.fade;
        thiis.material.opacity -= this.life;
      }

    	if (this.position.y < 0 || this.life == 0 )
    		this.life = 0;
  }
}
