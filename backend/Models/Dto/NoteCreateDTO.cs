using System.ComponentModel.DataAnnotations;

namespace backend.Models.Dto
{
    public class NoteCreateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new List<string>();
        public bool IsArchived { get; set; } = false;
    }
}