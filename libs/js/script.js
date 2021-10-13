import {
    populatePage,
    deleteDepartmentFromDb,
    deleteLocationFromDb,
    deletePersonFromDb,
    addDepartmentToDb,
    addLocationToDb,
    addPersonToDb,
    updatePerson,
    updateLocation,
    updateDepartment,
    filterDepartments,
    filterResults
} from "/companypersonnel/libs/js/functions.js"

populatePage();

//modal listeners
$("#add-person").on("click", () => $("#add-person-modal").modal("show"));
$("#locations-link").on("click", () => $("#location-modal").modal("show"));
$("#departments-link").on("click", () => $("#department-modal").modal("show"));

//buttons listeners
$("#add-employee-save-btn").on("click", addPersonToDb);
$("#add-department-save-btn").on("click", addDepartmentToDb);
$("#add-location-save-btn").on("click", addLocationToDb);
$("#delete-department-btn").on("click", deleteDepartmentFromDb);
$("#delete-location-btn").on("click", deleteLocationFromDb);
$("#delete-person").on("click", deletePersonFromDb);
$("#edit-person").on("click", updatePerson);
$("#edit-department-btn").on("click", updateDepartment);
$("#edit-location-btn").on("click", updateLocation);


//select listeners
$("#location-filter").on("change", filterDepartments);
$("#department-filter").on("change", () => {
    let searchInput = document.getElementById("search").value.toUpperCase();
    let departmentID = $("#department-filter").val();
    let locationID = $("#location-filter").val();

    $(".dropdown-toggle").dropdown('toggle');

    filterResults(searchInput, departmentID, locationID);
})

//search listener
$("#search").on("change keyup paste ", () => {
    let searchInput = document.getElementById("search").value.toUpperCase();
    let departmentID = $("#department-filter").val();
    let locationID = $("#location-filter").val();

    filterResults(searchInput, departmentID, locationID);
});
