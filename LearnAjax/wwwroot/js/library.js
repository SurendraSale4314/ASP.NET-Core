// Load the data when the document is ready
$(document).ready(function () {
    bookData();

});

function bookData() {

    $.ajax({
        url: "/Book/BookList",
        type: "Get",
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        success: function (result) {
            console.log(result);
            var data = "";
            $.each(result, function (index, book) {
                data += '<tr>';
                data += '<td>' + book.bookId + '</td>';
                data += '<td>' + book.bookName + '</td>';
                data += '<td>' + book.authorName + '</td>';
                data += '<td>' + book.publisherYear + '</td>';
                data += '<td>' + book.price + '</td>';
                data += '<td>' + book.bookCategoryId + '</td>';
                data += '<td>' + book.updatedOn + '</td>';
                data += '<td><a href="#" onclick="Modify(' + book.bookId + ')">Modify</a> | <a href="#" onclick="Details(' + book.bookId + ')">Details</a> |  <a href="#" onclick="Delete(' + book.bookId + ')">Delete</a></td>';
                data += '<tr>';

            });
            $('#tableBody').html(data);
        },
        error: function (message) {
            alert("Load error");
        }
    });
}

function Add() {
    clearPopUp();
    data = "<h4>Add Book Details</h4>";
    $('#ActionTitle').html(data)
    $('#btnUpdate').css('display', 'none');
    $('#btnAdd').css('display', 'block');
    $('#bookModel').modal('show');
}

function AddBook() {

    var object = {
        BookName: $('#BookName').val(),
        AuthorName: $('#AuthorName').val(),
        PublisherYear: $('#PublisherYear').val(),
        Price: $('#Price').val(),
        UpdatedOn: $('#UpdatedOn').val(),
        BookCategoryId: $('#BookCategoryId').val()
    };
    var isValid = validateFromData(object);

    if (isValid) {
        $.ajax({
            url: "/Book/AddBook",
            data: object,
            type: "Post",
            dataType: "json",
            success: function (result) {
                if (result.success) {
                    clearPopUp()
                    bookData();
                }
                else {
                    displayErrors(result.errors);
                }

            },
            error: function (message) {
                alert("Add error");
            }
        });
    }  

}

