var camera, camera2, camera3, camera4, camera5, lastCamera, activeCamera = 3;
var scene, renderer, backgroundColor = 0xCCFFF8;
var sleigh, table, present, present2, ball, cheerio;
var mesh, material, geometry;

var dim = 500;
var falling = false;

var posX, posY, posZ;
var front = false;
var back = false;
var left = false;
var right = false;
var frontBreak = false;
var backBreak = false;
var clock = new THREE.Clock();
var timePassed;
var carRadius = 10, presentRadius = 10, ballRadius = 25, cheerioRadius = 6; //FIX ME
var numBall = 4;
var speedFactor = 1, rotDistance = 0, angleRotation = 1 / ballRadius;
var instructions = false, night = false;
var fog;
var paused = false;
var gameOver = false;
var infinity = -10000;

var effect, controls, element;

//Sensors
var handleTouchEvent, actualOrientation, handleDeviceMotionEvent;

var texture5, billboards, mapHeight = new THREE.TextureLoader().load( "textures/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg" );
var text, t;
var gamePausedText = [-3975 , 950 , 35]; 
var gameOverText = [4070 , 950 , -25];
var gameOverText2 = [4100 , 950 , 125]

var particle, group = new THREE.Group();;

//Materials
var matTable = new THREE.MeshPhongMaterial({color: 0xFFFFFF, specular:0xFFFFFF, shininess: 5, wireframe: false});
var matSleigh = new THREE.MeshPhongMaterial( {  color: 0x8E2F1C, specular: 0x000000, shininess: 5, wireframe: false });
var matPresent = new THREE.MeshPhongMaterial( {  color: 0xFFFFFF, specular: 0x000000, shininess: 5, wireframe: false} );
var matBall = new THREE.MeshPhongMaterial({color: 0xFF6726, specular: 0x000000, shininess: 5, wireframe: false});
var matCheerio =  new THREE.MeshPhongMaterial( {  color: 0xFFFFFFF, specular: 0x000000, shininess: 5, wireframe: false, bumpMap: mapHeight,
bumpScale: 12} );
var matCandle = new THREE.MeshPhongMaterial({  color: 0xFFB6B9, specular: 0x000000, emissive: 0x111111, shininess: 105, wireframe: false });
var matParticle = new THREE.SpriteMaterial( { transparent: true, fog: true, blending: THREE.AdditiveBlending } );


// Arrays
var go = [], materials = [], candles = [];
materials.push(matTable);
materials.push(matSleigh);
materials.push(matPresent);
materials.push(matBall);
materials.push(matCheerio);
materials.push(matCandle);

//Lights
var light, lensFlare, directionalLight, candle1, candle2, candle3, candle4, pointLight, spotLight, hemiLight, point = true;

//Water
var water;
var parameters = {
  oceanSide: 2000,
  size: 1.0,
  distortionScale: 3.7,
  alpha: 1.0
};


//Inicialization
function init(){
  'use strict';

  //new render conf because of lens flare
  renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);


  loadTextures();
  createScene();
  createCamera();
  //loadAudio();
  countTouch();
  orientationMode();
  headMovement();

  window.addEventListener("resize", onResize, false);
  window.addEventListener('touchstart', handleTouchEvent, false);
  window.addEventListener('touchend', handleTouchEvent, false);
}

//Render
function render(){
    'use strict';
     if (activeCamera == 1){
        renderer.render(scene, camera);
    }

    else if (activeCamera == 2){
        renderer.render(scene, camera2);
    }

    else if (activeCamera == 3){
        renderer.render(scene, camera3);
    }

    else if (activeCamera == 4){ 
        renderer.render(scene, camera4);
    }

    else if (activeCamera == 5){
        renderer.render(scene, camera5);
    }

    water.material.uniforms.time.value += 1.0 / 60.0;
    water.material.uniforms.size.value = parameters.size;
    water.material.uniforms.distortionScale.value = parameters.distortionScale;
    water.material.uniforms.alpha.value = parameters.alpha;
}

