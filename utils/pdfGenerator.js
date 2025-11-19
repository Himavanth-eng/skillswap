const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports.generateSkillPDF = (skill, student, booking) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      
      const filePath = path.join(
        'public',
        'pdfs',
        `${student._id}_${skill._id}_${Date.now()}.pdf`
      );

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // PDF Title
      doc.fontSize(22).text(`Skill Completion Summary`, { align: 'center' });
      doc.moveDown();

      // Skill info
      doc.fontSize(16).text(`Skill: ${skill.title}`);
      doc.text(`Category: ${skill.category}`);
      doc.text(`Description: ${skill.description}`);
      doc.moveDown();

      // Student info
      doc.fontSize(16).text(`Student: ${student.name}`);
      doc.text(`Tutor: ${booking.teacher.name}`);
      doc.text(`Duration: ${booking.durationHours} hour(s)`);
      doc.text(`Completion Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Final notes
      doc.fontSize(14).text(`Recommended next skills:`);
      doc.text(`• Advanced ${skill.title}`);
      doc.text(`• Similar category skills`);
      doc.text(`• Join a workshop to practice more`);
      
      doc.end();

      stream.on('finish', () => resolve(`/pdfs/${path.basename(filePath)}`));
      stream.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
};
