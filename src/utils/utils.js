//邮箱脱敏
function desensitize(email) {
  return email.replace(/\w+([-|\.]\w+)*@[\w]+\.[a-z]+/g, (email) => {
    return email.replace(/(\w{3}).*(\w{2})@(.*)/, "$1***$2@$3");
  });
}
module.exports = {desensitize}