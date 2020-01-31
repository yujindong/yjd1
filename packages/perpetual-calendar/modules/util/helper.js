import { baseDateTime } from "../constants/index";

export function getHelperObj(gregorianDate) {
  // 计算传入的公历时间，与 baseDate[1900年1月31日]的偏移天数
  let dateOffset =
    (Date.UTC(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate()) - baseDateTime) /
    (24 * 60 * 60 * 1000);
  return {
    gregorianDate,
    dateOffset
  }
}
