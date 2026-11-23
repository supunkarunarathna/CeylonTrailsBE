const { validationResult } = require('express-validator');
const { Inquiry } = require('../models');

exports.submit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }
    const { name, email, phone, subject, message } = req.body;
    const inquiry = await Inquiry.create({ name, email, phone, subject, message });
    res.status(201).json({ message: 'Thank you! Our travel consultants will get back to you shortly.', inquiry });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/contact - admin only. Paginated, filterable listing of every
 * "Contact Us" submission, mirroring the same page/limit + per-column
 * filter pattern used by GET /api/itineraries/admin so both admin tabs
 * behave consistently.
 */
exports.getAll = async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '10',
      name = '',
      email = '',
      phone = '',
      subject = '',
      status = '', // new | contacted | closed | ''
      q = '', // free-text search across the message body
      dateFrom = '',
      dateTo = '',
    } = req.query;

    const inquiries = await Inquiry.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5000,
    });

    const norm = (v) => String(v ?? '').toLowerCase();

    const filtered = inquiries.filter((inq) => {
      if (name && !norm(inq.name).includes(norm(name))) return false;
      if (email && !norm(inq.email).includes(norm(email))) return false;
      if (phone && !norm(inq.phone).includes(norm(phone))) return false;
      if (subject && !norm(inq.subject).includes(norm(subject))) return false;
      if (status && inq.status !== status) return false;
      if (q && !norm(inq.message).includes(norm(q))) return false;
      if (dateFrom && new Date(inq.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(inq.createdAt) > new Date(new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1)) return false;
      return true;
    });

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const start = (pageNum - 1) * limitNum;
    const data = filtered.slice(start, start + limitNum);

    res.json({ data, total, page: pageNum, limit: limitNum, totalPages });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    next(err);
  }
};
