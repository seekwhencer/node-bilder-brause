import WebSocket from 'ws';

export default class WebsocketServer extends NBBMODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.options = this.app.config.generator;
        this.label = 'WEBSOCKET SERVER';
        LOG(this.label, 'INIT');

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

        this.engine.on('connection', ws => {
            // here comes something from the server
            ws.on('message', message => this.onMessage(message));

            ws.on('close', () => {
                LOG(this.label, 'CLIENT DISCONNECTED');
            });

            // welcome message to the client
            this.send(ws, {
                message: 'hi',
                data: {
                    pow: 'peng'
                }
            });
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

    send(clientConnection, data) {
        const message = JSON.stringify(data);
        clientConnection.send(message);
    }


    // awaits a json object:
    // {
    //   "message": "text",
    //   "data": {}
    // }
    onMessage(message) {
        const data = JSON.parse(message);
        //LOG(this.label, 'GOT MESSAGE FROM CLIENT', data);
        //LOG(this.label, 'THE QUEUE', this.parent.queue);

        if (data.message === 'job-complete') {
            //LOG(this.label, '>>> JOB COMPLETE IN WEBSOCKET SERVER', data);
            //const image = this.parent.queue.filter(q => q.hash === data.data.hash)[0];
            //image.emit('complete'); // await from media server route controller
        }
    }
}
