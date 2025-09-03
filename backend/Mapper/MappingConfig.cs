using AutoMapper;
using backend.Models;
using backend.Models.Dto;
using backend.Encryption;

namespace backend.Mapper
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            // Note Mappings
            CreateMap<Note, NoteDTO>().ReverseMap();
            CreateMap<Note, NoteCreateDTO>().ReverseMap();
            CreateMap<Note, NoteUpdateDTO>().ReverseMap();

            CreateMap<NoteUpdateDTO, Note>();

            // User Mappings
            CreateMap<User, UserDTO>().ReverseMap();
        }
    }
}