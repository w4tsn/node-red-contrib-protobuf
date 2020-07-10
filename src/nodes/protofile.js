protobufjs = require('protobufjs');
fs = require('fs');

module.exports = function (RED) {
    function ProtoFileNode (config) {
        RED.nodes.createNode(this, config);
        this.protopath = config.protopath;
        this.watchFile = config.watchFile;
        protoFileNode = this;
        protoFileNode.load = function () {
            try {
                protoFileNode.protoTypes = protobufjs.loadSync(protoFileNode.protopath);
            }
            catch (error) {
                protoFileNode.error('Proto file could not be loaded. ' + error);
            }
        };
        protoFileNode.watchFile = function () {
            try {
                protoFileNode.protoFileWatcher = fs.watch(protoFileNode.protopath, (eventType) => {
                    if (eventType === 'change') {
                        protoFileNode.load();
                        protoFileNode.log('Protobuf file changed on disk. Reloaded.');
                    }
                });
                protoFileNode.on('close', () => {
                    protoFileNode.protoFileWatcher.close();
                });
            }
            catch (error) {
                protoFileNode.error('Error when trying to watch the file on disk: ' + error);
            }
        };
        protoFileNode.load();
        if (protoFileNode.protoTypes !== undefined && protoFileNode.watchFile) protoFileNode.watchFile();
    }
    RED.nodes.registerType('protobuf-file', ProtoFileNode);
};
