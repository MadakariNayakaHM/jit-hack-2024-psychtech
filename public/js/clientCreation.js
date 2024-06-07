
const serverCreation = async (clientName, serverEndPoint, accessId, userId ) => {
    try {
        console.log(clientName, serverEndPoint, accessId, userId);
        const res = await axios({

            method: 'POST',
            url: '/api/v1/client/clientCreation',
            data: {
                clientName, serverEndPoint, accessId, userId
            }
        })

        window.alert("client Creation successfull")
    } catch (err) {
         console.log(err);
        window.alert("client Creation failed")
    }
}
document.querySelector('form.rounded.bg-white.shadow.p-5').addEventListener('submit', e => {
    e.preventDefault();

    const clientName = document.getElementById('serverName').value;
    const serverEndPoint = document.getElementById('serverEndPoint').value;
    const accessId = document.getElementById('accessId').value;
    const userId = document.getElementById('userId').value;
   
    //console.log(req);
    serverCreation(clientName, serverEndPoint, accessId, userId)

});



