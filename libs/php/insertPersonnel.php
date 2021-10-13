<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
//this includes the login details
	include("config.php");

	//header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?,?,?,?,?)');

	$query->bind_param('ssssi' ,$_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['jobTitle'], $_REQUEST['email'], $_REQUEST['departmentID']);

	$query->execute();



//return id for edit person use

$query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, p.departmentID, d.name as departmentName, l.name as locationName FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.email = ? AND p.firstName = ? AND p.lastName = ?');
$query->bind_param('sss', $_REQUEST['email'], $_REQUEST['firstName'], $_REQUEST['lastName']);
$query->execute();



$result = $query->get_result();

$data = [];

while ($row = mysqli_fetch_assoc($result)) {

    array_push($data, $row);

}


	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [$data];
	
	mysqli_close($conn);

	echo json_encode($data);

?>