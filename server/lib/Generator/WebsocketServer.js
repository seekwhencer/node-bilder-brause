import WebSocket from 'ws';

export default class WebsocketServer extends MODULECLASS {
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
            ws.on('message', message => this.onMessage(message));

            ws.on('close', () => {
                LOG(this.label, 'CLIENT DISCONNECTED');
            });

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

    onMessage(message) {
        const data = JSON.parse(message);
        LOG(this.label, 'GOT MESSAGE FROM CLIENT', data);

        if (data.message === 'job-complete') {
            LOG(this.label, '>>> JOB COMPLETE IN WEBSOCKET SERVER');
            const found = this.parent.queue.filter(q => q.hash === data.job.hash)[0];
            found.emit('complete');
        }
    }
}
