import './App.css';
import {getAllStudents} from "./client";
import React,{useState,useEffect} from "react";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu, theme, Table, Empty, Spin} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const columns = [
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
 ];
const antIcon = < LoadingOutlined style={{fontSize: 24,}}/>;
function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const fetchStudents = ()=>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                setFetching(false);
                console.log(data)
            })

    useEffect(()=>{
        console.log("component is mounted");
        fetchStudents();
    },[]);

    const renderStudents = () =>{
        if(fetching){
            return <Spin indicator={antIcon} />
        }
        if(students.length <= 0){
            return < Empty />;
        }

        return <Table
            dataSource={students}
            columns={columns}
            bordered
            title={() => 'Students'}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 240 }}
            rwoKey = {(student) => student.id}
        />;
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
        getItem('Option 1', '1', <PieChartOutlined />),
        getItem('Option 2', '2', <DesktopOutlined />),
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
