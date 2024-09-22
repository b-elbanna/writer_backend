export default function dateObjFromIsoStr(tstr: string): Date {
  let TD = new Date(tstr);
  
  //   let cTD = new Date(TD.getTime() + TD.getTimezoneOffset() * 60 * 1000);
  return TD;
}