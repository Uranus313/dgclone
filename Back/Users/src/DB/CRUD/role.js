import { RoleModel } from "../models/role.js";

export async function saveRole(roleCreate){
    const result = {};
    const role = new RoleModel(roleCreate);
    const response = await role.save();
    result.response = response.toJSON();
    return result;
}

export async function getRoles(id , search, idArray){
    const result = {};
    if(id){
        result.response = await RoleModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
        
    }else if(idArray){
        result.response = await RoleModel.find({_id :{ $in: idArray}});
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }else{
        result.response = await RoleModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}

export async function deleteRole(id){
    const result = {};
    result.response = await RoleModel.findByIdAndDelete({_id : id});
    return result;
}

export async function updateRole(id,roleUpdate ){
    const result = {};
    const response = await RoleModel.findByIdAndUpdate(id,{$set :roleUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

