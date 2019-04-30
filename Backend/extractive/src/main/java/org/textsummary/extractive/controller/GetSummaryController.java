package org.textsummary.extractive.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.*;
import org.textsummary.extractive.domain.User;
import org.textsummary.extractive.emailHelper.EmailSender;
import org.springframework.http.MediaType;

import javax.validation.Valid;

@RestController
public class GetSummaryController {

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private User user;

    @PostMapping(value = "get-summary", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public String summary(@Valid @RequestBody User user){
        try{
            emailSender.sendEmail(user);
            //userService.saveUser(user);
        }catch (MailException mailException){
            System.out.println(mailException);
        }

        return "Your summary is send to your email";
    }
}
