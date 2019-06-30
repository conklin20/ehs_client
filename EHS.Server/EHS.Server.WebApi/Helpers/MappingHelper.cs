using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Dtos;

namespace EHS.Server.WebApi.Helpers
{
    public class MappingHelper : Profile
    {
        public MappingHelper()
        {
            CreateMap<DataAccess.DatabaseModels.Action, ActionDto>();
            CreateMap<ActionDto, DataAccess.DatabaseModels.Action>();
            CreateMap<Approval, ApprovalDto>();
            CreateMap<ApprovalDto, Approval>();
            CreateMap<ApprovalRouting, ApprovalRoutingDto>();
            CreateMap<ApprovalRoutingDto, ApprovalRouting>();
            CreateMap<DataAccess.DatabaseModels.Attribute, AttributeDto>();
            CreateMap<AttributeDto, DataAccess.DatabaseModels.Attribute>();
            CreateMap<Employee, EmployeeDto>();
            CreateMap<EmployeeDto, Employee>();
            CreateMap<Hierarchy, HierarchyDto>();
            CreateMap<HierarchyDto, Hierarchy>();
            CreateMap<HierarchyAttribute, HierarchyAttributeDto>();
            CreateMap<HierarchyAttributeDto, HierarchyAttribute>();
            CreateMap<HierarchyLevel, HierarchyLevelDto>();
            CreateMap<HierarchyLevelDto, HierarchyLevel>();
            CreateMap<PeopleInvolved, PeopleInvolvedDto>();
            CreateMap<PeopleInvolvedDto, PeopleInvolved>();
            CreateMap<ResultSeverity, ResultSeverityDto>();
            CreateMap<ResultSeverityDto, ResultSeverity>();
            CreateMap<SafetyEvent, SafetyEventDto>();
            CreateMap<SafetyEventDto, SafetyEvent>();
            CreateMap<Severity, SeverityDto>();
            CreateMap<SeverityDto, Severity>();
            CreateMap<Shared, SharedDto>();
            CreateMap<SharedDto, Shared>();
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<UserRole, UserRoleDto>();
            CreateMap<UserRoleDto, UserRole>();
        }
    }
}
