using AutoMapper;
using backend.Data;
using backend.Models;
using backend.Models.Dto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using System.Text.Json;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class NotesController : ControllerBase
{
    private readonly NotesService _notesService;
    protected APIResponse _response;

    public NotesController(NotesService notesService)
    {
        _notesService = notesService;
        _response = new();
    }

    #region Get
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<APIResponse>> GetAll(bool archived = false, string? tags = null, int pageNumber = 1, int pageSize = 10)
    {
        try
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("User not authenticated or token is invalid.");
                return StatusCode(401, _response);
            }

            var notesList = await _notesService.GetAllAsync(archived, tags, pageNumber, pageSize, userId);
            var totalCount = await _notesService.GetTotalCountAsync(archived, tags, userId);

            Pagination pagination = new() { PageNumber = pageNumber, PageSize = pageSize, TotalCount = totalCount };
            Response.Headers["X-Pagination"] = JsonSerializer.Serialize(pagination);

            _response.Result = notesList;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }
        catch (Exception ex)
        {
            _response.IsSuccess = false;
            _response.ErrorMessages = new List<string> { ex.Message };
            return StatusCode(500, _response);
        }
    }

    [HttpGet("{id:guid}", Name = "GetNote")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> GetNote(Guid id)
    {
        if (id == Guid.Empty)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            return BadRequest(_response);
        }

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return StatusCode(401, _response);
        }

        var note = await _notesService.GetNoteAsync(id, userId);
        if (note == null)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Note not found.");
            return NotFound(_response);
        }

        _response.Result = note;
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }
    #endregion

    #region Post
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<APIResponse>> CreateNote([FromBody] NoteCreateDTO createDTO)
    {
        if (createDTO == null)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            return BadRequest(_response);
        }

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            _response.StatusCode = HttpStatusCode.Unauthorized;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("User not authenticated or token is invalid.");
            return Unauthorized(_response);
        }

        var newNote = await _notesService.CreateNoteAsync(createDTO, userId);

        _response.Result = newNote;
        _response.StatusCode = HttpStatusCode.Created;

        return CreatedAtRoute("GetNote", new { id = newNote.Id }, _response);
    }
    #endregion

    #region Delete
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> DeleteNote(Guid id)
    {
        if (id == Guid.Empty)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            return BadRequest(_response);
        }

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return StatusCode(401, _response);
        }

        var success = await _notesService.DeleteNoteAsync(id, userId);
        if (!success)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Note not found.");
            return NotFound(_response);
        }

        _response.StatusCode = HttpStatusCode.NoContent;
        return NoContent();
    }
    #endregion

    #region Update
    [HttpPut("{id:guid}", Name = "UpdateNote")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> UpdateNote(Guid id, [FromBody] NoteUpdateDTO updateDTO)
    {
        if (updateDTO == null || id == Guid.Empty || id != updateDTO.Id)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            return BadRequest(_response);
        }

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return StatusCode(401, _response);
        }

        var updatedNote = await _notesService.UpdateNoteAsync(id, updateDTO, userId);

        if (updatedNote == null)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Note not found.");
            return NotFound(_response);
        }
        _response.Result = updatedNote;
        _response.StatusCode = HttpStatusCode.OK;
        _response.IsSuccess = true;
        return Ok(_response);
    }

    [HttpPatch("{id:guid}", Name = "UpdatePartialNote")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> UpdatePartialNote(Guid id, [FromBody] JsonPatchDocument<NoteUpdateDTO> patchDTO)
    {
        if (patchDTO == null || id == Guid.Empty)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            return BadRequest(_response);
        }

        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return StatusCode(401, _response);
        }

        var (updatedNote, errorMessage) = await _notesService.UpdatePartialNoteAsync(id, patchDTO, userId);

        if (updatedNote == null)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add(errorMessage ?? "Note not found.");
            return NotFound(_response);
        }

        _response.Result = updatedNote;
        _response.StatusCode = HttpStatusCode.OK;
        _response.IsSuccess = true;
        return Ok(_response);
    }

    [HttpPatch("{id:guid}/archive")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<APIResponse>> ArchiveNote(Guid id, [FromBody] bool archive)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return StatusCode(401, _response);
        }
        var note = await _notesService.ArchiveNoteAsync(id, archive, userId);
        if (note == null)
        {
            _response.StatusCode = HttpStatusCode.NotFound;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Note not found.");
            return NotFound(_response);
        }

        _response.Result = note;
        _response.StatusCode = HttpStatusCode.OK;
        _response.IsSuccess = true;
        return Ok(_response);
    }

    #endregion
}
