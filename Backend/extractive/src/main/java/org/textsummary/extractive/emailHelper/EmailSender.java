package org.textsummary.extractive.emailHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.textsummary.extractive.domain.User;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
@Service
public class EmailSender {

    private JavaMailSender javaMailSender;

    @Autowired
    public EmailSender(JavaMailSender javaMailSender){
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(User user) throws MailException {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setFrom("Olow304@gmail.com");
        mail.setSubject(user.getTitle());
        mail.setText("Title: " +user.getTitle() + "\n" + "Summary: " + user.getSummary() + "\n" + "Link: " + user.getLink());
        javaMailSender.send(mail);
    }

//    public void sendEmailWithAttachment(User user) throws MailException, MessagingException {
//
//        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//
//        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
//
//        helper.setTo(user.getEmail());
//        helper.setSubject("Testing Mail API with Attachment");
//        helper.setText("Please find the attached document below.");
//
//        FileSystemResource file = new FileSystemResource("/home/rockhard/Desktop/Registration.pdf");
//        helper.addAttachment(file.getFilename(), file);
//
//        javaMailSender.send(mimeMessage);
//    }
}
