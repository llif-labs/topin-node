const DateUtil = {
  today() {
    // this.format을 명시적으로 호출
    return this.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  },

  format(date, format) {
    const map = {
      YYYY: date.getFullYear().toString(),
      yyyy: date.getFullYear().toString(),
      MM: (date.getMonth() + 1).toString().padStart(2, "0"),
      DD: date.getDate().toString().padStart(2, "0"),
      HH: date.getHours().toString().padStart(2, "0"),
      mm: date.getMinutes().toString().padStart(2, "0"),
      ss: date.getSeconds().toString().padStart(2, "0"),
    };

    // 패턴에 매칭되는 값을 대체
    return format.replace(/YYYY|yyyy|MM|DD|HH|mm|ss/g, (match) => map[match]);
  }
};

export default DateUtil;
