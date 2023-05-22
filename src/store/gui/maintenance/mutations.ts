import Vue from 'vue'
import { MutationTree } from 'vuex'
import { GuiMaintenanceState } from '@/store/gui/maintenance/types'
import { getDefaultState } from './index'

export const mutations: MutationTree<GuiMaintenanceState> = {
    reset(state) {
        Object.assign(state, getDefaultState())
    },

    initStore(state, payload) {
        Vue.set(state, 'entries', payload.value)
    },

    store(state, payload) {
        Vue.set(state.entries, payload.id, payload.values)
    },

    update(state, payload) {
        if (payload.id in state.entries) {
            const entry = { ...state.entries[payload.id] }
            Object.assign(entry, payload)
            Vue.set(state.entries, payload.id, entry)
        }
    },

    /*delete(state, payload) {
        if (payload in state.reminders) {
            Vue.delete(state.reminders, payload)
        }
    },*/
}
