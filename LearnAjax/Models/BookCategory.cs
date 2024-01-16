using System;
using System.Collections.Generic;

namespace LearnAjax.Models;

public partial class BookCategory
{
    public short CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public DateOnly UpdatedOn { get; set; }

    public bool IsDeleted { get; set; }

   public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
