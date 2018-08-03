protobufjs = require('protobufjs');

module.exports = function (RED) {
    function ProtoFileNode (config) {
        RED.nodes.createNode(this, config);
        this.protopath = config.protopath;
        try {
            this.prototypes = protobufjs.loadSync(config.protopath);
        }
        catch (error) {
            this.error('Proto file could not be loaded. ' + error);
        }
    }
    RED.nodes.registerType('protobuf-file', ProtoFileNode);
};
