
/** returns a JSON-stringified string with an indent of 2 spaces */
export function jsoning(obj:any){
  return JSON.stringify(obj,undefined, "  ");
}