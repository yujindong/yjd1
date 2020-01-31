/* 农历 */
import {
  lunarInfo,
  beginYear,
  endYear,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  LUNAR_MONTH_CN_NAME,
  THE_CHINESE_ZODIAC
} from "../constants/index";
import { getHelperObj } from "./helper";
/**
 * 是否是农历闰年
 */
export function isLeapYear(year) {
  return getLeapMonth(year) !== 0;
}

/**
 * 计算农历的闰月
 * @param year
 * @return {number} 0: 没有闰月; (1 - 12) 闰月的月份
 */
export function getLeapMonth(year) {
  return lunarInfo[year - 1900] & 0xf;
}

/**
 * 农历年一年的总天数
 * 农历中月份大月30天，小月29天
 * @param year
 * @return {number}
 */
export function getLunarYearDays(year) {
  let sum = 348; // 12 * 29
  /*
    0x8000 => 16位二进制 1000 0000 0000 0000
    大月加一天 小月加0天
  */
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunarInfo[year - 1900] & i ? 1 : 0;
  }
  // 加上闰月的天数
  return sum + getLeapMonthDays(year);
}

/**
 * 计算农历闰月的天数，如果没有闰月，返回0
 * 农历大月30 小月29 润月也是这样
 * @param year
 * @return {number}
 */
export function getLeapMonthDays(year) {
  let days = 0;
  if (isLeapYear(year)) {
    days = (lunarInfo[year - 1900] & 0x10000) !== 0 ? 30 : 29;
  }
  return days;
}
/**
 * 计算农历某年某月的天数 闰月单独通过leapMonthDays获取
 * @param year
 * @param month 从1开始
 * @return {number}
 */
export function getMonthDays(year, month) {
  return lunarInfo[year - 1900] & (0x10000 >> month) ? 30 : 29;
}

/**
 * 获取年份的天干地支信息
 * 天干
 * 甲乙丙丁戊己庚辛壬癸 10进制
 * 地支
 * 子丑寅卯辰巳午未申酉戌亥 12进制
 * 天干地支
 * 60进制
 * 1900年1月31日庚子年正月初一
 * @param year 农历年
 */
export function getGanZhis(year) {
  let num = year - 1900 + 36;
  const zodiac = THE_CHINESE_ZODIAC[num % 12];
  const gan = HEAVENLY_STEMS[num % 10];
  const zhi = EARTHLY_BRANCHES[num % 12];
  return {
    gan,
    zhi,
    zodiac
  };
}

/**
 * 计算农历年
 * @param helpObj
 */
export function getYear(helpObj) {
  let year; // year 农历年
  let sumDays = 0; // sumDays 1900年开始到gregorianDate所在的年的总天数 如果正好是dateOffset 则 sumDays与dateOffset相等
  let yearDate; // 当前农历年的第几天 正月初一是1
  // 计算年
  for (let i = beginYear; i < endYear; i++) {
    let yearDays = getLunarYearDays(i);
    if (sumDays + yearDays > helpObj.dateOffset) {
      year = i;
      break;
    }
    sumDays += yearDays;
    year = i;
  }
  yearDate = helpObj.dateOffset - sumDays + 1;
  return {
    year,
    yearDate
  };
}

/**
 * 获取农历月日
 * @param year 农历年
 * @param yearDate getYear()得到的农历yearDate
 */
export function getMonthDate(year, yearDate) {
  let month; // 农历月份
  let date; // 农历日期
  let isLeap = false; // 是否为闰月
  let leapMonth = getLeapMonth(year); // 闰月

  let monthSumDay = 0;
  for (let i = 1; i < 13; i++) {
    // 获得每个月的天数
    let monthDays = getMonthDays(year, i);
    // 如果monthSumDay加下个月的天数 大于 yearDate 则说明月份是当前循环
    if (monthSumDay + monthDays >= yearDate) {
      month = i;
      date = yearDate - monthSumDay;
      break;
    }
    monthSumDay += monthDays;
    // 处理闰月情况
    if (isLeapYear(year) && i === leapMonth) {
      if (monthSumDay < yearDate) {
        monthDays = getLeapMonthDays(year);
        if (monthSumDay + monthDays >= yearDate) {
          month = i;
          isLeap = true;
          date = yearDate - monthSumDay;
          break;
        }
      }
      monthSumDay += monthDays;
    }
  }
  return {
    month,
    isLeap,
    date,
    leapMonth
  };
}

/**
 * 计算当天的农历信息 农历以1900年1月31日庚子年为基准计算
 * @param gregorianDate 公历日期
 */
export function lunarDateInfo(gregorianDate) {
  const helpObj = getHelperObj(gregorianDate);
  // 计算年
  const { year, yearDate } = getYear(helpObj);
  const { month, isLeap, date, leapMonth } = getMonthDate(year, yearDate);

  const ganZhis = getGanZhis(year);
  const monthNames = LUNAR_MONTH_CN_NAME[month - 1].map((name) => {
    return (isLeap ? "润" : "") + name;
  });
  return {
    yearDate,
    year,
    month,
    date,
    leapMonth,
    isLeap,
    ganZhis,
    monthNames
  };
}
