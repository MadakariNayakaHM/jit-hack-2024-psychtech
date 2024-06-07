
const startServer= async (serverName, accessId ) => {
    try {
        console.log(serverName,  accessId);
        const res = await axios({

            method: 'POST',
            url: '/api/v1/server/startServer',
            data: {
                serverName,  accessId
            }
        })
       console.log(res) 
        window.alert("server started successfull")
    } catch (err) {
         console.log(err);
        window.alert("server stopped  after an intrupt")
    }
}
document.querySelector('form.rounded.bg-white.shadow.p-5').addEventListener('submit', e => {
    e.preventDefault();

    const serverName = document.getElementById('serverName').value;

    const accessId = document.getElementById('accessId').value;
    
   
    //console.log(req);
    startServer(serverName, accessId)

});



