class Cheerio extends GameObject {

   constructor(x, y, z, matCheerio, cheerioRadius){

     super(x, y, z, 0, 0 , cheerioRadius);
     this.addTorus(matCheerio);
     this.angle = 0;
   }


   addTorus(material){
     'use strict';

     geometry = new THREE.TorusGeometry( 6, 2, 16, 100 );
     mesh = new THREE.Mesh(geometry, material);
     mesh.castShadow = true;
     mesh.position.set(0,0,0);
     mesh.rotateX(Math.PI/2);

     this.add(mesh);
   }

   updateMovement(timePassed){
      this.auxpositionx = this.position.x;
      this.auxpositiony = this.position.y;
      this.auxpositionz = this.position.z;

      if (this.speed > 0 && this.acceleration > 0 || this.speed < 0 && this.acceleration < 0){
        this.acceleration = 0;
        this.speed = 0;
      }

      this.speed = this.speed + this.acceleration * timePassed;
      var distance = this.speed * timePassed * 60;
      var dx = distance * Math.cos(this.angle);
      var dz = distance * Math.sin(this.angle);

      if (this.position.x < -425 || this.position.x > 425 || this.position.z > 350 ||this.position.z < -350 )
            this.dead = true;

      this.translateX(dx);
      this.translateZ(dz);
    }

   //Collisions
   treatCollision(obj){
    if (obj instanceof Sleigh){
      if (obj.speed < 0) this.speed = -obj.speed;
      else this.speed = obj.speed;
      
      this.acceleration = -0.5 * obj.acceleration;

      this.angle = obj.angle;

      this.position.x = this.auxpositionx;
      this.position.y = this.auxpositiony;
      this.position.z = this.auxpositionz;
    }
   }
}