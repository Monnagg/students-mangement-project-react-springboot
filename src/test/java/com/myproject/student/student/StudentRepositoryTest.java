package com.myproject.student.student;

import jakarta.validation.constraints.AssertTrue;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
@DataJpaTest
public class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @AfterEach
    void tearDown() {
        //在每个测试完成后执行这个方法
        studentRepository.deleteAll();
    }

    @Test
    void ckeckIfExistsEmail() {
        String email ="Jonson@jci.com";
        Student student = new Student(
                "Jonson",
                email,
                Gender.MALE
        );
        studentRepository.save(student);
        Boolean exist = studentRepository.selectExistsEmail(email);

        assertThat(exist).isTrue();
    }

    @Test
    void ckeckIfNotExistsEmail() {
        String email ="Jonson@jci.com";
        Boolean exist = studentRepository.selectExistsEmail(email);

        assertThat(exist).isFalse();
    }
}
