// // hooks/usePipelineStages.ts
// import { useEffect, useCallback, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { PipelineStageService } from '@/services/pipelineStageService'
// import { PipelineStage, PipelineStageFormData, PipelineStageFilters } from '@/types/pipeline'
// import {
//   setStages,
//   setFilteredStages,
//   addStage,
//   updateStage,
//   removeStage,
//   setSelectedStage,
//   setStats,
//   setFilters,
//   setSearchQuery,
//   clearFilters,
//   setLoading,
//   setSubmitting,
//   setError,
//   setSuccess,
//   clearMessages,
//   setPagination,
// } from '@/store/slices/pipelineStagesSlice'

// interface UsePipelineStagesOptions {
//   companyId?: string
//   autoLoad?: boolean
//   initialFilters?: PipelineStageFilters
// }

// export const usePipelineStages = (options: UsePipelineStagesOptions = {}) => {
//   const dispatch = useDispatch()

//   // Selectors
//   const stages = useSelector((state: any) => state.pipelineStages.items)
//   const filteredStages = useSelector((state: any) => state.pipelineStages.filteredItems)
//   const selectedStage = useSelector((state: any) => state.pipelineStages.selectedStage)
//   const stats = useSelector((state: any) => state.pipelineStages.stats)
//   const filters = useSelector((state: any) => state.pipelineStages.filters)
//   const searchQuery = useSelector((state: any) => state.pipelineStages.searchQuery)
//   const isLoading = useSelector((state: any) => state.pipelineStages.isLoading)
//   const isSubmitting = useSelector((state: any) => state.pipelineStages.isSubmitting)
//   const error = useSelector((state: any) => state.pipelineStages.error)
//   const success = useSelector((state: any) => state.pipelineStages.success)
//   const pagination = useSelector((state: any) => state.pipelineStages.pagination)

//   // Load stages
//   const loadStages = useCallback(async (companyId?: string) => {
//     const targetCompanyId = companyId || options.companyId
//     if (!targetCompanyId) {
//       dispatch(setError('Company ID is required'))
//       return
//     }

//     try {
//       dispatch(setLoading(true))
//       dispatch(clearMessages())

//       const result = await PipelineStageService.getStages(targetCompanyId, filters)
      
//       dispatch(setStages(result.stages))
//       dispatch(setPagination({ total: result.total }))
      
//       // Calculate and set stats
//       const calculatedStats = PipelineStageService.calculateStats(result.stages)
//       dispatch(setStats(calculatedStats))

//       // Apply search filter if exists
//       if (searchQuery) {
//         const filtered = result.stages.filter(stage => 
//           stage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           stage.category.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//         dispatch(setFilteredStages(filtered))
//       }
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to load stages'))
//     } finally {
//       dispatch(setLoading(false))
//     }
//   }, [dispatch, options.companyId, filters, searchQuery])

//   // Get single stage
//   const getStage = useCallback(async (stageId: string) => {
//     try {
//       dispatch(setLoading(true))
//       dispatch(clearMessages())

//       const stage = await PipelineStageService.getStageById(stageId)
//       dispatch(setSelectedStage(stage))
      
//       return stage
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to load stage'))
//       return null
//     } finally {
//       dispatch(setLoading(false))
//     }
//   }, [dispatch])

//   // Create stage
//   const createStage = useCallback(async (companyId: string, formData: PipelineStageFormData) => {
//     try {
//       dispatch(setSubmitting(true))
//       dispatch(clearMessages())

//       const newStage = await PipelineStageService.createStage(companyId, formData)
      
//       dispatch(addStage(newStage))
      
//       // Update stats
//       if (stats) {
//         const updatedStats = PipelineStageService.calculateStats([...stages, newStage])
//         dispatch(setStats(updatedStats))
//       }

//       dispatch(setSuccess('Stage created successfully'))
      
//       return newStage
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to create stage'))
//       return null
//     } finally {
//       dispatch(setSubmitting(false))
//     }
//   }, [dispatch, stages, stats])

//   // Update stage
//   const updateStageById = useCallback(async (stageId: string, formData: PipelineStageFormData) => {
//     try {
//       dispatch(setSubmitting(true))
//       dispatch(clearMessages())

//       const updatedStage = await PipelineStageService.updateStage(stageId, formData)
      
//       dispatch(updateStage(updatedStage))
      
//       // Update stats
//       if (stats) {
//         const updatedStages = stages.map(s => s._id === stageId ? updatedStage : s)
//         const updatedStats = PipelineStageService.calculateStats(updatedStages)
//         dispatch(setStats(updatedStats))
//       }

//       dispatch(setSuccess('Stage updated successfully'))
      
//       return updatedStage
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to update stage'))
//       return null
//     } finally {
//       dispatch(setSubmitting(false))
//     }
//   }, [dispatch, stages, stats])

//   // Toggle stage status
//   const toggleStageStatus = useCallback(async (stage: PipelineStage) => {
//     try {
//       const updatedStage = await PipelineStageService.toggleStageStatus(stage._id, stage.isActive)
      
//       dispatch(updateStage(updatedStage))
      
