using LearnAjax.Models;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Rendering;
using static System.Runtime.InteropServices.JavaScript.JSType;
namespace LearnAjax.Controllers
{
    public class BookController : Controller
    {
        private readonly LibraryDbContext _object;
        public BookController(LibraryDbContext dbObject)
        {
            this._object = dbObject;
        }

        // Index View Action
        public IActionResult Index()
        {
            
            return View();
        }
        // Loading the data from the database
        public JsonResult BookList()
        {
            ViewBag.BookCategoryId = new SelectList(_object.BookCategories, "CategoryId", "CategoryId");
            var data = _object.Books.Include(b => b.BookCategory).ToList().OrderBy( o=> o.BookId);
            return new JsonResult(data);

        }
        // Posting the data into the database
        [HttpPost]
        public IActionResult AddBook(Book book)
        {
            // Chekcing the server-side validations
            if (!ModelState.IsValid)
            {
                // Loop through each property's errors
                /*var errors = ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Errors.Select(e => e.ErrorMessage));*/
                //var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage).ToList());
                var errors = ModelState
                .Where(x => x.Value.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value.Errors.Select(e => string.IsNullOrEmpty(e.ErrorMessage) ? e.Exception.Message : e.ErrorMessage).ToList()
                );
                return Json(new { success = false,errors });
            }
                var b = new Book()
                {
                    BookName = book.BookName,
                    AuthorName = book.AuthorName,
                    PublisherYear = book.PublisherYear,
                    Price = book.Price,
                    BookCategoryId = book.BookCategoryId,
                    UpdatedOn = book.UpdatedOn

                };
                _object.Books.Add(b);
                _object.SaveChanges();
            ViewBag.BookCategoryId = new SelectList(_object.BookCategories, "CategoryId", "CategoryId");
            return new JsonResult(new { success = true, message= "Book Added Successfully."});
        }
        // Delete Book aciton
        // With the Unique ID of the book
        public JsonResult DeleteBook(short id)
        {
            // Find the book with particular ID
            var data = _object.Books.Where(e => e.BookId == id).SingleOrDefault();
            // If the book not found
            if(data == null)
            {
                return Json(NotFound());
            }
            // If the book found
            _object.Books.Remove(data);
            _object.SaveChanges();
            return new JsonResult("Object deleted");

        }
        // Modify Action, [Get] the data from the database 
        public JsonResult Modify(short id)
        {
            var book = _object.Books.FirstOrDefault(e => e.BookId == id);
            if(book == null)
            {
                return Json(NotFound());
            }
            return new JsonResult(book);
        }
        // Modify Book book, after doing the modifications
        [HttpPost]
        public JsonResult ModifyBook(Book book)
        {
            if(book == null)
            {
                return Json(NotFound());
            }
            _object.Books.Update(book);
            _object.SaveChanges();
            return new JsonResult("Record updated");

        }

        // Details action
        // Witht he unique ID, displaying the particaular data
        public JsonResult Details(short id)
        {
            // Checking the existence
            var book = _object.Books.Where(_object => _object.BookId == id).FirstOrDefault();
            // If the book not found
            if(book == null)
            {
                return Json(NotFound());
            }
            return new JsonResult(book);
        }

        public IActionResult Detail(short id)
        {
            var book = _object.Books.Where(_object => _object.BookId == id).FirstOrDefault();
            // If the book not found
            if (book == null)
            {
                return NotFound();
            }
            return View(book);
        }





    }
}

