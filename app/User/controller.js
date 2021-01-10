const User = require("./model");
const { getHashedPassword, comparePassword, generateToken } = require("../../utils/helper");
const mongoosePaginate = require("mongoose-paginate-v2");
const asyncHandler = require("express-async-handler");

const create = asyncHandler(async (req, res) => {
  const { userName, userEmail, userPass, userRole, department, teampj, userFullname } = req.body;
  // validate UNIT
  if (!["DIRECTION", "LEADER", "MEMBER"].includes(userRole.toUpperCase())) return res.status(200).send({ status: 0, message: `Phân quyền không hợp lệ` });

  let user = await User.User.findOne({ userName });
  if (user) return res.status(200).send({ status: 0, message: `${userName} đã tồn tại` });
  user = await User.User.findOne({ userEmail });
  if (user) return res.status(200).send({ status: 0, message: `${userEmail} đã tồn tại` });
  const date = Date.now() / 1000;
  console.log(req.body);
  user = new User.User({
    userName, userEmail, userFullname, userRole, department, teampj, userPass: getHashedPassword(userPass),
    createdDate: date, updatedDate: date,
  });
  user.save().then((data) => {
    res.send({
      status: 1,
      data,
    });
  }).catch((err) => {
    res.status(200).send({
      status: 0,
      message: err.message,
    });
  });
});


const findAll = (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  if (limit > 1500) {
    limit = 1500;
  }
  limit = Math.max(limit);
  page = Math.max(page);

  const options = {
    page,
    limit,
    sort: { createdDate: -1 },
    customLabels: { docs: "data" },
    populate: ["department", "teampj"],
  };

  User.User.paginate({}, options).then((result) => {
    const data = { status: 1, ...result };
    res.send(data);
  });
};

const findMemberDepartment = (req, res) => {
  let { page = 1, limit = 10, departmentId } = req.query;
  limit = Math.max(limit);
  page = Math.max(page);

  const options = {
    page,
    limit,
    sort: { createdDate: -1 },
    customLabels: { docs: "data" },
    populate: ["department", "teampj"],
  };

  User.User.paginate({ department: departmentId }, options).then((result) => {
    const data = { status: 1, ...result };
    res.send(data);
  });
};

const findMemberTeampj = (req, res) => {
  let { page = 1, limit = 10, teampjId } = req.query;
  limit = Math.max(limit);
  page = Math.max(page);
  const options = {
    page,
    limit,
    sort: { createdDate: -1 },
    customLabels: { docs: "data" },
    populate: ["department", "teampj"],
  };

  User.User.paginate({ teampj: teampjId }, options).then((result) => {
    const data = { status: 1, ...result };
    res.send(data);
  });
};

const login = async (req, res) => {
  try {
    const { userName = "", userPass = "" } = req.body;
    let user = await User.User.findOne({ userName: userName });
    if (!user) return res.status(200).send({ status: 0, message: "Tài khoản không chính xác" });
    if (!comparePassword(user.userPass, userPass)) return res.status(200).send({ status: 0, message: "Mật khẩu không chính xác" });
    const token = generateToken(user);
    res.send({ status: 1, data: { token, userInfo: user } });
  } catch (error) {
    return res.status(200).send({ status: 0, message: err.message });
  }
};

const getDetailUser = async (req, res) => {
  const { id } = req.query;
console.log(id);
  await User.User.findOne({ _id: id })//.populate(['department','teampj'])
    .then(data => res.send({
      status: 1,
      data
    }))
    .catch(err => {
      res.status(200).send({
        status: 0,
        message: "Data not found"
        // message: err.message,
      })
    })
};

const findLeaderDepartment = (req, res) => {
  let { departmentId } = req.query;

  const options = {
    sort: { createdDate: -1 },
    customLabels: { docs: "data" },
    populate: ["department", "teampj"],
  };

  User.User.paginate({ department: departmentId, userRole: "LEADER" }, options).then((result) => {
    const data = { status: 1, ...result };
    res.send(data);
  });
};

const update = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { userName, userEmail, userPass, userRole, department, teampj, userFullname } = req.body;
  // validate UNIT
  let user = await User.User.findOne({ userName });
  if (user && user._id != userId) return res.status(200).send({ status: 0, message: `${userName} đã tồn tại` });
  user = await User.User.findOne({ userEmail });
  if (user && user._id != userId) return res.status(200).send({ status: 0, message: `${userEmail} đã tồn tại` });

  // Find note and update it with the request body
  const updatedDate = Date.now() / 1000;
  User.User.findByIdAndUpdate(userId, { userName, userEmail, userPass, userRole, department, teampj, userFullname }, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(200).send({
          status: 0,
          message: `${userId} không chính xác`,
        });
      }
      res.send({
        status: 1,
        data: { userInfo: data },
      });
    })
    .catch((err) => {
      return res.status(200).send({
        status: 1,
        message: err.message,
      });
    });
});


const changePasswords = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { userPassOld, userPassNew } = req.body;
  // validate UNIT
  if (!userPassOld || !userPassNew) return res.status(200).send({ status: 0, message: `Mật khẩu không được rỗng` });

  await User.User.findOne({ _id: userId }).then(data => {
    if (!data) return res.status(200).send({ status: 0, message: `${userId} không chính xác` });
    if (!comparePassword(data.userPass, userPassOld)) return res.status(200).send({ status: 0, message: "Mật khẩu hiện tại không chính xác" });
  }).catch((err) => {
    return res.status(200).send({ status: 0, message: err.message });
  });

  const updatedDate = Date.now();
  await User.User.findOneAndUpdate({ _id: userId }, { userPass: getHashedPassword(userPassNew), updatedDate }, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(200).send({
          status: 0,
          message: "User id not found with id " + userId,
        });
      }
      res.send({
        status: 1,
        data: { userInfo: data },
      });
    })
    .catch((err) => {
      return res.status(200).send({
        status: 1,
        message: err.message,
      });
    });
});





module.exports = {
  create, findAll, login, update, changePasswords, findLeaderDepartment, findMemberDepartment, findMemberTeampj, getDetailUser,
};