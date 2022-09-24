import './style.css'
import * as THREE from 'three'
import { Clock, Face3, Float16BufferAttribute, Matrix3, Mesh, MeshBasicMaterial, RedIntegerFormat, Shape, Sphere, TetrahedronBufferGeometry, TetrahedronGeometry, Vector3, Vector4 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACLoader, DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


const teaxtureLoder = new THREE.TextureLoader()
const earthTexture = teaxtureLoder.load('/5000.png')
const plantTexture = teaxtureLoder.load('/6000.png')
const bord = teaxtureLoder.load('/bord.png')

//gui
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
window.addEventListener('dblclick' , () => {
    if (!document.fullscreenElement){
        canvas.requestFullscreen()
    }
    else 
    {
        document.exitFullscreen()
    }

})
///delet
const loader = new GLTFLoader();

loader.load( 'models/sun/scene.gltf', function ( gltf ) {
    console.log(gltf)
    gltf.scene.scale.set(1000,1000,1000)
    gltf.scene.position.x = 50000
    
    
	scene.add( gltf.scene );
// console.log(gltf)
}, undefined, function ( error ) {

	console.error( error );

} );

//  gltf.position.x =0
///
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.0001, 1000000)
camera.position.y= 5000
scene.add(camera)




/**
 *  Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * debug
 */
const i_earth = {
    R : 637.1 ,
    M : 5.9742 * Math.pow(10 , 19),
    position: {
        X:0 , 
        Y:0,
        Z:0
    }
}

 const objectsToAdd = {
    moonM:0.2415,
    VL:138.8888,
    camera:0,
    p : 0

}


gui.add(objectsToAdd , 'moonM')
gui.add(objectsToAdd , 'VL')
gui.add(objectsToAdd , 'camera')
gui.add(objectsToAdd , 'p')

/**
 * light
 */
const directionalLight = new THREE.DirectionalLight(0xffffff , 0.9 )
directionalLight.position.x = 1
directionalLight.position.y = 0
const ambientLight = new THREE.AmbientLight(0xffffff , 0.07)
scene.add(directionalLight ,  ambientLight)






/////

//const earthR = 637.1 //نصف قطر الارض


let arg = 0 // زاوية الدورانبة
let gh = 0 //  قوة الجاذبية عندالقمر
let f = 0 //  اقوة الجذبالكوني
const dt =0.005
let r2 = 0
let moonM = 0 
//let earthM = 5.9742 * Math.pow(10 , 19)
const G = 6.67430 * Math.pow(10 , -11 )
let fx =0, fy =0  
let ax =0 , ay =0 , a =0  // تسارع
let  vx =0 , vy =0
let dx = 0 , dy = 0 , dx2 = 0 , dy2 = 0
let v0 = 0 , vx2 = 0 , vy2 = 0 
let arg1 =0
let fr = 0 , frx = 0 , fry = 0 
let k = 0.82
let s = 25.84
let v = 0 
let vr = 0 ,  vrx = 0 ,  vry = 0
let ar = 0 ,arx = 0 ,ary = 0

const earth = new THREE.Mesh(
    new THREE.SphereBufferGeometry(i_earth.R,32,32),
new THREE.  MeshStandardMaterial({map:earthTexture})
)
earth.position.set(i_earth.position.X,i_earth.position.Y,i_earth.position.Z)



// createPlant(500 , {x:1000 , y:1000})
const moon = new THREE.Group()
const cylendre = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(100,100,200 ,32),
    new THREE.MeshBasicMaterial({color:0x0ff0ff})
)
cylendre.rotation.x = Math.PI /2
const head = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(100,0,200 ,32),
    new THREE.MeshBasicMaterial({color:0x0ff0ff})
)
head.position.z = 170
head.rotation.x = Math.PI/2


/////////////////
const L11 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
L11.position.x = - 250
const L12 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
L12.rotation.x = Math.PI 
L12.position.x = - 250

const L21 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
L21.position.x =  250
const L22 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
L22.position.x =  250
L22.rotation.x = Math.PI


///
const B11 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
B11.position.x = - 250
B11.position.z = - 100
const B12 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)


B12.position.x = - 250
B12.position.z = - 100
B12.rotation.x = Math.PI 

const B21 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
B21.position.x =  250
B21.position.z =  -100
const B22 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(300,100),
    new THREE.MeshBasicMaterial({map:bord})
)
B22.rotation.x = Math.PI 
B22.position.x =  250
B22.position.z =  -100

scene.add(B21 , B22)
moon.add(L11 , L12 , B11 , B12 , L21 ,L22 , B21 , B22 , cylendre , head)
scene.add(moon)
moon.position.x =  2000
moon.position.y = 2600


const group = new THREE.Group()
group.add(earth)
group.add(moon)
scene.add(group)



/**
 * Animate
 */
