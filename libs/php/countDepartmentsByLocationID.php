<?php

// example use from browser
// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

// remove next two lines for production

//ini_set('display_errors', 'On');
//error_reporting(E_ALL);

$executionStartTime = microtime(true);

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
$id =$_REQUEST['id'];

$query = $conn->prepare("SELECT COUNT(id) FROM department WHERE locationID = ?;");
$query->bind_param("i", $id);
$query->execute();
$result = $query->get_result();

$row = mysqli_fetch_row($result);

echo json_encode($row[0]);


