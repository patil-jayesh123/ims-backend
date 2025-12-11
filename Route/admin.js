const express = require("express");
const bcrypt = require("bcrypt"); // <-- Added
const adminschema = require("../model/adminschema");
const Router = express.Router();
const auth = require("../auth");
const jwt = require("jsonwebtoken");
const Student = require("../model/studentschem"); // path may vary
const staffschema = require("../model/staffschema");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const coursechema = require("../model/coursechema");

require('dotenv').config();


Router.get("/", (req, res) => {
  res.send("admin route");
});

//------------register page-------------------------------------------
Router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const exist = await adminschema.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const result = new adminschema({
      name,
      email,
      password: hashPassword,
    });

    const data = await result.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "failed to create user",
      error: err,
    });
  }
});

//---------------------login page-----------------------------------------
Router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await adminschema.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // success response
    // create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "jayu", // Strong secret key use karo
      { expiresIn: "24h" } // token valid for 24h days
    );

    res.status(200).json({
      success: true,
      message: "Login successfully ✅",
      token: token,
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Login failed ❌",
      error: err,
    });
  }
});

//-------------------------dashbord page---------------------------------------------------

Router.get("/dashboard", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin verified",
    user: req.user, // jwt se aata hai
  });
});

//------------------------studentspage----------------------------------------------------
//----------register- post----------------
Router.post("/registeruser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = new Student(req.body);
    const data = await result.save();

    return res.status(201).json({
      success: true,
      message: "student added sucessfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "failed t0 add students",
      error: err,
    });
  }
});

//--------get--read student-----------------

Router.get("/student", auth, async (req, res) => {
  try {
    const data = await Student.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: err,
    });
  }
});

//------------------------edit student----------------------------------------------
//edite api
Router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Student.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      success: true,
      message: "student updated successfully",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to update student",
      error: err,
    });
  }
});

//edit 2
//get single student
Router.get("/student/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: err,
    });
  }
});

//------------------------delete student----------------------------------------------
//delete api
Router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Student.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "student delete sucessfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to delete student",
      error: err,
    });
  }
});

//-----------------------------staff page-----------------------------------------------
//-----------------------------add staff-----------------------------------------------

Router.post("/registerstaff", async (req, res) => {
  try {
    const { name, department, email } = req.body;
    const result = new staffschema(req.body);
    const data = await result.save();

    return res.status(201).json({
      success: true,
      message: "staff added successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "failed to add staff",
      error: err,
    });
  }
});

// //-----------------------------read staff-----------------------------------------------
Router.get("/staff", auth, async (req, res) => {
  try {
    const data = await staffschema.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch staff",
      error: err,
    });
  }
});

// //-------------------delete staff---------------------------------------------------------
Router.delete("/staffdelete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await staffschema.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "staff delete successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to delete",
      error: err,
    });
  }
});

// //--------------------edit staff--------------------------------------------------------
// //get data for update
Router.get("/staff/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await staffschema.findById(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      staff: staff,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to fetch staff",
      error: err,
    });
  }
});
// // -------
Router.put("/updatestaff/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await staffschema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "staff updated successfully",
      data: data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to update staff",
      error: err,
    });
  }
});

//--------------------------courses page--------------------------------------------------
//--------------------post--------------------------------------------------------
//course crud
Router.post("/savecourse",async(req,res)=>{
try{
  const {name,course,instructor}=req.body
  const result=new coursechema(req.body)
  const data=await result.save()
  return res.status(201).json({
    success:true,
    message:"course added successfully",
    data:data,
  })
}catch(err){
  console.log(err);
  return res.status(500).json({
    success:false,
    message:"failed to add course",
    error:err,
  })  
}
})

//-----------get data------------------
Router.get("/courses",auth,async(req,res)=>{
  try{
    const data = await coursechema.find()
    return res.status(200).json(data)    
  }catch(err){
    return res.status(500).json({
      success:false,
      message:"failed to fetch",
      error:err
    })
  }
})


//----------------------------------------------------------------------------
// Forgot password
Router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await adminschema.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ msg: "If that email exists, a reset link was sent" });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Create a transporter. In production, set SMTP creds in .env.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    const message = {
      from: "jayeshpatil8262@gmail.com",
      to: user.email,
      subject: "Password reset",
      text: `Reset your password using this link: ${resetURL}`,
    };

    // Try to send email; if SMTP not configured, just return the resetURL in response (useful for testing)
    try {
      await transporter.sendMail(message);
      return res.json({ msg: "Reset link sent to email" });
    } catch (err) {
      console.error(
        "Email error, returning reset URL in response (development):",
        err.message
      );
      return res.json({
        resetURL,
        msg: "SMTP not configured - using dev resetURL",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Reset password
Router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashed = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await adminschema.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Token invalid or expired" });
    const { password } = req.body;
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
//----------------------------------------------------------------------------

module.exports = Router;


//password  vzdk nofz onko pbow