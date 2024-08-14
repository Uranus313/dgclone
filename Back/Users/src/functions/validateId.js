import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);

export default function(id){
    return Joi.objectId().validate(id);
}