using EID.Application.DTOs.Auth;
using FluentValidation;

namespace EID.Application.Validators;

public sealed class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email é obrigatório.")
            .EmailAddress().WithMessage("Email inválido.")
            .MaximumLength(200).WithMessage("Email deve ter no máximo 200 caracteres.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Senha é obrigatória.")
            .MaximumLength(100).WithMessage("Senha deve ter no máximo 100 caracteres.");
    }
}
