
const Server = require('./../models/serverModel');
const serverData=require('./../models/serverDataModel')
const opcua = require('node-opcua');


 
exports.createNewServer = async (req, res, next) => {
  try {
    const serverName = req.body.serverName;
    const endpoint = req.body.serverEndPoint;
    const dataNames = req.body.dataName.split(',');
    const accessId = req.body.accessId;
    const userId = req.body.userId;

    const newServer = await Server.create({
      serverName: serverName,
      serverEndPoint: endpoint,
      userId: userId,
      accessId: accessId,
    });

    const serverId = newServer._id;
    const data = await serverData.create({ serverId: serverId, data: [{}] });

    dataNames.forEach((dataName) => {
      const variableNodeData = {
        dataName: dataName,
        dataSource: [],
      };

      data.data[0].variableNode.push(variableNodeData);
    });

    
    await data.save();

   
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

    server.initialize(async () => {
      const addressSpace = server.engine.addressSpace;
      const namespace = addressSpace.getOwnNamespace();

      
      dataNames.forEach((dataName) => {
        const variableNode = namespace.addVariable({
          componentOf: server.engine.addressSpace.rootFolder,
          browseName: dataName,
          dataType: 'Double',
          value: new opcua.Variant({ dataType: opcua.DataType.Double, value: 0.0 }),
        });
      });

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
  } catch (e) {
    console.log("Error at serverCreation", e);
  }
};

exports.registerServer = async (req, res, next) => {
  try{
    const serverName = req.body.serverName;
    const endpoint = req.body.serverEndPoint;
   
    const accessId = req.body.accessId;
    const userId = req.body.userId;
  
    const newServer = await Server.create({
      serverName: serverName,
      serverEndPoint: endpoint,
      userId: userId,
      accessId: accessId,
    });
    res.status(200).json({newServer,message:"successfully created"})
  }catch(e)
  {
    console.log("error at server registration", e)
  }
};
// exports.startServer=async(req,res,next)=>
// {
//   try{


// // ---------------------------------------------------------------------------------------------------------------------------------
// const serverName = req.body.serverName;
  
// const accessId = req.body.accessId;
 

//   const ser = await Server.findOne({serverName:serverName})
//   const endpoint= ser.serverEndPoint
//   const dataName= ser.data[0].dataName



//   if(ser.accessId==accessId)
//   {
//     const endpointUrl = endpoint;

//     (async () => {
//       try {
//         const options = {
//           endpointMustExist: false,
//         };
    
//         const client = opcua.OPCUAClient.create(options);
    
//         // Step 1: Connect to the server
//         try {
//             console.log('Before connecting to server...');
//             await client.connect(endpointUrl);
//             console.log('After connecting to server...');
//           } catch (error) {
//             console.error('Error connecting to server:', error.message);
//           }
        
    
//         // Step 2: Create a session
//         console.log('Creating a session...');
//         const session = await client.createSession();
//         console.log('Session created');
    
//         // Step 3: Browse the server's address space (here we start from the RootFolder)
//         console.log('Browsing the address space...');
//         const browseResult = await session.browse('RootFolder');
//         console.log('Browsing completed. Results:');
          




//         const dataToUpdate = [];
//         // Step 4: Iterate through the references and read data from variables
//         for (const reference of browseResult.references) {
//             const nodeId = reference.nodeId.toString();
//             const browseName = reference.browseName.toString();
          
//             console.log(`Node BrowseName: ${browseName}, NodeId: ${nodeId}`);
          
//             const dataValue = await session.readVariableValue(nodeId);
//             console.log(`  Value: ${dataValue.value.value}, DataType: ${dataValue.value.dataType}`);

//             obj={
//               dataName:dataName,
//               dataValue:dataValue.value.value,
//               timeStamp: new Date()
//             }
//             dataToUpdate.push(obj);
//             await Server.findByIdAndUpdate(
//               ser._id,
//               { $push: { data: { $each: dataToUpdate } } },
//               { new: true, runValidators: true }
//             );
    


//           }
          
    
//         // Step 5: Close the session and disconnect from the server
//         console.log('Closing the session...');
//         await session.close();
//         console.log('Session closed');
    
//         console.log('Disconnecting from the server...');
//         await client.disconnect();
//         console.log('Client disconnected from server');
//       } catch (error) {
//         console.error('Error:', error.message);
//       }
//     })();
//   }
//   else{
//     res.status(400).json({message:"failed"})
//   }
// // ----------------------------------------------------------------------------------------------------------------------------------



//   }
//   catch(e)
//   {

//   }
// }

exports.startServer = async (req, res, next) => {
  try {
    // ---------------------------------------------------------------------------------------------------------------------------------
    const serverName = req.body.serverName;
    const accessId = req.body.accessId;

    console.log(serverName, accessId);
    const ser = await Server.findOne({ serverName: serverName });
    const endpoint = ser.serverEndPoint;
    console.log(accessId, ser.accessId);

    if (`${ser.accessId}` === `${accessId}`) {
      const serversData = await serverData.findOne({ serverId: ser._id }).exec();

      if (!serversData) {
        console.log('No document found with the specified serverId.');
        return res.status(404).json({ message: "No document found with the specified serverId." });
      }

      const dataNames = serversData.data[0].variableNode.map((node) => node.dataName);
      const endpointUrl = endpoint;

      const options = {
        endpointMustExist: false,
      };

      const client = opcua.OPCUAClient.create(options);

      // Step 1: Connect to the server
      await client.connect(endpointUrl);
      console.log('Connected to the server.');

      // Create a session
      const session = await client.createSession();
      console.log('Session created.');

      // Loop to send data 30 times
      for (let i = 0; i < 5; i++) {
        // Step 3: Browse the server's address space (here we start from the RootFolder)
        const browseResult = await session.browse('RootFolder');
        console.log(browseResult)
        console.log('Browsing completed. Results:');
        console.log()
        // Iterate through the references and read data from variables
        for (const reference of browseResult.references) {
          const nodeId = reference.nodeId.toString();
          const browseName = reference.browseName.toString();
          const browseNameWithoutPrefix = browseName.replace(/^\d+:/, '');

          if (dataNames.includes(browseNameWithoutPrefix)) {
            console.log('Matched DataName:', browseName);
            const dataValue = await session.readVariableValue(nodeId);

            const data = {
              dataName: browseNameWithoutPrefix,
              dataValue: dataValue.value.value,
              timeStamp: new Date(),
            };

            const variableNode = serversData.data[0].variableNode.find((node) => node.dataName === browseNameWithoutPrefix);
            if (variableNode) {
              variableNode.dataSource.push(data);
            }
          }
        }
        console.log(`Data sent, iteration ${i + 1}`);
        await serversData.save();
      }

      // Close the session and disconnect from the server
      await session.close();
      console.log('Session closed.');
      await client.disconnect();
      console.log('Client disconnected from the server.');

      return res.status(200).json({ message: "Data sent successfully 30 times." });
    } else {
      return res.status(401).json({ message: "Request failed due to unauthorized access" });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};



exports.stopServer=async(req,res,next)=>
{
  try{

  }catch(e)
  {

  }
}

