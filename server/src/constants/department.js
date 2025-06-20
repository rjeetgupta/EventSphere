import Department from "../models/department.model.js";

const departmentName = ['MBA', 'MCA', 'BCA', 'BBA', 'B.COM', 'B.SC', 'BA'];

async function initializeDepartment () {
    try {
        const existingDept = await Department.find({});
        if (existingDept.length === 0) {
            const departmentsToCreate = departmentName.map(dept => ({ departmentName: dept }));
            console.log("Attempting to create departments:", departmentsToCreate);
            const createdDepts = await Department.insertMany(departmentsToCreate);
            console.log("Created departments:", createdDepts);
            console.log("Default departments created successfully");
        } else {
            console.log("Departments already exist:", existingDept);
        }
    } catch (error) {
        console.log("Failed to create default departments", error);
    }
}

export default initializeDepartment;