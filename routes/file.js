const router = require('express').Router();

const File = require('../models/file');

const { v4: uuidv4 } = require('uuid');

const { upload } = require('../multer/multer')


router.post('/', upload.single("myfile"), async (req, res) => {
  try{

    const file = new File({

      filename: req.file.originalname,

      uuid: uuidv4(),

      awsurl: req.file.location
  });
 
  const response = await file.save();
 
  res.status(200).json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,Awsurl:response.awsurl });
}
catch(err){

  res.status(500).json({ msg:err });

}
});


router.post('/send', async (req, res) => {

  // Get data from db 
  try {
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  
    if(!uuid || !emailTo || !emailFrom) {
        
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  
      }
    const file = await File.findOne({ uuid: uuid });
   
    if(!file){

      return res.status(404).json({"msg":"Invali Request"})

    }

    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
   
    file.sender = emailFrom;
   
    file.receiver = emailTo;
   
   
    const response = await file.save();
    // send mail
   
    const sendMail = require('../Services/mailService');
   
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'EazyShare file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../Services/emailTemplate')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    })
    .then(() => {
      return res.json({success: true});
    })
    .catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
} 
catch(err) {

  return res.status(500).send({ error: 'Something went wrong.'});

}

});

router.post('/delete', async (req, res) => {
  try {

    let x = await File.deleteMany({ createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });

    return res.send(`successfully deleted ${x}`);
  }
   catch (err) {
   
    return res.send(`error while deleting file ${err} `);
  }
})

module.exports = router;