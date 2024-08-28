import { GiftCardModel } from "../models/giftCard.js";
import { UserModel } from "../models/user.js";

export async function saveGiftCard(giftCardCreate){
    const result = {};
    const giftCard = new GiftCardModel(giftCardCreate);
    const response = await giftCard.save();
    result.response = response.toJSON();
    return result;
}

export async function getGiftCards(id , search , idArray){
    const result = {};
    if(id){
        result.response = await GiftCardModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        }
        return result;
        
    }else if(idArray){
        result.response = await GiftCardModel.find({_id :{ $in: idArray}});
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }else{
        result.response = await GiftCardModel.find(search);
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
        }
        return result;
    }
}

export async function getBoughtGiftCards( idArray){
    const result = {};
        result.response = await GiftCardModel.find({_id :{ $in: idArray}});
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
            if(result.response[index].isUsed && result.response[index].buyerID != result.response[index].userID){
                let user = await UserModel.find({_id : result.response[index].userID}).findOne();
                user = user.toJSON();
                if(user){
                    result.response[index].user ={
                        phoneNumber : user.phoneNumber,
                        firstName : user.firstName,
                        lastName : user.lastName
                    }
                }
            }
        }
        return result;
    
}


export async function getReceivedGiftCards( idArray){
    const result = {};
        result.response = await GiftCardModel.find({_id :{ $in: idArray}});
        for (let index = 0; index < result.response.length; index++) {
            result.response[index] = result.response[index].toJSON();
                let buyer = await UserModel.find({_id : result.response[index].buyerID}).findOne();
                buyer = buyer.toJSON();
                if(buyer){
                    result.response[index].buyer ={
                        phoneNumber : buyer.phoneNumber,
                        firstName : buyer.firstName,
                        lastName : buyer.lastName
                    }
                }
            
        }
        return result;
    
}

export async function deleteGiftCard(id){
    const result = {};
    result.response = await GiftCardModel.deleteOne({_id : id});
    return result;
}

export async function updateGiftCard(id,giftCardUpdate ){
    const result = {};
    const response = await GiftCardModel.findByIdAndUpdate(id,{$set :giftCardUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

