import BreadcrumpTemplate from './Templates/Breadcrump.html';
import BreadcrumpItemTemplate from './Templates/BreadcrumpItem.html';

export default class Breadcrump extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);


        this.options = options;

        this.target = this.toDOM(BreadcrumpTemplate({
            scope: {}
        }));

        this.parent.target.append(this.target);

    }

    set(data) {
        this.data = data;
        this.draw();
    }

    flush() {
        if (this.items.length > 0)
            this.items.forEach(i => i.remove());

        this.items = [];
    }

    draw() {
        this.flush();
        let uriHash = '';

        // create the home button
        this.createItem('Home', uriHash);

        // create the folder buttons
        if (this.data.pathCrumped[0] !== '') {
            this.data.pathCrumped.forEach((p, i) => {
                i === 0 ? uriHash = `${p}` : null;
                i !== 0 ? uriHash = `${uriHash}/${p}` : null;
                this.createItem(p, uriHash);
            });
        }

    }

    createItem(pathStep, uriHash) {
        const item = this.toDOM(BreadcrumpItemTemplate({
            scope: {name: pathStep}
        }));
        item.uriHash = uriHash;
        item.onclick = e => this.select(e);
        this.target.append(item);
        this.items.push(item);
    }

    select(e) {
        e.preventDefault();
        console.log('>>>', e.target.uriHash);
        this.parent.setLocationHash(encodeURI(e.target.uriHash))
    }
}
