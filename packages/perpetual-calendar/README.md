# 日历数据工具 
用来计算1900-2050年之间的日历信息 
农历支持1900年2月31日 庚子年正月初一开始到2050年，包括天干地支生肖节气


## Usage

    暂未提供typescript的types

```js
import Util from "@yjd/perpetual-calendar";

// 传入公历1901年2月18日
Util.Lunar.lunarDateInfo(new Date(1901, 1, 18));
// 农历信息 {"yearDate":384,"year":1900,"month":12,"date":30,"leapMonth":8,"isLeap":false,"ganZhis":{"gan":"庚","zhi":"子"},"monthNames":["腊月","涂月","嘉平","季冬","冰月"]}

Util.Lunar.lunarDateInfo(new Date(2020, 4, 23));
// 农历信息 {"yearDate":120,"year":2020,"month":4,"date":1,"leapMonth":4,"isLeap":true,"ganZhis":{"gan":"庚","zhi":"子"},"monthNames":["润四月","润阴月","润梅月","润余月","润清和","润槐序","润孟夏"]}
```
