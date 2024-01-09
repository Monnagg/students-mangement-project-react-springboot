import { Drawer, Input, Col, Select, Form, Row, Button, Spin } from 'antd';
import { editStudent } from "./client";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from 'react';
import { successNotification, errorNotification } from "./Notification";

const { Option } = Select;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function EditStudentDrawerForm({ showDrawer, setShowDrawer, fetchStudents, studentToEdit }) {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        form.setFieldsValue(studentToEdit);
    }, [form, studentToEdit]);

    const onClose = () => setShowDrawer(false);

    const onFinish = (updatedStudent) => {
        setSubmitting(true);

        // You can perform additional logic here if needed
        console.log(JSON.stringify(updatedStudent, null, 2));

        editStudent(studentToEdit.id, updatedStudent)
            .then(() => {
                console.log("student updated");
                onClose();
                successNotification(
                    "Student successfully updated",
                    `${updatedStudent.name} was updated in the system`
                );
                fetchStudents();
            })
            .catch((err) => {
                console.log(err);
                err.response.json().then((res) => {
                    console.log(res);
                    errorNotification(
                        "There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`,
                        "bottomLeft"
                    );
                });
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const onFinishFailed = (errorInfo) => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return (
        <Drawer
            title="Edit student"
            width={720}
            onClose={onClose}
            visible={showDrawer}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinishFailed={onFinishFailed}
                onFinish={onFinish}
                hideRequiredMark
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{required: true, message: 'Please enter student name'}]}
                        >
                            <Input placeholder="Please enter student name"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{required: true, message: 'Please enter student email'}]}
                        >
                            <Input placeholder="Please enter student email"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="gender"
                            label="gender"
                            rules={[{required: true, message: 'Please select a gender'}]}
                        >
                            <Select placeholder="Please select a gender">
                                <Option value="MALE">MALE</Option>
                                <Option value="FEMALE">FEMALE</Option>
                                <Option value="OTHER">OTHER</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>{submitting && <Spin indicator={antIcon} />}</Row>
            </Form>
        </Drawer>
    );
}

export default EditStudentDrawerForm;
