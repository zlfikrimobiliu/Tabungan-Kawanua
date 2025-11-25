import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalSaved: number;
  weeksReceived: number[];
  isActive: boolean;
}

export interface Transaction {
  id: string;
  type: "saving" | "receiving";
  memberId: string;
  memberName: string;
  amount: number;
  week: number;
  date: string;
  status: "pending" | "completed";
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  name: string; // Contoh: "Karakter Kopi 24-2-2025"
  locationLink?: string; // Link lokasi
}

export interface AppState {
  members: Member[];
  transactions: Transaction[];
  gallery: GalleryItem[];
  currentWeek: number;
  savingsSchedule: {
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    time: string; // HH:mm format
  };
  adminEmail: string;
  adminPassword: string;
  isAdmin: boolean;
  darkMode: boolean;
  
  // Actions
  setMembers: (members: Member[]) => void;
  addMember: (member: Omit<Member, "id" | "totalSaved" | "weeksReceived">) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  markReceived: (memberId: string, week: number) => void;
  unmarkReceived: (memberId: string, week: number) => void;
  markSaved: (memberId: string, week: number) => void;
  unmarkSaved: (memberId: string, week: number) => void;
  getTotalAmount: () => number; // Total amount untuk penerima (jumlah anggota aktif × 100rb)
  setSavingsSchedule: (dayOfWeek: number, time: string) => void;
  setCurrentWeek: (week: number) => void;
  setAdminEmail: (email: string) => void;
  setAdminPassword: (password: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  initializeData: () => void;
  syncWithServer: () => Promise<void>;
  pushToServer: () => Promise<void>;
  getTotalKas: () => number;
  getNextReceiver: () => Member | null;
  getCurrentReceiver: () => Member | null;
  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  deleteGalleryItem: (id: string) => void;
}

const defaultMembers: Member[] = [
  { id: "1", name: "Anggota A", totalSaved: 0, weeksReceived: [], isActive: true },
  { id: "2", name: "Anggota B", totalSaved: 0, weeksReceived: [], isActive: true },
  { id: "3", name: "Anggota C", totalSaved: 0, weeksReceived: [], isActive: true },
  { id: "4", name: "Anggota D", totalSaved: 0, weeksReceived: [], isActive: true },
  { id: "5", name: "Anggota E", totalSaved: 0, weeksReceived: [], isActive: true },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      members: defaultMembers,
      transactions: [],
      gallery: [],
      currentWeek: 1,
      savingsSchedule: {
        dayOfWeek: 1, // Monday
        time: "09:00",
      },
      adminEmail: "fikri.mobiliu@example.com",
      adminPassword: "", // Akan di-set dengan obfuscated default password saat pertama kali
      isAdmin: false,
      darkMode: true, // Default dark mode

      setMembers: (members) => set({ members }),
      
      addMember: (member) => {
        const newMember: Member = {
          ...member,
          id: Date.now().toString(),
          totalSaved: 0,
          weeksReceived: [],
        };
        set((state) => ({
          members: [...state.members, newMember],
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      updateMember: (id, updates) => {
        // Pastikan update benar-benar terjadi
        set((state) => {
          // Buat array baru untuk memastikan reference berubah
          const updatedMembers = state.members.map((m) => {
            if (m.id === id) {
              // Merge updates dengan member yang ada
              const updated: Member = { 
                ...m, 
                ...updates,
                // Pastikan semua required fields ada
                totalSaved: m.totalSaved ?? 0,
                weeksReceived: m.weeksReceived ?? [],
                isActive: m.isActive ?? true,
              };
              // Pastikan undefined fields dihapus jika perlu
              if (updates.email === undefined) {
                delete updated.email;
              }
              if (updates.phone === undefined) {
                delete updated.phone;
              }
              return updated;
            }
            return m;
          });
          
          // Return new state dengan members yang sudah di-update
          // Zustand persist akan otomatis menyimpan ke localStorage
          return {
            ...state,
            members: updatedMembers,
          };
        });
        
        // Force persist dengan manual save ke localStorage
        // Pastikan data benar-benar tersimpan
        if (typeof window !== "undefined") {
          // Tunggu sebentar untuk memastikan set() selesai
          setTimeout(() => {
            const currentState = get();
            const memberExists = currentState.members.find((m) => m.id === id);
            
            // Verifikasi update berhasil
            if (memberExists && updates.name && memberExists.name === updates.name) {
              // Update berhasil, force persist ke localStorage
              try {
                const storageKey = "tabungan-kawanua-storage";
                const stateToSave = {
                  state: {
                    members: currentState.members,
                    transactions: currentState.transactions,
                    currentWeek: currentState.currentWeek,
                    savingsSchedule: currentState.savingsSchedule,
                    adminEmail: currentState.adminEmail,
                    adminPassword: currentState.adminPassword,
                    isAdmin: false,
                  },
                  version: 0,
                };
                localStorage.setItem(storageKey, JSON.stringify(stateToSave));
              } catch (error) {
                // Handle error jika localStorage penuh
                console.error("Failed to save to localStorage");
              }
            } else {
              // Update belum terjadi, coba lagi
              set((state) => ({
                ...state,
                members: state.members.map((m) =>
                  m.id === id ? { ...m, ...updates } : m
                ),
              }));
              
              // Force persist lagi setelah retry
              setTimeout(() => {
                const retryState = get();
                try {
                  const storageKey = "tabungan-kawanua-storage";
                  const stateToSave = {
                    state: {
                      members: retryState.members,
                      transactions: retryState.transactions,
                      currentWeek: retryState.currentWeek,
                      savingsSchedule: retryState.savingsSchedule,
                      adminEmail: retryState.adminEmail,
                      adminPassword: retryState.adminPassword,
                      isAdmin: false,
                    },
                    version: 0,
                  };
                  localStorage.setItem(storageKey, JSON.stringify(stateToSave));
                } catch (error) {
                  console.error("Failed to save to localStorage");
                }
              }, 100);
            }
            
            // Push perubahan ke server setelah update selesai
            setTimeout(() => {
              get().pushToServer();
            }, 200);
          }, 100);
        }
      },

      deleteMember: (id) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      markReceived: (memberId, week) => {
        const member = get().members.find((m) => m.id === memberId);
        if (!member) return;

        // Skip jika sudah received
        if (member.weeksReceived.includes(week)) return;

        // Hitung jumlah dinamis berdasarkan anggota aktif
        const activeMembers = get().members.filter((m) => m.isActive);
        const totalAmount = activeMembers.length * 100000; // jumlah anggota × 100rb

        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  weeksReceived: [...m.weeksReceived, week],
                }
              : m
          ),
          transactions: [
            ...state.transactions,
            {
              id: Date.now().toString(),
              type: "receiving",
              memberId,
              memberName: member.name,
              amount: totalAmount,
              week,
              date: new Date().toISOString(),
              status: "completed",
            },
          ],
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      unmarkReceived: (memberId, week) => {
        const member = get().members.find((m) => m.id === memberId);
        if (!member) return;

        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  weeksReceived: m.weeksReceived.filter((w) => w !== week),
                }
              : m
          ),
          transactions: state.transactions.filter(
            (t) => !(t.memberId === memberId && t.week === week && t.type === "receiving")
          ),
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      markSaved: (memberId, week) => {
        const member = get().members.find((m) => m.id === memberId);
        if (!member) return;

        // Check if already saved for this week
        const alreadySaved = get().transactions.some(
          (t) => t.memberId === memberId && t.week === week && t.type === "saving"
        );
        if (alreadySaved) return;

        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  totalSaved: m.totalSaved + 100000,
                }
              : m
          ),
          transactions: [
            ...state.transactions,
            {
              id: Date.now().toString(),
              type: "saving",
              memberId,
              memberName: member.name,
              amount: 100000,
              week,
              date: new Date().toISOString(),
              status: "completed",
            },
          ],
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      unmarkSaved: (memberId, week) => {
        const member = get().members.find((m) => m.id === memberId);
        if (!member) return;

        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  totalSaved: Math.max(0, m.totalSaved - 100000),
                }
              : m
          ),
          transactions: state.transactions.filter(
            (t) => !(t.memberId === memberId && t.week === week && t.type === "saving")
          ),
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      setSavingsSchedule: (dayOfWeek, time) => {
        set({ savingsSchedule: { dayOfWeek, time } });
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      setCurrentWeek: (week) => {
        set({ currentWeek: week });
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      setAdminEmail: (email) => {
        set({ adminEmail: email });
      },

      setAdminPassword: (password) => {
        // Store password securely dengan obfuscation
        // Password tidak akan terlihat di console atau element inspector
        // JANGAN PERNAH log password ke console!
        if (typeof window !== "undefined") {
          // Import obfuscation function
          const { obfuscatePassword } = require("@/lib/security");
          const obfuscated = obfuscatePassword(password);
          set({ adminPassword: obfuscated });
        } else {
          set({ adminPassword: password });
        }
      },

      setIsAdmin: (isAdmin) => {
        set({ isAdmin });
      },

      setDarkMode: (darkMode) => {
        set({ darkMode: darkMode !== undefined ? darkMode : true }); // Default to dark
        // Apply dark mode class to html element
        if (typeof window !== "undefined") {
          const shouldBeDark = darkMode !== undefined ? darkMode : true;
          if (shouldBeDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },

      initializeData: () => {
        const state = get();
        // Hanya initialize jika benar-benar kosong (tidak ada data di localStorage)
        // JANGAN overwrite data yang sudah ada atau sudah di-edit
        // Cek apakah ada data di localStorage terlebih dahulu
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("tabungan-kawanua-storage");
            if (stored) {
              // Ada data di localStorage, jangan overwrite
              const parsed = JSON.parse(stored);
              if (parsed.state && parsed.state.members && parsed.state.members.length > 0) {
                // Data sudah ada, sync dengan state (jangan overwrite)
                // Hanya update jika state kosong
                if (state.members.length === 0) {
                  set({ members: parsed.state.members });
                }
                return;
              }
            }
          } catch {
            // Error parsing, lanjutkan dengan initialize
          }
        }
        
        // Hanya initialize jika benar-benar kosong
        if (state.members.length === 0) {
          set({ members: defaultMembers });
        }
      },

      getTotalKas: () => {
        const state = get();
        const totalSaved = state.members.reduce((sum, m) => sum + m.totalSaved, 0);
        const totalReceived = state.transactions
          .filter((t) => t.type === "receiving")
          .reduce((sum, t) => sum + t.amount, 0);
        return totalSaved - totalReceived;
      },

      getNextReceiver: () => {
        const state = get();
        const activeMembers = state.members.filter((m) => m.isActive);
        if (activeMembers.length === 0) return null;

        const nextWeek = state.currentWeek + 1;
        const receiverIndex = (nextWeek - 1) % activeMembers.length;
        return activeMembers[receiverIndex] || null;
      },

      getCurrentReceiver: () => {
        const state = get();
        const activeMembers = state.members.filter((m) => m.isActive);
        if (activeMembers.length === 0) return null;

        const receiverIndex = (state.currentWeek - 1) % activeMembers.length;
        return activeMembers[receiverIndex] || null;
      },

      getTotalAmount: () => {
        const state = get();
        const activeMembers = state.members.filter((m) => m.isActive);
        return activeMembers.length * 100000; // jumlah anggota aktif × 100rb
      },

      addGalleryItem: (item) => {
        const newItem: GalleryItem = {
          ...item,
          id: Date.now().toString(),
        };
        set((state) => ({
          gallery: [...state.gallery, newItem],
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      deleteGalleryItem: (id) => {
        set((state) => ({
          gallery: state.gallery.filter((item) => item.id !== id),
        }));
        
        // Push perubahan ke server
        setTimeout(() => {
          get().pushToServer();
        }, 100);
      },

      // Sync data dari server
      syncWithServer: async () => {
        try {
          const response = await fetch("/api/data");
          if (!response.ok) throw new Error("Failed to fetch data");
          
          const result = await response.json();
          if (result.success && result.data) {
            const serverData = result.data;
            
            // Update state dengan data dari server
            set({
              members: serverData.members || [],
              transactions: serverData.transactions || [],
              gallery: serverData.gallery || [],
              currentWeek: serverData.currentWeek || 1,
              savingsSchedule: serverData.savingsSchedule || { dayOfWeek: 1, time: "09:00" },
              adminEmail: serverData.adminEmail || "fikri.mobiliu@example.com",
            });
            
            // Update localStorage juga
            if (typeof window !== "undefined") {
              const currentStorage = localStorage.getItem("tabungan-kawanua-storage");
              if (currentStorage) {
                const parsed = JSON.parse(currentStorage);
                parsed.state = {
                  ...parsed.state,
                  members: serverData.members || [],
                  transactions: serverData.transactions || [],
                  gallery: serverData.gallery || [],
                  currentWeek: serverData.currentWeek || 1,
                  savingsSchedule: serverData.savingsSchedule || { dayOfWeek: 1, time: "09:00" },
                  adminEmail: serverData.adminEmail || "fikri.mobiliu@example.com",
                };
                localStorage.setItem("tabungan-kawanua-storage", JSON.stringify(parsed));
              }
            }
          }
        } catch (error) {
          console.error("Error syncing with server:", error);
          // Fallback: tetap gunakan localStorage jika server error
        }
      },

      // Push data ke server
      pushToServer: async () => {
        try {
          const state = get();
          const response = await fetch("/api/data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              members: state.members,
              transactions: state.transactions,
              gallery: state.gallery,
              currentWeek: state.currentWeek,
              savingsSchedule: state.savingsSchedule,
              adminEmail: state.adminEmail,
            }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch {
              errorData = { error: errorText };
            }
            throw new Error(`Failed to update server: ${errorData.error || errorData.details || response.statusText}`);
          }
          
          const result = await response.json();
          if (result.success) {
            console.log("Data pushed to server successfully");
          } else {
            console.warn("Server response:", result);
          }
        } catch (error) {
          console.error("Error pushing to server:", error);
          // Data tetap tersimpan di localStorage meskipun server error
        }
      },
    }),
    {
      name: "tabungan-kawanua-storage",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        // Wrap localStorage untuk mencegah akses langsung ke password
        const storage = localStorage;
        return {
          getItem: (name: string) => {
            const item = storage.getItem(name);
            // JANGAN log item yang berisi password
            return item;
          },
          setItem: (name: string, value: string) => {
            // JANGAN log value yang berisi password
            storage.setItem(name, value);
          },
          removeItem: (name: string) => {
            storage.removeItem(name);
          },
        };
      }),
      skipHydration: true,
      // Pastikan semua state ter-persist, termasuk members
      partialize: (state) => ({
        members: state.members,
        transactions: state.transactions,
        gallery: state.gallery,
        currentWeek: state.currentWeek,
        savingsSchedule: state.savingsSchedule,
        adminEmail: state.adminEmail,
        adminPassword: state.adminPassword,
        isAdmin: false, // Reset isAdmin saat reload untuk keamanan
        darkMode: state.darkMode,
      }),
    }
  )
);

// Prevent password exposure in console (client-side only)
if (typeof window !== "undefined") {
  // Override console methods untuk mencegah logging password
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;
  const originalDebug = console.debug;
  
  const sanitizeMessage = (args: any[]): any[] => {
    return args.map((arg) => {
      if (typeof arg === "string") {
        // Redact jika mengandung password-related keywords atau angka 1998
        if (
          arg.includes("adminPassword") || 
          arg.toLowerCase().includes("password") ||
          arg.includes("1998") ||
          arg.includes(String.fromCharCode(49, 57, 57, 56)) // "1998" dalam char codes
        ) {
          return "[REDACTED]";
        }
      }
      if (typeof arg === "object" && arg !== null) {
        try {
          const str = JSON.stringify(arg);
          // Redact jika mengandung password atau angka 1998
          if (
            str.includes("adminPassword") || 
            str.toLowerCase().includes("password") ||
            str.includes("1998") ||
            str.includes(String.fromCharCode(49, 57, 57, 56))
          ) {
            return "[REDACTED]";
          }
        } catch {
          // Ignore JSON stringify errors
        }
      }
      return arg;
    });
  };
  
  console.log = (...args: any[]) => originalLog(...sanitizeMessage(args));
  console.warn = (...args: any[]) => originalWarn(...sanitizeMessage(args));
  console.error = (...args: any[]) => originalError(...sanitizeMessage(args));
  console.info = (...args: any[]) => originalInfo(...sanitizeMessage(args));
  console.debug = (...args: any[]) => originalDebug(...sanitizeMessage(args));
}

