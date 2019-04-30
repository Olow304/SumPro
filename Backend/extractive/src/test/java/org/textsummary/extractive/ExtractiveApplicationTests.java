package org.textsummary.extractive;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.textsummary.extractive.domain.User;
import org.textsummary.extractive.emailHelper.EmailSender;
import org.textsummary.extractive.emailHelper.SmtpServerRule;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
public class ExtractiveApplicationTests {

//	@Autowired
//	private WebApplicationContext context;
//	private MockMvc mockMvc;
//
//	@Before
//	public void setup(){
//		this.mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
//	}
//
//	@Test
//	public void testURLEndPoint() throws Exception {
//		this.mockMvc.perform(get("/extractive/")).andExpect(status().isOk());
//	}



}
