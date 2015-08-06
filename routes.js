// ROUTES
// ######
// ######

Router.route('/', function(){
});

Router.route('/mood-super-good', {
    name: 'mood-super-good', //optional
    where: 'server', //important to make sure that the function is synchronous
    action: function() {
        var percent = moodPercent();
        //console.log(this.request.body);
        var xmlData = myfeedExport(percent); //grabs your data
        this.response.writeHead(200, {'Content-Type': 'application/xml'}); //outputs data to visitor
        this.response.end(xmlData);
    }
});