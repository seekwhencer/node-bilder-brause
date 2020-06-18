import ImageViewerTemplate from './Templates/ImageViewer.html';


export default class ImageViewer extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);


        this.options = options;

        this.target = this.toDOM(ImageViewerTemplate({
            scope: {}
        }));

        this.parent.target.prepend(this.target);

    }

    set(data) {
        this.data = data;
        this.draw();
    }

    draw(){
        //...
    }

}
