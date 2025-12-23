# PriCare HMS - AI Coding Guidelines

## Project Overview

PriCare HMS is a Hospital Management System built with .NET/C# using MSBuild for compilation. The project focuses on managing hospital operations including patient records, appointments, billing, and staff management.

## Architecture

- **Major Components**: Core modules include Patient Management, Appointment Scheduling, Billing System, and Staff Administration.
- **Service Boundaries**: Modular design with separate assemblies for business logic, data access, and UI layers.
- **Data Flows**: Centralized database with Entity Framework for ORM, following repository pattern for data access.
- **Structural Decisions**: MSBuild used for build automation to ensure consistent compilation across Windows environments.

## Developer Workflows

- **Build**: Execute `msbuild /t:build` or use VS Code's "build" task for compilation.
- **Debug**: Standard .NET debugging in Visual Studio or VS Code with C# extension.
- **Testing**: [To be established - likely xUnit or NUnit for unit tests]
- **Deployment**: [To be defined - potentially Windows Installer or web deployment]

## Project-Specific Conventions

- **Naming**: Follow .NET naming conventions (PascalCase for classes, camelCase for variables).
- **Error Handling**: Use try-catch blocks with custom exception classes for hospital-specific errors.
- **Logging**: Implement structured logging using Serilog or NLog for audit trails.
- **Security**: Implement role-based access control for different user types (admin, doctor, nurse).

## Integration Points

- **Database**: SQL Server with Entity Framework Core.
- **External Dependencies**: [To be added as integrations are implemented]
- **Communication Patterns**: Event-driven architecture for inter-module communication.

## Key Files/Directories

- `src/`: Source code organized by feature
- `tests/`: Unit and integration tests
- `docs/`: Project documentation

## Code Examples

```csharp
// Repository pattern example
public class PatientRepository : IPatientRepository
{
    private readonly HospitalDbContext _context;

    public PatientRepository(HospitalDbContext context)
    {
        _context = context;
    }

    public async Task<Patient> GetByIdAsync(int id)
    {
        return await _context.Patients.FindAsync(id);
    }
}
```

This file will be updated as the codebase evolves. Please provide feedback on any unclear sections.
