protobufjs = require('protobufjs');

module.exports = function (RED) {
    function ProtobufDecodeNode (config) {
        RED.nodes.createNode(this, config);
        // Retrieve the config node
        this.protofile = RED.nodes.getNode(config.protofile);
        this.protoType = config.protoType;
        var node = this;

        let resolveMessageType = function (msg) {
            if (!msg.protobufType) {
                if (!node.protoType) return node.error('No protobuf type supplied!');
                msg.protobufType = node.protoType;
            }
            let messageType;
            try {
                messageType = node.protofile.prototypes.lookupType(msg.protobufType);
            }
            catch (error) {
                node.error(`
                Problem while looking up the message type.
                ${error}
                > Protofile object:
                ${node.protofile}
                > Prototypes content:
                ${node.protofile.prototypes}
                > With configured protoType:
                ${msg.protobufType}`);
            }
            // check if msg.payload is a valid message under respective
            // selected protobuf message type
            let result = messageType.verify(msg.payload);
            if (result) {
                node.error('Message is not valid under selected message type. ' + result);
            }
            return messageType;
        };

        node.on('input', function (msg) {
            let messageType = resolveMessageType(msg);
            if (!messageType) return;
            let message;
            try {
                message = messageType.decode(msg.payload);
            }
            catch (exception) {
                if (exception instanceof protobufjs.util.ProtocolError) {
                    node.warn('Received message contains empty fields. Uncomplete message will be forwarded.');
                    msg.payload = e.instance;
                    node.send(msg);
                }
                else {
                    node.error('Wire format is invalid.');
                }
            }
            let decodeoptions = {
                longs: String,
                enums: String,
                bytes: String,
                defaults: false, // includes default values, otherwise not transmitted values will be assigned their default value!
            };
            msg.payload = messageType.toObject(message, decodeoptions);
            node.send(msg);
        });
    }
    RED.nodes.registerType('decode', ProtobufDecodeNode);
};
