const mongoose =require('mongoose');
const serverSchema=mongoose.Schema(
    {
        serverName:{type:String,required:true,unique:true},
        serverEndPoint:{type:String,required:true,unique:true},
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
        status:{type:String,
        default:"stopped"}

    }
)

serverSchema.pre(/^find/, function(next) {
    
  
    this.populate({
      path: 'userId',
      select: 'name photo phone email'
    });
    next();
  });

  const Server= mongoose.model("Server", serverSchema);

module.exports = Server;