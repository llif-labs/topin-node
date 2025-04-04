const DateUtil = {
  today() {
    // this.format을 명시적으로 호출
    return this.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  },

  format(date, format) {
    const d = new Date(date);
    const map = {
      YYYY: d.getFullYear().toString(),
      YY: d.getFullYear().toString().slice(2, 4),
      yyyy: d.getFullYear().toString(),
      MM: (d.getMonth() + 1).toString().padStart(2, "0"),
      DD: d.getDate().toString().padStart(2, "0"),
      HH: d.getHours().toString().padStart(2, "0"),
      mm: d.getMinutes().toString().padStart(2, "0"),
      ss: d.getSeconds().toString().padStart(2, "0"),
    };

    // 패턴에 매칭되는 값을 대체
    return format.replace(/YYYY|yyyy|YY|MM|DD|HH|mm|ss/g, (match) => map[match]);
  },
};

export default DateUtil;
