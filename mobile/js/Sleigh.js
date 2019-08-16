var acceleration = 2;
var acceleration2 = 3; //acceleration2
var gravity = 60;


class Sleigh extends GameObject{

  constructor(x, y, z, matSleigh, speed, acceleration, carRadius){

    super(x, y, z, speed , acceleration, carRadius);
    //this.addCube(matSleigh);
    this.addHeadLight(-15, 10, 9);
    this.addHeadLight(-15, 10, -9);
    this.lives = 50;
    this.rotation.set(0, Math.PI/2, 0);

    this.downVelocity = 0;

    this.angle = 0;
  }

  addCube(material){
    /*'use strict';

    geometry = new THREE.CubeGeometry (30, 10, 20, 1, 1, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    this.add(mesh);*/
  }

  addHeadLight(x, y, z){

    //SpotLight( color, intensity, distance, angle, penumbra, decay )
    spotLight = new THREE.SpotLight(0xffffff, 1.8, 200, 0.2, 0.6, 1);
    spotLight.target.position.set(100,5,0);
    this.add(spotLight);
    spotLight.position.set(x, y, z);
    this.add(spotLight.target);
  }

  restartCar(){

  }

//All movements

  moveFront(max, timePassed){
			if(this.speed + acceleration*timePassed < max){
				this.speed += acceleration*timePassed;
			}
			else{
				this.speed = max;
			}
	}

	moveBack(max, timePassed){
			if(this.speed + acceleration2*timePassed > -max){
				this.speed -= acceleration2*timePassed;
			}
			else{
				this.speed = -max;
			}
	}

	rotateLeft(timePassed){
		if(left &&!right && this.speed != 0){
			this.rotateY(timePassed*2);
		}
	}

	rotateRight(timePassed){
		if(right &&!left && this.speed != 0){
			this.rotateY(-timePassed * 2);
		}
	}

	stopFront(timePassed){
		if(this.speed - acceleration2 * timePassed > 0){
			this.speed -= acceleration2 * timePassed;
		}
		else{
			this.speed = 0;
		}
	}

	stopBack(timePassed){
		if(this.speed + acceleration2 * timePassed < 0){
			this.speed += acceleration2 * timePassed;
		}
		else{
			this.speed = 0;
		}
	}

  updateMovement(timePassed){

  	this.auxpositionx = this.position.x;
	this.auxpositiony = this.position.y;
	this.auxpositionz = this.position.z;

  	this.updateObjectRotation(timePassed)

    //Para mais tarde
    posX = this.position.x;
	posY = this.position.y;
    posZ = this.rotation.z;


		if(front && back){
			this.moveFront(0, timePassed);
		}

		else if(front && !back){
			this.moveFront(3, timePassed);
		}

		else if(!front && back){
			this.moveBack(2, timePassed);
		}

		else if(frontBreak){
			this.stopFront(timePassed);
		}

		else if(backBreak){
			this.stopBack(timePassed);
		}

    // Check for limits
    if (this.position.x < -385 || this.position.x > 355 || this.position.z < -250 || this.position.z > 235) {
			//falling = true;
		}


		if (this.position.y < -100){
      falling = false;
      this.position.set(10, 0, -70);
      this.speed = 0;
      this.rotation.set(0,0,0);
      this.lives--;
    }
    this.translateX(this.speed);

    this.angle = Math.atan2(this.position.z - this.auxpositionz, this.position.x - this.auxpositionx);
  }

  updateObjectRotation(delta){
		if(left){
		this.rotateLeft(delta/10);
		}
		if(right){
			this.rotateRight(delta/10);
		}
	}


  //Collisions
  treatCollision(obj){
  	//Nao esta a tratar pontuacao
    if (obj instanceof Ball){
      if (!obj.isNew()){
      	this.speed = -0.5 * this.speed;
      	this.lives--;
      }
    }
	else if (obj instanceof Present || obj instanceof Cheerio){
        this.speed = -0.5 * this.speed;
    }

    this.position.x = this.auxpositionx;
    this.position.y = this.auxpositiony;
    this.position.z = this.auxpositionz;
    //else if (obj instanceof Cheerio){}
  }

}
