CREATE TABLE [dbo].[Approvals] (
    [ApprovalId]      INT            IDENTITY (1, 1) NOT NULL,
    [ActionId]        INT            NOT NULL,
    [ApprovalLevelId] INT            NOT NULL,
    [ApprovedBy]      NVARCHAR (MAX) NULL,
    [ApprovedOn]      DATETIME2 (7)  NOT NULL,
    [Notes]           NVARCHAR (255) NULL,
    CONSTRAINT [PK_Approvals] PRIMARY KEY CLUSTERED ([ApprovalId] ASC)
);

