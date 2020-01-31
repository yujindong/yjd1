/* 公历 */
import { MONTH_DAYS } from "../constants/index";

/**
 * 是否是闰年
 * 计算方法如下，第四点我可能活不到
 *  1. 公历闰年判定遵循的规律为：四年一闰、百年不闰、400年再闰。
 *  2. 公历闰年的精确计算方法：普通年能被四整除且不能被100整除的为闰年。
 *  3. 世纪年能被400整除的是闰年，如2000年是闰年，1900年不是闰年。
 *  4. 对于数值很大的年份，如果这年能整除3200并且能整除172800则是闰年。
 * @param year
 * @return boolean true: 是闰年; false: 不是闰年
 */
export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
/**
 * 计算公历某年某月的天数
 * @param year 公历年
 * @param month 公历月 从0开始
 * @return {number}
 */
export function monthDays(year, month) {
  if (month === 1) {
    return isLeapYear(year) ? 29 : 28;
  } else return MONTH_DAYS[month];
}

