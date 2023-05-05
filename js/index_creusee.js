
import Scene from './Scene.js';
import Pool from './Pool.js';
import TEXTURES from './Textures.js';
import generateTexturesButton from './ButtonGenerator.js';

function _main_(){

    //generate Swimming Pool
    const pool = new Pool({filename:'creusee'});
    let scene;

    pool.load().then( object => {

        scene = new Scene({
            container: "#poolContainer",
            objects:[object],
        });

        //init
        scene.init();
        scene.setHDR({path:'./assets/HDR.hdr', intensity:0.0});

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.castShadow = true;
        directionalLight.position.set(0.2, 0.9, 0);
        scene.scene.add( directionalLight );

        //set new camera position
        scene.camera.position.z = 4; 
        scene.camera.position.y = 1; 
        scene.camera.fov=70;
        scene.camera.updateProjectionMatrix();

    });


    //generate Liner Textures
    generateTexturesButton({ 
        textures: TEXTURES.liner.filter(n => n.model === 'creusée'), 
        path:'./assets/textures/liner/',
        parent:'#choice > section[data-choice="liner"] > div',
        onButtonClick: (e) => {
            pool?.setLinerTextureTo({texture: e.texture.path, ambientOcclusion:true});
        }
    });

}



window.onload = _main_;
