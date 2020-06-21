import PageTitleTemplate from './Templates/PageTitle.html';

export default class PageTitle extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.options = options;

        this.target = this.toDOM(PageTitleTemplate({
            scope: {}
        }));

        this.parent.target.append(this.target);

    }

    set(value) {
        value ? this.target.innerHTML = value : '';
    }
}
