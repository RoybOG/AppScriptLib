/*
Script created by Itay Barak 2024
*/
const area_codes = {"ישראל":"972"}

function formatPhoneStr(phone_str,country="ישראל"){

    if(typeof phone_str ==='string'|| typeof phone_str ==='number'){


    phone_str = phone_str.toString().replace(/[^0-9]/g, "");
    
    phone_str = phone_str.replace(/^0+/, "");

    if(/^\d+$/.test(phone_str)){

    phone_str = (phone_str.startsWith(area_codes[country])?"":area_codes[country]) + phone_str

    return phone_str
    }}

    return null
    
    }


function get_transformer(transform_obj){
    return (key,value)=>{
        return key in transform_obj? transform_obj[key](value):value
    }
}


function printObj(obj){
  Logger.log("{")
  for(k in obj){
    Logger.log(`${k}:${obj[k]}`)
  }
  Logger.log("}")
}



function printArr(arr){
  Logger.log("[")
  for(k of arr){
    Logger.log(`,${k.toString()},`)
  }
  Logger.log("]")
}
