import {create} from 'zustand'
import {persist, createJSONStorage, StateStorage} from 'zustand/middleware'
import {Store} from '@tauri-apps/plugin-store';

const privateStore = new Store('./store.bin');

interface MyState {
    bears: number
    addABear: () => void
}

const getStorage = (store:Store):StateStorage => ({
    getItem: async (name: string): Promise<string | null> => {
        console.log('getItem', {name})
        return (await store.get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        console.log('setItem',{ name, value})
        await store.set(name, value)
        await store.save()
    },
    removeItem: async (name: string): Promise<void> => {
        console.log('removeItem', {name})
        await store.delete(name)
        await store.save()
    },
})

export const useBearStore = create<MyState>()(
    persist((set, get) => ({
            bears: 0,
            addABear: () => set({bears: get().bears + 1}),
        }),
        {
            name: 'storage', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => getStorage(privateStore)), // (optional) by default the 'localStorage' is used
        },
    ),
)