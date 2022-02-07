using System.Security.Claims;
using System.Threading.Tasks;
using APi.DTOs;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [AllowAnonymous]
  [ApiController]
  [Route("/api/[controller]")]
  public class AccountController : ControllerBase
  {
    private readonly UserManager<AppUser> _userManger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenServices;
    public AccountController(UserManager<AppUser> userManger, SignInManager<AppUser> signInManager, TokenService tokenServices)
    {
      _tokenServices = tokenServices;
      _signInManager = signInManager;
      _userManger = userManger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      var user = await _userManger.FindByEmailAsync(loginDto.Email);

      if (user == null) return Unauthorized();

      var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

      if (result.Succeeded)
      {
        return CreateUserObject(user);
      }
      return Unauthorized();
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      if (await _userManger.Users.AnyAsync(x => x.Email == registerDto.Email))
      {
        ModelState.AddModelError("email", "Email taken");
        return ValidationProblem();
      }
      if (await _userManger.Users.AnyAsync(x => x.UserName == registerDto.Username))
      {
        ModelState.AddModelError("username", "Username taken");
        return ValidationProblem();
      }

      var user = new AppUser
      {
        DisplayName = registerDto.DisplayName,
        Email = registerDto.Email,
        UserName = registerDto.Username
      };

      var result = await _userManger.CreateAsync(user, registerDto.Password);
      if (result.Succeeded)
      {
        return CreateUserObject(user);
      }

      return BadRequest("Propblem registering user");
    }


    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
      var user = await _userManger.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
      return CreateUserObject(user);
    }

    private UserDto CreateUserObject(AppUser user)
    {
      return new UserDto
      {
        DisplayName = user.DisplayName,
        Image = null,
        Token = _tokenServices.CreateToken(user),
        Username = user.UserName
      };
    }

  }
}