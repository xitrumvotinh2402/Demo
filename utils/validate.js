const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

const validatePhone = (phone) => {
    var re = /^0[0-9]{9}$/;
    return re.test(phone)
}
module.exports = {
    validateEmail, validatePhone
}