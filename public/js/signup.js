const signup = async (name, email, phone, password, confirmPassword) => {
    try {
        console.log(name, email, phone, password, confirmPassword);
        const res = await axios({

            method: 'POST',
            url: '/api/v1/user/signup',
            data: {
                name, email, phone, password, confirmPassword
            }
        })

        if (res.data.status === "success") {
            window.alert("login successfull")
            window.setTimeout(() => {
                location.assign('/home')
            }, 1500)
        }
    } catch (err) {
        // console.log(res);
        window.alert("signup failed")
    }
}

const logout = async () => {
    try {

        const res = await axios({
            method: "GET",
            url: "/api/v1/user/logout",

        });
        console.log(res);
        if (res.data.status === "success") {
            window.alert("logedout successfully")
            window.setTimeout(() => {
                location.assign('/home')
            }, 100)
        }
    } catch (err) {
        console.log(err);
        window.alert("error logging out")
    }
}

const logoutButton = document.querySelector('.logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', e => {
        e.preventDefault();
        logout();
    });
}

document.querySelector('form.rounded.bg-white.shadow.p-5').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    //console.log(req);
    signup(name, email, phone, password, confirmPassword, location)

});


