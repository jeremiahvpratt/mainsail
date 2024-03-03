import { FileStateFileThumbnail } from '@/store/files/types'

export interface ServerHistoryState {
    jobs: ServerHistoryStateJob[]
    job_totals: {
        total_jobs: number
        total_time: number
        total_print_time: number
        total_filament_used: number
        longest_job: number
        longest_print: number
    }
    all_loaded: boolean
}

export interface ServerHistoryStateJob {
    job_id: string
    exists: boolean
    end_time: number
    filament_used: number
    filename: string
    // eslint-disable-next-line
    metadata: {
        print_start_time?: number
        job_id?: number
        size?: number
        slicer?: string
        slicer_version?: string
        layer_count?: number
        layer_height?: number
        first_layer_height?: number
        object_height?: number
        filament_total?: number
        filament_weight_total?: number
        estimated_time?: number
        thumbnails?: FileStateFileThumbnail[]
        first_layer_bed_temp?: number
        first_layer_extr_temp?: number
        gcode_start_byte?: number
        gcode_end_byte?: number
        filename?: string
        filesize?: number
        modified?: number
        uuid?: string
        nozzle_diameter?: number
        [key: string]: any
    }
    note?: string
    print_duration: number
    status: string
    start_time: number
    total_duration: number
}

export interface ServerHistoryStateAllPrintStatusEntry {
    name: string
    displayName: string
    value: number
    showInTable: boolean
    itemStyle: {
        opacity: number
        color: string
        borderColor: string
        borderWidth: number
        borderRadius: number
    }
}
