require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = () =>{

    mongoose.connect("mongodb+srv://EazyShare:EazyShare123@cluster0.fi3yidq.mongodb.net/test",{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then((data) =>{

    console.log('Database connected 🥳🥳🥳🥳');

})
.catch(err =>{

    console.log('Connection failed ☹️☹️☹️☹️');

})
}





module.exports = connectDB;