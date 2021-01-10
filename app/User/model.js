const mongoose = require("mongoose");
const { Schema } = mongoose
const mongoosePaginate = require("mongoose-paginate-v2");

const { validateEmail, validatePhone } = require("../../utils/validate");

const UserSchema = Schema(
  {
    userName: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      required: [true, "không được bỏ trống"],
    },
    userEmail: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      required: [true, "không được bỏ trống"],
      // validate: [validateEmail, "không hợp lệ"],
      validate: [{ validator: validateEmail, message: props => `không hợp lệ` }],
    },
    userFullname: {
      type: String,
      trim: true,
    },
    userPass: {
      type: String,
      trim: true,
      minlength: [6, "ít nhất 6 ký tự"],
      required: [true, "không được bỏ trống"],
    },
    userRole: {
      type: String,
      trim: true,
      required: [true, "không được bỏ trống"],
      enum: ["DIRECTION", "LEADER", "MEMBER", "ADMIN"]
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department'
    },
    teampj: [{
      type: Schema.Types.ObjectId,
      ref: 'Teampj'
    }],

    status: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  }

);


const DepartmentSchema = Schema(
  {
    departmentName: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      required: [true],
    },
    // functionGroup: {
    //   type: String,
    //   trim: true,
    //   required: [true],
    // },

    // leader: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // },

    status: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  }

);


const TeampjSchema = Schema(
  {
    teampjCode: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      required: [true, "không được bỏ trống"],
    },
    teampjName: {
      type: String,
      trim: true,
      required: [true, "không được bỏ trống"],
    },
    // leader: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // },
    // member: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // }],
    status: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
  }

);



UserSchema.plugin(mongoosePaginate);
DepartmentSchema.plugin(mongoosePaginate);
TeampjSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);
User.createIndexes();
const Department = mongoose.model("Department", DepartmentSchema);
Department.createIndexes();
const Teampj = mongoose.model("Teampj", TeampjSchema);
Teampj.createIndexes();

module.exports = { User, Department, Teampj };
