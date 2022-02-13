const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const fs = require("fs");

const fileUpload = require('express-fileupload');
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload({createParentPath: true}));

mongoose.connect("mongodb://localhost:27017/square", { useNewUrlParser: true });


const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  age: {
    type: Number,
    min: 1,
    max: 150,
    required: [true],
  },
  email: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
  confpass: {
    type: String,
  },
  phone: {
    type: Number,
    required: [true],
  },
  username: {
    type: String,
    required: [true],
  },
});

const fileSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true],
  },
  name: {
    type: String,
    required: [true],
  },
  file: {
    type: Buffer,
    required: [true],
  },
});

const file = mongoose.model("File", fileSchema);




const patient = mongoose.model("Patient", patientSchema);

const defaultPatient = new patient({
  name: "none",
  email: "none",
  age: "none",
  password: "none",
  confpass: "none",
  username: "none",
  phone: "none",
});

let currentPatient = defaultPatient;

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  special: {
    type: String,
    reequired: [true],
  },
  email: {
    type: String,
    required: [true],
  },
  password: {
    type: String,
    required: [true],
  },
  confpass: {
    type: String,
    required: [true],
  },
  phone: {
    type: Number,
    required: [true],
  },
  username: {
    type: String,
    required: [true],
  },
  address: {
    type: String,
    require: [true],
  },
  experience: {
    type: Number,
    required: [true],
  },
});
const doctor = mongoose.model("Doctor", doctorSchema);

const defaultDoctor = new doctor({
  name: "none",
  email: "none",
  special: "none",
  password: "none",
  confpass: "none",
  username: "none",
  phone: "none",
  address: "none",
  experience: "none",
});

const formSchema = new mongoose.Schema({
  docname: {
    type: String,
    required: [true],
  },
  name: {
    type: String,
    required: [true],
  },

  gender: {
    type: String,
    required: [true],
  },
  rfa: {
    type: String,
    require: [true],
  },
  phone: {
    type: Number,
    required: [true],
  },

  address: {
    type: String,
    require: [true],
  },
  age: {
    type: Number,
    required: [true],
  },
  approve: {
    type: Boolean,
    required: true,
  },
  date: Date,
  visited: Boolean,
  pat_email: {
    type: String,
    required: [true],
  },
});

const form = mongoose.model("Form", formSchema);

const defaultform = new form({
  docname: "none",
  name: "none",
  age: "none",
  phone: "none",
  gender: "male",
  address: "none",
  rfa: "none",
  approve: "false",
  date: "none",
  visited: false,
  pat_email: "none",
});



let currentDoctor = defaultDoctor;
let alertSignUp = "";
let errusrnme = "";
let erremail = "";
let errc_no = "";
app.get("/", function (req, res) {
  res.render("aboutUs");
});

app.post(
  "/signUp_patient",
  check("username")
    .isLength({ min: 8 })
    .withMessage("Username should be alphanumeric with more than 7 characters.")
    .isAlphanumeric()
    .withMessage(
      "Username should be alphanumeric with more than 7 characters."
    ),
  check("email").isEmail().withMessage("Enter vaild email"),
  check("c_no").isMobilePhone().withMessage("Enter a valid Contact Number"),
  function (req, res) {
    
    var err1 = validationResult(req);
    let arr = err1.errors;
    if (arr.length === 0) {
      patient.find({ email: req.body.email }, function (err, found) {
        if (!err) {
          if (found.length === 0) {
            console.log(req.body);
            const newPatient = new patient({
              name: req.body.name,
              age: req.body.age,
              email: req.body.email,
              password: req.body.pass,
              confpass: req.body.conf_pass,
              username: req.body.username,
              phone: req.body.c_no,
            });
            console.log(newPatient);
            patient.insertMany([newPatient], function (err) {
              if (err) {
                console.log(err);
              }
            });
            currentPatient = newPatient;
            res.render("explore");
          } else {
            alertSignUp =
              "Account already exists with this email, try signing in.";
            res.redirect("/signUp_patient");
          }
        }
      });
    } else {
      let arr = err1.errors;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].param === "email") {
          erremail = arr[i].msg;
          res.render("signUp_patient", {
            erroremail: erremail,
            errorcno: "",
            errorun: "",
            alertsignup: "",
          });
        }
        if (arr[i].param === "username") {
          errusrnme = arr[i].msg;
          res.render("signUp_patient", {
            erroremail: "",
            errorcno: "",
            errorun: errusrnme,
            alertsignup: "",
          });
        }
        if (arr[i].param === "c_no") {
          errc_no = arr[i].msg;
          res.render("signUp_patient", {
            erroremail: "",
            errorcno: errc_no,
            errorun: "",
            alertsignup: "",
          });
        }
      }
    }
  }
);

