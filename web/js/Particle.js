class Particle extends GameObject{

  constructor(life, fade, x , y, z, velocity, acceleration, matParticle){
    super(x, y, z, velocity , acceleration, 1);
    this.addParticle(matParticle);
    this.life = life;
    this.fade = fade;
    this.velocity = velocity;
    this.acceleration = acceleration;

  }


  addParticle(material){
    'use strict';
    var sprite = new THREE.Sprite(material);
    sprite.position.set(0, 0, 0);
    sprite.scale.set(15, 15, 15);
    this.add(sprite);
  }

    updateMovement(timePassed){
      this.position.x = this.position.x + (this.velocity[0] * timePassed);
      this.position.y = this.position.y + (this.velocity[1] * timePassed);
      this.position.z = this.position.z + (this.velocity[2] * timePassed);

      this.velocity[0] = this.velocity[0] + (this.acceleration[0] * timePassed);
      this.velocity[1] = this.velocity[1] + (this.acceleration[1] * timePassed);
      this.velocity[2] = this.velocity[2] + (this.acceleration[2] * timePassed);

    	this.life -= this.fade;
      this.children[0].material.opacity = this.life;

    	if (this.position.y < 0 || this.life <= 0 ) {
    		scene.remove(this);
        group.remove(this);
      }
  }
}
