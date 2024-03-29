import './App.css';
import {deleteStudent, getAllStudents} from "./client";
import React,{useState,useEffect} from "react";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, PlusOutlined
} from '@ant-design/icons';
import {Radio,Breadcrumb, Layout, Menu, theme, Table, Empty, Spin, Button, Badge, Space, Tag, Avatar, Popconfirm} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";
import EditStudentDrawerForm from "./editStudentdrawer";
const { Header, Content, Footer, Sider } = Layout;
const TheAvatar = ({name}) =>{
    let trim =name.trim();
    if( trim.length=== 0){
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if(split.length === 1){
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)} ${name.charAt(name.length-1)}`}</Avatar>
}
const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification( "Student deleted", `Student with ${studentId} was deleted`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    })
}
const columns = (fetchStudents, setShowEditForm,setSelectedStudent)  => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render:(text,student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small" onClick={() => {
                    setShowEditForm(true);
                    setSelectedStudent(student);
                }}>
                    Edit
                </Radio.Button>
            </Radio.Group>
    }
 ];
const antIcon = < LoadingOutlined style={{fontSize: 24,}}/>;
function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const fetchStudents = ()=>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                console.log(data);
            }).catch(err=>{
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an issue",
                        `${res.message} [${res.status}] [${res.error}]`)
                })
        }).finally(() =>setFetching(false));


    useEffect(()=>{
        console.log("component is mounted");
        fetchStudents();
    },[]);

    const renderStudents = () =>{
        if(fetching){
            return <Spin indicator={antIcon} />
        }
        if(students.length <= 0){
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }

        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            {showEditForm && (
                <EditStudentDrawerForm
                    showDrawer={showEditForm}
                    setShowDrawer={setShowEditForm}
                    fetchStudents={fetchStudents}
                    studentToEdit={selectedStudent}
                />
            )}
            <Table
            dataSource={students}
            columns={columns(fetchStudents,setShowEditForm,setSelectedStudent)}
            bordered
            title={() =>
                <>
                <Space>
                    <Tag>Number of students</Tag>
                    <Badge count={students.length} className="site-badge-count-4" style={{
                        backgroundColor: '#52c41a',
                    }}/>
                </Space>
                    <br/><br/>
                    <Space>
                    <Button
                        onClick={() => setShowDrawer(!showDrawer)}
                        type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                        Add New Student
                    </Button>
                    </Space>
                </>}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 500 }}
            rwoKey = {(student) => student.id}
        />
        </>;
    }

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    const items = [
        getItem('Student Management', '1', <PieChartOutlined />),
        getItem('Events', '2', <DesktopOutlined />),
        getItem('User', 'sub1', <UserOutlined />, [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
        getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
        getItem('Files', '9', <FileOutlined />),
    ];
    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                By Menghua
            </Footer>
        </Layout>
    </Layout>

}

export default App;
