const Client = require('./../models/clientModel')
const Server = require('./../models/serverModel');
const opcua = require('node-opcua');
exports.createClient=async(req,res,next)=>
{
  try{

    const clientName = req.body.clientName
    const serverEndPoint=req.body.serverEndPoint
    const userId = req.body.userId
    const accessId = req.body.accessId
    // console.log(clientName,serverEndPoint)
    // const ser= await Server.findOne({serverEndPoint:serverEndPoint})
    // console.log(server)
    const ser=await Server.findOne({serverEndPoint:serverEndPoint})
    
    console.log(ser)
    if(ser.accessId == accessId)
    {
    const newClient=  await Client.create({
        clientName:clientName,
        serverEndPoint:serverEndPoint,
        userId:userId,
        accessId:accessId
      })
res.status(200).json({message:"success",newClient})
const endpointUrl = serverEndPoint;


    (async () => {
      try {
        while(1)
        {
          const options = {
            endpointMustExist: false,
          };
      
          const client = opcua.OPCUAClient.create(options);
      
          // Step 1: Connect to the server
          try {
              console.log('Before connecting to server...');
              await client.connect(endpointUrl);
              console.log('After connecting to server...');
            } catch (error) {
              console.error('Error connecting to server:', error.message);
            }
          
      
          // Step 2: Create a session
          console.log('Creating a session...');
          const session = await client.createSession();
          console.log('Session created');
      
          // Step 3: Browse the server's address space (here we start from the RootFolder)
          console.log('Browsing the address space...');
          const browseResult = await session.browse('RootFolder');
          console.log('Browsing completed. Results:');
            
  
  
  
  
          const dataToUpdate = [];
          // Step 4: Iterate through the references and read data from variables
          for (const reference of browseResult.references) {
              const nodeId = reference.nodeId.toString();
              const browseName = reference.browseName.toString();
            
              console.log(`Node BrowseName: ${browseName}, NodeId: ${nodeId}`);
            
              const dataValue = await session.readVariableValue(nodeId);
              console.log(`  Value: ${dataValue.value.value}, DataType: ${dataValue.value.dataType}`);
  
              obj={
                dataName:browseName,
                dataValue:dataValue.value.value,
                timeStamp: new Date()
              }
              dataToUpdate.push(obj);
              await Client.findByIdAndUpdate(
                newClient._id,
                { $push: { data: { $each: dataToUpdate } } },
                { new: true, runValidators: true }
              );
      
  
  
            }
            
      
          // Step 5: Close the session and disconnect from the server
          console.log('Closing the session...');
          await session.close();
          console.log('Session closed');
      
          // console.log('Disconnecting from the server...');
           await client.disconnect();
          // console.log('Client disconnected from server');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    })();

    }

    else
    {
      res.status(400).json({message:"failed"})
    }
  }
  catch(e)
  {
console.log("error in client creation ",e)
  }
}

exports.startClient=async(req,res,next)=>
{
  try{

  }
  catch(e)
  {

  }
}

exports.stopClient=async(req,res,stop)=>
{
  try{

  }
  catch(e)
  {

  }
}