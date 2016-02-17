// Past Filter
setListApp.filter('past', function () {
  return function (items) {
    var filtered = [];
    angular.forEach(items, function (item) {
      if (Date.parse(item.date) < Date.parse(Date())) { filtered.push(item) };
    })
    return filtered;
  }
})
