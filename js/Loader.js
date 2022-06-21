const LOADER = new THREE.GLTFLoader();

export default function LoadModel(model){

  return new Promise( (resolve, reject) => {

    LOADER.load(`./assets/${model}.gltf`,
      (gltf) => resolve(gltf.scene),
      (xhr) => console.log(xhr),
      (error) => { console.log(error); reject(); }
    );

  });

}
