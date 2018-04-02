const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('http://localhost:8000/app/sendmail',(req,res)=>{
   
    nodemailer.createTestAccount((err,account)=>{

        const htmlEmail =`

        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.sender_name}</li>
            <li>Name: ${req.body.sender_email}</li>
        </ul>
        <h3>Contact Details</h3>
        <p> ${req.body.sender_message}</p>
       
        `
        let transporter = nodemailer.createTransport({
            
           host:process.env.SMTP_HOST,
           port:process.env.SMTP_PORT,
           secure:process.env.SMTP_SECURE,
           auth:{
               user:process.env.SMTP_LOGIN,
               pass:process.env.SMTP_PASSW
           }
        });

        let mailOptions ={
            from:req.body.sender_email,
            to:'wamoscode@gmail.com',
            subject:'Contact from Website',
            text: req.body.sender_message,
            html:htmlEmail
        };

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return console.log(error);
            }

            console.log('Message sent: %s', info.messageId);
        });
    });

});

const PORT = process.env.PORT || 8081;

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
});