//       // Update stats
//       if (stats) {
//         const updatedStages = stages.map(s => s._id === stage._id ? updatedStage : s)
//         const updatedStats = PipelineStageService.calculateStats(updatedStages)
//         dispatch(setStats(updatedStats))
//       }

//       dispatch(setSuccess(`Stage ${updatedStage.isActive ? 'activated' : 'deactivated'} successfully`))
      
//       return updatedStage
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to toggle stage status'))
//       return null
//     }
//   }, [dispatch, stages, stats])

//   // Delete stage
//   const deleteStage = useCallback(async (stageId: string) => {
//     try {
//       dispatch(setSubmitting(true))
//       dispatch(clearMessages())

//       await PipelineStageService.deleteStage(stageId)
      
//       dispatch(removeStage(stageId))
      
//       // Update stats
//       if (stats) {
//         const updatedStages = stages.filter(s => s._id !== stageId)
//         const updatedStats = PipelineStageService.calculateStats(updatedStages)
//         dispatch(setStats(updatedStats))
//       }

//       dispatch(setSuccess('Stage deleted successfully'))
      
//       return true
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to delete stage'))
//       return false
//     } finally {
//       dispatch(setSubmitting(false))
//     }
//   }, [dispatch, stages, stats])

//   // Reorder stages
//   const reorderStages = useCallback(async (companyId: string, reorderedStages: { id: string; order: number }[]) => {
//     try {
//       dispatch(setSubmitting(true))
//       dispatch(clearMessages())

//       await PipelineStageService.reorderStages(companyId, reorderedStages)
      
//       // Update local order
//       const updatedStages = [...stages].map(stage => {
//         const reorderItem = reorderedStages.find(r => r.id === stage._id)
//         if (reorderItem) {
//           return { ...stage, order: reorderItem.order }
//         }
//         return stage
//       }).sort((a, b) => a.order - b.order)
      
//       dispatch(setStages(updatedStages))
//       dispatch(setSuccess('Stages reordered successfully'))
      
//       return true
//     } catch (err: any) {
//       dispatch(setError(err.message || 'Failed to reorder stages'))
//       return false
//     } finally {
//       dispatch(setSubmitting(false))
//     }
//   }, [dispatch, stages])

//   // Filter actions
//   const applyFilters = useCallback((newFilters: PipelineStageFilters) => {
//     dispatch(setFilters(newFilters))
//     if (options.companyId) {
//       loadStages()
//     }
//   }, [dispatch, loadStages, options.companyId])

//   const searchStages = useCallback((query: string) => {
//     dispatch(setSearchQuery(query))
    
//     if (!query) {
//       dispatch(setFilteredStages(stages))
//       return
//     }

//     const filtered = stages.filter(stage => 
//       stage.name.toLowerCase().includes(query.toLowerCase()) ||
//       stage.category.toLowerCase().includes(query.toLowerCase())
//     )
//     dispatch(setFilteredStages(filtered))
//   }, [dispatch, stages])

//   const resetAllFilters = useCallback(() => {
//     dispatch(clearFilters())
//     dispatch(setFilteredStages(stages))
//   }, [dispatch, stages])

//   // Clear messages
//   const clearMessagesHandler = useCallback(() => {
//     dispatch(clearMessages())
//   }, [dispatch])

//   // Auto-load on mount
//   useEffect(() => {
//     if (options.autoLoad !== false && options.companyId) {
//       loadStages()
//     }
//   }, [loadStages, options.autoLoad, options.companyId])

//   // Memoized values
//   const activeStages = useMemo(() => 
//     stages.filter(s => s.isActive), [stages]
//   )

//   const defaultStages = useMemo(() => 
//     stages.filter(s => s.isDefault), [stages]
//   )

//   const customStages = useMemo(() => 
//     stages.filter(s => !s.isDefault), [stages]
//   )

//   const stagesByCategory = useMemo(() => ({
//     open: stages.filter(s => s.category === 'open'),
//     won: stages.filter(s => s.category === 'won'),
//     lost: stages.filter(s => s.category === 'lost'),
//   }), [stages])

//   return {
//     // State
//     stages,
//     filteredStages,
//     selectedStage,
//     stats,
//     filters,
//     searchQuery,
//     isLoading,
//     isSubmitting,
//     error,
//     success,
//     pagination,

//     // Memoized
//     activeStages,
//     defaultStages,
//     customStages,
//     stagesByCategory,

//     // CRUD Actions
//     loadStages,
//     getStage,
//     createStage,
//     updateStage: updateStageById,
//     toggleStageStatus,
//     deleteStage,
//     reorderStages,

//     // Filter Actions
//     applyFilters,
//     searchStages,
//     resetFilters: resetAllFilters,

//     // Selection
//     selectStage: (stage: PipelineStage | null) => dispatch(setSelectedStage(stage)),
//     clearSelectedStage: () => dispatch(setSelectedStage(null)),

//     // Messages
//     clearMessages: clearMessagesHandler,

//     // Helpers
//     getCategoryColor: PipelineStageService.getCategoryColor,
//     getCategoryLabel: PipelineStageService.getCategoryLabel,
//     formatProbability: PipelineStageService.formatProbability,
//     formatCurrency: PipelineStageService.formatCurrency,
//   }
// }