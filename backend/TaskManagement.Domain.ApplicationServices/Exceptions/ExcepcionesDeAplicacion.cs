using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManagement.Domain.ApplicationServices.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException(string mensaje) : base(mensaje) { }
    }

    public class NotFoundException : Exception
    {
        public NotFoundException(string mensaje) : base(mensaje) { }
    }

    public class ForbiddenException : Exception
    {
        public ForbiddenException(string mensaje) : base(mensaje) { }
    }

    public class UnauthorizedException : Exception
    {
        public UnauthorizedException(string mensaje) : base(mensaje) { }
    }

    public class ConflictException : Exception
    {
        public ConflictException(string mensaje) : base(mensaje) { }
    }

    public class LockedException : Exception
    {
        public LockedException(string mensaje) : base(mensaje) { }
    }
}
