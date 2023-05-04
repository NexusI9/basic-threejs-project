import Scene from './Scene.js';
import Pool from './Pool.js';
import Tips from './Tips.js';
import TEXTURES from './Textures.js';
import generateTexturesButton from './ButtonGenerator.js';

function _main_(){

    //generate Swimming Pool
    const pool = new Pool();
    let scene;

    pool.load().then( object => {

        scene = new Scene({
            container: "#poolContainer",
            objects:[object],
            orbitControls:true
        });

        //init
        scene.init();
        scene.setHDR({path:'./assets/HDR.hdr', intensity:0.3});

        setTimeout( () => pool?.pop({model:'circle'}), 500);

    });

    //generate tips popup
    const tips = new Tips({container: "#builder"});
    tips.init();

    //generate Wall Textures
    generateTexturesButton({ 
        textures: TEXTURES.wall, 
        path:'./assets/textures/wall/',
        parent:'#choice > section[data-choice="wall"] > div',
        onButtonClick: (e) => pool?.setWallTextureTo({texture: e.texture.path})
    });

    //generate Liner Textures
    generateTexturesButton({ 
        textures: TEXTURES.liner, 
        path:'./assets/textures/liner/',
        parent:'#choice > section[data-choice="liner"] > div',
        onButtonClick: (e) => pool?.setLinerTextureTo({texture: e.texture.path}) 
    });

    //generate Support Textures
    generateTexturesButton({ 
        textures: TEXTURES.support, 
        path:'./assets/textures/border/',
        parent:'#choice > section[data-choice="support"] > div',
        onButtonClick: (e) => pool?.setSupportTextureTo({texture: e.texture.name})
    });


    //set radio button event listener();
    document.querySelectorAll('#choice > section[data-choice="shape"] input[type="radio"]').forEach( item => {
        item.onclick = () => pool?.pop({model:item.value});
    });


}



window.onload = _main_;
