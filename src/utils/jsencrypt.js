const nodeRSA = require('node-rsa')

// 生成一个1024长度的密钥对
const key = new nodeRSA({ b: 1024 })
//指定加密格式  不改格式得话可能会报错 由于jsencrypt的加密格式为pkcs1
key.setOptions({ encryptionScheme: 'pkcs1' }); 
const publicKey = key.exportKey('pkcs8-public') // 公钥
const privateKey = key.exportKey('pkcs8-private') // 私钥

// 使用私钥解密
function decrypt(data) {
    key.importKey(privateKey);
    return key.decrypt(data, 'utf8')
}


module.exports = {
    publicKey,
    decrypt
}