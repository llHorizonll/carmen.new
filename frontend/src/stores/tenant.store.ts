import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCurrentFiscalPeriod, getCurrentPropertyId } from '../lib/pocketbase'

type TenantStore = {
  selectedTenantId: string | null
  selectedPropertyId: string | null
  fiscalPeriod: string
  search: string
  recentTenantIds: string[]
  setTenant: (tenantId: string) => void
  setProperty: (propertyId: string) => void
  setFiscalPeriod: (period: string) => void
  setSearch: (value: string) => void
  pushRecentTenant: (tenantId: string) => void
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      selectedTenantId: 'tenant-carmen',
      selectedPropertyId: getCurrentPropertyId(),
      fiscalPeriod: getCurrentFiscalPeriod(),
      search: '',
      recentTenantIds: ['tenant-carmen', 'tenant-northstar'],
      setTenant: (tenantId) =>
        set((state) => ({
          selectedTenantId: tenantId,
          recentTenantIds: [tenantId, ...state.recentTenantIds.filter((id) => id !== tenantId)].slice(0, 4),
        })),
      setProperty: (propertyId) => set({ selectedPropertyId: propertyId }),
      setFiscalPeriod: (period) => set({ fiscalPeriod: period }),
      setSearch: (value) => set({ search: value }),
      pushRecentTenant: (tenantId) =>
        set((state) => ({
          recentTenantIds: [tenantId, ...state.recentTenantIds.filter((id) => id !== tenantId)].slice(0, 4),
        })),
    }),
    {
      name: 'carmen-tenant-state',
    },
  ),
)
