const monent=require("moment");
function formateMessage(username,text){
    return {
        username,
        text,
        time:monent().format("h:mm:a")
    }
}
module.exports=formateMessage