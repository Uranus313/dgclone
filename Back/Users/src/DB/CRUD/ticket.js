import { TicketModel } from "../models/ticket.js";

export async function saveTicket(ticketCreate){
    const result = {};
    const ticket = new TicketModel(ticketCreate);
    const response = await ticket.save();
    result.response = response.toJSON();
    return result;
}

export async function getTickets(id , searchParams ,limit , floor ,titleSearch,sort , desc ){
    const result = {};
    let sortOrder = (desc == true || desc == "true")? -1 : 1;
    if(id){
        result.response = await TicketModel.find({_id : id}).findOne();
        if(result.response){
            result.response = result.response.toJSON();
        delete result.response.password;

        }
        return result;
    }else{
        let data = null;
        let hasMore = false;
        if(!limit){
            limit = 20;
        }
        if(titleSearch && titleSearch != ''){
            data = await TicketModel.find({...searchParams,title:{
                $regex: titleSearch,
                $options: 'i'
            } }).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await TicketModel.countDocuments({...searchParams,title:{
                $regex: titleSearch,
                $options: 'i'
            } });
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        }else{
            data = await TicketModel.find(searchParams).skip(floor).limit(limit).sort({[sort] : sortOrder} );
            let count = await TicketModel.countDocuments(searchParams);
            // console.log(count);
            // console.log(limit+floor);
            
            hasMore = count > (Number(limit) + Number(floor));
            console.log(hasMore)
        }
        for (let index = 0; index < data.length; index++) {
            data[index] = data[index].toJSON();
            delete data[index].password;
        }
        result.response = {
            data: data,
            hasMore: hasMore
        }
        return result;
    }
}

export async function deleteTicket(id){
    const result = {};
    result.response = await TicketModel.deleteOne({_id : id});
    return result;
}

export async function updateTicket(id,ticketUpdate ){
    const result = {};
    const response = await TicketModel.findByIdAndUpdate(id,{$set :ticketUpdate},{new : true});
    result.response = response.toJSON();
    return(result);
}

