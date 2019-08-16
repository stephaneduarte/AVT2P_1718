class GameObject extends THREE.Object3D{

    constructor (x, y, z, speed, acceleration, radius){
        super();

        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

        this.auxpositionx = x;
        this.auxpositiony = y;
        this.auxpositionz = z;

        this.speed = speed;
        this.acceleration= acceleration;

        this.radius = radius;

        this.dead = false;
    }

   updateMovement(timePassed){}

  hasCollision(obj){
    if(Math.pow(this.radius+obj.radius,2) >= (Math.pow(this.position.x - obj.position.x,2) + Math.pow(this.position.z - obj.position.z,2))){
      return true;
    }
    return false;
  }

    treatCollision(obj){}
}