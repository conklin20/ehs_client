using Microsoft.EntityFrameworkCore;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class EhsDbContext : DbContext
    {
        public EhsDbContext(DbContextOptions<EhsDbContext> options) : base(options)
        {

        }

        public DbSet<Action> Actions { get; set; }
        public DbSet<Approval> Approvals { get; set; }
        public DbSet<ApprovalRouting> ApprovalRoutings { get; set; }
        public DbSet<Attribute> Attributes { get; set; }

        public DbSet<Employee> Employees { get; set; }

        //public DbSet<dbo.AttributeCategory> AttributeCategories { get; set; }
        public DbSet<Hierarchy> Hierarchies { get; set; }
        public DbSet<HierarchyAttribute> HierarchyAttributes { get; set; }
        public DbSet<HierarchyLevel> HierarchyLevels { get; set; }

        public DbSet<PeopleInvolved> PeopleInvolved { get; set; }

        public DbSet<SafetyEvent> SafetyEvents { get; set; }
        public DbSet<Severity> Severities { get; set; }

        public DbSet<ResultSeverity> ResultSeverities { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
    }
}
