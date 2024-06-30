/*
Script created by Itay Barak 2024
*/

const sheet_ids = {"חישובי עזר":2131840200,
"מעקב אוטומטי":1259578473,
"מעקב ידני":0,
'מעקב כמותי': 1077426030} //The names here are independent of the actual sheet name, you can change the names of these sheets and it would still work!


function getHolidays(){
  const currentDate = new Date()
  //Pull all Isreali Hollidays //Run this every begining of year!
const holidays_calandar = CalendarApp.getCalendarsByName("חגים בישראל")[0]
Logger.log(typeof holidays_calandar.getEvents)

let holidays_list = holidays_calandar.getEvents(new Date(currentDate.getFullYear(),1,1),new Date(currentDate.getFullYear()+1,1,1))
let r = getSheetById("חישובי עזר").getRange(3,10, holidays_list.length,2)
Logger.log(r.getSheet().getName())
//Logger.log(holidays_list.map((e)=>[e.getTitle()]))
 r.setValues(holidays_list.map((e)=>[e.getTitle(),e.getStartTime()])) //e.getStartTime().toDateString()))
//r.setValue( 3) //[ ["2.000"], ["1,000,000"], ["$2.99"] ])
}

function getIDOfSheet(){
  let sheetName = "יעדים למעקב אוטומטי"
  let ss = SpreadsheetApp.getActiveSpreadsheet()
  Logger.log(ss.getSheets()?.map((s)=>`${s.getName()}:${s.getSheetId().toString()}`))
  let wanted_sheet = ss.getSheetByName(sheetName)
  let sheet_id = wanted_sheet.getSheetId().toString()
  Logger.log(sheet_id)
}

function getSheetById(wanted_sheet, ss=SpreadsheetApp.getActiveSpreadsheet()){
  let sheets = ss.getSheets()
  //Logger.log(sheets.find((s)=>s.getSheetId() === sheet_ids[wanted_sheet]).getName())
  return sheets.find((s)=>s.getSheetId() === sheet_ids[wanted_sheet])

  

}

function archiveResults() {
  let ss = SpreadsheetApp.getActiveSpreadsheet()//SpreadsheetApp.openById(spreadsheetID) //| SpreadsheetApp.getActiveSpreadsheet(); //Make sure when you copy The ID is fitting!
  let auto_sheet = getSheetById("מעקב אוטומטי",ss)
  Logger.log(auto_sheet)  
    
    
    let prevDate = auto_sheet.getRange(3, 2, 1, auto_sheet.getLastColumn()).getValues()
    auto_sheet.insertRowAfter(3);
    auto_sheet.getRange(4, 2, 1, auto_sheet.getLastColumn()).setValues(prevDate)
    let CurrentDate = new Date()
    auto_sheet.getRange(4,1).setValue(CurrentDate)
/*
    let prevValue = auto_sheet.getRange("B2").getValue()
    Logger.log(prevValue)
    auto_sheet.getRange("B3").setValue(prevValue)*/
}



function addToCounter(r, startColumnNum, addOrSub=true){
  
  let sign = addOrSub?1:-1
  let addValueRange = r.getSheet().getRange(r.rowStart, startColumnNum)
  
  let addValue = (addValueRange.getValue()?Number(addValueRange.getValue()):1)*sign 
  let valueRange = r.getSheet().getRange(r.rowStart, startColumnNum+2)
  valueRange.setValue(Number(valueRange.getValue())+addValue)
  addValueRange.setValue(1)
  r.setValue(false)

  return valueRange.getValue()
}

/*
async function buttonAction(r,addOrSub=true){
  let proc = r.protect()
  Browser.msgBox(3)
  protection.setDomainEdit(false);
}*/


const amount_track_fields =  [["תאריך"],["תיאור"],["ערך"],[""]]

