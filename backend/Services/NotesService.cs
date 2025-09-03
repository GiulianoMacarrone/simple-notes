using AutoMapper;
using backend.Data;
using backend.Models;
using backend.Models.Dto;
using backend.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Xml.Serialization;

namespace backend.Services
{
    public class NotesService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public NotesService(AppDbContext dbNote, IMapper mapper)
        {
            _dbContext = dbNote;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NoteDTO>> GetAllAsync(bool archived, string? tags, int pageNumber, int pageSize, Guid userId)
        {
            IQueryable<Note> notesQuery = _dbContext.Notes.Where(n => n.UserId == userId).AsQueryable();

            notesQuery = archived ? notesQuery.Where(n => n.IsArchived) : notesQuery.Where(n => !n.IsArchived);

            if (!string.IsNullOrEmpty(tags))
            {
                var tagsArray = tags.Split(',').Select(t => t.Trim().ToLower()).ToArray();
                notesQuery = notesQuery.Where(n => n.Tags != null && n.Tags.Any(tag => tagsArray.Contains(tag.ToLower())));
            }

            notesQuery = notesQuery.OrderByDescending(n => n.UpdatedAt);

            var notesList = await notesQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return _mapper.Map<List<NoteDTO>>(notesList);
        }

        public async Task<int> GetTotalCountAsync(bool archived, string? tags, Guid userId)
        {
            IQueryable<Note> notesQuery = _dbContext.Notes.Where(n => n.UserId == userId).AsQueryable();

            notesQuery = archived ? notesQuery.Where(n => n.IsArchived) : notesQuery.Where(n => !n.IsArchived);

            if (!string.IsNullOrEmpty(tags))
            {
                var tagsArray = tags.Split(',').Select(t => t.Trim().ToLower()).ToArray();
                notesQuery = notesQuery.Where(n => n.Tags != null && n.Tags.Any(tag => tagsArray.Contains(tag.ToLower())));
            }

            return await notesQuery.CountAsync();
        }

        public async Task<NoteDTO?> GetNoteAsync(Guid id, Guid userId)
        {
            var note = await _dbContext.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            return note == null ? null : _mapper.Map<NoteDTO>(note);
        }

        public async Task<NoteDTO> CreateNoteAsync(NoteCreateDTO createDTO, Guid userId)
        {
            Note note = _mapper.Map<Note>(createDTO);
            note.UserId = userId;
            await _dbContext.Notes.AddAsync(note);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<NoteDTO>(note);
        }

        public async Task<bool> DeleteNoteAsync(Guid id, Guid userId)
        {
            var note = await _dbContext.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null)
            {
                return false;
            }
            _dbContext.Notes.Remove(note);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<NoteDTO?> UpdateNoteAsync(Guid id, NoteUpdateDTO updateDTO, Guid userId)
        {
            var noteFromDb = await _dbContext.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (noteFromDb == null)
            {
                return null;
            }

            _mapper.Map(updateDTO, noteFromDb);
            noteFromDb.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return _mapper.Map<NoteDTO>(noteFromDb);
        }

        public async Task<(NoteDTO? note, string? errorMessage)> UpdatePartialNoteAsync(Guid id, JsonPatchDocument<NoteUpdateDTO> patchDTO, Guid userId)
        {
            var noteFromDb = await _dbContext.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (noteFromDb == null)
            {
                return (null, "Note not found.");
            }

            var noteDTO = _mapper.Map<NoteUpdateDTO>(noteFromDb);

            try
            {
                patchDTO.ApplyTo(noteDTO);
            }
            catch (Exception ex)
            {
                return (null, $"Error applying patch: {ex.Message}");
            }

            _mapper.Map(noteDTO, noteFromDb);
            noteFromDb.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return (_mapper.Map<NoteDTO>(noteFromDb), null);
        }

        public async Task<NoteDTO?> ArchiveNoteAsync(Guid id, bool archive, Guid userId)
        {
            var note = await _dbContext.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null) return null;

            note.IsArchived = archive;
            note.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return _mapper.Map<NoteDTO>(note);
        }

    }
}