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
    $.ajax({
        url: "/Book/AddBook",
        data: object,
        type: "Post",
        dataType: "json",
        success: function (result) {
            clearPopUp()
            bookData();
        },
        error: function (message) {
            alert("Add error");
        }
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
        BookId : $('#BookId').val(),
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
   // $('#bookModel').modal('hide');
    $('#BookId').val("");
    $('#BookName').val("");
    $('#AuthorName').val("");
    $('#PublisherYear').val("");
    $('#Price').val("");
    $('#UpdatedOn').val("");
    $('#BookCategory').val("");
}




