CREATE TABLE [dbo].[Severities] (
    [SeverityId]          INT            IDENTITY (1, 1) NOT NULL,
    [SeverityName]        NVARCHAR (50)  NOT NULL,
    [SeverityDescription] NVARCHAR (255) NOT NULL,
    [Enabled]             BIT            NOT NULL,
    CONSTRAINT [PK_Severities] PRIMARY KEY CLUSTERED ([SeverityId] ASC)
);

