using System.Net;

namespace backend.Models
{
    public class APIResponse
    {
        public APIResponse()
        {
            ErrorMessages = new List<string>();
        }
        public HttpStatusCode StatusCode { get; set; }
        public bool IsSuccess { get; set; } = true;
        public object? Result { get; set; }
        public List<string> ErrorMessages { get; set; } = new List<string>();
    }
}