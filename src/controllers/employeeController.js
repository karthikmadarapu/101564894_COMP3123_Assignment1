const { matchedData } = require('express-validator');
const  Employee = require('../models/Employee');

// GET /employees → 200
exports.getAll = async (req, res, next) => {
  try {
    const employees = await Employee.find({ user: req.user.id }).sort({ created_at: -1 });
    res.status(200).json(employees);
  } catch (err) { next(err); }
};

// POST /employees → 201
exports.create = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const employee = await Employee.create({ ...data, user: req.user.id }); // owner from token
    res.status(201).json({
      message: 'Employee created successfully.',
      employee_id: employee._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ status: false, message: 'You already have an employee with this email' });
    }
    next(err);
  }
};

// GET /employees/:eid → 200
exports.getOne = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.eid, user: req.user.id });
    if (!employee) return res.status(404).json({ status: false, message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) { next(err); }
};

// PUT /employees/:eid → 200
exports.update = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.eid, user: req.user.id },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ status: false, message: 'Employee not found' });
    res.status(200).json({ message: 'Employee details updated successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ status: false, message: 'You already have an employee with this email' });
    }
    next(err);
  }
};

// DELETE /employees?eid=xxx → 204
exports.remove = async (req, res, next) => {
  try {
    const result = await Employee.findOneAndDelete({ _id: req.query.eid, user: req.user.id });
    if (!result) return res.status(404).json({ status: false, message: 'Employee not found' });
    res.status(204).send(); // 204 must have no body
  } catch (err) { next(err); }
};