const populatePage = () => {
    makeAjaxCall("libs/php/getAllPersonnel.php", {}, populatePersonnel, error);
    makeAjaxCall("libs/php/getAllDepartments.php", {}, populateDepartments, error);
    makeAjaxCall("libs/php/getAllLocations.php", {}, populateLocations, error);
}
const getDepartments = () => makeAjaxCall("libs/php/getAllDepartments.php", {}, populateDepartments, error);
const getLocations = () => makeAjaxCall("libs/php/getAllLocations.php", {}, populateLocations, error);


const makeAjaxCall = (url, data, succes, error) => {
    $('#preloader').fadeIn('fast');
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: data
    }).then(succes, error).done(() => $('#preloader').fadeOut('slow'));
}

const populateDepartments = (departments) => {
    $(".departments").empty();
    $(".department-select").empty();

    $("#department-filter").append("<option value=0 name='department0' selected>All departments</option>");

    $(".departments").append(`<li class=\" department fs-4\"><div class="d-flex flex-row"><p>All departments</p></div></li>`);
    document.getElementById("departments-list").lastElementChild.addEventListener("click", ()=>$("#department-filter").val(0).change());


    departments.forEach((department) => {
        //add elements
        $(".departments").append(`<li class=\" department fs-4\"><div class="d-flex flex-row"><p>${department.name}</p></div></li>`);
        $(".department-select").append(`<option value=${department.id} class="department-option">${department.name}</option>`);
        //add filtering on click
        document.getElementById("departments-list").lastElementChild.addEventListener("click", () => {
            $("#department-filter").val(department.id);
            filterResults($("#search").val().toUpperCase(), department.id, $("#location-filter").val());
        });
    });
}

const populatePersonnel = (personnel) => {

    $(".personnel").empty();

    personnel.forEach(person => {

        //add new entry
        $(".personnel").append(`<li class="person  align-items-center row"><span
                    class="col-auto initials text-center text-capitalize fs-3 align-items-center justify-content-center">${person.firstName.charAt(0) + person.lastName.charAt(0)}</span>
                <div class="col-auto"><p class="fs-4 row fullName">${person.lastName + ", " + person.firstName + " "}<span
                        class="row">${person.departmentName + ", " + person.locationName}</span></p>
                </div>
            </li>`);

        //edit person listener
        document.getElementById("personnel-list").lastElementChild.addEventListener("click", () => {
            let succesFunction = (result) => {
                for (let key in result[0])
                    $(`#edit-person-${key}`).val(result[0][key])
                $("#edit-person-modal").modal("show");
            }
            //modify inputs based on person
            makeAjaxCall("libs/php/getPersonByID.php", {id: person.id}, succesFunction, error);
        });
    });
}

const populateLocations = (locations) => {
    $(".location-select").empty();
    $("#location-filter").append("<option value=0 selected>All locations</option>");
    locations.forEach(location => {
        $(".location-select").append(`<option value=${location.id} class="location">${location.name}</option>`);
    });
}

const addPersonToDb = () => {
    let person = {
        firstName: $("#add-person-firstName").val(),
        lastName: $("#add-person-lastName").val(),
        email: $("#add-person-email").val(),
        jobTitle: $("#add-person-jobTitle").val(),
        departmentID: $("#add-person-departmentID").val(),
    }

    let succesFunction = () => {
        refreshPage();
        $(".modal").modal("hide");
        $.alert("Person succesfully added!");
    }

    makeAjaxCall("libs/php/insertPersonnel.php", person, succesFunction, error);
}

const addDepartmentToDb = () => {
    let dept = {
        name: $("#add-department-name").val(),
        locationID: $("#add-department-locationID").val()
    };

    let succesFunction = () => {
        filterDepartments();
        $.alert("Department added succesfully");
    }
    if (dept.locationID !== null && dept.name !== null) {
        $(".modal").modal("hide");
        makeAjaxCall("libs/php/insertDepartment.php", dept, succesFunction, error);
    }
}

const addLocationToDb = () => {

    let newLocation = {name: $("#add-location-name").val()};

    let succcesFunction = () => {
        $(".modal").modal("hide");
        getLocations();
        $.alert("Location added succesfully");
    }

    if ($("#add-location-name").val() !== undefined) {
        makeAjaxCall("libs/php/insertLocation.php", newLocation, succcesFunction, error);
    }
}

const deletePersonFromDb = () => {

    let personId = $("#edit-person-id").val();

    let succesFunction = (result) => {
        $.alert("Employee deleted succesfully!!");
        refreshPage();
        $(".modal").modal("hide");
    }

    createConfirmWindow({
        title: 'Delete employee?',
        url: "libs/php/deletePersonByID.php",
        data: {id: personId},
        callOnSuccesFunction: succesFunction
    });

}

const deleteLocationFromDb = () => {
    let locationId = $("#delete-location-id").val();

    let succesFunction = (result) => {
        if (result === 0) {
            createConfirmWindow({
                title: 'Delete location?',
                url: "libs/php/deleteLocationByID.php",
                data: {id: locationId},
                callOnSuccesFunction: () => {
                    $.alert("Location deleted succesfully!!")
                    getLocations();
                }
            });
            $(".modal").modal("hide");
        } else {
            $.alert(`There are ${result} department(s) left in the location, please delete them before proceeding`);
            $(".modal").modal("hide");
        }
    }
    makeAjaxCall("libs/php/countDepartmentsByLocationID.php", {id: locationId}, succesFunction, error);
}

