const bodyParser = require("body-parser");
const express = require("express");

server = express();

//databse
let bankDb = [];

//models
function BankModel({ name, branch, location, phone, address, accountNumber }) {
  const bank = {
    name,
    branch,
    location,
    phone,
    address,
    accountNumber,

    save: function () {
      bankDb.push(this);
      return this;
    },
  };
  BankModel.all = function () {
    return bankDb;
  };

  //   const updateBank = (updateDetails = {}) => {
  //     bankDb = bankDb.map((bank) => {
  //       if (bank.name === updateDetails.name) {
  //         return { ...bank, ...updateDetails };
  //       }
  //       return bank;
  //     });
  //     return updateBank;
  //   };

  BankModel.update = function (updateDetails = {}) {
    const { name } = updateDetails;
    // Find the index of the bank to be updated
    const updateInfor = bankDb.findIndex((bank) => bank.name === name);

    bankDb[updateInfor] = { ...bank, ...updateDetails };

    return bankDb[updateInfor];
  };

  BankModel.delete = function ({ name }) {
    // Filter out the bank with the given name
    bankDb = bankDb.filter((bank) => bank.name !== name);

    return bankDb; // Return the updated bankDb array
  };

  return bank;
}
//controllers
//creating details
const createBankDetails = (req, res) => {
  //get data from the request body
  const { name, branch, location, phone, address, accountNumber } = req.body;

  //create a new bank data
  const bank = new BankModel({
    name,
    branch,
    location,
    phone,
    address,
    accountNumber,
  });
  //save the bank
  bank.save();

  res.json({ message: "Details created", data: bank });
};

//retrieving details
const retrieveBankDetails = (req, res) => {
  const bank = BankModel.all();

  res.json({ message: "bank details retrieved", data: bank });
};

//updating details
const editBankDetails = (req, res) => {
  //get data from the request body
  const { name, branch, location, phone, address, accountNumber } = req.body;

  const updateDetails = BankModel.update({
    name,
    branch,
    location,
    phone,
    address,
    accountNumber,
  });

  res.json({ message: "Details updated", data: updateDetails });
};

//deleting details
const deleteBankDetails = (req, res) => {
  const { name } = req.body;

  // Call the delete method from the BankModel
  const deleteBanks = BankModel.delete({ name });

  // If no matching bank is found, return a 404 error
  if (!deleteBanks) {
    return res
      .status(404)
      .json({ message: `Bank not found with the name: ${name}` });
  }

  // Return a success message with the updated list of banks
  res.status(200).json({ message: "Bank details deleted", data: deleteBanks });
};

//middleware
server.use(bodyParser.json());

//routes and method

server.post("/banks", createBankDetails);
server.get("/banks", retrieveBankDetails);
server.put("/banks", editBankDetails);
server.delete("/banks", deleteBankDetails);

server.listen(5000, "localhost", () =>
  console.log("Server is live  on port 5000")
);
