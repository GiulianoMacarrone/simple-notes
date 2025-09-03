using AutoMapper;
using backend.Data;
using backend.Encryption;
using backend.Models;
using backend.Models.Dto;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend.Services
{
    public class UserService
    {
        private readonly AppDbContext _dbContext;
        private readonly IMapper _mapper;

        public UserService(AppDbContext context, IMapper mapper)
        {
            _dbContext = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _dbContext.Users.ToListAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO?> GetByUsernameAsync(string username)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            return user == null ? null : _mapper.Map<UserDTO>(user);
        }
        public async Task<bool> ValidatePasswordAsync(string username, string password)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null) return false;

            var encrypted = EncryptPassword.EncryptPww(password);
            return user.Password == encrypted;
        }

        public async Task<UserDTO?> GetUserByIdAsync(Guid id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null) return null;
            return _mapper.Map<UserDTO>(user);
        }

    }
}
