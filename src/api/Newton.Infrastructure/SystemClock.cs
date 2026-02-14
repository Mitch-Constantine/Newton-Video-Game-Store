using Newton.Application;

namespace Newton.Infrastructure;

public sealed class SystemClock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}
