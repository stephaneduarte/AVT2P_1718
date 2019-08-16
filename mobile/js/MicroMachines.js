var camera,effect;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


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

var effect, controls, element, e;

//Sensors
var handleTouchEvent, actualOrientation, handleDeviceMotionEvent;

var texture5, billboards, mapHeight = new THREE.TextureLoader().load( "textures/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg" );
var text, t;
var gameTextPos = [0 , 150 , -1200];

var particle, group;

//Materials
var matTable = new THREE.MeshPhongMaterial({color: 0xFFFFFF, specular:0xFFFFFF, shininess: 5, wireframe: false});
var matSleigh = new THREE.MeshPhongMaterial( {  color: 0x8E2F1C, specular: 0x000000, shininess: 5, wireframe: false });
var matPresent = new THREE.MeshPhongMaterial( {  color: 0xFFFFFF, specular: 0x000000, shininess: 5, wireframe: false} );
var matBall = new THREE.MeshPhongMaterial({color: 0xFF6726, specular: 0x000000, shininess: 5, wireframe: false});
var matCheerio =  new THREE.MeshPhongMaterial( {  color: 0xFFFFFFF, specular: 0x000000, shininess: 5, wireframe: false, bumpMap: mapHeight,
bumpScale: 12} );
var matCandle = new THREE.MeshPhongMaterial({  color: 0xFFB6B9, specular: 0x000000, emissive: 0x111111, shininess: 105, wireframe: false });
var matParticle = new THREE.MeshPhongMaterial({  color: 0xFFB6B9, specular: 0x000000, wireframe: false });


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
  element = renderer.domElement;
  document.body.appendChild(element);

  renderer.setSize(window.innerWidth, window.innerHeight);

  loadTextures();
  createScene();
  createCamera();
  loadAudio();
  countTouch();
  orientationMode();

  effect = new THREE.StereoEffect( renderer );
	effect.setSize( window.innerWidth, window.innerHeight );

  controls = new THREE.OrbitControls(camera, element);

  controls.enableKeys = true;
  controls.enableZoom = true;


  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }

    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    element.addEventListener('click', fullscreen, false);

    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }

  window.addEventListener("resize", onResize, false);
  window.addEventListener('touchstart', handleTouchEvent, false);
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener('touchend', handleTouchEvent, false);
  window.addEventListener('deviceorientation', setOrientationControls, true);

  setTimeout(onResize, 1);
}

//Render
function render(){
    'use strict';

    water.material.uniforms.time.value += 1.0 / 60.0;
    water.material.uniforms.size.value = parameters.size;
    water.material.uniforms.distortionScale.value = parameters.distortionScale;
    water.material.uniforms.alpha.value = parameters.alpha;

    effect.render( scene, camera );
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

function createSleigh(){
  sleigh = new Sleigh(150, 0, -70, matSleigh, 0, acceleration, carRadius);
  loadBoat(sleigh);
  scene.add(sleigh);
  go.push(sleigh);
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

function hemisphereLight(){
  hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 );
  scene.add( hemiLight );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 ); //tom amarelado
	hemiLight.position.set( 0, 80, 0 );
	scene.add( hemiLight );
  hemiLight.visible = false;

  hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
	scene.add( hemiLightHelper );

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

//TGA only
function loadTextures(){

  var loader = new THREE.TGALoader();

  //Present
  var texture1 = loader.load( 'textures/boxwood.tga' );
  matPresent.map = texture1;

  var texture2 = loader.load( 'textures/floater.tga' );
  matCheerio.map = texture2;

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

  createSleigh();
  //createPresent();
  createBall();
  createDirectionalLight();
  createCandles();
  createCheerios();
  hemisphereLight();
  createLensFlare();
  createWater();
  createBillboards();
}

//Camera
function createCamera(){
  'use strict';

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight,  1 , 2000); //VR

  camera.position.x = 10;
  camera.position.y = 20;
  camera.position.z = 0;
	camera.lookAt(new THREE.Vector3( window.innerWidth/2, window.innerHeight/2, 0));
  sleigh.add(camera);

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
  billboards.scale.set(20,20,20);
  scene.add( billboards );

}

//Resize
function onResize(){


	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	effect.setSize( window.innerWidth, window.innerHeight );


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

function onDocumentTouchStart( event ) {
				if ( event.touches.length > 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}
			function onDocumentTouchMove( event ) {
				if ( event.touches.length == 1 ) {
					event.preventDefault();
					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;
				}
			}


// Where the magic happens
function animate(){
  update();
  render();
  requestAnimationFrame(animate);
}

//Game update
function update() {

  timePassed = clock.getDelta();
  onResize();

  controls.update(timePassed);
  stereoAnimation(timePassed);


  if (!paused) {
    for (var i = 0; i < go.length; i++){
      go[i].updateMovement(timePassed);
    }
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
}

//Fullscreen Mode
function fullscreen() {
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    document.body.msRequestFullscreen();
  } else if (document.body.mozRequestFullScreen) {
    document.body.mozRequestFullScreen();
  } else if (document.body.webkitRequestFullscreen) {
    document.body.webkitRequestFullscreen();
  }
}

function stereoAnimation(timePassed) {
    front = true;
      backBreak = true;
      frontBreak = false;
      left = true;
}
