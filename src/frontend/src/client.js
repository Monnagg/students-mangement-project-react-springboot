import 'unfetch/polyfill'

const checkStatus = response =>{
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP responses into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}
export const getAllStudents = () =>
    fetch("api/v1/students")
    .then(checkStatus);

export const addNewStudent = student =>
    fetch("api/v1/students",{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body: JSON.stringify(student)
    }).then(checkStatus);

export const deleteStudent = studentId =>
    fetch(`api/v1/students/${studentId}`, {
        method: 'DELETE'
    }).then(checkStatus);

export const editStudent =(id,student)  =>
    fetch(`api/v1/students/${id}`, {  // 使用 student.id 作为占位符
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    }).then(checkStatus);
