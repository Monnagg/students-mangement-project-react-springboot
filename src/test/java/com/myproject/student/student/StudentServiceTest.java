package com.myproject.student.student;

import com.myproject.student.student.exception.BadRequestException;
import com.myproject.student.student.exception.StudentNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
    @Mock
    private StudentRepository studentRepository;
    private StudentService studentService;
    //private AutoCloseable autoCloseable;

    @BeforeEach
    void setUp() {
        //run before each test
        //autoCloseable = MockitoAnnotations.openMocks(this);
        studentService= new StudentService(studentRepository);
    }

    @AfterEach
    void tearDown() throws Exception {
        //autoCloseable.close();
    }

    @Test
    void getAllStudents() {
        studentService.getAllStudents();
        //verify测试 studentService 中的 getAllStudents() 方法是否调用了 studentRepository 的 findAll() 方法。
        verify(studentRepository).findAll();
        //verify(studentRepository).deleteAll();
    }

    @Test
    //@Disabled
    void addStudent() {
        String email ="Jonson@jci.com";
        Student student = new Student(
                "Jonson",
                email,
                Gender.MALE
        );
        studentService.addStudent(student);
        // 使用 ArgumentCaptor 捕获 save 方法的参数
        ArgumentCaptor<Student> studentArgumentCaptor =
                ArgumentCaptor.forClass(Student.class);

        // 验证 studentRepository 的 save 方法是否被调用，并捕获参数
        verify(studentRepository)
                .save(studentArgumentCaptor.capture());

        // 从 ArgumentCaptor 中获取捕获的 Student 对象
        Student capturedStudent = studentArgumentCaptor.getValue();

        // 使用断言确保捕获的 Student 对象与预期的 student 对象相等
        assertThat(capturedStudent).isEqualTo(student);

    }

    @Test
    void failAddStudentWithTakenEmail() {
        String email ="Jonson@jci.com";
        Student student = new Student(
                "Jonson",
                email,
                Gender.MALE
        );

        // 模拟 studentRepository 的 selectExistsEmail 方法，返回 true，表示邮箱已存在
        given(studentRepository.selectExistsEmail(anyString()))
                .willReturn(true);

        // 使用断言确保调用 addStudent 方法时会抛出 BadRequestException 异常，
        // 并且异常消息包含重复邮箱的提示信息
        assertThatThrownBy(() -> studentService.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email " + student.getEmail() + " taken");

        // 验证 studentRepository 的 save 方法从未被调用，确保不会保存重复邮箱的学生
        verify(studentRepository, never()).save(any());


    }

    void deleteStudent() {
        long id = 10;

        // 模拟 studentRepository 的 existsById 方法，返回 true，表示学生存在
        given(studentRepository.existsById(id))
                .willReturn(true);

        // 调用 studentService 的 deleteStudent 方法
        studentService.deleteStudent(id);

        // 验证 studentRepository 的 deleteById 方法被正确调用，删除指定 ID 的学生
        verify(studentRepository).deleteById(id);
    }

    @Test
    void willThrowWhenDeleteStudentNotFound() {
        long id = 10;

        // 模拟 studentRepository 的 existsById 方法，返回 false，表示学生不存在
        given(studentRepository.existsById(id))
                .willReturn(false);

        // 使用断言确保调用 deleteStudent 方法时会抛出 StudentNotFoundException 异常，
        // 并且异常消息包含学生不存在的提示信息
        assertThatThrownBy(() -> studentService.deleteStudent(id))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("Student with id " + id + " does not exist");

        // 验证 studentRepository 的 deleteById 方法从未被调用，确保不会尝试删除不存在的学生
        verify(studentRepository, never()).deleteById(any());
    }

}