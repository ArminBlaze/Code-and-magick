function getMessage(a, b) {
  var res;
  var sumA = 0;

  if (typeof a === 'boolean') {
    if (a) {
      res = 'Я попал в ' + b;
    }
    else {
      res = 'Я никуда не попал';
    }
  }
  else if (typeof a === 'number') {
    res = 'Я прыгнул на ' + a * 100 + ' сантиметров';
  }
  else if (Array.isArray(a) && Array.isArray(b)) {
    for (var i = 0; i < a.length; i++) {
      sumA += a[i] * b[i];
    }
    res = 'Я прошёл ' + sumA + ' метров';
  }
  else if (Array.isArray(a)) {
    for (var i = 0; i < a.length; i++) {
      sumA += a[i];
    }
    res = 'Я прошёл ' + sumA + ' шагов';
  }
  return res;
}

