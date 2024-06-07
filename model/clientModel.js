const mongoose =require('mongoose');
const clientSchema=mongoose.Schema(
    {
        clientName:{type:String,required:true,unique:true},
        serverEndPoint:{type:String,required:true},
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required: [true, 'server should belongs to a user']
        },
        accessId:{
            type:String,
            minlength: 8,
            required:true,
            unique:true
        },
        data:{type:[{
            dataName:String,
            dataValue:String,
            timeStamp:String
           
        }]},
        status:{type:String,
            default:"stopped"}
    

    }
)

clientSchema.pre(/^find/, function(next) {
    
  
    this.populate({
      path: 'userId',
      select: 'name photo phone email'
    });
    next();
  });

  const Client= mongoose.model("Client", clientSchema);

module.exports = Client;