//Objects
function createBall(){
  for (var i = 0 ; i < numBall; i++){
    ball = new Ball(0, 25, 0, matBall, Math.floor(Math.random() * speedFactor) + 0.005, ballRadius);
    loadDolphins(ball);
    scene.add(ball);
    go.push(ball);
  }
}
function resetBalls() {
	for(var firstBall = 0; !(go[firstBall] instanceof Ball); firstBall++); //finds first ball in go

	for(var j = 0; j < numBall; j++){
		go[firstBall+j].position.x = 0;
		go[firstBall+j].position.z = 0;
	}
}

function createSleigh(){
  sleigh = new Sleigh(100, 0, -70, matSleigh, 0, acceleration, carRadius);
  loadBoat(sleigh);
  scene.add(sleigh);
  go.push(sleigh);
}

function resetSleigh() {
 // falling = false;
  sleigh.lives = 3;
  sleigh.position.x = 100;
  sleigh.position.z = -70;
  sleigh.position.y = 0;
  sleigh.score = 0;
  sleigh.downVelocity = 0;
  sleigh.speed = 0;
  sleigh.rotation.set(0,0,0);
}

function createPresent(){

  pX = [-100, 90, -120, -140, 200, 90, 90, 90, 80];
  pY = [-150, 200, 100, 120, 100, -140, -100, -120, 80];

  for (var i = 0; i < pX.length; i++){
    present = new Present(pX[i], 6, pY[i] , matPresent, 0, 0, presentRadius);
    scene.add(present);
    go.push(present);
  }
}

function createDirectionalLight(){

  directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  //directionalLight.color.setHSL( 0.1, 1, 0.95 ); //da tom amarelado para imitar o sol
  //TO DO COM A TROCA
  /*directionalLight.position.y = -350;
  directionalLight.position.z = -300;*/
  directionalLight.position.set(30, 80, 0);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //water
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;  // default
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.top = 350;
  directionalLight.shadow.camera.right = 300;
  directionalLight.shadow.camera.left = -300;
  directionalLight.shadow.camera.bottom = -300;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 300;
  directionalLight.shadowCameraVisible = true;

  /*//Create a helper for the shadow camera (optional)
  var helper = new THREE.CameraHelper( directionalLight.shadow.camera );
  scene.add( helper );*/

  //directionalLight.rotateY(20);
  scene.add(directionalLight);
}

function createCandles(){
  //950 * 700

  //Cande 1 - amarelo
  candle1 = new Candle(240, 20, 205, matCandle);
  scene.add(candle1);

  pointLight = new THREE.PointLight( 0xffff00, 1.2, 300 );
  pointLight.position.set(260, 52, 205);
  scene.add(pointLight);
  candles.push(pointLight);

  var sphereSize = 5;
  var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  scene.add( pointLightHelper );

  //Cande 2 - sup esq - rosa
  candle2 = new Candle(-345, 20, 30, matCandle);
  scene.add(candle2);

  pointLight2 = new THREE.PointLight( 0xff00ff, 1.2, 300 );
  pointLight2.position.set(-325, 52, 30);
  scene.add(pointLight2);
  candles.push(pointLight2);

  var pointLightHelper2 = new THREE.PointLightHelper( pointLight2, sphereSize );
  scene.add( pointLightHelper2 );


  //Cande 3 - inf dir - azul
  candle3 = new Candle(265, 20, -150, matCandle);
  scene.add(candle3);

  pointLight3 = new THREE.PointLight( 0x00ffff, 1.2, 300 );
  pointLight3.position.set(285, 52, -150);
  scene.add(pointLight3);
  candles.push(pointLight3);

  var pointLightHelper3 = new THREE.PointLightHelper( pointLight3, sphereSize );
  scene.add( pointLightHelper3 );


  //Cande 4 - inf esq - verde
  candle4 = new Candle(-125, 20, -300, matCandle);
  scene.add(candle4);

  pointLight4 = new THREE.PointLight( 0x00ff00, 1.2, 300 );
  pointLight4.position.set(-105, 52, -300);
  scene.add(pointLight4);
  candles.push(pointLight4);

  var pointLightHelper4 = new THREE.PointLightHelper( pointLight4, sphereSize );
  scene.add( pointLightHelper4 );

}

function createCheerios(){
  auxCreateCheerios(25, 70);
  auxCreateCheerios(70, 300);
}

