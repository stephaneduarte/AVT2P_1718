var time = 0 ;

class Ball extends GameObject {

    constructor(x, y, z, matBall, speed, ballRadius){

      super(x, y, z, speed, 0, ballRadius);
      //this.addSphere(matBall);
      this.angle = Math.floor(Math.random() * 361); //angle between 0 and 360
      this.speedFactor = 4;												  //FIXME
      this.speed = Math.floor(Math.random() * this.speedFactor) + 1.010;  //FIXME
      this.new = true;

      //this.lookAt(new THREE.Vector3(0, 0, 0));
      }

    addSphere(material){
        'use strict';

        geometry = new THREE.SphereGeometry( 25, 32, 32 );
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.position.set(0, 0 , 0);

        this.add(mesh);
      }

    updateMovement(timePassed){
      this.new = false;

      this.auxpositionx = this.position.x;
      this.auxpositiony = this.position.y;
      this.auxpositionz = this.position.z;

      //Increase speed
      time += timePassed;
      if (time > 10000){
        this.speedFactor += 0.005;
        this.time = 0;
      }

      var distance = this.speed * timePassed;
  	  var dx = distance * Math.cos(this.angle)*30;
  	  var dz = distance * Math.sin(this.angle)*30;

  	  if (this.position.x < -425 || this.position.x > 425 || this.position.z > 350 ||this.position.z < -350 )
            this.restartBall();

  	  this.translateX(dx);
  	  this.translateZ(dz);
    }


    restartBall(){
      this.visible = false;
      this.position.x = 0;
      this.position.z = 0;
      this.visible = true;
      this.angle = Math.floor(Math.random() * 361);
      this.new = true;
    }

    //Collisions
    treatCollision(obj){
      if(!this.new){
        if (obj instanceof Sleigh){
          this.speed = -this.speed;
          this.position.x = this.auxpositionx;
          this.position.y = this.auxpositiony;
          this.position.z = this.auxpositionz;
        }
      }
    }

    isNew(){
      return this.new;
    }

}
