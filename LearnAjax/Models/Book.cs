using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LearnAjax.Models;

public partial class Book
{
    [Key]
    public short BookId { get; set; }
    [RegularExpression(@"^[a-zA-Z0-9\s]+$", ErrorMessage = "Book name should not contain special characters.")]
    public string BookName { get; set; } = null!;

    public string? AuthorName { get; set; }

    public int? PublisherYear { get; set; }

    [Range(101, double.MaxValue, ErrorMessage = "Price must be greater than 100.")]
    public double? Price { get; set; }


    [Required(ErrorMessage ="Book Category is required !")]
    public short BookCategoryId { get; set; }


    [Required(ErrorMessage = "Please enter a date.")]
    [DateComparison(ErrorMessage = "Date must be less than the current date.")]
    public DateOnly UpdatedOn { get; set; }

    public bool IsDeleted { get; set; }

    public virtual BookCategory? BookCategory { get; set; }
}

public class DateComparisonAttribute : ValidationAttribute
{
    public override bool IsValid(object value)
    {
        if (value is DateOnly dateOnly)
        {
            // Compare the date with the current date
            return dateOnly < DateOnly.FromDateTime(DateTime.Now);
        }

        return false; // Invalid date type
    }
}