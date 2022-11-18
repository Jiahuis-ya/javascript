
// getRealNumber
export const reg = /[-.]/g;
export const reg_English = /[A-Fa-f]/g;
export const reg_math = /\d/g;

// 获取实数
function getRealNumber(value1: number, value2: number) {
  return Math.trunc(value1 / value2)
}

// 获取余数
function getRemainder(value1: number, value2: number) {
  return value1 % value2
}

// 10进制转换n进制,只允许整数
export function decimalToAnyBase(value: string, typeNum: number) {
  if(value.match(reg) !== null) {
    throw new Error('传入数值不支持小数或负数')
  }
  const data = (value?.toString()?.split('') || []).reverse()
  const res = [] // 余数集合
  
    let realNumber = getRealNumber(+value, typeNum); // 实数
    let remainder = getRemainder(+value, typeNum);  // 余数
    res.push(remainder)

    while(realNumber !== 0) {
      remainder = realNumber % typeNum
      realNumber = getRealNumber(realNumber, typeNum)
      res.push(remainder)
    }

  return res.reverse().join('')
}

function numFormat(str: string) {
  // a:10...f:15
  const reg_English = /[A-Fa-f]/g
  const isLetter = reg_English.test(str)
  if(isLetter) {
    const charIndex = str.toUpperCase().charCodeAt(0)
    const strIndex = charIndex - 55
    return strIndex
  } else {
    return str
  }
  
}

// n进制转换10进制,只允许整数
export function anyBaseToDecimal(value: string) {

  if(value.match(reg) !== null) {
    throw new Error('传入数值不支持小数或负数')
  }
  let num = 0;

  return function(typeNum: number) {
    // if(typeNum < 16) alert(`请输入${typeNum}进制数`);
    const data = (value?.toString()?.split('') || []).reverse()
    
    data.forEach((item: string, index: number) => {
      num += +numFormat(item) * Math.pow(typeNum, index)
    })

    return num;
  }
}

/**
 * 检测16进制数是否有效
 * @param value 
 * @returns 
 */
function check16Letter(value: string): boolean {
  return (value.split('') || '').every(i => {
    if(i.match(reg_math)) {
      return +i >= 0 && +i <= 9
    } else if(i.match(reg_English)) {
        return true;
    } else {
      return false;
    }
  })
}

/**
 * 检测有效进制数
 * @param type 
 * @param value 
 * @returns 
 */
export function checkValid(type: string, value: string): boolean {
  let status = false;
  switch(type) {
    case '2':
    case '8':
    case '10':
      if((value.split('') || '').every(i => (+i >= 0 && +i <= (+type-1)))) {
        status = true;
      } else {
        status = false;
      }
    break;
    case '16':
      status = check16Letter(value);
    break;
    
  }

  return status;
}