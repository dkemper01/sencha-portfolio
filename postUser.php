<?php
$email = $_REQUEST['email'];
$name = $_REQUEST['name'];
$message = $_REQUEST['message'];
$url = $_REQUEST['url'];

header('Content-Type: application/json');

if(($email != '') && ($name != '') && ($message != '')) {
  mail("daniel@dankemper.net", "Mobile contact form submission " . $url, $message, "From: $email");
	echo '{"success":true, "msg":' . json_encode('Message transmission successful!') . '}';
} else {
  // { success: false,
  //   msg: 'All required fields are not populated.',
  //   errors: {
  //		name: 'name is required.'
  //   },
  //   name: <name_field_value>
  // }
  //		
	if (($email == null) || ($email == '')) {
	  echo '{"success":false, "msg":' .
		json_encode('All required fields are not populated.') .
		', "errors" : { "email" :' . json_encode('email is required.') . 
		'}' . ', "email" :' . json_encode($email) . '}';
	} else if (($name == null) || ($name == '')) {
	  	echo '{"success":false, "msg":' .
		json_encode('All required fields are not populated.') .
		', "errors" : { "name" :' . json_encode('name is required.') . 
		'}' . ', "name" :' . json_encode($name) . '}';
	} else if (($message == null) || ($message == '')) {
	  	echo '{"success":false, "msg":' .
		json_encode('All required fields are not populated.') .
		', "errors" : { "message" :' . json_encode('A message is required.') . 
		'}' . ', "message" :' . json_encode($message) . '}';
	}
}
?>