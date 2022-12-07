const os = require('os');
os.hostname = () => 'localhost';

const nodemailer = require("nodemailer");
require('dotenv').config()

const sendSimpleEmail = async (dataSend) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"bác sĩ iE 👻" <jack1102ng@gmail.com>', // sender address
        to: dataSend.recieverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Thông tin đặt lịch khám bệnh", // plain text body
        html: getBookEmailHtml(dataSend)
    });
}

const getBookEmailHtml = (dataSend) => {
    let result = ''
    if (dataSend.lang === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Đây là thông tin về lịch hẹn khám bệnh bạn đã đặt ở bookingCare</p>
        <p><b>Thời gian: ${dataSend.time}</b></p>
        <p><b>Bác sĩ: ${dataSend.doctorName}</b></p>
        <p><b>Lý do khám bệnh: ${dataSend.reason}</b></p>
        <p>Nếu tất cả thông tin ở trên là chính xác, vui lòng click vào nút Xác nhận để xác nhận</p>
        <div><a href=${dataSend.redirect} target="_blank">Xác nhận</a></div>
    `
    } else {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>This is the information about the medical appointment you have booked at bookingCare</p>
        <p><b>Time: ${dataSend.time}</b></p>
        <p><b>Doctor: ${dataSend.doctorName}</b></p>
        <p><b>Reason: ${dataSend.reason}</b></p>
        <p>If all the information above is correct, please click the Confirm button to confirm</p>
        <div><a href=${dataSend.redirect} target="_blank">Confirm</a></div>
    `
    }
    return result
}

//---------------------------------------------------------------------------

const sendRemedyEmail = async (dataSend) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"bác sĩ iE 👻" <jack1102ng@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Hóa đơn khám bệnh của bạn", // Subject line
        text: "Hóa đơn khám bệnh của bạn", // plain text body
        html: getRemedyEmailHtml(dataSend),
        attachments: [
            {   // encoded string as an attachment
                filename: `remery-${dataSend.patientId}-${new Date()}.png`,
                content: dataSend.imageBase64.split("base64,")[1],
                encoding: 'base64'
            },
        ]
    });
}

const getRemedyEmailHtml = (dataSend) => {
    let result = ''
    if (dataSend.lang === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn đã được bác sĩ xác nhận lịch hẹn khám bệnh, đây là hóa đơn của bạn</p>
        <p>Chân thành cảm ơn</p>
    `
    } else {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You've been confirmed by your doctor for your appointment, here's your bill</p>
        <p>Thank you very much</p>
    `
    }
    return result
}

export {
    sendSimpleEmail, sendRemedyEmail
}