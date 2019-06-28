
CREATE VIEW [dbo].[vJobTitles]
AS
SELECT hl.HierarchyLevelName, h.HierarchyName, a.AttributeName, ha.[Key], ha.Value, h.Lft, h.Rgt
FROM  dbo.HierarchyLevels hl INNER JOIN
         dbo.Hierarchies h ON hl.HierarchyLevelId = h.HierarchyLevelId INNER JOIN
         dbo.Attributes a INNER JOIN
         dbo.HierarchyAttributes ha ON a.AttributeId = ha.AttributeId ON h.HierarchyId = ha.HierarchyId
WHERE (ha.[Key] = N'Job Titles')

GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane1', @value = N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[20] 2[20] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "HierarchyCategories"
            Begin Extent = 
               Top = 12
               Left = 76
               Bottom = 259
               Right = 453
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Hierarchies"
            Begin Extent = 
               Top = 12
               Left = 529
               Bottom = 259
               Right = 862
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "Attributes"
            Begin Extent = 
               Top = 12
               Left = 938
               Bottom = 259
               Right = 1264
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "AttributeCategories"
            Begin Extent = 
               Top = 12
               Left = 1340
               Bottom = 191
               Right = 1710
            End
            DisplayFlags = 280
            TopColumn = 0
         End
         Begin Table = "HierarchyAttributes"
            Begin Extent = 
               Top = 12
               Left = 1786
               Bottom = 259
               Right = 2117
            End
            DisplayFlags = 280
            TopColumn = 0
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
      Begin ColumnWidths = 10
         Width = 284
         Width = 750
         Width = 750
         Width = 750
         Width = 750
         Width = 870
         Width = 750
         Width = 750
         Width = 750
         Width = 750
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidt', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vJobTitles';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPane2', @value = N'hs = 11
         Column = 1440
         Alias = 900
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1583
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vJobTitles';


GO
EXECUTE sp_addextendedproperty @name = N'MS_DiagramPaneCount', @value = 2, @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'VIEW', @level1name = N'vJobTitles';

