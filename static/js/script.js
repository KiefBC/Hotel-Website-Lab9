//<editor-fold desc="Section 1">
let userLogin = false;
const hotelName = "Château de Mona Liséa";

$("#login-button").on("click", (e) => {
    e.preventDefault();
    // if the text is login, show the modal else log the user out
    if ($("#login-button").text() === "Register") {
        $("#login-modal").modal("show");
    } else {
        $("#login-button").text("Register").removeClass("btn-danger").addClass("btn-outline-light");
        $("#greet-user").html("");
        $("#user-profile").html("");
        userLogin = false;
        checkBookingButtonUserLoggedIn();
    }
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
        $("#login-button").text("Logout").removeClass("btn-outline-light").addClass("btn-danger");
        clearFormInputs();
        checkBookingButtonUserLoggedIn();
    }
});

const verifyForm = () => {
    const registerForm = document.getElementById('register-user-form');

    if (registerForm.checkValidity()) {
        console.log('Form is valid');
        $('#login-modal').modal('hide');
        return true;
    } else {
        console.log('Form is invalid');
        return false;
    }

}

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

$("#section-one-button").on("click", (e) => {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#section2").offset().top
    });
});

const clearFormInputs = () => {
    $('#first-name').val('');
    $('#last-name').val('');
    $('#phone-number').val('');
    $('#email').val('');
    $('#age').val('');
    $('#postal-code').val('');

}
//</editor-fold>

//<editor-fold desc="Weather Widget">
const apiKey = `e1be3967c5f2d60263adc1ed3907d170`;
const lat = 17.607788;
const lon = 8.081666;
const apiBaseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

const getWeather = async () => {
    const response = await fetch(apiBaseUrl);
    const data = await response.json();
    console.log(data);

    const temp = data.main.temp;
    const tempC = Math.round(temp - 273.15);
    const weatherIcon = data.weather[0].icon;
    const weatherDescription = data.weather[0].description;

    //capitalize every word in the description
    const weatherDescriptionCapitalized = weatherDescription.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    $("#temperature").html(`${tempC}\u00B0`);
    $("#weather-icon").html(`<img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">`);
    $("#weather").html(`${weatherDescriptionCapitalized}`);
};

getWeather().then(r => console.log("Weather Data Fetched Successfully!"));
//</editor-fold>

//<editor-fold desc="Section 2">