const deleteDepartmentFromDb = () => {

    let departmentId = $("#delete-department-id").val();

    console.log(departmentId)
    let succesFunction = (result) => {
        if (result === 0) {
            createConfirmWindow({
                title: 'Delete department?',
                url: "libs/php/deleteDepartmentByID.php",
                data: {id: departmentId},
                callOnSuccesFunction: () => {
                    $.alert("Department deleted succesfully!!")
                    $(".modal").modal("hide");
                    filterDepartments();
                }
            });
            $(".modal").modal("hide");
        } else {
            $.alert(`There are ${result} persons left in the department, please delete them before proceeding`);
            $(".modal").modal("hide");
        }

    }

    makeAjaxCall("libs/php/countPersonnelByDepartmentID.php", {id: departmentId}, succesFunction, error);


}

const updatePerson = () => {

    let person = {
        id: $("#edit-person-id").val(),
        firstName: $("#edit-person-firstName").val(),
        lastName: $("#edit-person-lastName").val(),
        email: $("#edit-person-email").val(),
        jobTitle: $("#edit-person-jobTitle").val(),
        departmentID: $("#edit-person-departmentID").val()
    }

    let succesFunction = (result) => {
        $.alert("Edit succesfully!!");
        refreshPage();
        $(".modal").modal("hide");
    }

    createConfirmWindow({
        title: 'save changes?',
        url: "libs/php/updatePerson.php",
        data: person,
        callOnSuccesFunction: succesFunction,
    });

}

const updateDepartment = () => {
    //show the modal
    $(".modal").modal("hide");
    $("#edit-department-modal").modal("show");
    //show correct data in modal
    let departmentID = $("#delete-department-id :selected").val();

    let succesFunction = (result) => {
        $("#edit-department-name").val(result[0].name);
        $("#edit-department-select").val(result[0].locationID);

        //add listener to save button
        $('#edit-department-save-btn').off();
        $('#edit-department-save-btn').on("click", () => {
            let data = {
                id: result[0].id,
                name: $("#edit-department-name").val(),
                locationID: $("#edit-department-select").val()
            }

            makeAjaxCall("libs/php/updateDepartment.php", data, () => {
                $(".modal").modal("hide");
                filterDepartments();
                $.alert("Edit succesfully");
            }, error)
        });
    }

    makeAjaxCall("libs/php/getDepartmentByID.php", {id: departmentID}, succesFunction, error);

}

const updateLocation = () => {
    //show the modal
    $(".modal").modal("hide");
    $("#edit-location-modal").modal("show");
    //show correct data in modal
    let locationID = $("#delete-location-id").val();

    let succesFunction = (result) => {
        $("#edit-location-name").val(result[0].name);

        //add listener to save button
        $('#edit-location-save-btn').off();
        $('#edit-location-save-btn').on("click", () => {
            let data = {
                id: result[0].id,
                name: $("#edit-location-name").val(),
            }

            makeAjaxCall("libs/php/updateLocation.php", data, () => {
                $(".modal").modal("hide");
                getLocations();
                refreshPage();
                $.alert("Edit succesfully");
            }, error)
        });
    }

    makeAjaxCall("libs/php/getLocationByID.php", {id: locationID}, succesFunction, error);

}

const filterResults = (searchValue = "", departmentID = 0, locationID = 0) => {
    let data = {
        searchVal: searchValue,
        departmentID: departmentID,
        locationID: locationID
    };

    makeAjaxCall("libs/php/filterPersonnel.php", data, populatePersonnel, error)
}

const filterDepartments = () => {
    let locationID = {locationID: $("#location-filter").val()};
    let succesFunction = (result) => {
        $(".dropdown-toggle").dropdown('hide');
        populateDepartments(result);
        filterResults($("#search").val().toUpperCase(), 0, $("#location-filter").val());
    }

    makeAjaxCall("libs/php/getDepartmentsByLocationID.php", locationID, succesFunction, error);
}

const createConfirmWindow = (object) => {
    $.confirm({
        title: object.title,
        content: '',
        type: 'red',
        typeAnimated: true,
        autoClose: 'no|8000',
        buttons: {
            yes: {
                text: 'Yes',
                btnClass: 'btn-red',
                action: () => makeAjaxCall(object.url, object.data, object.callOnSuccesFunction, error)
            },
            no: function () {
            }
        }
    });
}

function error(xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText)
    console.log(ajaxOptions)
    console.log(thrownError)
}

function refreshPage() {
    let searchInput = document.getElementById("search").value.toUpperCase();
    let departmentID = $("#department-filter").val();
    let locationID = $("#location-filter").val();
    filterResults(searchInput, departmentID, locationID);
}

export {
    populatePage,
    deleteDepartmentFromDb,
    deleteLocationFromDb,
    deletePersonFromDb,
    addDepartmentToDb,
    addLocationToDb,
    addPersonToDb,
    updatePerson,
    updateDepartment,
    updateLocation,
    filterDepartments,
    filterResults
}