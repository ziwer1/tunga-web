const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/api/sendmail', (req, res) => {

        const htmlEmail = `
        <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">

        <tbody><tr>
            <td align="center">
                <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                    <tbody> 
                    <tr>
                        <td align="center">
                            <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                <tbody><tr>
                                    <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                    <tr>
                        <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="left">
                            <table border="0" width="590" align="center" cellpadding="0" cellspacing="0" class="container590">
                                <tbody><tr>
                                    <td align="left" style="color: #888888; font-size: 16px; font-family: 'Fira Sans', sans-serif !important; line-height: 24px;">
                                        <p style="line-height: 24px; margin-bottom:15px;">
                                        I am ${req.body.sender_name},
                                        </p>
                                        <p style="line-height: 24px;margin-bottom:15px;">
                                        ${req.body.sender_msg}  
                                        </p>
                                      
                                        <p style="line-height: 24px">
                                            Sincerely,<br>
                                            <span style="color: #ee1f54;"><a href="https://tunga.io">Tunga</a></span>
                                        </p>

                                    </td>
                                </tr>
                            </tbody></table>
                        </td>
                    </tr>
                </tbody></table>

            </td>
        </tr>

        <tr>
            <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
        </tr>

    </tbody></table>  
        `
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'Your email',
                pass: 'pass'
            }
        });

        let mailOptions = {
            from: 'wamoscode@gmail.com',
            to: `${req.body.sender_email}, bart@tunga.io`,
            subject: 'Contact from Website',
            text: req.body.sender_message,
            html: htmlEmail
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent: %s', info.messageId);
        });

});

app.listen(app.get('port'), function () {
    console.log('Server started on: ' + app.get('port'));
});
