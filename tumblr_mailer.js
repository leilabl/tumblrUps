var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync("email_template.html", "utf8");

function csvParse(str){
	var arr = str.split("\n");
	var keys = arr[0].split(",");
	arr.splice(0,1);
	var contacts = [];
	var data = [];
	for (var i = 0; i < arr.length-1; i++){
		var obj = {};
		contacts = arr[i].split(",");
		for(var j = 0; j < keys.length ; j++){				
			obj[keys[j]] = contacts[j];
		}
		data.push(obj);
	}
	return data;
}

var csvData = csvParse(csvFile);

var client = tumblr.createClient({
  consumer_key: 'kYw5eMgY3LHlfIhqhRv2AutxXmccGDK2zCBIb9OYygP6ocUxqk',
  consumer_secret: 'IGWDJY6Yfct9hCJmLVsNaE4i6IcCrT5vkjHLl7ahZe5NkXp4Z0',
  token: 'gsdPYGlcCsyjkwEoGdzHMmycwstkF4UwU0i9UlAI8gC3CXBjKs',
  token_secret: 'dSZ8H7pwzreDBOPts4MJNMOAa7Mo7iEwGspNqQqNXuNuKub0rY'
});

var latestPosts = [];

client.posts('leilaloezer.tumblr.com', function(err, blog){
	var today = Math.floor((new Date).getTime()/1000);
	// var latestPosts = [];
	for (var i = 0 ; i < blog.posts.length-1; i++){
		var title = blog.posts[i].title;
		var date = blog.posts[i].timestamp;
		var link = blog.posts[i].post_url;
		var obj = {};
		if (today-date<604800){
			obj.title = title;
			obj.link = link;
		}
		latestPosts.push(obj);
	}
	//console.log(latestPosts);
	csvData.forEach(function(row){
	var firstName = row['firstName'];

	var numMonthsSinceContact = row['numMonthsSinceContact'];

	var customTemplate = ejs.render(emailTemplate, {
		firstName: firstName, numMonthsSinceContact: numMonthsSinceContact, latestPosts: latestPosts
	});

	console.log(customTemplate);

});

});

// console.log(latestPosts);






// client.userInfo(function (err, data) {
//     // ...
// });


