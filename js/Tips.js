export default class Tips{


    constructor({container}){
        this.container = document.querySelector(container);
    }

    onTransitionEnd(e){

        if( ! this.popup.container.classList.contains('appear') && this.nextDesc && this.nextTitle ){
            this.show({title:this.nextTitle, description: this.nextDesc});
        }
    }

    close(){
        this.nextDesc = null;
        this.nextTitle= null;
        this.popup.container.classList.remove('appear');
    }

    init(){

        const container = document.createElement('div');
        container.setAttribute('id','popupTips');

        const title = document.createElement('h3');
        const desc = document.createElement('p');
        const close = document.createElement('img');
        close.setAttribute('src', './assets/close.svg');
        close.addEventListener('click', this.close.bind(this));

        container.appendChild(close);
        container.appendChild(title);
        container.appendChild(desc);

        this.container.appendChild(container);
        this.container.addEventListener('transitionend', this.onTransitionEnd.bind(this) );
        

        this.popup = {
            container: container,
            title: title, 
            desc: desc
        };

    
    }

    fill({title, description}){
        //fill up popup
        this.popup.title.innerHTML = title;
        this.popup.desc.innerHTML = description;
        this.popup.container.classList.add("appear");
    }

    show({title, description}){

        if(!this.popup){return;}

        if(this.popup.container.classList.contains("appear") ){
            this.popup.container.classList.remove("appear");
            this.nextTitle = title;
            this.nextDesc = description;
        }else{
            this.fill({title, description});
        }
   
        

    }
}