function auxCreateCheerios(nrCheerios, radius){

  var slice = 2 * Math.PI / nrCheerios;
  for (var i = 0; i < nrCheerios; i++){
    var angle = slice * i;
    cheerio = new Cheerio(radius * Math.cos(angle), 1, radius * Math.sin(angle), matCheerio, cheerioRadius);
    scene.add(cheerio);
    go.push(cheerio);
  }
}

function resetCheerios() {
	for(var i = 0; !(go[i] instanceof Cheerio); i++); //finds first cheerio in go
	auxResetCheerios(25, 70, i);
    auxResetCheerios(70, 300, i+25); 
}
function auxResetCheerios(nrCheerios, radius, firstCheerio) {
	var slice = 2 * Math.PI / nrCheerios;

	for (var j = 0; j < nrCheerios; j++) {
		var angle = slice * j;
		go[firstCheerio+j].position.x = radius * Math.cos(angle);
		go[firstCheerio+j].position.z = radius * Math.sin(angle);
		go[firstCheerio+j].acceleration = 1; 
		go[firstCheerio+j].velocity = 1; //positive vel & accel forces it to stop
		go[firstCheerio+j].dead = false;
	}
}


function hemisphereLight(){
  hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 );
  scene.add( hemiLight );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 ); //tom amarelado
	hemiLight.position.set( 0, 80, 0 );
	scene.add( hemiLight );
  hemiLight.visible = false;

  /*hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
	scene.add( hemiLightHelper );*/

}

//Load .obj
function loadDolphins(ball){
  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) { };

  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

  var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/golfinho/' );
    mtlLoader.load( 'dophin.mtl', function( materials ) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'obj/golfinho/' );
      objLoader.load( 'dophin.obj', function ( object ) {

        //object.position.y = - 95;
        object.position.set(0,-20,-20);
        ball.add(object);

      }, onProgress, onError );
  });
}

//Load .obj
function loadBoat(boat){
  console.log("Loading boat.");
  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) { };

  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

  var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/boat/' );
    mtlLoader.load( 'SeaAngler.mtl', function( materials ) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'obj/boat/' );
      objLoader.load( 'SeaAngler.obj', function ( object ) {
        object.scale.set(0.4,0.4,0.25);
        object.rotation.y = Math.PI / 2;
        object.position.set(-18,10,0);
        object.castShadow = true;
        boat.add(object);

      }, onProgress, onError );
  });
}

//Load .obj
function loadCruiser(){
  console.log("Loading cruiser.");
  // model
  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) { };

  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

  var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'obj/cruiser/' );
    mtlLoader.load( 'Cruiser_2012.mtl', function( materials ) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
      objLoader.setPath( 'obj/cruiser/' );
      objLoader.load( 'Cruiser_2012.obj', function ( object ) {
      	object.scale.set(0.75,0.75,0.75);
        object.rotation.y = Math.PI / 2;
        object.position.set(-400,0,0);
        scene.add(object);
      }, onProgress, onError );
  });
}

//TGA only
function loadTextures(){

  var loader = new THREE.TGALoader();

  //Present
  var texture1 = loader.load( 'textures/boxwood.tga' );
  matPresent.map = texture1;

  var texture2 = loader.load( 'textures/floater.tga' );
  matCheerio.map = texture2;

  var texture3 = new THREE.TextureLoader().load( "textures/snowflake2.png" );
  matParticle.map = texture3;

  texture5 = loader.load('textures/fin.tga');
}

//Sound
function loadAudio(){
  //Create an AudioListener and add it to the camera
  var listener = new THREE.AudioListener();
  camera.add( listener );

  // create a global audio source
  var sound = new THREE.Audio( listener );

  //Positional, needs to be added to object after
  //poSound = new THREE.PositionalAudio( listener );

  var audioLoader = new THREE.AudioLoader();

  audioLoader.load( 'sounds/music.mp3', function( buffer ) {
  	sound.setBuffer( buffer );
  	sound.setLoop( true );
    //sound.setRefDistance( 20 ); for Positional
  	sound.setVolume( 0.5 );
  	sound.play();
  });

}