earth.scale.set(1.5 , 1.5 , 1.5)

let oldElapsedTime = 0 


///////////
const points = [];
const materialLine = new THREE.LineBasicMaterial({color: 0Xffffff})



// for(let i = 0 ; i> 1000 ; i++){
    
earth.M = i_earth.M

const sphareGeometry = new THREE.SphereBufferGeometry(0.5 , 4 ,4)
const sphareMesh = new THREE.MeshBasicMaterial()
for(let i=0 ; i<1000 ; i++){

   const star = new THREE.Mesh(sphareGeometry,sphareMesh)
   star.position.x =( Math.random() - 0.5) * 200000
   star.position.y =( Math.random() - 0.5) * 200000
   star.position.z =( Math.random() - 0.5) * 200000
   star.rotation.x =  Math.random() * Math.PI
   star.rotation.y =  Math.random() * Math.PI
   const scale = Math.random()*300
   star.scale.set(scale , scale ,scale )
   scene.add(star)
}
let tt = true 

const addGravityForce =   (  plant ) => {
    r2 = Math.sqrt( Math.pow((moon.position.x - plant.position.x) , 2 )  + Math.pow((moon.position.y - plant.position.y) , 2 ) ) 
    f = G * (plant.M * moonM) / (r2 * r2)
    a = f/moonM
    v +=a *dt 
    fx =  -  f * ((moon.position.x) / r2)
    fy = - f * (moon.position.y / r2)
    ax = fx /moonM
    ay = fy/moonM
    vx += ax * dt 
    vy += ay * dt 
    dx = vx *dt
    dy = vy *dt
    
    moon.position.x = moon.position.x + dx
    moon.position.y = moon.position.y + dy  
}
group.rotation.x = Math.PI / 2 
moon.rotation.x = Math.PI / 2

const clock = new Clock()
const tick = () =>
{
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime =  (elapsedTime - oldElapsedTime ) + 0.1
    oldElapsedTime  = elapsedTime 
    ///
    v0 = objectsToAdd.VL
    ///
   
 
    points.push( new THREE.Vector3( moon.position.x, moon.position.y, 0 ) );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, materialLine );

        // group.add(line)

        if (r2 <= 637.1 ){
            group.remove(line)
        }
         
    
    
    group.add(line)

    //////////
     moonM = objectsToAdd.moonM

    controls.update() 
 //   if ( objectsToAdd.try%2 == 0){

   addGravityForce( earth)
     //addGravityForce(plant)
    
//////////////////////

    vx2 =-v0* (moon.position.y / r2) * 9
    vy2 = v0*(moon.position.x / r2) * 9
  
    dx2 = vx2 * dt 
    dy2 = vy2 * dt 
    
    moon.position.x = moon.position.x + dx2 
    moon.position.y = moon.position.y + dy2 

   if (r2 <= 637.1 *1.5 ){
        moon.scale.set(0,0,0)
    }

    // Rende
    earth.rotation.z =( elapsedTime / 24 ) * Math.PI *2
    

    // group.position.x =  Math.cos(arg1) * 50000 + 30000
    // group.position.z = Math.sin(arg1) * 50000 
    // arg1+= 0.001

/////////////////


if (moon.position.x == 0  ){
    if (moon.position.y > 0 )
    arg = Math.PI / 2
    if (moon.position.y < 0 )
    arg = - Math.PI / 2
    
}else if ( moon.position.y == 0) {
    if(moon.position.x > 0 )
    arg = 0 
    if ( moon.position.x < 0)
    arg = Math.PI 
}else
{
if (moon.position.x >  0 && moon .position.y > 0){
    arg = Math.atan((moon.position.y )/(moon.position.x  )) 
}
if (moon.position.x <  0 && moon .position.y > 0){
    arg = Math.atan((moon.position.y )/(-moon.position.x  ))
    arg = Math.PI - arg 
}
if (moon.position.x <  0 && moon .position.y < 0 ){
    arg = Math.atan((-moon.position.y )/(-moon.position.x  ))
    arg = Math.PI + arg 
}
if (moon.position.x >  0 && moon.position.y < 0){
    arg = Math.atan((-moon.position.y )/(moon.position.x  ))
    arg =2 * Math.PI - arg 
}
}
// r2 = Math.sqrt( Math.pow((moon.position.x - earth.position.x) , 2 )  + Math.pow((moon.position.y - earth.position.y) , 2 ) ) 

    if ( r2 <= 67500 ){
    vr = v + objectsToAdd.VL
    fr = 0.5 * k * s * objectsToAdd.p * vr * vr / 100000000

    ar = fr / moonM
    vr = ar * dt 
    vrx =  vr * Math.cos(arg)
    vry = - vr * Math.sin(arg)
    
    moon.position.x += vrx*dt  
    moon.position.y += vry *dt 
        // moon.rotation.y = arg
    }
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()
