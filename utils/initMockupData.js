const User = require("../app/User/model");
const { getHashedPassword, comparePassword, generateToken } = require("./helper");

exports.mockupData = async () => {
    let result = await User.Department.findOne({});
    if (!result) {
        mockupDepartment();
        console.log("Create Mockup Department Complete");
    }
    result = await User.Teampj.findOne({});
    if (!result) {
        await mockupTeampj();
        console.log("Create Mockup Teampj Complete");
    }
    result = await User.User.findOne({userName: {$ne: "GIAMDOC"}});
    if (!result) {
        await mockupUser();
        console.log("Create Mockup User Complete");
    }
    // result = await User.Department.findOne({},{_id :1}).limit(1).skip(3);
    // console.log(result._id);
}

function mockupDepartment() {
    var listData = [];
    for (var i = 1; i < 100; i++) {
        let data = {
            departmentName: "Phòng ban " + i,
        };
        listData.push(data);
    }
    User.Department.insertMany(listData);
}

async function mockupUser () {
    var checkData = await User.User.findOne({userName: {$eq: "GIAMDOC"}});
    if(!checkData){
        var direction = new User.User({
            userName : "GIAMDOC", userEmail:"GIAMDOC@gmail.com", userFullname: "GIAMDOC", userRole: "DIRECTION", userPass: getHashedPassword("123456"),
        });
        await direction.save();
    }
    var holdDepartment = 1;
    var holdTeampj = 1;
    var resultDepartment = {};
    var resultTeampj = [];
    for (var i = 1; i < 1500; i++) {
        let userRole = "MEMBER";
        if(holdDepartment != Math.floor(i/15) || i==1){
            userRole = "LEADER";
            resultDepartment = await User.Department.findOne({},{_id :1}).limit(1).skip(i/25);
        }
        holdDepartment = Math.floor(i/15);
        if(holdTeampj != Math.floor(i/20) || i==1){
            resultTeampj = [];
            let temp = await User.Teampj.findOne({},{_id :1}).limit(1).skip(i/20);
            resultTeampj.push(temp._id);
        }
        holdTeampj = Math.floor(i/20);
        if(!resultDepartment){
            resultDepartment = await User.Department.findOne({});
        }
        if(!resultTeampj || !resultTeampj[0]){
            let temp = await User.Teampj.findOne({});
            resultTeampj.push(temp._id);
        }
        var user = new User.User({
            userName : "Cong"+i, userEmail:"Cong"+i+"@gmail.com", userFullname: "TruongHoangCong"+i, userRole: userRole, userPass: getHashedPassword("123456"),
            department: resultDepartment._id, teampj: resultTeampj,
        });
        await user.save();
    }
}

async function mockupTeampj() {
    for (var i = 1; i < 200; i++) {
        var pj = new User.Teampj({
            teampjCode : "PJ00"+i, teampjName:"Project "+i,
        });
        await pj.save();
    }

}
