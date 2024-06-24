/*
Script created by Itay Barak 2024
*/

function getIDOfSheet(ss){
  let wanted_sheet = ss.getActiveSheet()
  //Logger.log(SpreadsheetApp.getActiveSpreadsheet().getSheets()?.map((s)=>`${s.getName()}:${s.getSheetId().toString()}`))
  //let wanted_sheet = ss.getSheetByName(sheetName)
  let sheet_id = wanted_sheet.getSheetId().toString()
  return sheet_id
}

function getSheetById(sheet_id, ss){
  let sheets = ss.getSheets()
  return sheets.find((s)=>s.getSheetId() === sheet_id)

}

function is_in_range(range_to_check, input_range){
  if(range_to_check.getSheet().getSheetId() != input_range.getSheet().getSheetId()){
    return false
  }
  
  if(input_range.getColumn()<range_to_check.getColumn()||
     input_range.getLastColumn()>range_to_check.getLastColumn()){
      return false

  }

  //.if(range_to_check.getLastRow()<range_to_check.getSheet().getMaxRows()){}

  if(input_range.getRow()<range_to_check.getRow()||
     input_range.getLastRow()>range_to_check.getLastRow()){
      return false

  }
  return true
}

function find_index_value_in_range(r,v){
  let c_index;

  for (const [r_index, r_row] of r.getValues().entries()) { 
        c_index=r_row.indexOf(v);
        if(c_index>-1){
          return r.getCell(r_index+1, c_index+1)
        } 
  }
  return null
}

function get_table_col_by_name(tab_range, col_name){
  tab_range.getRange(tab_range.getRow(), tab_range.getColumn(), 1, tab_range.getNumColumns())
}

function get_table_row(tab_range, row_num=1){
  tab_range.getRange(tab_range.getRow()+row_num, tab_range.getColumn(), 1, tab_range.getNumColumns())
}


function combine_dates(arr){
  return arr.join(arr, " ")
}

  function copyFolderContent(original_folder, new_folder) {
    Logger.log('Coping content of folder ' + original_folder.getName())
    //let original_folder = DriveApp.getFolderById(original_folder_id)
  
    let inner_files = original_folder.getFiles()
    let inner_folders = original_folder.getFolders()
    let file,folder,copied_folder, copied_file
  
    while(inner_files.hasNext()){
      file = inner_files.next()

      try{
        file.makeCopy(file.getName(),new_folder)
        Logger.log(`Copied file ${file.getName()}`)
      }catch(e){
        Logger.log("failed creating file "+file.getName())
      }

    
    }

    while(inner_folders.hasNext()){
      folder = inner_folders.next()
     
      copied_folder= new_folder.createFolder(folder.getName())
    
      copyFolderContent(folder,copied_folder)

    Logger.log(`Copied folder ${folder.getName()}`)
    }
  }

function getNamedRange(ss, nameOfRange){
  return ss.getNamedRanges().find((nr)=>nr.getName()==nameOfRange)?.getRange()
}

function formatTemplate(str, obj) {
        let formatedStr = str;
        for (k in obj) {
          formatedStr = formatedStr.replaceAll(`{{${k}}}`, obj[k].toString());
        }

        return formatedStr;
}

function translateToHebrew(s){
  return typeof s ==="string"&Boolean(s)?LanguageApp.translate(s,"en","he"):""
}


function fetchDataFromAPI(url) {
  // Fetch data from the specified URL using GET request
  var response = UrlFetchApp.fetch(url);
  
  // Check for successful response
  if (response.getResponseCode() === 200) {
    // Parse the response data (assuming JSON format)
    var data = JSON.parse(response.getContentText());
    // Process the data as needed
    return data;
  } else {
    Logger.log("Error fetching data: " + response.getResponseCode());
    return null;
  }
}


function getLastRowWithContent(sheet,column_num_to_check=1) {
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(lastRow, column_num_to_check); // Get the last row in column 1 (can be adjusted)
  var lastCell = range.getNextDataCell(SpreadsheetApp.Direction.UP);
  return lastCell ? lastCell.getRow() : 0; // Return 0 if no data found
}


function get_properties(f_id){
  Logger.log(fetchDataFromAPI('https://www.googleapis.com/drive/v2/files/1XlHV1fxlIF-4m-rZaFRL8ZJ0Xn2SM_vw/properties'))
}


function getMultiChoiseCell(cell_range){
  return new MultiChoiseOptionCell(cell_range)
}

function textHasTags(multiChoiseOptionObj,text,checkFormat=false){
  multiChoiseOptionObj.array.some((el)=>text.includes(checkFormat?MultiChoiseOptionCell.format_choise(el):el))
}



//functions for specific needs
function formatSpreadsheetFormFields(activeSheet) {
  let titles = activeSheet.getRange(1,1).getDataRegion(SpreadsheetApp.Dimension.COLUMNS)
  return titles.getValues()[0].join("\n''\n\n")+"\n''\n\n*Made With Make Automation"
}




