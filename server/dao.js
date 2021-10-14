'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const db = require('./db');

// get all services
exports.listServices = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM services';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const services = rows.map((s) => ({ id: s.id, name: s.name, time: s.time }));
      resolve(services);
    });
  });
};

// get all counters
exports.listCounters = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM counters';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const counters = rows.map((c) => ({ id: c.id, name: c.name }));
      resolve(counters);
    });
  });
};
/*
// get the course identified by {code}
exports.getCourse = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE code = ?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Course not found.'});
      } else {
        const course = { code: row.code, name: row.name, CFU: row.CFU };
        resolve(course);
      }
    });
  });
};

// get all exams
exports.listExams = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT coursecode, score, date FROM exam WHERE userid = ?';

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const exams = rows.map((e) => (
        {
          code: e.coursecode,
          score: e.score,
          date: e.date,
        }));

      resolve(exams);
    });
  });
};
*/
// add a new exam
exports.createService = (service) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO services(name, time) VALUES(?, ?)';
    db.run(sql, [service.name, service.time], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};
/*
// update an existing exam
exports.updateExam = (exam, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE exam SET date=DATE(?), score=? WHERE coursecode = ? AND userid = ?';
    db.run(sql, [exam.date, exam.score, exam.code, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};
*/

// delete an existing service
exports.deleteService = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM services WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

// delete existing services
exports.deleteServices = () => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM services';
    db.run(sql, (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}