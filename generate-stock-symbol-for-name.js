function generateStockSymbolForName(theName) {
  var name = theName.trim();
  var symbol;

  if (name.length > 0) {
    if (name.length < 4) {
      symbol = name;
    }
    else if (name.indexOf(' ') !== -1) {
      var words = name.split(' ');
      symbol = words.map(getFirstChar).join('');
    }
    else  {
      var first = getFirstChar(name);
      name = name.slice(1);

      if (name.length < 1) {
        symbol = first;
      }
      else {
        var last = name[name.length - 1];
        name = name.slice(0, name.length - 1);
        if (name.length < 1) {
          symbol = first + last;
        }
        else {
          symbol = first + summarizeMiddle(name) + last;
        }
      }
    }
  }

  return symbol.toUpperCase();
}

function summarizeMiddle(middleOfName) {
  var summary;
  var l = middleOfName.length;
  if (l < 3) {
    summary = middleOfName;
  }
  else {
    var index1 = ~~(l * 0.333) - 1;
    if (index1 < 0) {
      index1 = 0;
    }
    var index2 = ~~(l * 0.666);
    summary = middleOfName[index1] + middleOfName[index2];
  }

  return summary;
}

function getFirstChar(s) {
  if (s.length > 0) {
    return s[0];
  }
}

module.exports = generateStockSymbolForName;