//Scene
function createScene(){
  'use strict';

  scene = new THREE.Scene();
  scene.background = new THREE.Color( backgroundColor );

  /*var axisHelper = new THREE.AxisHelper(100);
  scene.add(axisHelper);
  axisHelper.position.set(0, 5, 0);*/

  /*table = new Table(0,0,0, matTable);
  //matTable.color.setHSL( 0.095, 1, 0.75 );
  scene.add(table);*/
  createSleigh();
  createPresent();
  createBall();
  createDirectionalLight();
  createCandles();
  createCheerios();
  hemisphereLight();
  createLensFlare();
  createWater();
  loadCruiser();
  createBillboards();
  createText("Paused", gamePausedText); 
  createText("Game", gameOverText);
  createText("Over", gameOverText2);
}

//Camera
function createCamera(){
  'use strict';

  //Otho Fixed
  camera  = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, 1 , 1000);

  camera.position.y = 500;
  camera.lookAt(scene.position);

  //PerspectiveCamera
  camera2 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight,  100 , 2000);

  camera2.position.x = 0;
  camera2.position.y = 500;
  camera2.position.z = -300;
  camera2.lookAt(scene.position);

  //Follows Sleigh
  camera3 = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight,  1 , 2000);

  camera3.position.x = -50;
  camera3.position.y = 50;
  camera3.position.z = 0;
  camera3.up = new THREE.Vector3(0, 1, 0);
	camera3.lookAt(new THREE.Vector3(80, 0, 0));
  sleigh.add(camera3);

  camera4  = new THREE.OrthographicCamera(-dim*8, -dim*7, dim/3, -dim/3, 1 , 1000);
  camera4.position.y = 970;
  camera4.lookAt(scene.position);

  camera5  = new THREE.OrthographicCamera(dim*8, dim*9, dim/3, -dim/3, 1 , 1000);
  camera5.position.x = 0;
  camera5.position.y = 970;
  camera5.position.z = 0;
  camera5.lookAt(scene.position);
}

//Lens Flare
function createLensFlare(){
  'use strict';

  var textureLoader = new THREE.TextureLoader();

  var textureFlare0 = textureLoader.load( "textures/lensflare/lensflare0.png" );
  var textureFlare2 = textureLoader.load( "textures/lensflare/lensflare2.png" );
  var textureFlare3 = textureLoader.load( "textures/lensflare/lensflare3.png" );

  light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
  light.color.setHSL( 0.995, 0.5, 0.9 );
  light.position.set( 425, 50, 300);
  /*light.castShadow = true;
  light.shadow.camera.near = 100;
  light.shadow.camera.far = 600;*/
  scene.add( light );

  var flareColor = new THREE.Color( 0xffffff );
  flareColor.setHSL( 0.995, 0.5, 0.9 + 0.5 );

  lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

  lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

  lensFlare.customUpdateCallback = lensFlareUpdateCallback;
  lensFlare.position.copy( light.position );

  scene.add( lensFlare );
}

function lensFlareUpdateCallback( object ) {

  var f, fl = object.lensFlares.length;
  var flare;
  var vecX = -object.positionScreen.x * 2;
  var vecY = -object.positionScreen.y * 2;


  for( f = 0; f < fl; f++ ) {

    flare = object.lensFlares[ f ];

    flare.x = object.positionScreen.x + vecX * flare.distance;
    flare.y = object.positionScreen.y + vecY * flare.distance;

    flare.rotation = 0;

  }

  object.lensFlares[ 2 ].y += 0.025;
  object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

}

function createWater() {

  water = new THREE.Water(
    parameters.oceanSide * 5,
    parameters.oceanSide * 5,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      alpha:  parameters.alpha,
      sunDirection: directionalLight.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: parameters.distortionScale,
      fog: scene.fog != undefined
    }
  );
  water.rotation.x = - Math.PI / 2;
  water.receiveShadow = true;
  scene.add( water );
}

//Billboards
function createBillboards(){

  //Hearts
  var geometry2 = new THREE.Geometry();

  for ( var i = 0; i < 3; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = 450 * Math.random() + 280;
    vertex.y = 3;
    vertex.z = 450 * Math.random() - 180;
    geometry2.vertices.push( vertex );
  }

  //alpha test & transparent para mandar fora os fragmentos que não interessam
  var material2 = new THREE.PointsMaterial( { size: 45,  sizeAttenuation: false, map: texture5, alphaTest: 0.5, transparent: true } );
  billboards = new THREE.Points( geometry2, material2 );
  billboards.name = "shark fin";
  console.log(billboards);
  //billboards.scale(new THREE.Vector3(20,20,20));
  scene.add( billboards );

}

