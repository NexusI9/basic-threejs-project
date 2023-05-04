import LoadModel from './Loader.js';


export default class Pool{

    mesh;
    bones = {
        ovale:null,
        circle:null
    };

    tl = gsap.timeline({ defaults: { overwrite: true } });

    textureLoader = new THREE.TextureLoader();

    constructor({filename=null}){
        this.file = filename;
    }

    async load(){

        this.mesh = await LoadModel(this.file);
        
        //link bones
        this.mesh.traverse( item => {
            if( item.name.match('oval_pool') && item.type === 'Object3D'  ){ this.bones.ovale = item; }
            if( item.name.match('circle_pool') && item.type === 'Object3D'  ){ this.bones.circle = item; }
        });

        this.bones.ovale?.scale.set(0,0,0);
        this.bones.circle?.scale.set(0,0,0);

        return this.mesh;
    }

    pop({model='circle' }){

        if(model !== 'circle' && model !== 'ovale'){ return; }
        
        //scale down other bones
        let scale = 1;
        switch(model){
            case 'circle':
                this.tl.to(this.bones["ovale"].scale,{ x:0, y:0, z:0, duration:0.1,ease:'linear' });
            break;

            case 'ovale':
                this.tl.to(this.bones["circle"].scale,{ x:0, y:0, z:0, duration:0.1, ease:'linear' });
                scale = 0.6;
            break;
        }

        //scale up the right bone
        this.tl.to(this.bones[model].scale,{ x:scale, y:scale, z:scale, duration:1, ease:'elastic.out' });
    }

    setWallTextureTo({texture}){
         texture = this.textureLoader.load(texture);
         this.mesh.traverse( item => {
            if(item.material && item.material.name === 'wall'){
                item.material.map = texture;
                item.material.needsUpdate = true;
            }
         });
    }

    setLinerTextureTo({texture, ambientOcclusion=false}){

        this.mesh.traverse( item => {
           if(item.material){
            switch(item.material.name){
                case 'liner':
                    let linerTexture = this.textureLoader.load(texture);
                    /*if(ambientOcclusion){
                        item.material.aoMap = this.textureLoader.load('./assets/textures/ao.jpg');
                        item.material.aoMapIntensity=1.4;
                     } *///set 
                    item.material.map = linerTexture;
                break;

                case 'bottom':
                    let bottomTexture = this.textureLoader.load( texture.replace('/liner/','/bottom/') ); //manually set bottom texture
                    bottomTexture.wrapS = THREE.RepeatWrapping;
                    bottomTexture.wrapT  = THREE.RepeatWrapping;
                    item.material.map = bottomTexture;
                break;
            }
           }
        });
    }


    setSupportTextureTo({texture, metalness}){
        
        this.mesh.traverse( item => {
           if(item.material && item.material.name === 'border' ){
                const supportTexture =  this.textureLoader.load('./assets/textures/border/'+texture+'.jpg');
                item.material.map = supportTexture;
                item.material.map.repeat.set(1,1,1);
                item.material.metalness = metalness || 0.0;
           }
        });

    }

}