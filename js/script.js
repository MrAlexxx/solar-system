/**
 * Created by Alex on 16.10.2016.
 */
$(function () {
/**
 * @todo - перевірку чи підтримує браузер WebGL
 * @todo - переробити матеріал сонця на THREE.MeshPhongMaterial({map: ,emissive: })
 * @todo - розібратися з тінями планет
 * */


    var scene, camera, render, container;
    var W = parseInt(window.innerWidth);
    var H = parseInt(window.innerHeight);


    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, W/H, 1, 1000000);
    camera.position.z = 20300;
    camera.rotation.z = -Math.PI/20;
    scene = new THREE.Scene();

//Light

    var light = new THREE.PointLight(0xffffff, 1.4, 30000);
    light.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    scene.add(light);
//Code...

    var ambient = new THREE.AmbientLight(0xffffff);
    // scene.add(ambient);
//Stars
    var stars = addStars(25000, 0.3);
    stars = new THREE.Points(stars.starsGeometry,stars.starsMaterial);
    stars.scale.set(50, 50, 50);
    scene.add(stars);

    var stars2 = addStars(5000, 1);
    stars2 = new THREE.Points(stars2.starsGeometry,stars2.starsMaterial);
    stars2.scale.set(5, 5, 5);
    scene.add(stars2);

//Sun
    //     var sunTexture = new THREE.ImageUtils.loadTexture("/textures/sun.png");
    var sunTexture = new THREE.TextureLoader().load("/textures/sun.png");
    sunTexture.anisotropy = 8;
    var sun = new THREE.Mesh(new THREE.SphereGeometry(2300,80,80),
                             new THREE.MeshBasicMaterial({map: sunTexture}));
                             // new THREE.MeshPhongMaterial({map: sunTexture, emissive: 0xffffff}));
    scene.add(sun);

//Mercury
    var mercury = addPlanet("mercury",70,20);
    scene.add(mercury);

//Venus
    var venus = addPlanet("venus",90,20);
    scene.add(venus);

//Earth
    var earth = addPlanet("earth",100,20);
    scene.add(earth);

//Mars
    var mars = addPlanet("mars",80,20);
    scene.add(mars);

//Jupiter
    var jupiter = addPlanet("jupiter",350,20);
    scene.add(jupiter);

//Saturn
    var saturn = addPlanet("saturn",230,20);
    scene.add(saturn);

//Uranus
    var uranus = addPlanet("uranus",170,40);
    scene.add(uranus);

//Neptune
    var neptune = addPlanet("neptune",168,20);
    scene.add(neptune);

//Render
    render = new THREE.WebGLRenderer({antialias:true});
    render.setSize(W,H);
    container.appendChild(render.domElement);
    var t = 0;
    var y = 0;
    animate();


    document.addEventListener('mousemove',function (event) {
        y = parseInt(event.offsetY);
    }, false );

    function addPlanet(planetName, radius, segment) {
        var Texture = new THREE.TextureLoader().load("/textures/"+planetName+".jpg");
        Texture.anisotropy = 8;
        var planet = new THREE.Mesh(new THREE.SphereGeometry(radius,segment,segment),
                                    new THREE.MeshBasicMaterial({map: Texture}));
        planet.castShadow = true;
        return  planet;

    }

    function addStars(qty, opct) {
        var starsGeometry = new THREE.Geometry();
        var starsMaterial = new THREE.PointsMaterial({color: 0xbbbbbb, size:1, opacity:opct, sizeAttenuation:false});

        for(var i=0; i<qty; i++){
            var vertex = new THREE.Vector3();
            vertex.x = Math.random()*2-1;
            vertex.y = Math.random()*2-1;
            vertex.z = Math.random()*2-1;
            vertex.multiplyScalar(camera.position.z - 200);
            starsGeometry.vertices.push(vertex);
        }

       return {
            starsGeometry: starsGeometry,
            starsMaterial: starsMaterial
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        sun.rotation.y += 0.001;

        mercury.position.x = Math.sin(t*0.3)*4500;
        mercury.position.z = Math.cos(t*0.3)*4500;
        mercury.rotation.y += 0.01;

        venus.position.x = Math.sin(t*0.2)*5500;
        venus.position.z = Math.cos(t*0.2)*5500;
        venus.rotation.y += 0.01;

        earth.position.x = Math.sin(t*0.1)*7500;
        earth.position.z = Math.cos(t*0.1)*7500;
        earth.rotation.y += 0.01;

        mars.position.x = Math.sin(t*0.08)*8500;
        mars.position.z = Math.cos(t*0.08)*8500;
        mars.rotation.y += 0.01;

        jupiter.position.x = Math.sin(t*0.06)*(-10700);
        jupiter.position.z = Math.cos(t*0.06)*(-10700);
        jupiter.rotation.y += 0.01;

        saturn.position.x = Math.sin(t*0.04)*12000;
        saturn.position.z = Math.cos(t*0.04)*12000;
        saturn.rotation.y += 0.01;

        uranus.position.x = Math.sin(t*0.02)*13500;
        uranus.position.z = Math.cos(t*0.02)*13500;
        uranus.rotation.y += 0.01;

        neptune.position.x = Math.sin(t*0.01)*15000;
        neptune.position.z = Math.cos(t*0.01)*15000;
        neptune.rotation.y += 0.01;

        camera.position.y = y * 5;
        // camera.position.z = mercury.position.z + 200;
        // camera.lookAt(mercury.position);

        t += Math.PI/180*2;

        render.render(scene, camera);
    }

});