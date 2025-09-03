using System.ComponentModel.DataAnnotations;

namespace backend.Models.Dto
{
    public class NoteUpdateDTO
    {
        [Required]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public bool IsArchived { get; set; } = false;
    }
}