app.post(
  "/signUp_doctor",
  check("username")
    .isLength({ min: 8 })
    .withMessage("Username should be alphanumeric with more than 7 characters.")
    .isAlphanumeric()
    .withMessage(
      "Username should be alphanumeric with more than 7 characters."
    ),
  check("email").isEmail().withMessage("Enter vaild email"),
  check("c_no").isMobilePhone().withMessage("Enter a valid Contact Number"),
  function (req, res) {
    var err1 = validationResult(req);
    let arr = err1.errors;
    
    console.log(arr);
    if (arr.length === 0) {
      doctor.find({ email: req.body.email }, function (err, found) {
        if (!err) {
          if (found.length === 0) {
            console.log(req.body);
            const newDoctor = new doctor({
              name: req.body.name,
              special: req.body.input,
              email: req.body.email,
              password: req.body.password,
              confpass: req.body.confirm_password,
              username: req.body.username,
              phone: req.body.c_no,
              address: req.body.address,
              experience: req.body.experience,
            });
            console.log(newDoctor);
            doctor.insertMany([newDoctor], function (err) {
              if (err) {
                console.log(err);
              }
            });
            currentDoctor = newDoctor;
            res.render("prof_doc", {
              doc_name: currentDoctor.name,
              doc_email: currentDoctor.email,
              doc_input: currentDoctor.special,
              doc_phn: currentDoctor.phone,
              doc_add: currentDoctor.address,
              doc_exp: currentDoctor.experience,
            });
          } else {
            alertSignUp =
              "Account already exists with this email, try signing in.";
            res.redirect("/signUp_doctor");
          }
        }
      });
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].param === "email") {
          erremail = arr[i].msg;
          res.render("signUp_doctor", {
            erroremail: erremail,
            errorcno: "",
            errorun: "",
            alertsignup: "",
          });
        }
        if (arr[i].param === "username") {
          errusrnme = arr[i].msg;
          res.render("signUp_doctor", {
            erroremail: "",
            errorcno: "",
            errorun: errusrnme,
            alertsignup: "",
          });
        }
        if (arr[i].param === "c_no") {
          errc_no = arr[i].msg;
          res.render("signUp_doctor", {
            erroremail: "",
            errorcno: errc_no,
            errorun: "",
            alertsignup: "",
          });
        }
      }

      
    }
  }
);

app.post("/login_doctor", function (req, res) {
  console.log(req.body);
  doctor.find({ email: req.body.email }, function (err, found) {
    if (!err) {
      if (found.length === 0) {
        alertSignIn = "Email is not registered, sign up first.";
        res.redirect("/signUp_doctor");
      } else {
        if (found[0].password === req.body.password) {
          currentDoctor = found[0];
          res.render("prof_doc", {
            doc_name: currentDoctor.name,
            doc_email: currentDoctor.email,
            doc_input: currentDoctor.special,
            doc_phn: currentDoctor.phone,
            doc_add: currentDoctor.address,
            doc_exp: currentDoctor.experience,
          });
        } else {
          alertSignIn = "Password incorrect.";
          res.redirect("/login_doctor");
        }
      }
    } else {
      console.log(err);
    }
  });
});
app.post("/login_patient", function (req, res) {
  console.log(req.body);
  patient.find({ email: req.body.email }, function (err, found) {
    if (!err) {
      if (found.length === 0) {
        alertSignIn = "Email is not registered, sign up first.";
        res.redirect("/signUp_patient");
      } else {
        if (found[0].password === req.body.password) {
          currentPatient = found[0];
          res.render("prof_patient", {
            pat_name: currentPatient.name,
            pat_email: currentPatient.email,
            pat_age: currentPatient.age,
            pat_phn: currentPatient.phone,
          });
          console.log(currentPatient);
        } else {
          alertSignIn = "Password incorrect.";
          res.redirect("/login_patient");
        }
      }
    } else {
      console.log(err);
    }
  });
});

app.get("/aboutUs/:docname", function (req, res) {
  console.log(req.params.docname);
  doctor.find({ name: req.params.docname }, function (err, found) {
    console.log(found);
    res.render("profd_p", {
      doc_name: found[0].name,
      doc_email: found[0].email,
      doc_input: found[0].special,
      doc_phn: found[0].phone,
      doc_exp: found[0].experience,
      doc_add: found[0].address,
    });
  });
});

var form_docname = "";

app.post("/aboutUs/:docname", function (req, res) {
  // console.log(req.params.docname);
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  form_docname = req.params.docname;
  res.redirect("/app_form");
});

