import WebSocket from 'ws';

export default class WebsocketServer extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.options = this.app.config.generator.server;
        this.label = 'WEBSOCKET SERVER';
        LOG(this.label, 'INIT');

        this.clients = [];
        this.clientsIndex = 0;

        this.engine = new WebSocket.Server({
            port: this.options.port,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    // See zlib defaults.
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                // Other options settable:
                clientNoContextTakeover: true, // Defaults to negotiated value.
                serverNoContextTakeover: true, // Defaults to negotiated value.
                serverMaxWindowBits: 10, // Defaults to negotiated value.
                // Below options specified as default values.
                concurrencyLimit: 10, // Limits zlib concurrency for perf.
                threshold: 1024 // Size (in bytes) below which messages
                // should not be compressed.
            }
        });

        this.engine.on('connection', client => {
            // its a secret, but it works perfectly
            client.id = client._socket._handle.fd;
            client.busy = false;

            // do things on a message
            client.on('message', message => this.onMessage(client, message));

            // do things when this one connection was closed
            client.on('close', () => {
                LOG(this.label, 'CLIENT DISCONNECTED');
                this.removeClient(client);
            });

            // add the client
            this.clients.push(client);

            // send a welcome message to the client
            this.send(client, {
                message: 'hi',
                data: {
                    pow: 'peng'
                }
            });
            LOG(this.label, 'CLIENT CONNECTED:', client.id);
        });
    }

    sendAll(data) {
        const message = JSON.stringify(data);
        this.engine.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    send(client, data) {
        const message = JSON.stringify(data);
        client.send(message);
    }

    findFreeClient() {
        return new Promise(resolve => {
            setTimeout(() => resolve(), 50); // i hope it's done before recursion limit reached, @TODO - break it before.
        }).then(() => {
            return new Promise((resolve, reject) => {
                this.clientsIndex === this.clients.length ? this.clientsIndex = 0 : null;
                LOG(this.label, 'FIND CLIENTS INDEX', this.clientsIndex);

                const client = this.clients[this.clientsIndex];
                if (client) {
                    if (client.busy === false) {
                        this.clientsIndex++;
                        resolve(client);
                    } else {
                        this.clientsIndex++;
                        return this.findFreeClient();
                    }
                } else {
                    this.clientsIndex++;
                    return this.findFreeClient();
                }
            });
        });
    }

    rotate(message) {
        this
            .findFreeClient()
            .then(client => {
                LOG(this.label, '>>> FOUND NEXT FREE CLIENT', client.id);
                this.send(client, message);
            })
            .catch(error => {
                LOG(this.label, '>>> TIMEOUT FINDING FREE CLIENT', error);
            });
    }


    // awaits a json object:
    // {
    //   "message": "text",
    //   "data": {}
    // }
    onMessage(client, message) {
        const data = JSON.parse(message);
        //LOG(this.label, 'GOT MESSAGE FROM CLIENT', client.id);
        //LOG(this.label, 'THE QUEUE', this.parent.queue);

        if (data.message === 'job-complete') {
            //LOG(this.label, '>>> JOB COMPLETE IN WEBSOCKET SERVER', data);
            //const image = this.parent.queue.filter(q => q.hash === data.data.hash)[0];
            //image.emit('complete'); // await from media server route controller
        }

        if (data.message === 'ok') {
            LOG(this.label, 'CLIENT:', client.id, 'IS FREE');
            client.busy = false;
        }
        if (data.message === 'busy') {
            LOG(this.label, 'CLIENT:', client.id, 'IS BUSY');
            client.busy = true;
        }
    }

    removeClient(client) {
        this.clients = this.clients.filter(c => c.id !== client.id);
    }
}
