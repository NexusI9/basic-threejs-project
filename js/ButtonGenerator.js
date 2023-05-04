export default function generateTexturesButton({textures=[], path='',parent='body', onButtonClick=()=>0}){

    parent = document.querySelector(parent);

    textures.forEach( tex => {

        const fullpath = path+tex.name+'.jpg';
        tex.path = fullpath;

        const button = document.createElement('button');
        button.setAttribute('class','textureButton');
        button.addEventListener('click', (e) => onButtonClick({event:e,texture:tex}) );

        const imgTexture = document.createElement('img');
        imgTexture.setAttribute('src', fullpath);
        button.appendChild(imgTexture);

        parent.appendChild(button);
    } );


}