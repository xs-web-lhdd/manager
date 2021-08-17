/**
 * @description 工具函数封装
 * @author 凉风有信、
 */

export default {
  formateDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
        // 'y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const val = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
        }
    }
    return fmt;
  },
  formateTime(value, stdValue) { // 格式化时间戳的简单方式（根据数据库返回的时间戳模型进行格式化） 2021-08-14T07:35:54.850+00:00
    return value.split('.')[0].split('T')[0] + ' ' + stdValue.toString().split(' ')[4]
  },
  formate(value) { // 格式化时间戳的简单方式（根据数据库返回的时间戳模型进行格式化） 2021-08-14T07:35:54.850+00:00
    return value.split('.')[0].split('T')[0] + ' ' + value.split('.')[0].split('T')[1]
  }
}