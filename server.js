var express = require('express')
var app = express()

app.set("view options", {layout: false})
app.use(express.static(__dirname + '/views'))

app.get('/', function (req, res) {
  res.render('/views/index.html')
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})