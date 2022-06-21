/**
Template de la scene THREE.JS
Nassim El Khantour 2022

THREE docu: https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
GTLFLoader docu: https://threejs.org/docs/index.html?q=gltf#examples/en/loaders/GLTFLoader
OrbitControls docu: https://threejs.org/docs/index.html?q=orbit#examples/en/controls/OrbitControls

*/

import ViewScope from './ViewScope.js';

const BACKGROUND = 0x000000;             //background du Canvas
const INIT_WIDTH =  window.innerWidth;  //width du canvas
const INIT_HEIGHT = window.innerHeight; //height du canvas

export default class Scene{

  constructor({container='body', width=window.innerWidth, height=window.innerHeight, backgroundColor=BACKGROUND, objects, cameraPosX=0, cameraZoom=3.8, orbitControls=false}){

    this.renderer;
    this.scene;
    this.camera;
    this.loader = new THREE.GLTFLoader();
    this.width = width;
    this.height = height;
    this.container = container;
    this.backgroundColor = backgroundColor;
    this.objects = objects;
    this.cameraPosX = cameraPosX;
    this.cameraZoom = cameraZoom;
    this.orbitControls = orbitControls;
    this.play = true;
  }

  spawn(){

      //check si le canvas est present dans le DOM
      this.container = document.querySelectorAll(this.container)[0];
      if(!this.container){
        console.warn("Canvas element not found in DOM, check CanvasId parameter");
        return null;
      }

      //initialise la scene, le render et les events listeners
      this._init_();
      this._render_();
  }

  onResize(){

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth,window.innerHeight);
  }

  _init_(){

    //-------Setup le Renderer-------
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( 0x000000, 0 );
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    this.container.appendChild(this.renderer.domElement);    //append le render dans le canvas

    //-------Setup de la scene-------
    this.scene = new THREE.Scene();
    this.scene.background = null;

    //-------Setup de la camera-------
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.focalLength = 205;
    this.camera.position.z = 3.8;
    this.camera.position.y = 0.3;
    this.camera.position.x = this.cameraPosX;
    this.camera.rotation.x = -Math.PI/50;
    this.scene.add(this.camera); //ajout de la camera

    if(this.orbitControls){
      this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
      this.orbitControls.enableDamping=true;
      this.orbitControls.enableZoom=false;
      this.orbitControls.update();
    }



    //viewscope setup to render or not depending if the scene is in the viewport

    (new ViewScope({
      container:this.container,
      onViewEnter: () => {
        this.play = true;
        this._render_();
      },
      onViewExit: () => this.play = false
    })).init();

    window.addEventListener('resize', this.onResize.bind(this), false );

  }

  setHDR(path){

    const hdrEquirect = new THREE.RGBELoader().load(path, () => {  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; });

    this.objects?.forEach( obj => {
      obj.traverse( item => item.material ? item.material.envMap = hdrEquirect : 0);
      this.scene.add(obj);
    });

  }
  _render_(){

    if(!this.play){ return; }
    requestAnimationFrame( this._render_.bind(this) );
    if(this.orbitControls){
      this.orbitControls.update();
    }
    this.renderer.render( this.scene, this.camera );
  }


}
