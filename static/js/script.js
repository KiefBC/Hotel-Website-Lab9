//<editor-fold desc="Widget">
const initializeDatePickers = () => {
    let defaultStartDate = new Date();
    let defaultEndDate = new Date();
    defaultEndDate.setDate(defaultStartDate.getDate() + 1);

    $(() => {
        $('#start_date').datepicker({
            minDate: 0,
            defaultDate: defaultStartDate,
            onSelect: (selectedDate) => {
                let minEndDate = new Date(selectedDate);
                minEndDate.setDate(minEndDate.getDate() + 1);
                // Set the minDate of the end date datepicker to the day after the selected start date
                $('#end_date').datepicker('option', 'minDate', minEndDate);

                calculateStayLength();
            }
        }).datepicker('setDate', defaultStartDate);

        $('#end_date').datepicker({
            minDate: 1,
            defaultDate: defaultEndDate,
            onSelect: calculateStayLength
        }).datepicker('setDate', defaultEndDate);
    });
}

const calculateStayLength = () => {
    let dayPlural;

    let startDate = new Date($('#start_date').datepicker('getDate'));
    let endDate = new Date($('#end_date').datepicker('getDate'));
    let stayLength = (endDate - startDate) / (1000 * 60 * 60 * 24);

    if (stayLength === 1) {
        dayPlural = "day";
    } else {
        dayPlural = "days";
    }

    const cardFooter = $("#date-select");
    cardFooter.html(`
    You have chosen to stay for ${stayLength} ${dayPlural}.
    `);
}

const initializeWidget = () => {
    console.log("\nInitiating Widget...\n");
    initializeDatePickers();

    $("#submit-button").on("click", () => {
        let start_date = $("#start_date").val();
        let end_date = $("#end_date").val();
        let radioValue = $("input[name='btnradio']:checked").attr("id");

        buildShell(start_date, end_date, radioValue);
    });
};

const buildShell = (start_date, end_date, radioValue) => {
    const resultsDiv = $("#results");

    // Convert the date strings to Date objects
    let startDate = new Date(start_date);
    let endDate = new Date(end_date);

    // Subtract the dates and convert the result from milliseconds to days
    let stayLength = (endDate - startDate) / (1000 * 60 * 60 * 24);


    resultsDiv.html(`
    <p>You have chosen to stay for ${stayLength} days.</p>
    <p> We appreciate your business and hope you accept our Leader the Holy Lobster.</p>
    <p id="room-type-results"></p>
    `);

    if (radioValue === "button-single-room") {
        $("#room-type-results").html("You have chosen a single room. You must be lonely. But don't worry, our Lobster Clawettes will keep you company!");
        console.log("single room");
    } else if (radioValue === "button-double-room") {
        $("#room-type-results").html("A double room? Do you have friends? You saw the sign right? Only Lobsters allowed in this club. We will let it slide this time.");
        console.log("double room");
    } else if (radioValue === "button-mona-lisa") {
        $("#room-type-results").html("The Mona Lisa is the ultimate room for the ultimate Claw. We hope you understand that there is a $1000 surcharge for this room.");
        console.log("suite");
    }
};

initializeWidget();
//</editor-fold>

let userLogin = false;
const hotelRooms = [{
    title: "Standard Package",
    description: "This is our standard package. It includes a bed, a bathroom, and a TV. It's perfect for a short stay.",
    price: "$100",
    imgRef: "static/img/hotel-room-one.webp"
}, {
    title: "Deluxe Package",
    description: "This is the deluxe package. It includes a bed, a bathroom, a TV, and a balcony. It's perfect for a longer stay.",
    price: "$200",
    imgRef: "static/img/hotel-room-two.webp"
}, {
    title: "Suite Package",
    description: "This is the suite package. It includes a bed, a bathroom, a TV, a balcony, and a kitchen. It's perfect for a forever stay.",
    price: "$300",
    imgRef: "static/img/hotel-room-three.webp"
}];

$("#section-one-button").on("click", (e) => {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#section2").offset().top
    });
});

$("#login-button").on("click", (e) => {
    $("#login-modal").modal("show");
});

$("#which-room-button").on("click", (e) => {
    e.preventDefault();
    $('html, body').animate({
        // scroll to #single-room
        scrollTop: $("#single-room").offset().top - 60
    });
});

$("#register-submit-btn").on("click", (event) => {
   clearInvalidInputs();

    const $firstName = $('#first-name').val();
    const $lastName = $('#last-name').val();
    const $phoneNumber = $('#phone-number').val();
    const $email = $('#email').val();
    const $age = $('#age').val();
    const $postalCode = $('#postal-code').val();

    if (verifyForm()) {
        userLogin = true;
        greetUser($firstName, $lastName);
        buildUserProfile($firstName, $lastName, $age, $phoneNumber, $postalCode, $email);
    }
});

const greetUser = (firstName, lastName) => {
    $("#greet-user").html(`Welcome, ${firstName} ${lastName}!`);
}

const buildUserProfile = (firstName, lastName, age, phone, address, email) => {
    const userProfile = $("#user-profile");
    userProfile.html(`
        <div class="card mt-3">
          <div class="card-header">
            <h5 class="text-center mt-3">User Account</h5>
          </div>
            <div class="card-body py-1">
                <div class="row" id="hotel-rooms-cards">
                    <div class="col-md d-flex flex-column">
                        <img src="static/img/portrait.jpg" class="img-fluid rounded-3" alt="face">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <p class="card-text text-center"><span class="fw-bolder fs-5">${firstName} ${lastName}</span><br><span class="text-warning fw-bolder">${email}</span></p>
                            </li>
                            <li class="list-group-item"><p class="card-text text-center">Age: <span class="text-danger fw-bold">${age}</span></p></li>
                            <li class="list-group-item"><p class="card-text text-center">Postal Code: <span class="text-success fw-bold">${address}</span></p></li>
                            <li class="list-group-item"><p class="card-text text-center">Phone: <span class="text-info fw-bold">${phone}</span></p></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}

const verifyForm = () => {
    const registerForm = document.getElementById('register-user-form');

    if (registerForm.checkValidity()) {
        console.log('Form is valid');
        $('#login-modal').modal('hide');
        $('#login-button').text('Logout').removeClass('btn-outline-light').addClass('btn-danger');
        return true;
    } else {
        console.log('Form is invalid');
        return false;
    }

}

const clearInvalidInputs = () => {
    const $firstName = $('#first-name');
    if (!/^[A-Za-z]+$/.test($firstName.val())) {
        $firstName.val('');
    }

    const $lastName = $('#last-name');
    if (!/^[A-Za-z]+$/.test($lastName.val())) {
        $lastName.val('');
    }

    const $phoneNumber = $('#phone-number');
    if (!/^(?:\d{3}-\d{3}-\d{4}|\d{10}|\d{3} \d{3} \d{4})$/.test($phoneNumber.val())) {
        $phoneNumber.val('');
    }

    const $email = $('#email');
    if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test($email.val())) {
        $email.val('');
    }

    const $age = $('#age');
    if ($age.val() < 0 || $age.val() > 120) {
        $age.val('');
    }

    const $postalCode = $('#postal-code');
    if (!/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test($postalCode.val())) {
        $postalCode.val('');
    }
};