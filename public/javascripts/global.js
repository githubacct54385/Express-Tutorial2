// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Add User button click
    $('#btnAddUser').on('click', addUser);    

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    
    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {
        // stick our user data array into a userlist variable in the global object
        userListData = data;
        
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
  event.preventDefault();
  
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    // if it is, compile all user info into one object
    var newUser = {
        'username': $('#addUser fieldset input#inputUserName').val();
        'email': $('#addUser fieldset input#inputUserEmail').val();
        'fullname': $('#addUser fieldset input#inputUserFullName').val();
        'age': $('#addUser fieldset input#inputUserAge').val();
        'location': $('#addUser fieldset input#inputUserLocation').val();
        'gender': $('#addUser fieldset input#inputUserGender').val();
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      ur: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {
      
      // check for successful (blank) response
      if(response.msg === '') {

        // clear the form inputs
        $('#addUser fieldset input').val();

        // Update the table
        populateTable();
      } else {
        // if something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  } else {
    // if error count is more than zero, error out
    alert('Please fill in all the fields');
    return false;
  }
};










