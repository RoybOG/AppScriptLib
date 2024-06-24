/*
Script created by Itay Barak 2024
*/
class MultiChoiseOptionCell {
    constructor(cell_range){
        this.cell_range = cell_range
        this.value = typeof cell_range.getValue()=="string"?cell_range.getValue():""
    }
    format_choise(raw_str){
        return `[${raw_str}],`
    }
    update_options(new_value){
      this.value = new_value
      this.cell_range.setValue(this.value)
    }
    includes(raw_str){
      return this.value.includes(this.format_choise(raw_str))
    }
    remove_choise(choise_str){
            this.update_options(this.value.replaceAll(this.format_choise(choise_str),""))
    }
    add_choise(choise_str){
        if(this.includes(choise_str)){
            this.remove_choise(choise_str)
        }else{
            this.update_options(this.value + this.format_choise(choise_str))
        
    }}
    get text(){
        return this.value
    }
    get array(){
        return Array.from(this.value.matchAll(/\[(.+?)\]/g)).map(m=>m[1])
    }
    toString() {
        return this.text
    }
}
