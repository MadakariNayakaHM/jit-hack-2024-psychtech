
const serverCreation = async (serverName, serverEndPoint, accessId, userId,dataName  ) => {
    try {
        console.log(serverName, serverEndPoint, accessId, userId,dataName);
        const res = await axios({

            method: 'POST',
            url: '/api/v1/server/serverCreation',
            data: {
                serverName, serverEndPoint, accessId, userId,dataName
            }
        })

        window.alert("server Creation successfull")
    } catch (err) {
         console.log(err);
        window.alert("server Creation failed")
    }
}
document.querySelector('form.rounded.bg-white.shadow.p-5').addEventListener('submit', e => {
    e.preventDefault();

    const serverName = document.getElementById('serverName').value;
    const serverEndPoint = document.getElementById('serverEndPoint').value;
    const accessId = document.getElementById('accessId').value;
    const userId = document.getElementById('userId').value;
    const dataName = document.getElementById('dataName').value;
    //console.log(req);
    serverCreation(serverName, serverEndPoint, accessId, userId,dataName)

});



