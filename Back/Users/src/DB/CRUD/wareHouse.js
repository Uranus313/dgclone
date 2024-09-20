import { WareHouseModel } from "../models/wareHouse.js";

export async function saveWareHouse(wareHouseCreate){
    const result = {};
    const wareHouse = new WareHouseModel(wareHouseCreate);
    const response = await wareHouse.save();
    result.response = response.toJSON();
    return result;
}

export async function getWareHouses(id , search){
    const result = {};
    if(id){
        result.response = await WareHouseModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
        
    }else{
        result.response = await WareHouseModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}

export async function deleteWareHouse(id){
    const result = {};
    result.response = await WareHouseModel.findByIdAndDelete({_id : id});
    return result;
}

// export async function updateWareHouse(id,wareHouseUpdate ){
//     const result = {};
//     const response = await WareHouseModel.findByIdAndUpdate(id,{$set :wareHouseUpdate},{new : true});
//     result.response = response.toJSON();
//     return(result);
// }

