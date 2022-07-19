import express from 'express';
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import google from 'googleapis';
import pkg from 'google-auth-library';
import 'dotenv/config'


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



//View engine setup
app.engine('handlebars', engine());   // tried handlebars, not working at all, Had to run "npm install ejs"
app.set('view engine', 'handlebars'); // tried handlebars, not working at all, Had to run "npm install ejs"
app.set('views', './views');          // tried handlebars, not working at all, Had to run "npm install ejs"

app.set('view engine', 'ejs'); // this worked well

// Static Folder
app.use('/public', express.static(path.join(__dirname, '/public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('contacts');
});

app.post('/send', (req, res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;     

    
    // Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAUTH2',
            user: process.env.EMAIL,
            pass: process.env.PASSWORD, 
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken: process.env.OAUTH_CLIENT_ACCESS
        }
    })

    // Step 2
    let mailOptions = {
        from: 'rejoiceoedokpayi@gmail.com',
        to: 'rejoiceoedokpayi@gmail.com, edokpayi.oseretin@eng.uniben.edu', // Bulk messaging applied
        subject: 'NodeJS Zuri Assignment',
        text: 'It worked',
        html: output
    }

    // Step 3
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email Sent');
        }
    });
})

app.listen(3000, () => console.log('Server Started'));
