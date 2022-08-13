const router = require('express').Router();

const File = require('../models/file');

const { v4: uuidv4 } = require('uuid');

const { upload } = require('../multer/multer')


router.post('/', upload.single("myfile"), async (req, res) => {
  const file = new File({
    filename: req.file.originalname,
    uuid: uuidv4(),
    awsurl: req.file.location
  });
  console.log(req.file)
  const response = await file.save();
  res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`, response, });
});


router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All fields are required except expiry.' });
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: 'Email already sent once.' });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/mailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'EazyShare send a file ',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + ' KB',
        expires: '24 hours'
      })
    }).then(() => {
      return res.json({ success: true });
    }).catch(err => {
      return res.status(500).json({ error: 'Error in email sending.' });
    });
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' });
  }

});

router.post('/delete', async (req, res) => {
  try {
    let x = await File.deleteMany({ createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    console.log(`successfully deleted ${x}`);
  } catch (err) {
    console.log(`error while deleting file ${err} `);
  }
})

module.exports = router;