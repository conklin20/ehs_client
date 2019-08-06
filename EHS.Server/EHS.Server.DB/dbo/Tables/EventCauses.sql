CREATE TABLE [dbo].[EventCauses] (
    [EventCauseId] INT             IDENTITY (1, 1) NOT NULL,
    [EventId]      INT             NOT NULL,
    [CauseId]      INT             NOT NULL,
    [Comments]     NVARCHAR (2000) NULL,
    CONSTRAINT [PK_EventCauses] PRIMARY KEY CLUSTERED ([EventCauseId] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'will be the HierarchyAttributeId from the Root Cause, Immediate Cause or Contributing Factor keys ', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'EventCauses', @level2type = N'COLUMN', @level2name = N'CauseId';

