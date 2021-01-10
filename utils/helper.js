
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs')
const { isEmpty } = require("lodash")

exports.getHashedPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    return hash;
}

exports.comparePassword = (passHash, pass2) => {
    return bcrypt.compareSync(pass2, passHash)
}

exports.generateToken = ({ _id, userRole , userName}) => {
    accessToken = jwt.sign({ _id, userRole, userName }, process.env.SECRET_KEY);
    // console.log(accessToken);
    return accessToken
}

async function checkAndCreateDir(createPath) {
    !fs.existsSync(createPath) && fs.mkdirSync(createPath, { recursive: true })
}
async function moveFile(fileName, createPath) {
    const pathFile = `./tmp/${fileName}`;
    const newPath = `./${createPath + fileName}`;
    if (fs.existsSync(pathFile)) {
        const a = fs.rename(pathFile, newPath, (err) => {
            if (err) throw err
        })
        return createPath + fileName;
    }
    return false
}

exports.storageFile = async (fileName, createPath) => {
    // check not exist and create
    await checkAndCreateDir(`./${createPath}`);
    const result = await moveFile(fileName, createPath);
    return result
}

exports.cleanObject = (object) => {
    function replaceUndefinedOrNull(key, value) {
        if (value === null || value === undefined || value === "") {
            return undefined;
        }
        if (typeof value === "object") {
            if (isEmpty(value)) return undefined;
        }
        if (typeof value === "array") {
            if (value.length) return undefined;
        }

        return value;
    }
    object = JSON.stringify(object, replaceUndefinedOrNull);
    return object = JSON.parse(object);
}