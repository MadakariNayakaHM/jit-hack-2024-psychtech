const opcua = require('node-opcua');

const serverName = "RealTimeEnv";
const endpoint = "opc.tcp://192.168.192.70:4840/freeopcua/RealTimeEnv/";
const dataNames = "distance,moist".split(',');

const server = new opcua.OPCUAServer({
    port: 4840,
    resourcePath: `/freeopcua/${serverName}/`,
    buildInfo: {
    productName: `${serverName}`,
    buildNumber: '1',
    buildDate: new Date(),
  },
});

server.on('getEndpoints', (request, callback) => {
    const endpoints = [
        {
        endpointUrl: `${endpoint}`,
        securityMode: opcua.MessageSecurityMode.None,
        securityPolicyUri: opcua.SecurityPolicy.None,
        userIdentityTokens: [],
        transportProfileUri: 'http://opcfoundation.org/UA-Profile/Transport/uatcp-uasc-uabinary',
    },
  ];

callback(null, endpoints);
});

server.initialize(() => {
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    // Create variables for each dataName
    const variables = dataNames.map((dataName) => {
        const variableNode = namespace.addVariable({
            componentOf: server.engine.addressSpace.rootFolder,
            browseName: dataName,
            dataType: 'Double',
            value: new opcua.Variant({ dataType: opcua.DataType.Double, value: 0.0 }),
        });

        return variableNode;
    });

    // Function to update variable values with random data
 
         //   variable.setValueFromSource(new opcua.Variant({ dataType: opcua.DataType.Double, value: 0}));
            //console.log(variable)
       
    // function updateVariable() {
    //     variables.forEach((variable) => {
            
    //         console.log(variable.value);
    //     });
    // }

    // Update variable values every second
   // setInterval(updateVariableValues, 1000);
    //setInterval(updateVariable, 1000);

    server.start((err) => {
        if (err) {
            console.log("Error while starting server", err);
        } else {
            console.log('OPC-UA server is up and running on port', server.endpoints[0].port);
        }
    });
});

process.on('SIGINT', () => {
    server.shutdown(() => {
        console.log('Server shutdown completed.');
        process.exit(0);
    });
});