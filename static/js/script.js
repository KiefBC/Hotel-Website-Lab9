//<editor-fold desc="Widget">
const initializeSeafloor = () => {
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

                announceLobster();
            }
        }).datepicker('setDate', defaultStartDate);

        $('#end_date').datepicker({
            minDate: 1,
            defaultDate: defaultEndDate,
            onSelect: announceLobster
        }).datepicker('setDate', defaultEndDate);
    });
}

const announceLobster = () => {
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

const letsGo = () => {
    console.log("\nInitiating Widget...\n");
    initializeSeafloor();
    specialLobster();

    $("#submit-button").on("click", () => {
        let start_date = $("#start_date").val();
        let end_date = $("#end_date").val();
        let radioValue = $("input[name='btnradio']:checked").attr("id");

        buildShell(start_date, end_date, radioValue);
    });
};

const specialLobster = () => {
    $(".btn-group").click((event) => {
        let cssRootVariable;

        switch (event.target.id) {
            case "button-single-room":
                cssRootVariable = '--card-color-one';
                break;
            case "button-double-room":
                cssRootVariable = '--card-color-two';
                break;
            case "button-mona-lisa":
                cssRootVariable = '--card-color-three';
                break;
        }

        if (cssRootVariable) {
            let newColor = $(':root').css(cssRootVariable);
            $(".card-body").animate(
                { backgroundColor: newColor },
                500
            );
        }
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

letsGo();
//</editor-fold>

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

const displayHotelCards = () => {
    const hotelRoomContainer = document.getElementById('hotel-room-cards');
    hotelRooms.forEach(room => {
        hotelRoomContainer.innerHTML += `
        <div class="col-md-10 my-5 px-5 mx-auto">
            <!-- This will make the room title the id of the card, using proper formatting -->
            <div class="card" id="${room.title.replace(/\s/g, '-').toLowerCase()}-card">
                <div class="card-body py-1">
                    <div class="row" id="hotel-rooms-cards">
                        <div class="col-md-8 m-0 p-0 mx-auto my-auto">
                            <img src="${room.imgRef}" class="img-fluid rounded-3" alt="${room.title}">
                        </div>
                        <div class="col-md d-flex flex-column">
                            <h5 class="card-title text-center mt-3 mb-4 title-underline">${room.title}</h5>
                            <p class="card-text my-auto mx-auto px-2 mt-5 py-auto">${room.description}</p>
                            <p class="card-text mx-auto">Price: ${room.price}</p>
                            <div class="mt-auto text-end">
                                <!-- This will make the room title the id of the button, but also appending 'button' to it -->
                                <button class="btn btn-primary mb-3" id="${room.title.replace(/\s/g, '-').toLowerCase()}-button">Book Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
}

const initializeHotelRoomButton = () => {
    hotelRooms.forEach(room => {
        document.getElementById(`${room.title.replace(/\s/g, '-').toLowerCase()}-button`)
            .addEventListener('click', () => alert(`You have booked the ${room.title} for ${room.price}.`));
    });
}

displayHotelCards();
initializeHotelRoomButton();