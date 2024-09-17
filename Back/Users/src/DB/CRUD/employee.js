import { EmployeeModel } from "../models/employee.js";
import { comparePassword, hashPassword } from "../../functions/hashing.js";

export async function saveEmployee(employeeCreate){
    const result = {};
    const employee = new EmployeeModel(employeeCreate);
    const response = await employee.save();
    result.response = response.toJSON();
    return result;
}

export async function getEmployees(id , search,limit , floor ,nameSearch){
    const result = {};
    if(id){
        result.response = await EmployeeModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
            delete result.response.password;

        }
        return result;
    }else{
        if(nameSearch){
            result.response = await EmployeeModel.find({...searchParams,lastName:{
                $regex: nameSearch,
                $options: 'i'
            } }).skip(floor).limit(limit);
        }else{
            result.response = await EmployeeModel.find(searchParams).skip(floor).limit(limit);
        }
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
            delete result.response[index].password;
        }
        return result;
    }
}

export async function logIn(email , phoneNumber , password){
    const result = {};
    let employee = null;
    if (email){
        employee = await EmployeeModel.find({email : email}).findOne();
        if(!employee){
            result.error = "no employee with this email exists";
            return result;
        }
    }else{
        employee = await EmployeeModel.find({phoneNumber : phoneNumber}).findOne();
        if(!employee){
            result.error = "no employee with this phoneNumber exists";
            return result;
        }
    }
    const passwordCheck = await comparePassword(password , employee.password);
    if(!passwordCheck){
        result.error = "wrong password";
        return result;
    }
    result.response = employee.toJSON();
    delete result.response.password;

    return result;
}
export async function deleteEmployee(id){
    const result = {};
    result.response = await EmployeeModel.deleteOne({_id : id});
    return result;
}

export async function updateEmployee(id,employeeUpdate ){
    const result = {};
    if(employeeUpdate.password){
        employeeUpdate.password = await hashPassword(employeeUpdate.password);
    }
    const response = await EmployeeModel.findByIdAndUpdate(id,{$set :employeeUpdate},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}

export async function changeEmployeePassword(id,newPassword , oldPassword ){
    const result = {};
    const employee = await EmployeeModel.find({_id : id}).findOne();
    if (employee.password){
        const answer = await comparePassword(oldPassword,employee.password);
        if(!answer){
            result.error = "wrong password"
            return result;
        }
    }else if (oldPassword){
        result.error = "wrong password"
        return result;
    }
    const hashedPassword = await hashPassword(newPassword);
    const response = await EmployeeModel.findByIdAndUpdate(id,{$set :{password : hashedPassword}},{new : true});
    result.response = response.toJSON();
    delete result.response.password;
    return(result);
}