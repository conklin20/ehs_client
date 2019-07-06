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
            //objects with no child dependancies need to be mapped first
            CreateMap<DataAccess.DatabaseModels.Action, ActionDto>().ReverseMap();
            CreateMap<Approval, ApprovalDto>().ReverseMap();
            CreateMap<DataAccess.DatabaseModels.Attribute, AttributeDto>().ReverseMap();
            CreateMap<Employee, EmployeeDto>().ReverseMap();
            CreateMap<HierarchyLevel, HierarchyLevelDto>().ReverseMap();
            CreateMap<Hierarchy, HierarchyDto>().ReverseMap();
            CreateMap<PeopleInvolved, PeopleInvolvedDto>().ReverseMap();
            CreateMap<SafetyEvent, SafetyEventDto>().ReverseMap();
            CreateMap<Severity, SeverityDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserRole, UserRoleDto>().ReverseMap();
            
            //now map the rest             
            CreateMap<ApprovalRouting, ApprovalRoutingDto>().ReverseMap();
            CreateMap<HierarchyAttribute, HierarchyAttributeDto>().ReverseMap();           
            CreateMap<ResultSeverity, ResultSeverityDto>().ReverseMap();    
            CreateMap<Shared, SharedDto>().ReverseMap();

            //CreateMap<ActionDto, DataAccess.DatabaseModels.Action>();
            //CreateMap<ApprovalDto, Approval>();
            //CreateMap<ApprovalRoutingDto, ApprovalRouting>();
            //CreateMap<AttributeDto, DataAccess.DatabaseModels.Attribute>();
            //CreateMap<EmployeeDto, Employee>();
            //CreateMap<HierarchyDto, Hierarchy>();
            //CreateMap<HierarchyAttributeDto, HierarchyAttribute>();
            //CreateMap<HierarchyLevelDto, HierarchyLevel>();
            //CreateMap<PeopleInvolvedDto, PeopleInvolved>();
            //CreateMap<ResultSeverityDto, ResultSeverity>();
            //CreateMap<SafetyEventDto, SafetyEvent>();
            //CreateMap<SeverityDto, Severity>();
            //CreateMap<SharedDto, Shared>();
            //CreateMap<UserDto, User>();
            //CreateMap<UserRoleDto, UserRole>();

        }
    }
}
