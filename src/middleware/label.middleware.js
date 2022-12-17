const service = require("../service/label.service");

const verfigisLabelExist = async (ctx, next) => {
  const {labels} = ctx.request.body;
  console.log(labels);
  const newlabels = [];
  //1.检查标签是否存在
  for (const name of labels) {
    const result = await service.select(name);
    const label = {name: name};
    if (!result) {
      //如果不存在创建标签
      const newlabel = await service.create(name);
      label.id = newlabel.insertId;
    } else {
      label.id = result.id;
    }
    newlabels.push(label);
  }
  ctx.labels = newlabels;

  await next();
};

module.exports = {
  verfigisLabelExist,
};
