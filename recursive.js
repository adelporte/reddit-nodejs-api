// load the mysql library
var mysql = require('mysql');

// create a connection to our Cloud9 server
var c = mysql.createConnection({
  host     : 'localhost',
  user     : 'ziad_saab', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});



//This is an example of a LAMFF function.
//Maxlevel is the base case for our recursive function
//parentIds is not required on the first run so a parameter shift is required
//Notice that the function is oly called with two arguments

function getComments(maxLevel, parentIds, commentsMap, finalComments, callback) {
  //Query declared at top level to build it dynamically.
  var query;
  if (!callback) {
    // first time function is called
    callback = parentIds;
    parentIds = [];
    commentsMap = {};
    finalComments = [];
    query = 'select * from comments where parentId is null';
  }
  //this is where the process is over. there is no parentIds left.
  else if (maxLevel === 0 || parentIds.length === 0) {
    callback(null, finalComments);
    return;
  }
  else {
      //This is where the magic happens: in is like where id = 1 or id = 2 or id = 3
    query = 'select * from comments where parentId in (' + parentIds.join(',') + ')';
  }
  c.query(query, function(err, res) {
    if (err) {
      callback(err);
      return;
    }
    res.forEach(
      function(comment) {
        commentsMap[comment.id] = comment;
        if (comment.parentId === null) {
          finalComments.push(comment);
        }
        else {
          var parent = commentsMap[comment.parentId];
          parent.replies = parent.replies || [];
          parent.replies.push(comment);
        }
      }
    );
    
    var newParentIds = res.map(function(item) {return item.id;});
    getComments(maxLevel - 1, newParentIds, commentsMap, finalComments, callback);
  });
}
//This is the recursive part - we recall the function until it goes through the else if
getComments(5, function(err, res) {
  console.log(JSON.stringify(res, null, 4));
})