function validateFromData(formData) {
    var validator = {
        BookName: {
            required: true
        },
        Price: {
            required: true,
            min: 100
        },
        UpdatedOn :{
            required: true,
            date: true,
            notInThePast: true

        },
        BookCategoryId : {
            required: true,
            min : 1
        }
    };

    var isValid = true;
    $.each(formData, function (key, value) {
        if (validator[key]) {
            var fieldRules = validator[key];
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
}
function displayError(fieldName, message) {
    var errorElement = $('#' + fieldName + 'ValidationError');

    if (errorElement.length) {
        // Display error message in the span element
        msg = fieldName + message;
        errorElement.text(msg);
    } else {
        // If span element not found, you can handle it as needed (e.g., alert)
        alert(fieldName + ': ' + message);
    }
}
function displayErrors(errors) {
    // Clear previous error messages
    $('.validation-error').text('');

    // Display new error messages
    $.each(errors, function (key, value) {
        displayError(key, value.join(', '));
    });
}



function Delete(id) {
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

function Modify(id) {
    $.ajax({
        url: "/Book/Modify?id=" + id,
        type: "Get",
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        success: function (response) {
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
function ModifyBook() {
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
            clearPopUp();
            $('#bookModel').modal('hide');
            bookData();
        },
        error: function () {
            alert("Data can't be changed !");
        }
    })
}

function Details(id) {
    $.ajax({
        url: "/Book/Details?id=" + id,
        type: "Get",
        contentType: "application/json;charset=utf-8;",
        dataType: "json",
        success: function (response) {
            $('#detailsModel').modal('show');
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

            bookCategory = response.bookCategory;
            $('#bookCategory').html(bookCategory);

            updatedOn = response.updatedOn;
            $('#updatedOn').html(updatedOn);




            /* bookDetails = "<dl>" +
                 "<dt>Book ID</dt><dd>" + response.bookId + "</dd>" +
                 "<dt>Book Name</dt><dd>" + response.bookName + "</dd>" +
                 "<dt>AuthorName</dt><dd>" + response.authorName + "</dd>" +
                 "<dt>PublisherYear</dt><dd>" + response.publisherYear + "</dd>" +
                 "<dt>Price</dt><dd>" + response.price + "</dd>" +
                 "<dt>BookCategoryId</dt><dd>" + response.bookCategoryId + "</dd>" +
                 "<dt>UpdatedOn</dt><dd>" + response.updatedOn + "</dd>";
             $('#id').html(bookDetails);*/


            /* $('#id').val(response.bookId);
             $('#name').val(response.bookName);
             $('#AuthorName').val(response.authorName);
             $('#PublisherYear').val(response.publisherYear);
             $('#Price').val(response.price);
             $('#BookCategoryId').val(response.bookCategoryId);
             $('#UpdatedOn').val(response.updatedOn);
             data = "<h4>Book Details</h4>";*/
            // $('#ActionTitle').html(data) 

            //$('#btnAdd').css('display', 'none');

        },
        error: function () {
            alert("Data not found");
        }
    })
}

function clearPopUp() {
     $('#bookModel').modal('hide');
    $('#BookId').val("");
    $('#BookName').val("");
    $('#AuthorName').val("");
    $('#PublisherYear').val("");
    $('#Price').val("");
    $('#UpdatedOn').val("");
    $('#BookCategory').val("");
}


function validateBookName() {
    var book = document.getElementById('BookName');
    if (book.value.trim() == "") {
        book.style.borderColor = 'red';
        BookNameValidationError.innerHTML = "Book name cannot be empty";
        BookNameValidationError.style.color = 'red';
        return false;
    }
    else if (!(/^[A-Za-z]+$/.test(book.value))) {
        BookNameValidationError.innerHTML = "Numeric values not allowed";
        BookNameValidationError.style.color = 'red';
        return false;
    }
    else {
        BookNameValidationError.innerHTML = "";
        book.style.borderColor = 'black';
        return true;
    }
}

function validatePrice() {
    var cost = document.getElementById('Price');
    if (cost.value.trim() == "") {
        PriceValidationError.innerHTML = " Price cannot be empty";
        PriceValidationError.style.color = 'red';
        cost.style.borderColor = 'red';
        return false;
    }
    else if (!/^[0-9][0-9]*(\.[0-9]{2})?$|^0\.\d/.test(cost.value)) {
        PriceValidationError.innerHTML = "Only numeric values are allowed";
        PriceValidationError.style.color = 'red';
        cost.style.borderColor = 'red';
        return false;
    }
    else if (cost.value < 101)
    {
        PriceValidationError.innerHTML = "Price should be greater than 100.";
        PriceValidationError.style.color = 'red';
        cost.style.borderColor = 'red';
        return false;
    }
    else {
        PriceValidationError.innerHTML = "";
        cost.style.borderColor = "black";
        console.log("hello");
        return true;
    }
}


function validateDate() {
    var year = document.getElementById('UpdatedOn');
    /*    var selectedDate = new Date(value);
        var formattedSelectedDate = selectedDate.toISOString().split('T')[0];
        var currentDate = new Date();
        var formattedCurrentDate = currentDate.toISOString().split('T')[0];*/

    if (year.value.trim() == "") {
        UpdatedOnValidationError.innerHTML = "Updated Date cannot be empty";
        UpdatedOnValidationError.style.color = 'red';
        year.style.borderColor = 'red';
        return false;
    }
    /*else if (formattedSelectedDate >= formattedCurrentDate) {
        UpdatedOnValidationError.innerHTML = "Updated Date should be in the past !";
        UpdatedOnValidationError.style.color = 'red';
        year.style.borderColor = 'red';
        return false;
    }*/

    else {
        UpdatedOnValidationError.innerHTML = "";
        year.style.borderColor = "black";
        console.log("hello");
        return true;
    }
}
