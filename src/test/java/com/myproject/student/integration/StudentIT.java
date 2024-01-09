package com.myproject.student.integration;

import com.github.javafaker.Faker;
import com.myproject.student.student.Gender;
import com.myproject.student.student.Student;
import com.myproject.student.student.StudentRepository;
import org.springframework.boot.test.context.SpringBootTest;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
//import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.StringUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@TestPropertySource(
        locations = "classpath:application-it.properties"
)
@AutoConfigureMockMvc
public class StudentIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    StudentRepository studentRepository;
    private final Faker faker = new Faker();
    @Test
    void registerStudent() throws Exception {
        String name= String.format("%s %s",
                faker.name().firstName(),
                faker.name().lastName()
                );

        Student student = new Student(
                name,
                String.format("%s@gmail.com",StringUtils.trimAllWhitespace(name.trim().toLowerCase())),
                Gender.MALE
        );

        ResultActions resultActions = mockMvc.
                perform(post("/api/v1/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(student))
        );
        resultActions.andExpect(status().isOk());
        List<Student> students = studentRepository.findAll();
        assertThat(students).usingElementComparatorIgnoringFields("id")
                .contains(student);
    }



    @Test
    void deleteStudent() throws Exception {
        String name= String.format("%s %s",
                faker.name().firstName(),
                faker.name().lastName()
        );
        String email = String.format("%s@gmail.com", StringUtils.trimAllWhitespace(name.trim().toLowerCase()));
        Student student = new Student(
                        name,
                        email,
                Gender.MALE
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isOk());

        MvcResult getStudentsResult = mockMvc.perform(get("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = getStudentsResult
                .getResponse()
                .getContentAsString();

        List<Student> students = objectMapper.readValue(
                contentAsString,
                new TypeReference<>() {
                }
        );

        long id = students.stream()
                .filter(s -> s.getEmail().equals(student.getEmail()))
                .map(Student::getId)
                .findFirst()
                .orElseThrow(() ->
                        new IllegalStateException(
                                "student with email: " + email + " not found"));

        ResultActions resultActions = mockMvc
                .perform(delete("/api/v1/students/" + id));

        resultActions.andExpect(status().isOk());
        boolean exists = studentRepository.existsById(id);
        assertThat(exists).isFalse();
    }
}