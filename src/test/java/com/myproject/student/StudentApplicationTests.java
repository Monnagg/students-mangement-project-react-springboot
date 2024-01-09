package com.myproject.student;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

class DemoApplicationTests {

	Calculator underTest = new Calculator();

	@Test
	void itShouldAddTwoNumbers() {
		int numberOne = 20;
		int numberTwo = 30;

		int result = underTest.add(numberOne, numberTwo);

		int expected = 50;
		assertThat(result).isEqualTo(expected);
	}

	class Calculator {
		int add(int a, int b) {
			return a + b;
		}
	}

}