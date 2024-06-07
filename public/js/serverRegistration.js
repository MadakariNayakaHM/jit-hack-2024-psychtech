
const serverRegistration = async (serverName, serverEndPoint, accessId, userId  ) => {
    try {
        console.log(serverName, serverEndPoint, accessId, userId);
        const res = await axios({

            method: 'POST',
            url: '/api/v1/server/serverRegistration',
            data: {
                serverName, serverEndPoint, accessId, userId
            }
        })

        window.alert("server Registration successfull")
    } catch (err) {
         console.log(err);
        window.alert("server Registration failed")
    }
}
document.querySelector('form.rounded.bg-white.shadow.p-5').addEventListener('submit', e => {
    e.preventDefault();

    const serverName = document.getElementById('serverName').value;
    const serverEndPoint = document.getElementById('serverEndPoint').value;
    const accessId = document.getElementById('accessId').value;
    const userId = document.getElementById('userId').value;
   
    //console.log(req);
    serverRegistration(serverName, serverEndPoint, accessId, userId)

});



