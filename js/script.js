$(function(){

var container;
var spotLight, stats;
var camera, cameraTarget, scene, renderer, controls;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var sun;

var NEAR = 10, FAR = 5000;
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

var  maxParticles = 7000,
        particles = [],
        particleMaterial,
        particleCloud;

var texture;
var frameRate = 10;
var curTime;
var oldTime = Date.now();
var interval = 1000/frameRate;
var delta;

var sizeTracker = 12;
var direction = .2;

//TEXTURES
var sunTexture = new THREE.TextureLoader().load("/textures/sun.jpg");



// EVENTS
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

init();
animate();

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

//  CAMERA
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 1000;

    camera.shadowCameraVisible = true;
    camera.shadowMapWidth = 1028;
    camera.shadowMapHeight = 1028;

    cameraTarget = new THREE.Vector3( 0, -0.25, 0 );

// SCENE
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x59472b, 1000, FAR );


// LIGHTS
        spotLight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
        spotLight.position.set( 0, 0, 2000 );
        spotLight.target.position.set( 0, 0, 0 );
        //spotLight.intensity = 10;
        spotLight.angle = 45;

        spotLight.castShadow = true;
        spotLight.shadowCameraVisible = true;
        spotLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
        spotLight.shadow.bias = 0.0001;
        spotLight.shadowDarkness = .5;

        spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

        scene.add(spotLight);

//PARTICLES
//     particles = new THREE.Geometry();
//     for (var i = 0; i < maxParticles; i++) {
//         var particle = new THREE.Vector4(random(-4000, 4000), random(-2000, 2000), random(-3000, 20));
//
//         particles.vertices.push(particle);
//     }
//     texture = THREE.ImageUtils.loadTexture("textures/star.png");
//
//     particleMaterial = new THREE.PointCloudMaterial({ size: 15, map: texture, transparent: true, opacity: 1, blending: "AdditiveBlending", color: 0xeeeeee });
//
//     particleCloud = new THREE.PointCloud(particles, particleMaterial);
//     particleCloud.sortParticles = true;
//
//     scene.add( particleCloud );

// STATS
    stats = new Stats();
    container.appendChild( stats.dom );

// POSTPROCESSING
    //var composer = new THREE.EffectComposer( renderer );
    //composer.addPass( new THREE.RenderPass( scene, camera ) );
    //var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    //effect.uniforms[ 'scale' ].value = 4;
    //composer.addPass( effect );
    //var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    //effect.uniforms[ 'amount' ].value = 0.0015;
    //effect.renderToScreen = true;
    //composer.addPass( effect );

    ///////////////////////////*********************************//////////////////////////////

    sun = new THREE.Mesh(new THREE.SphereBufferGeometry(50 ,50,50), new THREE.MeshBasicMaterial({map:sunTexture}));
    // sun.position();
    scene.add(sun);






    ///////////////////////////*********************************//////////////////////////////

// RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    renderer.autoClear = false;

    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );


// CONTROLS
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set( 0, 0, 0 );
    controls.update();
    controls.addEventListener('change', render);


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.addEventListener( 'resize', onWindowResize, false );
}

// random helper
function random( min, max) {

    if ( isNaN(max) ) {
        max = min;
        min = 0;
    }

    return Math.random() * ( max - min ) + min;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) * 3;
    mouseY = ( event.clientY - windowHalfY ) * 3;
}

// UPDATE POINT CLOUD ANIMATION
function updateSize(){

    sizeTracker += direction;
    if(sizeTracker >= 16)
        direction = -0.2;
    if(sizeTracker < 12)
        direction = 0.2;

    //direction *= (((sizeTracker % 100) == 0) ? -1 : 1);
    // particleMaterial.size = sizeTracker;
    // particles.vertices[123].x += 3;
    //console.log(particleMaterial);
}

// ANIMATE SPEED
function refRate(){

    curTime = Date.now();
    delta = curTime - oldTime;

    if(delta > interval){
        oldTime = curTime - (delta % interval);
        updateSize();
    }
}

// ANIMATION SCENE
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}

// RENDER SCENE
function render() {
    refRate();
    // logo.rotation.y += .003*Math.PI;

    if((camera.position.x + ( mouseX - camera.position.x ) * .002) < 300 && (camera.position.x + ( mouseX - camera.position.x ) * .002) > -300)
        camera.position.x += ( mouseX - camera.position.x ) * (Math.abs(mouseX)/1000000);

    if((camera.position.y + (  - mouseY - camera.position.y ) * .002) < 300 && (camera.position.y + (  - mouseY - camera.position.y ) * .002) > -300)
        camera.position.y += ( - mouseY - camera.position.y ) * (Math.abs(mouseY)/500000);

    camera.lookAt( cameraTarget ); //scene.position
    renderer.render( scene, camera );
}
});