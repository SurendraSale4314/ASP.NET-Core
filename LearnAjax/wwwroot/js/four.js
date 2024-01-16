//when the document is ready
$(document).ready(function () {
    bookData();

});

// Loading the data fromt he database using bookData() function
function bookData() {

    $.ajax({
        url: "/Book/BookList",
        type: "Get",
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        success: function (result) {
            console.log(result);
            var data = "";
            // Using foreach statement, and assign the book values to the 'data' variable
            $.each(result, function (index, book) {
                data += '<tr>';
                data += '<td>' + book.bookId + '</td>';
                data += '<td>' + book.bookName + '</td>';
                data += '<td>' + book.authorName + '</td>';
                data += '<td>' + book.publisherYear + '</td>';
                data += '<td>' + book.price + '</td>';
                data += '<td>' + book.bookCategory.categoryName + '</td>';
                data += '<td>' + book.updatedOn + '</td>';
                data += '<td><a href="#" onclick="Modify(' + book.bookId + ')">Modify</a> | <a href="#" onclick="Details(' + book.bookId + ')">Details</a> |  <a href="#" onclick="Delete(' + book.bookId + ')">Delete</a></td>';
                data += '<tr>';

            });
            // Attaching the book data to table body, which is created in index view file.
            $('#tableBody').html(data);
        },
        error: function (message) {
            alert("Load error");
        }
    });
}

// If we click 'Create New' button on home page, the following function : Add() will execute
function Add() {
    clearPopUp();
    data = "<h4>Add Book Details</h4>";
    $('#ActionTitle').html(data)
    $('#btnUpdate').css('display', 'none');
    $('#btnAdd').css('display', 'block');
    $('#bookModel').modal('show');
    $('BookId').css('display', 'none');
    $('bookId').css('display', 'none');
}

// If we are going add the data,after entering the data, by clicking ADD button, Addbook() will execute.
// It will post the data into the controller by collecting from the from elements
function AddBook() {
    // Coolecting the data from the form elements and assining it to the object variable
    var object = {
        BookName: $('#BookName').val(),
        AuthorName: $('#AuthorName').val(),
        PublisherYear: $('#PublisherYear').val(),
        Price: $('#Price').val(),
        UpdatedOn: $('#UpdatedOn').val(),
        BookCategoryId: $('#BookCategoryId').val()
    };
    $.ajax({
        url: "/Book/AddBook",
        data: object,
        type: "Post",
        dataType: "json",

        success: function (result) {
            if (result.success) {
                // If it is success, Add pop up will be hidden.
                $('#bookModel').modal('hide');
                clearPopUp()
                // Loading the data in the index page from the database
                bookData();
            }
            else {
                // Calling displayErrors, when there are any server side validation errors.
                displayErrors(result.errors);
            }
        },
        error: function (message) {
            alert("Add error");
        }
    });
}

/*
function validateFromData(formData) {
    var validator = {
        BookName: {
            required: true
        },
        Price: {
            required: true,
            min: 100
        },
        BookCategoryId: {
            required: true,
            min: 0,
            max : 6 
        },
        UpdatedOn: {
            required: true,
            date: true,
            notInThePast: true

        }       
    };

    var isValid = true;
    $.each(formData, function (key, value) {
        if (validator[key]) {
            var fieldRules = validator[key];
            console.log(fieldRules);
            $.each(fieldRules, function (rule, ruleValue) {
                if (rule === 'required' && ruleValue && !value) {
                    isValid = false;
                    displayError(key, ' is required.');
                    return false;
                }
            });
        }
    });
    return isValid;
}*/
function displayError(fieldName, message) {
    var errorElement = $('#' + fieldName + 'ValidationError');
    // Display error message in the span element   
    if (message != null) {
        msg = "<p>" + fieldName + " is required</p > ";
        errorElement.html(msg);
    }
    else {
        errorElement.html(msg);
    }
}
function displayErrors(errors) {
    // Clear previous error messages
    $('.validation-error').text('');

    // Display new error messages
    $.each(errors, function (key, value) {
        displayError(key, value);
    });
}

// Delete function
function Delete(id) {
    //  collects the confirmation from the user, if yes proceed to delete
    if (confirm("Are you sure ? \n You want to delete this book ")) {
        $.ajax({
            url: 'Book/DeleteBook?id=' + id,
            success: function () {
                bookData();

            },
            error: function () {
                alert("data cannot be deleted");
            }
        });
    }
}

