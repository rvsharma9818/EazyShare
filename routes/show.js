const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        // Link expired
        if(!file) {
            
            return res.render('downloade', { error: 'Link has been expired.'});
        
        } 
        
        return res.render('downloade', { uuid: file.uuid, fileName: file.filename, downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` });
    } 
    catch(err) {
    
        return res.render( 'downloade', { error: 'Something went wrong.'});
    
    }
});


module.exports = router;