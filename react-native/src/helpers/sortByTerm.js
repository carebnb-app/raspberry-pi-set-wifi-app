var _sortByTerm = function (data, item, term) {
  return data.sort(function (a, b) {
    return a[item].toLowerCase().indexOf(term.toLowerCase()) < b[item].toLowerCase().indexOf(term.toLowerCase()) ? -1 : 1
  })
}

export default _sortByTerm