app.post("/app_form", function (req, res) {
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  const newform = new form({
    docname: req.body.doc_name,
    name: req.body.name,

    gender: req.body.input,
    rfa: req.body.rfa,
    phone: req.body.c_no,

    address: req.body.address,
    age: req.body.age,
    approve: false,
    date: new Date(),
    pat_email: req.body.pati_email,
  });
  form.insertMany([newform], function (err) {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/prof_patient");
});

app.get("/signUp_patient", function (req, res) {
  res.render("signUp_patient", {
    erroremail: erremail,
    errorcno: errc_no,
    errorun: errusrnme,
    alertsignup: alertSignUp,
  });
});
app.get("/signUp_doctor", function (req, res) {
  res.render("signUp_doctor", {
    erroremail: erremail,
    errorcno: errc_no,
    errorun: errusrnme,
    alertsignup: alertSignUp,
  });
});
app.get("/login_patient", function (req, res) {
  res.render("login_patient", { alertsignup: alertSignUp });
});
app.get("/login_doctor", function (req, res) {
  res.render("login_doctor", { alertsignup: alertSignUp });
});
app.get("/explore", function (req, res) {
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  res.render("explore");
});

app.get("/download", function (req, res) {
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
    file.find({user : currentPatient.email},function(err,found2){
      console.log(found2[0]);
      
      var filecontents = found2[0].file;
      var fileBuffer = Buffer.from(filecontents,"binary");
      var savedFilepath = path.join(__dirname,"uploads");
      fs.writeFile(savedFilepath,fileBuffer,function(){
        res.status(200).download(savedFilepath,found2[0].name);
      });
      
    });
});

app.get("/visits",function(req,res){
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  form.find({ pat_email: currentPatient.email }, function (err, found) {
    
    res.render("visits", { arr: found });
  });
});

app.post("/patients",function(req,res){
  res.set("Content-Security-Policy", "default-src 'self'");
  
  console.log(req.body);
  console.log(req.files);
  console.log(req.files.foo);

  const fileData = req.files.foo.data;
  const filename = req.files.foo.name;
  const useremail = req.body.patient_name;
  const newFile = new file({
    user: useremail,// name of the user
    name: filename,
    file: fileData,
  });
  newFile.save();

});

app.get("/aboutUs", function (req, res) {
  currentPatient = defaultPatient;
  currentDoctor = defaultDoctor;

  res.render("aboutUs");
});

let doctype_doc = "";
let doctype_found = defaultDoctor;

app.get("/explore/:doctortype", function (req, res) {
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  console.log(req.params.doctortype);
  doctor.find({ special: req.params.doctortype }, function (err, found) {
    doctype_found = found;
    doctype_doc = req.params.doctortype;
    res.redirect("/doctypee");
  });
});

app.get("/doctypee", function (req, res) {
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  res.render("doctypee", { doctors: doctype_found, doctor_type: doctype_doc });
});



app.get("/patients", function (req, res) {
  if (currentDoctor === defaultDoctor) {
    res.redirect("/signUp_doctor");
  }
  form.find(
    { docname: currentDoctor.name, approve: true },
    function (err, found) {
      res.render("patients", { arr: found });
    }
  );
});



app.get("/app_req", function (req, res) {
  if (currentDoctor === defaultDoctor) {
    res.redirect("/signUp_doctor");
  }
  form.find(
    { docname: currentDoctor.name, approve: false },
    function (err, found) {
      res.render("app_req", { arr: found });
    }
  );
});

app.post("/app_req", function (req, res) {
  console.log(req.body);
  form.updateOne(
    { name: req.body.patient_name },
    { approve: true, date: req.body.date_doc },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/app_req");
      }
    }
  );

  // form.find({name:req.body.patient_name},function(err,found){
  //   form.findOneAndUpdate()
  //   found[0].approve = true;
  //   res.redirect("/app_req");
  // });
});

app.get("/prof_edit", function (req, res) {
  if (currentDoctor === defaultDoctor) {
    res.redirect("/signUp_doctor");
  }
  res.render("prof_edit");
});

let app_doc = "";

app.get("/app_form", function (req, res) {
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  res.render("app_form", {
    pat_name: currentPatient.name,
    pat_email: currentPatient.email,
    doc_form: form_docname,
  });
});

app.get("/prof_patient", function (req, res) {
  console.log(currentPatient);
  if (currentPatient === defaultPatient) {
    res.redirect("/signUp_patient");
  }
  res.render("prof_patient", {
    pat_name: currentPatient.name,
    pat_email: currentPatient.email,
    pat_age: currentPatient.age,
    pat_phn: currentPatient.phone,
  });
});

app.get("/prof_doc", function (req, res) {
  console.log(currentDoctor.experience);
  if (currentDoctor === defaultDoctor) {
    res.redirect("/signUp_doctor");
  }
  res.render("prof_doc", {
    doc_name: currentDoctor.name,
    doc_email: currentDoctor.email,
    doc_input: currentDoctor.special,
    doc_phn: currentDoctor.phone,
    doc_exp: currentDoctor.experience,
    doc_add: currentDoctor.address,
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
