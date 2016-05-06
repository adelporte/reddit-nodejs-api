// load the mysql library
var mysql = require('mysql');

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'adelporte', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);

//It's request time!
// redditAPI.createUser({
//   username: 'hello232',
//   password: 'xxx'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     redditAPI.createPost({
//       title: 'hi reddit!',
//       url: 'https://www.reddit.com',
//       userId: user.id
//     }, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });
//   }
// });

// redditAPI.getAllPosts(function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// });

// //redditAPI.getAllPostsForUser(1, function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// })

// //redditAPI.getSinglePost(1, function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// });

// /*redditAPI.createSubreddit({name:"The world is doomed 8"},function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// });*/

// //redditAPI.getAllSubreddits(function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// })

// redditAPI.createPost(1, {userId:1, title:"Break it", url:"www.brk-it.com", subredditId:1}, function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// });

// redditAPI.createComment({text:"This is some text2", userId:1, postId:1}, function(err, result){if(err){
// console.log(err);
// } else {
// console.log(result);
// }
// })