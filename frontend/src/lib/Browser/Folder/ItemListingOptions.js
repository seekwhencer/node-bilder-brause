import ItemListingOptionsTemplate from './Templates/ItemListingOptions.html';

export default class ItemListingOptions extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ITEM LISTING OPTIONS';
        this.options = options;
        this.folder = this.parent.parent;
        this.browser = this.folder.parent;

        this.isLoading = false;

        this.target = this.folder.target.querySelector('[data-files-options]');
        this.target.innerHTML = ItemListingOptionsTemplate();
        this.registerButtons();

        this.on('loading', () => {
            this.isLoading = true;
            this.buttons.latest.innerText = 'LOADING ...';
            this.buttons.latest.classList.add('loading');
        });

        this.on('data', () => {
            this.isLoading = false;
            this.buttons.latest.innerText = 'LATEST';
            this.buttons.latest.classList.remove('loading');
        });
    }

    //
    registerButtons() {
        this.buttons = {
            picking: this.target.querySelector('[data-picking-mode]'),
            selection: {
                all: this.target.querySelector('[data-selection-all]'),
                none: this.target.querySelector('[data-selection-none]'),
                invert: this.target.querySelector('[data-selection-invert]')
            },
            latest: this.target.querySelector('[data-load-latest]')
        };

        //picking mode button
        this.buttons.picking.onclick = e => {

        };

        //select all button
        this.buttons.selection.all.onclick = e => {

        };

        //select none button
        this.buttons.selection.none.onclick = e => {

        };

        //invert selection button
        this.buttons.selection.invert.onclick = e => {

        };

        //latest files mode button
        this.buttons.latest.onclick = e => this.get();
    }

    get() {
        if (this.isLoading)
            return;

        this.folder.getLatest();
    }
}


