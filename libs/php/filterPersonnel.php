<?php

include("config.php");

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

$executionStartTime = microtime(true);

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

//vars for filtering
$searchParam = empty($_REQUEST['searchVal']) ? "" : $_REQUEST['searchVal'];
$departmentID = empty($_REQUEST['departmentID']) ? null : $_REQUEST['departmentID'];
$locationID = empty($_REQUEST['locationID']) ? null : $_REQUEST['locationID'];


$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, p.departmentID, d.name as departmentName, l.name as locationName FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID)';

//check if any request values are received

$query .= " WHERE ";

if ($locationID)
    $query .= "l.id = " . $locationID . " AND ";
if ($departmentID)
    $query .=  "d.id = " . $departmentID . " AND ";


$query .= '(p.firstName LIKE "%' . $searchParam . '%" OR p.lastName LIKE "%' . $searchParam . '%")' . "ORDER BY p.lastName, p.firstName, d.name, l.name";


$result = $conn->query($query);


if (!$result) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}

$data = [];
//
while ($row = mysqli_fetch_assoc($result)) {

    array_push($data, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($data);