//Text
function createText(input, position){
  var loader = new THREE.FontLoader();

	loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
		var xMid, text;
		var textShape = new THREE.BufferGeometry();
		var color = 0xff6699;
    var message = input;
		var matLite = new THREE.MeshBasicMaterial( {
			color: color,
			transparent: true,
			opacity: 0.7,
			side: THREE.DoubleSide
		} );


		var shapes = font.generateShapes( message, 100, 2 );
		var geometry = new THREE.ShapeGeometry( shapes );

    // make shape ( N.B. edge view not visible )
		textShape.fromGeometry( geometry );
		text = new THREE.Mesh( textShape, matLite );
		text.position.set(position[0], position[1], position[2]);
    text.rotateX(-Math.PI/2);
		scene.add(text);
	} );
}

function createParticles(){
  var nrParticles = 500;

  var slice = 2 * Math.PI / nrParticles;
  for (var i = 0; i < nrParticles; i++){

    var angle = slice * i;
    v = 0.8*Math.random() + 8;
    phi = Math.random()*Math.PI;
    theta = 2.0*Math.random()*Math.PI;
      var velocity = [];
      velocity.push(v*Math.cos(theta)*Math.sin(phi));
      velocity.push(v*Math.cos(phi));
      velocity.push(v*Math.sin(theta)*Math.sin(phi));
      var acceleration = [0.1, -0.15, 0];
      particle = new Particle(1, 0.005, 50 * Math.cos(angle), 200, 50 * Math.sin(angle), velocity, acceleration, matParticle);
      group.add(particle);
  }
    scene.add(group);
}

function updateParticles(){
  if (group.children != null){
    for(var i = 0; i < group.children.length; i++){    
      group.children[i].updateMovement(0.125);
    }
  }
}

//Resize
function onResize(){

  renderer.setSize(window.innerWidth, window.innerHeight);
  var aspectRatio = window.innerWidth / window.innerHeight;

  if (aspectRatio > 1){
    camera.top = dim;
    camera.bottom = -dim;
    camera.left = -dim * aspectRatio;
    camera.right = dim * aspectRatio;

  }

  else{
    camera. left = -dim;
    camera.right = dim;
    camera.top = (dim / aspectRatio);
    camera.bottom = - (dim / aspectRatio);
  }

  camera.updateProjectionMatrix();

}

//Touch
function countTouch(){

  handleTouchEvent = function(e) {

  	// Get the list of all touches currently on the screen
  	var allTouches = e.touches, allTouchesLength = allTouches.length;

  	// Prevent the default browser action from occurring when the user touches and
  	// holds their finger to the screen
  	if (e.type === 'touchstart') {
  		e.preventDefault();
  	}

  	// Write the number of current touches onto the page
    console.log(allTouchesLength);
  }
}

//OrientationControls
function orientationMode(){

  var onOrientationChange = function() {
  	// The device is in portrait orientation if the device is held at 0 or 180 degrees
  	// The device is in landscape orientation if the device is at 90 or -90 degrees
  	var isPortrait = window.orientation % 180 === 0;
  	actualOrientation = isPortrait ? 'portrait' : 'landscape';
    console.log(actualOrientation);
  }

  //Check for changes
  window.addEventListener('orientationchange', onOrientationChange, false);
  onOrientationChange();
}

//Device acceleration
function headMovement(){

    handleDeviceMotionEvent = function(e) {

      // Get the current acceleration values in 3 axes and find the greatest of these
      var acc = e.acceleration,
      maxAcc = Math.max(acc.x, acc.y, acc.z);
      console.log ('acceleration: ' + maxAcc  );

      // Get the acceleration values including gravity and find the greatest of these
      accGravity = e.accelerationIncludingGravity,
      maxAccGravity = Math.max(accGravity.x, accGravity.y, accGravity.z);
      console.log('acceleration w/ gravity: ' +  maxAccGravity);
    };

  window.addEventListener('devicemotion', handleDeviceMotionEvent, false);
}