function set_amount_goals(){
 /* const r = [['פרסומי PR שונים (כתבות, ראיונות, מדיה וכו…'], ['פרקים חדשים לפודקאסט של טיספייס'], ['שיתופי פעולה עם אוניברסיטאות'],  ['שיתופי פעולה עם מכללות'],  ['שיתופי פעולה עם קהילות דיגיטליות' ], ['שיתופי פעולה עם משפיענים פרטיים'], ['מספר המשתתפים בקהילת אולסטארס ווטסאפ שקנו לפחות מוצר פרונט אחד'], ['מספר נרשמים חדשים לקהילה ווטסאפ שהגיעו דרך המלצות מחבריה']] */

let result = [[],[]]
let amount_sheet = CodeLibrary.getSheetById(1477986358,SpreadsheetApp.getActiveSpreadsheet())
const amount_goals_num = amount_sheet.getRange("a1").getValue()
Logger.log(amount_goals_num)
let amount_goals = amount_sheet.getRange(2,1,amount_goals_num,1).getValues()
Logger.log(amount_goals)
let change_r = amount_sheet?.getRange(2, 2, 2, amount_goals_num*amount_track_fields.length)


const spacing =  Array(amount_track_fields.length-1).fill([""])
for(v of amount_goals){
result[0] = [...result[0],v,...spacing]
result[1] = [...result[1],...amount_track_fields]

}


Logger.log(result)

change_r.setValues(result)

//return r.reduce((acc,current)=>([...acc,current,[],[]]),[])  

}

function update_dashboard(){ 
  //functions to do everytime it opens to update the dashboard
  set_amount_goals() 
}


function onEdit(e){
  const ui = SpreadsheetApp.getUi();
  const sheet_range = SpreadsheetApp.getActiveSheet();
 
     if(sheet_range.getSheetId() === sheet_ids['מעקב כמותי']&&e.range.getValue()===true){
      
      if(sheet_range.getRange(1,e.range.columnStart).getValue()=="הוספה"){
         // buttonAction(e.range)
         
         addToCounter(e.range,e.range.columnStart-1)
      }else if(sheet_range.getRange(1,e.range.columnStart).getValue()=="הורדה"){
        addToCounter(e.range,e.range.columnStart-3,false)
      }

      if(sheet_range.getSheetId() === sheet_ids['מעקב כמותי']){

      } 
    }else if(sheet_range.getSheetId() === sheet_ids['מעקב ידני']&&e.range.columnStart>1){
        let reportDateRange = sheet_range.getRange(e.range.rowStart,1)
        if(reportDateRange.isBlank()&&!e.range.isBlank()){ //if the user is editing a non exsisting report to creatre an new one and is not deleting but writing new information
          if(sheet_range.getRange(e.range.rowStart-1,1).isBlank()){
             ui.alert("הדוח השבועי שלך חייב להיות מתחת לדוחות הקודמים, זוהה רווח בין דוחות!")
          }
          else{
            Logger.log("creating")
            reportDateRange.setValue(new Date())
            //CodeLibrary.getNamedRange(SpreadsheetApp.getActiveSpreadsheet(),"LastReportRow").getRange().setValue(e.range.rowStart)
          }
          //CodeLibrary.getSheetById(sheet_ids["חישובי עזר"]).getNamedRanges();
        }
      }
}


function t(){
  /*SpreadsheetApp.getActiveSpreadsheet().getNamedRanges().forEach(nr=>{Logger.log(`${nr.getName()}: ${nr.getRange().getSheet().getName()} ${nr.getRange().getA1Notation()}`)})*/

  Logger.log(SpreadsheetApp.getActiveSpreadsheet().getSheets())
}
  /*  if (e.range.columnStart > 1 && e.range.rowStart > 1 &&!Boolean(e.oldValue) && sheet_range.getName() == 'מעקב ביצועים של תוצרים'){
      let currentDate = new Date()
      let r = sheet_range.getRange(e.range.rowStart,1)
      if(!r.getValue()){
        r.setValue(currentDate)    
      }

    }*/

function doPost(e){
  Logger.log(e.parameter.origin)
  Logger.log(e.parameter)
  return ContentService.createTextOutput("hello world!");
}


