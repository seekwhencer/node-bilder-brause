import ItemListingOptionsTemplate from './Templates/ItemListingOptions.html';

export default class ItemListingOptions extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ITEM LISTING OPTIONS';
        this.options = options;
        this.folder = this.parent.parent;

        this.target = this.folder.target.querySelector('[data-files-options]');

        //console.log('>>>>>', this.target);

        this.target.innerHTML = ItemListingOptionsTemplate();

    }
}