//Keyboard Events
document.addEventListener('keydown', function(event){
  'use strict';

  switch (event.keyCode) {
    case 49: //1
      if (activeCamera != 1) {
      	activeCamera = 1; 
      	billboards.visible = false;
      	scene.fog = null;
      }
      break;
    case 50: //2
      if (activeCamera != 2) {
      	activeCamera = 2; 
      	billboards.visible = false;
      	scene.fog = null;
      }
      break;
    case 51: //3
      if (activeCamera != 3) {
      	activeCamera = 3; 
      	billboards.visible = false;
      	scene.fog = null;
      }
      break;
    case 65: case 97: //A
      left = true;
			right = false;
      break;
    case 83: //S
      front = false;
			back = true;
      break;
    case 68: //D
      right = true;
			left = false;
      break;
    case 87: //W
      back = false;
			front = true;
      break;
    case 32: //D
      for(var i in materials){
        materials[i].wireframe = !materials[i].wireframe;
      }
      break;
    case 78: //n
        if(night){
          scene.background = new THREE.Color( backgroundColor );
          if (scene.fog != null) scene.fog = new THREE.FogExp2(  backgroundColor , 0.0035 );
        }
        else{
          scene.background = new THREE.Color( 0x000011 );
          if (scene.fog != null) scene.fog = new THREE.FogExp2(  0x000011 , 0.0035 );
        }
        night = !night;
	      light.visible = !light.visible;
	      lensFlare.visible = !lensFlare.visible;
	      directionalLight.visible = !directionalLight.visible;
        break;
    case 67: //c
        for (var c  in candles)
          candles[c].visible =  !candles[c].visible;
        break;
    case 72: //h TO DO
        sleigh.children[1].visible = !sleigh.children[1].visible;
        sleigh.children[3].visible = !sleigh.children[3].visible;
        break;
    case 77: //m
          hemiLight.visible = !hemiLight.visible;
        break;
    case 70: //f
      if (activeCamera == 3 && scene.fog == null && !night ){ scene.fog = new THREE.FogExp2(  backgroundColor , 0.0035 );}
      else if (activeCamera == 3 && scene.fog == null && night){ scene.fog = new THREE.FogExp2(  0x000011 , 0.0035 );}
      else scene.fog = null;
      break;
    case 80:
    case 112: 
      if (!gameOver) {
        if(!paused){  
          lastCamera = activeCamera;
          activeCamera = 4;
        }
        else 
          activeCamera = lastCamera;
        
        paused = !paused;
      }
      break;
    case 71:
    case 103:
      createParticles();
      break;
    case 82: //R
    case 114: 
      resetGame();
      break;
  }
}, false);


document.addEventListener('keyup', function(event){
  'use strict';

  switch (event.keyCode) {
    case 65: case 97: //A
      left = false;
      break;
    case 83: //S
      back = false;
      frontBreak = false;
      backBreak = true;
      break;
    case 68: //D
      right = false;
      break;
    case 87: //W
      front = false;
      backBreak = false;
      frontBreak = true;
      break;
    case 73:
      toggleInstructions();
      break;
  }
}, false);

// Where the magic happens
function animate(){
  update();
  render();
  requestAnimationFrame(animate);
}

//Game update
function update() {
  displayScore();
  timePassed = clock.getDelta();

  if (paused || gameOver) return; 
  else if (sleigh.lives <= 0) {
    paused = true;
    gameOver = true;
    activeCamera = 5;
  }

  for (var i = 0; i < go.length; i++){
    go[i].updateMovement(timePassed);
  }

  //Check for collisions
  for (var i = 0; i < go.length; i++ ){
    for (var j = i + 1; j < go.length; j++ ){
      if (go[i].hasCollision(go[j])){
        go[i].treatCollision(go[j]);
        go[j].treatCollision(go[i]);
      }
    }
  }

  updateParticles();
}

function resetGame() {
  resetSleigh();
  resetBalls();
  resetCheerios();
  activeCamera = 3;
  paused = false;
  gameOver = false;
}

//Show/Hide game commands
function toggleInstructions() {
		if(instructions){
			document.getElementById("drop2").style.display = "none";
			instructions = false;
		}
		else {
			document.getElementById("drop2").style.display = "block";
			instructions = true;
		}
}

function displayScore() {
    var auxScore = "Score: " + sleigh.score;
    document.getElementById("score").innerHTML = auxScore;

    var auxLives = "Lives: " + sleigh.lives;
    document.getElementById("lives").innerHTML = auxLives;
}
