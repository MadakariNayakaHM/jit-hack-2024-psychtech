const predict = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/predict/prediction',
        })
        window.alert("done")
    } catch (err) {
        console.log(err);
        window.alert("error...!")
    }
}

const predictButton = document.querySelector('.predict');
if (predictButton) 
{  
    predictButton.addEventListener('click', e => {
        e.preventDefault();
        predict();
    });
}