let amountOfRooms;
let userAmountOfRooms;
let cost;
let totalCost;
let totalAvailableRooms;

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

    let dayPlural = stayLength === 1 ? "day" : "days";
    let roomPlural = userAmountOfRooms === 1 ? "room" : "rooms";


    resultsDiv.html(`
    <p>You have chosen to stay for <span class="fw-bold">${stayLength} ${dayPlural}</span>.</p>
    <p> We appreciate your business and hope you accept our Leader the <span class="fw-bold">Holy Lobster</span>.</p>
    <p id="room-type-results"></p>
    `);

    $("#results").hide().fadeIn(1000);

    totalAvailableRooms = 9;
    amountOfRooms = 8;
    userAmountOfRooms = 1;
    totalCost = 0;

    if (radioValue === "button-single-room") {
        $("#room-type-results").html(`
            <p>You have chosen a <span class="fw-bold">Single Room</span> which is our <span class="fw-bold">Standard Package</span>. You must be lonely. But don't worry, our services will keep you company!</p>
            <p class="fw-bolder text-start text-decoration-underline">Our Services for the <span class="fw-bold">Standard Package</span>!</p>
            <ul class="list-unstyled text-start">
                <li>Shuttle? <span class="fw-bold">NO!</span></li>
                <li>Breakfast? <span class="fw-bold">NO!</span></li>
                <li>Room Service? <span class="fw-bold">NO!</span></li>
                <li>Restaurants? <span class="fw-bold">YES!</span></li>
                <ul>
                    <li>McDonalds</li>
                    <li>Wendys</li>
                    <li>Burger King</li>
                </ul>
            </ul>
            <button class="btn btn-light mt-5" id="book-standard">BOOK ROOM NOW!</button>
            <div id="booking-response">
                <!-- notify the user here -->
            </div>
        `);

        $("#room-type-results").hide();
        $("#room-type-results").fadeIn(1000);

        cost = 100;

        $("#book-standard").on("click", () => {
            $("#room-availability-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Room Availability</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>There are currently <span class="fw-bold" id="room-amount-left">${amountOfRooms}</span> rooms available for the Standard Package.</p>
                        <p>You have chosen to stay for: <span class="fw-bold">${stayLength} ${dayPlural}</span>!</p>
                        <p>You want a total of: <span class="fw-bold" id="user-room-amount">${userAmountOfRooms}</span> <span class="fw-bolder">${roomPlural}</span>.</p>
                        <p>The total cost for <span class="fw-bold" id="user-room-cost">${userAmountOfRooms}</span> is: <span class="fw-bold" id="total-room-cost">${userAmountOfRooms * cost}</span></p>
                        <p><span class="fw-bold">Would you like to book a room for the Standard Package?</span></p>
                        <div class="text-center mb-3">
                            <div class="text-center" id="notify-user">
                            <!-- announce we have no rooms left -->
                            </div>
                            <button class="btn btn-outline-dark" id="book-room">YES!</button>
                            <button class="btn btn-outline-dark" id="cancel-room-button">NO!</button>
                        </div>
                        <div class="text-center mb-3">
                            <button class="btn btn-outline-dark" id="book-room-button" data-bs-target="#booking-confirmation" data-bs-toggle="modal">Book Now!</button>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);

            $("#room-availability").modal("show");

            $("#book-room").on("click", () => {
                amountOfRooms--;
                userAmountOfRooms++;
                totalCost = userAmountOfRooms * cost * stayLength;
                $("#cancel-room-button").prop("disabled", false);

                // Update the room amount display
                $("#room-amount-left").text(amountOfRooms);
                $("#user-room-amount").text(userAmountOfRooms);
                $("#user-room-cost").text(userAmountOfRooms);
                $("#total-room-cost").text(totalCost);

                if (amountOfRooms === 0) {
                    $("#book-room").prop("disabled", true);
                }

                if (amountOfRooms < 5) {
                    $("#room-amount-left").css("color", "red");
                } else if (amountOfRooms <= totalAvailableRooms) {
                    $("#room-amount-left").css("color", "orange");
                } else {
                    $("#room-amount-left").css("color", "green");
                }

                if (userAmountOfRooms === 0) {
                    $("#book-room-button").prop("disabled", true);
                } else {
                    $("#book-room-button").prop("disabled", false);
                }

                $("#booking-confirmation-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Booking Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="fw-bold">Congratulations! You have successfully booked a room for the Standard Package!</p>
                        <p>Thank you for choosing our hotel!</p>
                        <p>Your Total: <span class="fw-bold">$${totalCost}</span></p>
                        <p>Your Length of Stay: <span class="fw-bold">${stayLength} ${dayPlural}</span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);

                if (amountOfRooms === 0) {
                    $("#notify-user").html(`
                        <p class="text-danger">We are sorry, but there are no rooms left for the <span class="fw-bold">Standard Package</span>.</p>
                    `);
                }
            });

            $("#cancel-room-button").on("click", () => {
                if (userAmountOfRooms > 0) {
                    userAmountOfRooms--;
                    amountOfRooms++;
                    $("#book-room").prop("disabled", false);
                    $("#notify-user").html("");
                } else {
                    // disable the button
                    $("#cancel-room-button").prop("disabled", true);
                }

                if (amountOfRooms < 5) {
                    $("#room-amount-left").css("color", "red");
                } else if (amountOfRooms <= totalAvailableRooms) {
                    $("#room-amount-left").css("color", "orange");
                } else {
                    $("#room-amount-left").css("color", "green");
                }

                totalCost = userAmountOfRooms * cost * stayLength;

                // Update the room amount display
                $("#room-amount-left").text(amountOfRooms);
                $("#user-room-amount").text(userAmountOfRooms);
                $("#user-room-cost").text(userAmountOfRooms);
                $("#total-room-cost").text(totalCost);

                // disable the book now button if userAmountOfRooms is 0
                if (userAmountOfRooms === 0) {
                    $("#book-room-button").prop("disabled", true);
                } else {
                    $("#book-room-button").prop("disabled", false);
                }

                $("#booking-confirmation-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Booking Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="fw-bold">Congratulations! You have successfully booked a room for the Standard Package!</p>
                        <p>Thank you for choosing our hotel!</p>
                        <p>Your Total: <span class="fw-bold">$${totalCost}</span></p>
                        <p>Your Length of Stay: <span class="fw-bold">${stayLength} ${dayPlural}</span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);
            });

            $("#booking-confirmation").on("show.bs.modal", () => {
                amountOfRooms = 8;
                userAmountOfRooms = 0;
                totalCost = 0;
            });
        });
    } else if (radioValue === "button-double-room") {
        $("#room-type-results").html(`
            <p>You have chosen a <span class="fw-bold">Single Room</span> which is our <span class="fw-bold">Standard Package</span>. You must be lonely. But don't worry, our services will keep you company!</p>
            <p class="fw-bolder text-start text-decoration-underline">Our Services for the <span class="fw-bold">Standard Package</span>!</p>
            <ul class="list-unstyled text-start">
                <li>Shuttle? <span class="fw-bold">NO!</span></li>
                <li>Breakfast? <span class="fw-bold">NO!</span></li>
                <li>Room Service? <span class="fw-bold">NO!</span></li>
                <li>Restaurants? <span class="fw-bold">YES!</span></li>
                <ul>
                    <li>McDonalds</li>
                    <li>Wendys</li>
                    <li>Burger King</li>
                </ul>
            </ul>
            <button class="btn btn-light mt-5" id="book-standard">BOOK ROOM NOW!</button>
            <div id="booking-response">
                <!-- notify the user here -->
            </div>
        `);

        $("#room-type-results").hide();
        $("#room-type-results").fadeIn(1000);

        cost = 200;

        $("#book-standard").on("click", () => {
            $("#room-availability-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Room Availability</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>There are currently <span class="fw-bold" id="room-amount-left">${amountOfRooms}</span> rooms available for the Standard Package.</p>
                        <p>You have chosen to stay for: <span class="fw-bold">${stayLength} ${dayPlural}</span>!</p>
                        <p>You want a total of: <span class="fw-bold" id="user-room-amount">${userAmountOfRooms}</span> <span class="fw-bolder">${roomPlural}</span>.</p>
                        <p>The total cost for <span class="fw-bold" id="user-room-cost">${userAmountOfRooms}</span> is: <span class="fw-bold" id="total-room-cost">${userAmountOfRooms * cost}</span></p>
                        <p><span class="fw-bold">Would you like to book a room for the Standard Package?</span></p>
                        <div class="text-center mb-3">
                            <div class="text-center" id="notify-user">
                            <!-- announce we have no rooms left -->
                            </div>
                            <button class="btn btn-outline-dark" id="book-room">YES!</button>
                            <button class="btn btn-outline-dark" id="cancel-room-button">NO!</button>
                        </div>
                        <div class="text-center mb-3">
                            <button class="btn btn-outline-dark" id="book-room-button" data-bs-target="#booking-confirmation" data-bs-toggle="modal">Book Now!</button>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);

            $("#room-availability").modal("show");

            $("#book-room").on("click", () => {
                amountOfRooms--;
                userAmountOfRooms++;
                totalCost = userAmountOfRooms * cost * stayLength;
                $("#cancel-room-button").prop("disabled", false);

                // Update the room amount display
                $("#room-amount-left").text(amountOfRooms);
                $("#user-room-amount").text(userAmountOfRooms);
                $("#user-room-cost").text(userAmountOfRooms);
                $("#total-room-cost").text(totalCost);

                if (amountOfRooms === 0) {
                    $("#book-room").prop("disabled", true);
                }

                if (amountOfRooms < 5) {
                    $("#room-amount-left").css("color", "red");
                } else if (amountOfRooms <= totalAvailableRooms) {
                    $("#room-amount-left").css("color", "orange");
                } else {
                    $("#room-amount-left").css("color", "green");
                }

                if (userAmountOfRooms === 0) {
                    $("#book-room-button").prop("disabled", true);
                } else {
                    $("#book-room-button").prop("disabled", false);
                }

                $("#booking-confirmation-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Booking Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="fw-bold">Congratulations! You have successfully booked a room for the Standard Package!</p>
                        <p>Thank you for choosing our hotel!</p>
                        <p>Your Total: <span class="fw-bold">$${totalCost}</span></p>
                        <p>Your Length of Stay: <span class="fw-bold">${stayLength} ${dayPlural}</span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);

                if (amountOfRooms === 0) {
                    $("#notify-user").html(`
                        <p class="text-danger">We are sorry, but there are no rooms left for the <span class="fw-bold">Standard Package</span>.</p>
                    `);
                }
            });

            $("#cancel-room-button").on("click", () => {
                if (userAmountOfRooms > 0) {
                    userAmountOfRooms--;
                    amountOfRooms++;
                    $("#book-room").prop("disabled", false);
                    $("#notify-user").html("");
                } else {
                    // disable the button
                    $("#cancel-room-button").prop("disabled", true);
                }

                if (amountOfRooms < 5) {
                    $("#room-amount-left").css("color", "red");
                } else if (amountOfRooms <= totalAvailableRooms) {
                    $("#room-amount-left").css("color", "orange");
                } else {
                    $("#room-amount-left").css("color", "green");
                }

                totalCost = userAmountOfRooms * cost * stayLength;

                // Update the room amount display
                $("#room-amount-left").text(amountOfRooms);
                $("#user-room-amount").text(userAmountOfRooms);
                $("#user-room-cost").text(userAmountOfRooms);
                $("#total-room-cost").text(totalCost);

                // disable the book now button if userAmountOfRooms is 0
                if (userAmountOfRooms === 0) {
                    $("#book-room-button").prop("disabled", true);
                } else {
                    $("#book-room-button").prop("disabled", false);
                }

                $("#booking-confirmation-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Booking Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="fw-bold">Congratulations! You have successfully booked a room for the Standard Package!</p>
                        <p>Thank you for choosing our hotel!</p>
                        <p>Your Total: <span class="fw-bold">$${totalCost}</span></p>
                        <p>Your Length of Stay: <span class="fw-bold">${stayLength} ${dayPlural}</span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);
            });

            $("#booking-confirmation").on("show.bs.modal", () => {
                amountOfRooms = 8;
                userAmountOfRooms = 0;
                totalCost = 0;
            });
        });
    } else if (radioValue === "button-mona-lisa") {
        $("#room-type-results").html(`
            <p>You have chosen a <span class="fw-bold">Single Room</span> which is our <span class="fw-bold">Standard Package</span>. You must be lonely. But don't worry, our services will keep you company!</p>
            <p class="fw-bolder text-start text-decoration-underline">Our Services for the <span class="fw-bold">Standard Package</span>!</p>
            <ul class="list-unstyled text-start">
                <li>Shuttle? <span class="fw-bold">NO!</span></li>
                <li>Breakfast? <span class="fw-bold">NO!</span></li>
                <li>Room Service? <span class="fw-bold">NO!</span></li>
                <li>Restaurants? <span class="fw-bold">YES!</span></li>
                <ul>
                    <li>McDonalds</li>
                    <li>Wendys</li>
                    <li>Burger King</li>
                </ul>
            </ul>
            <button class="btn btn-light mt-5" id="book-standard">BOOK ROOM NOW!</button>
            <div id="booking-response">
                <!-- notify the user here -->
            </div>
        `);

        $("#room-type-results").hide();
        $("#room-type-results").fadeIn(1000);

        cost = 300;

        $("#book-standard").on("click", () => {
            $("#room-availability-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Room Availability</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>There are currently <span class="fw-bold" id="room-amount-left">${amountOfRooms}</span> rooms available for the Standard Package.</p>
                        <p>You have chosen to stay for: <span class="fw-bold">${stayLength} ${dayPlural}</span>!</p>
                        <p>You want a total of: <span class="fw-bold" id="user-room-amount">${userAmountOfRooms}</span> <span class="fw-bolder">${roomPlural}</span>.</p>
                        <p>The total cost for <span class="fw-bold" id="user-room-cost">${userAmountOfRooms}</span> is: <span class="fw-bold" id="total-room-cost">${userAmountOfRooms * cost}</span></p>
                        <p><span class="fw-bold">Would you like to book a room for the Standard Package?</span></p>
                        <div class="text-center mb-3">
                            <div class="text-center" id="notify-user">
                            <!-- announce we have no rooms left -->
                            </div>
                            <button class="btn btn-outline-dark" id="book-room">YES!</button>
                            <button class="btn btn-outline-dark" id="cancel-room-button">NO!</button>
                        </div>
                        <div class="text-center mb-3">
                            <button class="btn btn-outline-dark" id="book-room-button" data-bs-target="#booking-confirmation" data-bs-toggle="modal">Book Now!</button>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);

            $("#room-availability").modal("show");

            $("#book-room").on("click", () => {
                amountOfRooms--;
                userAmountOfRooms++;
                totalCost = userAmountOfRooms * cost * stayLength;
                $("#cancel-room-button").prop("disabled", false);

                // Update the room amount display
                $("#room-amount-left").text(amountOfRooms);
                $("#user-room-amount").text(userAmountOfRooms);
                $("#user-room-cost").text(userAmountOfRooms);
                $("#total-room-cost").text(totalCost);

                if (amountOfRooms === 0) {
                    $("#book-room").prop("disabled", true);
                }

                if (amountOfRooms < 5) {
                    $("#room-amount-left").css("color", "red");
                } else if (amountOfRooms <= totalAvailableRooms) {
                    $("#room-amount-left").css("color", "orange");
                } else {
                    $("#room-amount-left").css("color", "green");
                }

                if (userAmountOfRooms === 0) {
                    $("#book-room-button").prop("disabled", true);
                } else {
                    $("#book-room-button").prop("disabled", false);
                }

                $("#booking-confirmation-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Booking Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="fw-bold">Congratulations! You have successfully booked a room for the Standard Package!</p>
                        <p>Thank you for choosing our hotel!</p>
                        <p>Your Total: <span class="fw-bold">$${totalCost}</span></p>
                        <p>Your Length of Stay: <span class="fw-bold">${stayLength} ${dayPlural}</span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    <div id="booking-response">
                    <!-- notify the user here -->
                    </div>
                </div>
            `);

                if (amountOfRooms === 0) {
                    $("#notify-user").html(`
                        <p class="text-danger">We are sorry, but there are no rooms left for the <span class="fw-bold">Standard Package</span>.</p>
                    `);
                }
            });

            $("#cancel-room-button").on("click", () => {
                if (userAmountOfRooms > 0) {
                    userAmountOfRooms--;
                    amountOfRooms++;
                    $("#book-room").prop("disabled", false);
                    $("#notify-user").html("");
                } else {
                    // disable the button
                    $("#cancel-room-button").prop("disabled", true);
                }

                if (amountOfRooms < 5) {
                    $("#room-amount-left").css("color", "red");
                } else if (amountOfRooms <= totalAvailableRooms) {
                    $("#room-amount-left").css("color", "orange");
                } else {
                    $("#room-amount-left").css("color", "green");
                }

                totalCost = userAmountOfRooms * cost * stayLength;

                // Update the room amount display
                $("#room-amount-left").text(amountOfRooms);
                $("#user-room-amount").text(userAmountOfRooms);
                $("#user-room-cost").text(userAmountOfRooms);
                $("#total-room-cost").text(totalCost);

                // disable the book now button if userAmountOfRooms is 0
                if (userAmountOfRooms === 0) {
                    $("#book-room-button").prop("disabled", true);
                } else {
                    $("#book-room-button").prop("disabled", false);
                }

                $("#booking-confirmation-content").html(`
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Booking Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="fw-bold">Congratulations! You have successfully booked a room for the Standard Package!</p>
                        <p>Thank you for choosing our hotel!</p>
                        <p>Your Total: <span class="fw-bold">$${totalCost}</span></p>
                        <p>Your Length of Stay: <span class="fw-bold">${stayLength} ${dayPlural}</span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            `);
            });

            $("#booking-confirmation").on("show.bs.modal", () => {
                amountOfRooms = 8;
                userAmountOfRooms = 0;
                totalCost = 0;
            });
        });
    }

    checkBookingButtonUserLoggedIn();
};

$("#weather-button").on("click", () => {
    refreshWeatherWidget();
});

const refreshWeatherWidget = () => {
    getWeather().then(r => console.log("Weather Data Fetched Successfully!"));
}

const checkBookingButtonUserLoggedIn = () => {
    if (userLogin) {
        $("#book-standard").prop("disabled", false);
        $("#booking-response").html(``).fadeOut(1000);
    } else {
        $("#book-standard").prop("disabled", true);
        $("#booking-response").html(`<p class="text-center text-danger fw-bolder mt-5">You must be logged in to book a room!</p`).hide().fadeIn(1000);
    }
};

initializeWidget();
//</editor-fold>

//<editor-fold desc="Section 3">
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
    title: "Mona Lisa Package",
    description: "The Mona Lisa is the ultimate room for the ultimate Claw. Once you stay here, you will never want to leave.",
    price: "$300",
    imgRef: "static/img/hotel-room-three.webp"
}];

$("#which-room-button").on("click", (e) => {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $("#section3").offset().top - 60
    });
});

const buildHotelRooms = () => {
    const hotelRoomsContainer = $('#section3-room-description');

    hotelRooms.forEach(room => {
        let roomTitle = room.title.replace(/\s/g, '-').toLowerCase();
        let cardHtml = `
            <div class="card mb-5 shadow-lg" id="${roomTitle}-card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md m-0 p-0">
                            <img src="${room.imgRef}" class="img-fluid" alt="${room.title}">
                        </div>
                        <div class="col-md">
                            <h3>${room.title}</h3>
                            <p>${room.description}</p>
                            <p><strong>Price:</strong> ${room.price} per night</p>
                            <button class="btn btn-outline-dark mt-5 book-button" data-room-id="${roomTitle}-button">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        hotelRoomsContainer.append(cardHtml);
    });

    $('.book-button').on('click', function (event) {
        console.log(`Button clicked: ${event.id}`);
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $("#section2").offset().top
        });
    });
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
}

buildHotelRooms();
//</editor-fold>