// Modify Data 
function Modify(id) {
   
    $.ajax({
        url: "/Book/Modify?id=" + id,
        type: "Get",
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        success: function (response) {
            // It will show the pop up, by showing the data of the book in the editable format
            $('#bookModel').modal('show');
            $('#BookId').val(response.bookId);
            $('#BookName').val(response.bookName);
            $('#AuthorName').val(response.authorName);
            $('#PublisherYear').val(response.publisherYear);
            $('#Price').val(response.price);
            $('#BookCategoryId').val(response.bookCategoryId);
            $('#UpdatedOn').val(response.updatedOn);
            data = "<h4>Edit Book Details</h4>";
            $('#ActionTitle').html(data)
            $('#btnUpdate').css('display', 'block');
            $('#btnAdd').css('display', 'none');
        },
        error: function () {
            alert("Data not found");
        }
    })
}

// Modify book, after modify, it should be updated in the database.[Post]
function ModifyBook() {
    // Assigning the book data to the object variable
    var object = {
        BookId: $('#BookId').val(),
        BookName: $('#BookName').val(),
        AuthorName: $('#AuthorName').val(),
        PublisherYear: $('#PublisherYear').val(),
        Price: $('#Price').val(),
        UpdatedOn: $('#UpdatedOn').val(),
        BookCategoryId: $('#BookCategoryId').val()
    };

    $.ajax({
        url: "/Book/ModifyBook",
        type: "Post",
        dataType: "json",
        data: object,
        success: function (response) {
            // calling clearPopUp function
            clearPopUp();
            // Hiding the modal pop up
            $('#bookModel').modal('hide');
            // Calling the bookData function to load the data from the database after modification of book data
            bookData();
        },
        error: function () {
            alert("Data can't be changed !");
        }
    })
}

// Details function
function Details(id) {
    // Collects the unique id of the book
    $.ajax({
        url: "/Book/Details?id=" + id,
        type: "Get",
        //contentType: "application/json;charset=utf-8;",
        dataType: "json",
        success: function (response) {
            // Displaying the detailsModel, to show the particular book deails
            $('#detailsModel').modal('show');
            // Adding the book data according to the id's of the book properties
            id = response.bookId;
            $('#bookId').html(id);
            bname = response.bookName;
            $('#bookName').html(bname);
            authorName = response.authorName;
            $('#authorName').html(authorName);

            publisherYear = response.publisherYear;
            $('#publisherYear').html(publisherYear);

            price = response.price;
            $('#price').html(price);

            bookCategory = response.bookCategoryId;
            $('#bookCategory').html(bookCategory);

            updatedOn = response.updatedOn;
            $('#updatedOn').html(updatedOn);

        },
        error: function () {
            alert("Data not found");
        }
    })
}

// clearPopUp hides the modal pop up, which is used for the operations to be done on  the book details
function clearPopUp() {
    // Clearing all the input fileds
    $('#bookModel').modal('hide');
    $('#BookId').val("");
    $('#BookName').val("");
    $('#AuthorName').val("");
    $('#PublisherYear').val("");
    $('#Price').val("");
    $('#UpdatedOn').val("");
    $('#BookCategoryId').val("Select");

    // Clearing all the span element fileds with empty values.
    BookNameValidationError.innerHTML = "";
    $('#BookName').css('border-color', 'lightgray');
    PublisherYearValidationError.innerHTML = "";
    $('#PublisherYear').css('border-color', 'lightgray');
    PriceValidationError.innerHTML = "";
    $('#Price').css('border-color', 'lightgray');
    BookCategoryIdValidationError.innerHTML = "";
    $('#BookCategory').css('border-color', 'lightgray');
    UpdatedOnValidationError.innerHTML = "";
    $('#UpdatedOn').css('border-color', 'lightgray');
    data = "";
    $('#BookCategoryIdValidationError').html(data);
    $('#BookCategoryId').css('border-color', 'lightgray');

}

// Cleint-side Validations
//Validating the BookName 
function validateBookName() {
    var book = document.getElementById('BookName');
    // If the book name is empty
    if (book.value.trim() == "") {
        book.style.borderColor = 'red';
        BookNameValidationError.innerHTML = "Book name cannot be empty";
        BookNameValidationError.style.color = 'red';
        return false;
    }
    // if the book name not having the alphabets
    else if (!(/^[A-Za-z]+(?:\s[A-Za-z]+)?$/.test(book.value))) {
        BookNameValidationError.innerHTML = "Only alphabets are allowed";
        BookNameValidationError.style.color = 'red';
        return false;
    }
    else {
        BookNameValidationError.innerHTML = "";
        book.style.borderColor = 'black';
        return true;
    }
}

