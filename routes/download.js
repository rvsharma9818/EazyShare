const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
   // Extract link and get file from storage send download stream
   try{ 
   
      const file = await File.findOne({ uuid: req.params.uuid });
   
   // Link expired
   if(!file) {
        return res.render('download', { error: 'Link has been expired.'});
   } 
   
   return res.redirect(file.awsurl);
}catch(err){
   
   return res.status(500).json({"error":err.message})

}
});


module.exports = router;