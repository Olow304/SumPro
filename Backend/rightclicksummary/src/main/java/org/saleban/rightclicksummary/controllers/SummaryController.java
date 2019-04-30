package org.saleban.rightclicksummary.controllers;

import org.saleban.rightclicksummary.domain.Summary;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "http://127.0.0.1:5000/extractive")
public class SummaryController {
    @GetMapping("/summary")
    public String greetingForm(Model model, @RequestParam String selected) {
        try{
            String clean = selected.replace("-", " ");
            model.addAttribute("data", clean);
            model.addAttribute("greeting", new Summary());
            return "Summary";
        }catch (IllegalArgumentException e){
            return "errorPage";
        }
    }

}
