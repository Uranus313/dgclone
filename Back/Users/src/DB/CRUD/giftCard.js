import { GiftCardModel } from "../models/giftCard.js";

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
        result.response = await GiftCardModel.find(search);
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