// Validating the Book Price 
function validatePrice() {
    var cost = document.getElementById('Price');
    // if the price is empty
    if (cost.value.trim() == "") {
        PriceValidationError.innerHTML = "";
        return false;
    }
    // if the price is not having the numeric values
    else if (!/^[0-9][0-9]*(\.[0-9]{2})?$|^0\.\d/.test(cost.value)) {
        PriceValidationError.innerHTML = "Only numeric values are allowed";
        PriceValidationError.style.color = 'red';
        cost.style.borderColor = 'red';
        return false;
    }
    // if the price is less than 101
    else if (cost.value < 101) {
        PriceValidationError.innerHTML = "Price should be greater than 100.";
        PriceValidationError.style.color = 'red';
        cost.style.borderColor = 'red';
        return false;
    }
    else {
        PriceValidationError.innerHTML = "";
        cost.style.borderColor = "black";
        return true;
    }
}

// Validating the Updated Date of Book
function validateDate() {
    var year = document.getElementById('UpdatedOn');
    // the inout date given by user 
    const inputDate = new Date(year.value);
    // curent date
    const currentDate = new Date();
    // if the UpdatedDate is empty
    if (year.value.trim() == "") {
        UpdatedOnValidationError.innerHTML = "Updated Date cannot be empty";
        UpdatedOnValidationError.style.color = 'red';
        year.style.borderColor = 'red';
        return false;
    }
    // Check the format of the date
    else if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(year.value)) {
        UpdatedOnValidationError.innerHTML = "Updated Date should be 'yyyy-mm-dd' format";
        UpdatedOnValidationError.style.color = 'red';
        year.style.borderColor = 'red';
        return false;
    }
    // if the UpdatedDate is not the past
    else if (currentDate <= inputDate) {
        UpdatedOnValidationError.innerHTML = "Updated Date should be in the past !";
        UpdatedOnValidationError.style.color = 'red';
        year.style.borderColor = 'red';
        return false;
    }

    else {
        UpdatedOnValidationError.innerHTML = "";
        year.style.borderColor = "lightgray";
        return true;
    }
}
// Validating the BookCategoryId
function validateCategory() {
    var categorySelected = document.getElementById('BookCategoryId');
    // if the BookCategoryId is not selected
    if (categorySelected.value !== 'Select') {
        data = "";
        $('#BookCategoryIdValidationError').html(data);
        $('#BookCategoryId').css('border-color', 'lightgray');
        //  BookCategoryIdValidationError.innerHtml = "Book Category is required.";
        //  BookCategoryIdValidationError.style.color = 'red';
        return true;
    }
    else {
        data = "<p>Book category is required</p>";
        $('#BookCategoryIdValidationError').html(data);
        $('#BookCategoryId').css('border-color', 'red');
        //  BookCategoryIdValidationError.innerHtml = "Book Category is required.";
        //  BookCategoryIdValidationError.style.color = 'red';
        categorySelected.style.borderColor = 'red';
        return false;
    }
}

// Validating the AuthorName of the book
function validateAuthorName() {
    var author = document.getElementById('AuthorName');
    // check if the AuthorNAme is empty
    if (author.value.trim() == "") {
        AuthorNameValidationError.innerHTML = "";
        return false;
    }
    // Check whether it has the othe than aplhabets
    else if (!(/^[A-Za-z]+(?:\s[A-Za-z]+)?$/.test(author.value))) {
        AuthorNameValidationError.innerHTML = "Only alphabets are allowed";
        AuthorNameValidationError.style.color = 'red';
        return false;
    }
    else {
        AuthorNameValidationError.innerHTML = "";
        author.style.borderColor = 'lightgray';
        return true;
    }
}
// Validating the PublishedYear of the book
function validatePublisherYear() {
    var year = document.getElementById('PublisherYear');
    // Check if PublishedYear is empty
    if (year.value.trim() == "") {
        PublisherYearValidationError.innerHTML = "";
        return false;
    }
    // Check if the PublishedYear is not in the four digit format
    if (!(/^\d{4}$/.test(year.value))) {
        PublisherYearValidationError.innerHTML = "The year should be in 4 digit format";
        PublisherYearValidationError.style.color = "red";
        return false;
    }
    else {
        PublisherYearValidationError.innerHTML = "";
        year.style.border = " lightgray";
        return true;
    }
} 
