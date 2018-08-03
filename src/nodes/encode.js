module.exports = function (RED) {
    function ProtobufEncodeNode (config) {
        RED.nodes.createNode(this, config);
        // Retrieve the config node
        this.protofile = RED.nodes.getNode(config.protofile);
        this.protoType = config.protoType;
        var node = this;
        node.on('input', function (msg) {
            let messageType;
            try {
                messageType = node.protofile.prototypes.lookupType(node.protoType);
            }
            catch (error) {
                console.log(error);
                node.error(`
                Problem while looking up the message type. 
                ${error}
                > Protofile object:
                ${node.protofile.toString()}
                > Prototypes content:
                ${node.protofile.prototypes}
                > With configured protoType:
                ${node.protoType}`);
            }
            // check if msg.payload is a valid message under respective
            // selected protobuf message type
            let result = messageType.verify(msg.payload);
            if (result) {
                return node.error('Message is not valid under selected message type. ' + result);
            }
            // create a protobuf message and convert it into a buffer
            msg.payload = messageType.encode(messageType.create(msg.payload)).finish();
            msg.protobufType = node.protoType;
            node.send(msg);
        });
    }
    RED.nodes.registerType('encode', ProtobufEncodeNode);
};
