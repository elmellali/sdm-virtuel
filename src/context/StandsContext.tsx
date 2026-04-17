import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface StandConfig {
    id: number
    tvContent: string // URL of image or video
    tvType: 'image' | 'video'
    deskContent: string
    deskType: 'image' | 'video'
    pictureContent: string
    pictureType: 'image' | 'video'
    name?: string
}

interface StandsContextType {
    stands: StandConfig[]
    updateStand: (id: number, config: Partial<StandConfig>) => void
    isAdminOpen: boolean
    setAdminOpen: (open: boolean) => void
}

const DEFAULT_STANDS_COUNT = 40

const StandsContext = createContext<StandsContextType | undefined>(undefined)

// Compression helpers using LZ-based approach
const STORAGE_KEY = 'sdm_stands_data'
const MAX_STORAGE_BYTES = 4 * 1024 * 1024 // ~4MB typical localStorage limit
const WARNING_THRESHOLD = MAX_STORAGE_BYTES * 0.85

function estimateSize(data: string): number {
    return new Blob([data]).size
}

function handleStorageQuota(data: string): string {
    const size = estimateSize(data)
    if (size > WARNING_THRESHOLD) {
        console.warn(`localStorage usage approaching limit: ${(size / 1024).toFixed(1)}KB`)
        // Trim older stands' data if needed - keep only essential fields
        try {
            const parsed = JSON.parse(data) as StandConfig[]
            if (parsed.length > DEFAULT_STANDS_COUNT) {
                // Cap at default count to prevent overflow
                const trimmed = parsed.slice(0, DEFAULT_STANDS_COUNT)
                return JSON.stringify(trimmed)
            }
        } catch (e) {
            console.error('Failed to parse stands data during quota check', e)
        }
    }
    return data
}

function safeLocalStorageSet(key: string, value: string): boolean {
    try {
        const processed = handleStorageQuota(value)
        localStorage.setItem(key, processed)
        return true
    } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Data not saved.')
            // Attempt to save minimal fallback
            try {
                localStorage.setItem(key, JSON.stringify([]))
            } catch (_) {
                // Storage completely full
            }
        } else {
            console.error('localStorage error:', e)
        }
        return false
    }
}

export function StandsProvider({ children }: { children: ReactNode }) {
    const [stands, setStands] = useState<StandConfig[]>([])
    const [isAdminOpen, setAdminOpen] = useState(false)

    const DUMMY_NAMES = [
        "TechCorp", "InnovateX", "Global Finance", "NextGen Solutions", "Alpha Ventures",
        "Beta Systems", "CyberNet", "DataFlow", "EcoTech", "Future Web",
        "GigaByte", "HyperLink", "InfoSys", "LogicGate", "MetaWorks",
        "NovaTech", "Omega Corp", "Prime Systems", "Quantum Logic", "Spark Info",
        "Titan Tech", "UltraNet", "Velocity Systems", "WebCore", "XenoTech",
        "Zenith Solutions", "Apex Logic", "Bright Ideas", "CloudNine", "Digital Edge",
        "Elite Systems", "Frontier Tech", "Genesis Web", "Horizon IT", "Nexus Core",
        "Optima Solutions", "Pinnacle Tech", "Quantum Systems", "Synergy Web", "Vertex IT"
    ]

    const initializeStands = () => {
        const initial: StandConfig[] = []
        for (let i = 1; i <= DEFAULT_STANDS_COUNT; i++) {
            initial.push({
                id: i,
                name: DUMMY_NAMES[i - 1] || `Stand ${i}`,
                tvContent: '/0001-1021.mp4',
                tvType: 'video',
                deskContent: '/images.png',
                deskType: 'image',
                pictureContent: '/Collect receipt 2.png',
                pictureType: 'image'
            })
        }
        setStands(initial)
    }

    // Load from localStorage or initialize
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as StandConfig[]

                // Migrate old generic names to dummy names
                const migrated = parsed.map((s) => {
                    if (s.name === `Stand ${s.id}`) {
                        return { ...s, name: DUMMY_NAMES[s.id - 1] || `Stand ${s.id}` }
                    }
                    return s
                })

                // If we have fewer stands than the new default, append the missing ones
                if (migrated.length < DEFAULT_STANDS_COUNT) {
                    const extra: StandConfig[] = []
                    for (let i = migrated.length + 1; i <= DEFAULT_STANDS_COUNT; i++) {
                        extra.push({
                            id: i,
                            name: DUMMY_NAMES[i - 1] || `Stand ${i}`,
                            tvContent: '/0001-1021.mp4',
                            tvType: 'video',
                            deskContent: '/images.png',
                            deskType: 'image',
                            pictureContent: '/Collect receipt 2.png',
                            pictureType: 'image'
                        })
                    }
                    const combined = [...migrated, ...extra]
                    setStands(combined)
                    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(combined))
                } else {
                    setStands(migrated)
                }
            } catch (e) {
                console.error("Error parsing stands data from localStorage", e)
                initializeStands()
            }
        } else {
            initializeStands()
        }
    }, [])

    const updateStand = (id: number, config: Partial<StandConfig>) => {
        setStands(prev => {
            const next = prev.map(s => s.id === id ? { ...s, ...config } : s)
            const saved = safeLocalStorageSet(STORAGE_KEY, JSON.stringify(next))
            if (!saved) {
                console.warn('Failed to persist stands data to localStorage')
            }
            return next
        })
    }

    return (
        <StandsContext.Provider value={{ stands, updateStand, isAdminOpen, setAdminOpen }}>
            {children}
        </StandsContext.Provider>
    )
}

export function useStands() {
    const context = useContext(StandsContext)
    if (context === undefined) {
        throw new Error('useStands must be used within a StandsProvider')
    }
    return context
}
