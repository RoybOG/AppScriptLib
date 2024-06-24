/*
Script created by Itay Barak 2024
*/
const sheet_ids = {"חישובי עזר וטמפליטים":966108022,
"גיליון נתונים ממויינים":	313578405,
"נתוני בסיס מדוח נרשמים":0,
"נתוני בסיס מדוח הגעה":1631963383} //The names here are independent of the actual sheet name, you can change the names of these sheets and it would still work!




const format_subscriber_data_obj = {
  "שם הלקוח":(name_str)=>CodeLibrary.translateToHebrew(name_str),
  "טלפון הלקוח":(phone_str)=>CodeLibrary.formatPhoneStr(phone_str),
  //"תגיות":(tags_str)=>tags_str.replaceAll('"','').split(","),

  } 


function get_subscriber_transformer(){
  return format_subscriber_data_obj
}


function format_subscriber_value(key, value){

  return CodeLibrary.get_transformer(format_subscriber_data_obj)(key,value)

}


/*
function oldhandleEdit(e,ss){
  const range_sheet = e.range.getSheet()
  if(range_sheet.getSheetId() == sheet_ids["נתוני בסיס מדוח נרשמים"]){
    if(e.range.columnStart<7){// && !e.range.isBlank() //Checks for blank ranges for when the user deletes a range of cells instead of writing data
    let translatedNames = []
    let nameRange = range_sheet.getRange(e.range.getRow(),1,e.range.getLastRow()-e.range.getRow()+1,6)

    let translatedNamesRange = CodeLibrary.getSheetById(sheet_ids["גיליון נתונים ממויינים"],ss).getRange(e.range.getRow(),1,e.range.getLastRow()-e.range.getRow()+1,4)

    if(e.range.isBlank()){
      translatedNamesRange.clearContent()
    }else{
    //
    translatedNamesRange.setValues(nameRange.getValues().map(r=>[CodeLibrary.translateToHebrew(r[5]),CodeLibrary.translateToHebrew(r[3]),r[0],format_subscriber_value("טלפון הלקוח",r[2])])) //These are the values that are dependent on the email as a key
  //}
    }
  }
}*/

function handleEdit(e,ss){
  const range_sheet = e.range.getSheet()
  const userLock = LockService.getUserLock()
  if (userLock.tryLock(30000)) {
      if(range_sheet.getSheetId() == sheet_ids["נתוני בסיס מדוח נרשמים"]){
        let headers = range_sheet.getRange(1,1).getDataRegion(SpreadsheetApp.Dimension.COLUMNS) //There will never be a blank cell in between headers, so it should have all the headers

        if(e.range.columnStart<=headers.getNumColumns()){// && !e.range.isBlank() //Checks for blank ranges for when the user deletes a range of cells instead of writing data
          let translatedNames = []
          let nameRange = range_sheet.getRange(1,1).getDataRegion()
          Logger.log(nameRange.getNumRows())
          let resultsSheet = CodeLibrary.getSheetById(sheet_ids["גיליון נתונים ממויינים"],ss)
          let translatedNamesRange 
          let lastRow = CodeLibrary.getLastRowWithContent(resultsSheet)
    
          nameRange.getValues().slice(1).forEach(r=>{   //slice is to remove the headers row
          if(!(Boolean(r[0])&&/^\d+$/.test(r[0]?.toString()))){
              lastRow = lastRow + 1
              r[0] = lastRow
              resultsSheet.getRange(Number(lastRow),1).setValue(r[1])            
          }
       
          translatedNamesRange = resultsSheet.getRange(Number(r[0]),2,1,3)
          translatedNamesRange.clearContent()
          translatedNamesRange.setValues([[
            format_subscriber_value("שם הלקוח",r[6]),
            format_subscriber_value("שם הלקוח",r[4]),
            format_subscriber_value("טלפון הלקוח",r[3])]])
       }) 
 
    }
  }
  }
}

function handleEditForAfterWorkshop(e,ss){
  const userLock = LockService.getUserLock()
  if (userLock.tryLock(30000)) {
      if( [sheet_ids["נתוני בסיס מדוח נרשמים"],sheet_ids["נתוני בסיס מדוח הגעה"]].includes(e.range.getSheet().getSheetId())){
        const range_sheet = CodeLibrary.getSheetById(sheet_ids["נתוני בסיס מדוח נרשמים"],ss)
        let headers = range_sheet.getRange(1,1).getDataRegion(SpreadsheetApp.Dimension.COLUMNS) //There will never be a blank cell in between headers, so it should have all the headers
        
        if(e.range.columnStart<=headers.getNumColumns()){// && !e.range.isBlank() //Checks for blank ranges for when the user deletes a range of cells instead of writing data
          let translatedNames = []
          let nameRange = range_sheet.getRange(1,headers.getNumColumns()+1).getNextDataCell(SpreadsheetApp.Direction.NEXT).getDataRegion()
          Logger.log(nameRange.getNumRows())
          let resultsSheet = CodeLibrary.getSheetById(sheet_ids["גיליון נתונים ממויינים"],ss)
          let translatedNamesRange 
          let lastRow = CodeLibrary.getLastRowWithContent(resultsSheet)
    
          nameRange.getValues().slice(1).forEach(r=>{   //slice is to remove the headers row
          if(!(Boolean(r[0])&&/^\d+$/.test(r[0]?.toString()))){
              lastRow = lastRow + 1
              r[0] = lastRow
              resultsSheet.getRange(Number(lastRow),1).setValue(r[1])            
          }
          Logger.log(r)
          translatedNamesRange = resultsSheet.getRange(Number(r[0]),2,1,4) //The number of ranges should eqal he ength of values from the transform function
          translatedNamesRange.clearContent()
          translatedNamesRange.setValues([[
            format_subscriber_value("שם הלקוח",`${r[2]} ${r[3]}`),
            format_subscriber_value("שם הלקוח",r[2]),
            r[7],
            format_subscriber_value("טלפון הלקוח",r[5])]])
       }) 
 
    }
  }
  }
}

function getValuesForFormat(clientRowNum,ss){
  let obj = {}
  let eventR = CodeLibrary.getNamedRange(ss,"eventValues")


  let ks=[],vs=[];
  let clientR = CodeLibrary.getNamedRange(ss,"clientDetails")
  ks= ks.concat(eventR.getValues()[0],clientR.getValues()[0])

  let clientsSheet = CodeLibrary.getSheetById(sheet_ids["גיליון נתונים ממויינים"],ss)
  vs = vs.concat(eventR.getValues()[2],clientsSheet.getRange(clientRowNum,1,1,clientR.getNumColumns()).getValues()[0])
  
  ks.forEach((currentValue, index, arr)=>{obj[currentValue] = vs[index]})
  //printObj(obj)

//  Logger.log(obj["טלפון מלא"])

  return obj
}



function formatTemplate(str, obj) {
        let formatedStr = str;
        for (k in obj) {
          formatedStr = formatedStr.replaceAll(`{{${k}}}`, obj[k]);
        }

        return formatedStr;
}

function getMessageLink(phoneNumber, text){
  return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(text)}`
}


function getMessage(strFormat, currentRowNum,ss){
  let formatValues =  getValuesForFormat(currentRowNum,ss)

  msgStr = formatTemplate(strFormat,formatValues)
  return msgStr
  //return getMessageLink(formatValues["טלפון מלא"],msgStr)

}







